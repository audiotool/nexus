import type {
  AnyMessage,
  DescField,
  DescFile,
  DescMessage,
  Extension,
  FieldOptions,
  MessageOptions,
} from "@bufbuild/protobuf"
import { getExtension, hasExtension, ScalarType } from "@bufbuild/protobuf"

import * as opt_pb from "../../src/gen/audiotool/document/v1/opt/opt_pb"
import { throw_ } from "../../src/utils/lang.js"
import type { GeneratedFile } from "./file"
import type { NexusFieldOptions } from "./options"

/** Given a DescMessage, returns the NexusType of that message */
export const toTypeName = (message: DescMessage): string => {
  if (
    message.fields.some(
      (field: DescField) => field.name === "id" && field.number === 1,
    )
  ) {
    return `${message.name}`
  } else {
    return `${message.name}`
  }
}

/** Given a DescMessage, returns the OptionsType containing all field options of that message */
export const toOptionsName = (message: DescMessage): string =>
  `${message.name}Options`

/** Given a DescMessage, returns the name of the constructor type */
export const toConstructorName = (message: DescMessage): string =>
  `${message.name}Constructor`

/** Given a DescField, returns the type in the NexusType */
export const toFieldType = (field: DescField, file: GeneratedFile): string => {
  // the type of the field. Will be wrapped in `ArrayField` in case the field is repeated
  let innerType: string
  switch (field.fieldKind) {
    case "scalar": {
      const tsType = scalarTypeToTsType(field.scalar)
      // use the default type argument if field is mutable, looks a bit cleaner
      const mutabilityModifier = fieldIsImmutable(field) ? "immut" : "mut"
      innerType = `${file.import("PrimitiveField", false)}<${tsType}, "${mutabilityModifier}">`
      break
    }

    case "message": {
      if (field.message.name === "Pointer") {
        const mutabilityModifier = fieldIsImmutable(field) ? "immut" : "mut"
        innerType = `${file.import("PrimitiveField", false)}<${file.import(
          "NexusLocation",
          false,
        )}, "${mutabilityModifier}">`
      } else {
        innerType = `${file.import("NexusObject", false)}<${file.import(
          toTypeName(field.message),
          true,
          toNexusGeneratedFilePath(field.message),
        )}>`
      }
      break
    }

    default:
      throw new Error(`unsupported field kind ${field.fieldKind}`)
  }

  if (field.repeated) {
    const options =
      getFieldOptions(field).list ??
      throw_("repeated fields must have list option")

    return `${file.import("ArrayField", false)}<${innerType}, ${options.length}>`
  }
  return innerType
}

/**
 * The way buf-ES handles options is very verbose, this make it simpler.
 * Returns the field option asked for with `option`, if present, else
 * undefined.
 *
 * See example usages for example vaslues of `option`.
 *
 * Note that while the signature of this function looks ok at call sites,
 * the definition is disgusting, please improve if you know how.
 *
 */
export const findOptions = <
  D extends DescField | DescMessage,
  O extends Extension<FieldOptions | MessageOptions, any>,
>(
  desc: D,
  option: O,
): O extends Extension<AnyMessage, infer U> ? U | undefined : undefined => {
  const opts = desc.proto.options
  if (opts === undefined || !hasExtension(opts, option)) {
    // sorry for this weird type assertion, also for the weird return type,
    // it comes down to this weird  proto-es thing of anything having to be
    // `T extends Message<T>` and don't really want to deal with it, feel free
    // to give it a go
    return undefined as ReturnType<typeof findOptions>
  }
  return getExtension(opts, option)
}

export const getFieldOptions = (field: DescField): NexusFieldOptions => {
  const result: NexusFieldOptions = {}
  // value options - pointer, bool, number
  switch (field.fieldKind) {
    case "message": {
      if (field.message.name === "Pointer") {
        const pointerOpts =
          findOptions(field, opt_pb.pointer) ??
          throw_(
            `couldn't find pointer options in pointer field: ${field.name}`,
          )
        result["pointer"] = {
          target: opt_pb.TargetType[
            pointerOpts.target
          ] as keyof typeof opt_pb.TargetType,
          required: pointerOpts.required,
        }
      }
      break
    }
    case "scalar": {
      switch (field.scalar) {
        case ScalarType.BOOL: {
          result["bool"] = findOptions(field, opt_pb.bool) ?? new opt_pb.Bool()
          break
        }
        case ScalarType.FLOAT:
          result["float"] =
            findOptions(field, opt_pb.float) ?? new opt_pb.Float()

          if (result["float"] !== undefined) {
            // round init to 7 decimal digits
            result["float"].init = Math.fround(result["float"].init)

            if (result["float"].range !== undefined) {
              // round range.min and range.max to 7 decimal digits
              result["float"].range.min = Math.fround(result["float"].range.min)
              result["float"].range.max = Math.fround(result["float"].range.max)
            }
          }

          break
        case ScalarType.INT32:
          result["int32"] =
            findOptions(field, opt_pb.int32) ?? new opt_pb.Int32()
          break
        case ScalarType.UINT32:
          result["uint32"] =
            findOptions(field, opt_pb.uint32) ?? new opt_pb.UInt32()
          break
        case ScalarType.STRING:
          result["string"] =
            findOptions(field, opt_pb.string$) ?? new opt_pb.String()
          break
      }
    }
  }

  // target options
  {
    const fieldOptions = findOptions(field, opt_pb.field)
    if (fieldOptions !== undefined) {
      result["target"] = {
        is: fieldOptions.is.map(
          (type) => opt_pb.TargetType[type] as keyof typeof opt_pb.TargetType,
        ),
      }
      result.immutable = fieldOptions.immutable
    }
  }

  // list options
  {
    if (field.repeated) {
      let listOpts = findOptions(field, opt_pb.list)
      if (listOpts === undefined) {
        listOpts = new opt_pb.ListOptions()
      }

      result["list"] = {
        length: listOpts.length,
        elementIs: listOpts.elementIs.map(
          (type) => opt_pb.TargetType[type] as keyof typeof opt_pb.TargetType,
        ),
      }
    }
  }

  return result
}

/** Given a DescFile, returns the name of the generated file, minus the _pb (or other) extension */
export const toFileName = (file: DescFile): string => {
  const name: string = file.name
  return name.substring(name.lastIndexOf("/") + 1)
}

/** Returns true if the message is an entity */
export const isEntity = (message: DescMessage): boolean =>
  message.fields.some((f) => f.name === "id" && f.number == 1)

/** Given a ScalarType, returns the typescript type */
export const scalarTypeToTsType = (
  type: ScalarType,
): "number" | "string" | "boolean" | "Uint8Array" | "bigint" => {
  switch (type) {
    case ScalarType.INT32:
    case ScalarType.UINT32:
    case ScalarType.FIXED32:
    case ScalarType.SFIXED32:
    case ScalarType.FLOAT:
    case ScalarType.DOUBLE:
    case ScalarType.SINT32:
      return "number"
    case ScalarType.INT64:
    case ScalarType.UINT64:
    case ScalarType.SINT64:
    case ScalarType.FIXED64:
    case ScalarType.SFIXED64:
      return "bigint"
    case ScalarType.STRING:
      return "string"
    case ScalarType.BOOL:
      return "boolean"
    case ScalarType.BYTES:
      return "Uint8Array"
    default:
      throw new Error(`${type} unhandled`)
  }
}

export const formatComments = (
  com: { leading?: string },
  preamble?: string,
  epilog?: string,
): string => {
  if (
    (com.leading === "" || com.leading === undefined) &&
    preamble === undefined
  ) {
    return ""
  }
  const comment =
    (preamble ? `${preamble}\n\n` : "") +
    com.leading +
    (epilog ? `\n\n${epilog}` : "")
  return `/**\n * ${comment.split("\n").join("\n * ")}*/`.replace("* */", "*/")
}

export const fieldIsImmutable = (field: DescField): boolean =>
  getFieldOptions(field).immutable ?? false

export const typeNameToEntityName = (typeName: string): string => {
  const entityName =
    typeName.split(".").at(-1) ?? throw_(`invalid type name ${typeName}`)
  return entityName.charAt(0).toLowerCase() + entityName.slice(1)
}

export const toNexusGeneratedFilePath = (msg: DescMessage): string =>
  `@gen/${msg.file.name.replace(/^audiotool\//, "")}_nexus`

export const toProtoGeneratedFilePath = (msg: DescMessage): string =>
  `@gen/${msg.file.name.replace(/^audiotool\//, "")}_pb`
