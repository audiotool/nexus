import type { DescField, DescMessage } from "@bufbuild/protobuf"
import { localName } from "@bufbuild/protoplugin/ecmascript"
import * as opt_pb from "../../src/gen/audiotool/document/v1/opt/opt_pb"
import { throw_ } from "../../src/utils/lang.js"
import { ENTITY_GROUPS } from "./entity-groups"
import type { GeneratedFile } from "./file"
import {
  findOptions,
  formatComments,
  getFieldOptions,
  scalarTypeToTsType,
  toConstructorName,
  toFieldType,
  toNexusGeneratedFilePath,
  toTypeName,
} from "./utils"

export const generateNexusTypes = (
  file: GeneratedFile,
  messages: DescMessage[],
  entityNames: Map<string, string>,
  fieldTargets: Map<string, string[]>,
): void => {
  // for every message in this file
  messages.forEach((message) => {
    generateNexusType(file, message, entityNames, fieldTargets)
    generateConstructorType(file, message)
  })

  file.write()
}

const generateNexusType = (
  file: GeneratedFile,
  message: DescMessage,
  entityNames: Map<string, string>,
  fieldTargets: Map<string, string[]>,
): void => {
  // don't generate the type of the id field, since it is immutable
  const nonIdFields = message.fields.filter(
    (field) => !(field.name === "id" && field.number == 1),
  )
  // generate the NexusFieldType type for this message
  file.print()
  const name = entityNames.get(message.typeName)
  file.print(formatEntityComments(message, name))
  file.print(`export type ${toTypeName(message)} = {`)
  nonIdFields.forEach((field) => {
    file.print(formatNexusFieldComments(field, true, fieldTargets))
    file.print(`${localName(field)}: ${toFieldType(field, file)},`)
  })
  file.print(`}`)
}

const generateConstructorType = (
  file: GeneratedFile,
  message: DescMessage,
): void => {
  // don't generate the type of the id field, since it is immutable
  const nonIdFields = message.fields.filter(
    (field) => !(field.name == "id" && field.number == 1),
  )
  // generate the OptionsType for this message
  file.print(`/** @internal */\n`)
  file.print(`export type ${file.exclude(toConstructorName(message))} = {`)
  // print field-level options
  nonIdFields.map((field) => {
    let fieldIsRequired = false
    let fieldType
    const fieldOptions = getFieldOptions(field)
    switch (field.fieldKind) {
      case "message": {
        switch (field.message.name) {
          // special case for `Address` field: fieldType is location, and field is potentially required
          case "Pointer": {
            fieldType = file.import("NexusLocation", true)
            if (fieldOptions.pointer?.required ?? false) {
              fieldIsRequired = true
            }
            break
          }
          // special case for `Empty`: Don't generate constructor signature at all
          case "Empty":
            return
          default:
            fieldType = file.import(
              toConstructorName(field.message),
              true,
              toNexusGeneratedFilePath(field.message),
            )
        }
        break
      }
      case "scalar":
        fieldType = scalarTypeToTsType(field.scalar)
        break
      default: {
        throw new Error(`unsupported field kind ${field.fieldKind}`)
      }
    }
    if (field.repeated) {
      const arrayLength =
        fieldOptions.list?.length ??
        throw_("list length is required for repeated fields")
      fieldType = `${fieldType}[] & { length: ${arrayLength} }`
    }
    file.print(formatNexusFieldComments(field, false, undefined))
    file.print(
      `${localName(field)}${fieldIsRequired ? "" : "?"}: ${fieldType},`,
    )
  })
  file.print(`}`)
  file.print("\n")
}

const formatNexusFieldComments = (
  field: DescField,
  includeTargetTypes: boolean,
  fieldTargets?: Map<string, string[]>,
): string => {
  const opts = getFieldOptions(field)
  const comments = field.getComments()

  let lines: string[] = []

  const pushMeta = (key: string, value: string) => {
    lines.push(`${key} | ${value}`)
  }

  if (opts.bool !== undefined) {
    // pushMeta("type", "boolean")
    pushMeta("default", opts.bool.init ? "true" : "false")
  }

  if (opts.float !== undefined) {
    // pushMeta("type", "number (float)")
    pushMeta("default", opts.float.init.toString())
    if (opts.float.range !== undefined) {
      pushMeta("range", `[${opts.float.range.min}, ${opts.float.range.max}]`)
    } else {
      pushMeta("range", "full")
    }
  }

  if (opts.int32 !== undefined) {
    // pushMeta("type", "number (int32)")
    pushMeta("default", opts.int32.init.toString())
    if (opts.int32.range !== undefined) {
      pushMeta("range", `[${opts.int32.range.min}, ${opts.int32.range.max}]`)
    } else {
      pushMeta("range", "full")
    }
  }

  if (opts.uint32 !== undefined) {
    // pushMeta("type", "number (uint32)")
    pushMeta("default", opts.uint32.init.toString())
    if (opts.uint32.range !== undefined) {
      pushMeta("range", `[${opts.uint32.range.min}, ${opts.uint32.range.max}]`)
    } else {
      pushMeta("range", "full")
    }
  }

  if (opts.pointer !== undefined) {
    pushMeta(
      "default",
      opts.pointer.required ? "no default, required" : "empty location",
    )
    pushMeta("required", opts.pointer.required ? "true" : "false")
    if (fieldTargets !== undefined) {
      let targets = `{@link api.TargetType.${opts.pointer.target}}, meaning one of: <br />`
      const targetLocations = fieldTargets?.get(opts.pointer.target)
      if (targetLocations === undefined) {
        console.error("no field targets found for", opts.pointer.target)
      } else {
        targets += targetLocations
          .map((target) => `{@link entities.${target}}`)
          .join(", <br />")
      }
      pushMeta("targets", targets)
    }
  }

  if (opts.immutable === true) {
    pushMeta("immutable", "true")
  }

  if (
    opts.target?.is !== undefined &&
    opts.target.is.length > 0 &&
    includeTargetTypes
  ) {
    pushMeta(
      "is",
      opts.target.is.map((is) => `{@link api.TargetType.${is}}`).join(", "),
    )
  }
  if (
    opts.list?.elementIs &&
    opts.list.elementIs.length > 0 &&
    includeTargetTypes
  ) {
    pushMeta(
      "element is",
      opts.list.elementIs
        .map((is) => `{@link api.TargetType.${is}}`)
        .join(", "),
    )
  }

  // Build metadata table
  if (lines.length > 0) {
    lines.unshift("--- | ---")
    lines.unshift("key | value")
  }

  // Combine comments, metadata, and examples
  let fullComment = comments.leading || ""

  if (lines.length > 0) {
    fullComment += fullComment ? "\n\n" : ""
    fullComment += lines.join("\n")
  }

  return formatComments({ leading: fullComment }, undefined, undefined)
}

const formatConstructorFieldComments = (field: DescField): string => {
  const opts = getFieldOptions(field)
  const comments = field.getComments()

  let lines: string[] = []
  if (opts.bool !== undefined) {
    lines.push(`@defaultValue ${opts.bool.init ? "true" : "false"}\n`)
  }

  return formatComments(comments, ...lines)
}

const formatEntityComments = (message: DescMessage, name?: string): string => {
  const opts = findOptions(message, opt_pb.entity)

  const comments = message.getComments()

  const lines: string[] = []

  lines.push("")

  lines.push("key | value") // removed by css
  lines.push("--- | ---")
  lines.push(`type | ${name !== undefined ? "entity" : "object"}`)
  if (name !== undefined) {
    lines.push(`key | \`"${name}"\``)
    const targetTypes = opts?.is.map((type) => opt_pb.TargetType[type]) ?? []
    lines.push(
      `is | ${targetTypes.map((type) => `{@link api.TargetType.${type}}`).join(", ")}`,
    )
    lines.push("")
  }

  // Add TypeDoc group and category tags
  let typeDocTags = ""

  // Determine the entity name for lookup
  let entityName = name
  if (!entityName) {
    // For non-entity types, try to extract the name from the type name
    const typeName = toTypeName(message).replace(/Type$/, "").toLowerCase()
    entityName = typeName
  }

  if (entityName) {
    const groupConfig = ENTITY_GROUPS[entityName]
    if (groupConfig && groupConfig.category) {
      typeDocTags += `@category ${groupConfig.category}\n`
    } else {
      // Entity found but no category assigned - this helps catch missing configurations
      const isEntity = name !== undefined // entities have a name (key), non-entities don't
      if (isEntity) {
        console.error(
          `❌ Entity "${entityName}" (key: "${name}") has no category assignment in entity-groups.ts`,
        )
        throw new Error(`Missing category assignment for entity: ${entityName}`)
      } else {
        console.error(
          `⚠️  Non-entity type "${entityName}" has no category assignment (this might be OK)`,
        )
      }
    }
  }

  return formatComments(comments, lines.join("\n"), typeDocTags.trim())
}
