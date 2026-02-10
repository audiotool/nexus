import type { DescMessage } from "@bufbuild/protobuf"
import { throw_ } from "../../src/utils/lang.js"
import type { GeneratedFile } from "./file"
import {
  getFieldOptions,
  isEntity,
  toConstructorName,
  toNexusGeneratedFilePath,
  toProtoGeneratedFilePath,
  toTypeName,
} from "./utils"

export const generateTypes = (
  file: GeneratedFile,
  messages: DescMessage[],
  entityNames: Map<string, string>,
): string[] => {
  // sort and filter class generators to only use entities
  const entityMessages = messages.filter(isEntity)
  // the symbols created by this generator, collected so they can be returned
  // and used by future generators
  const generatedSymbols: string[] = []
  // util function that adds a symbol and returns it
  const createSymbol = (symbol: string): string => (
    generatedSymbols.push(symbol),
    symbol
  )

  file.print(`

// This file contains various type and map definitions. Check entity-utils.ts
// for some type checks and derived types.


/** Maps entity type keys to their field types.
 *
 * Field types are the types of the fields of a nexus entity. so e.g.:
 * \`\`\`ts
 * // "tonematrix" is the "type key"
 * const tm = t.create("tonematrix", {})
 *
 * // tm.fields is TypeKeyToType["tonematrix"]
 * tm.fields
 * \`\`\`
 */
export type ${createSymbol("EntityTypes")} = {
    ${entityMessages
      .map(
        (message: DescMessage): string =>
          `${entityNames.get(message.typeName) ?? throw_()}: ${file.import(
            toTypeName(message),
            true,
            toNexusGeneratedFilePath(message),
          )}`,
      )
      .join(",\n")}
}


/** Maps entity type keys to their constructor types. Constructor types are the
 * types that allow "overwriting" fields on creation.
 *
 * Example:
 * \`\`\`ts
 * const tm = t.create(
 *     // "tonematrix" is the "type key"
 *     "tonematrix",
 *      // {} is TypeKeyToConstructorType["tonematrix"]
 *     {}
 * )
 * \`\`\`
 */
export type ${createSymbol("ConstructorTypes")} =  {
    ${entityMessages
      .map(
        (message: DescMessage): string =>
          `${entityNames.get(message.typeName) ?? throw_()}: ${file.import(
            toConstructorName(message),
            true,
            toNexusGeneratedFilePath(message),
          )}`,
      )
      .join(",\n")}
}

/** The proto type URL to the type key. Type key is defined above; type url
 * is the URL used to indicate by the proto.Any message which type it is.
 */
export const ${createSymbol("entityUrlToTypeKey")} = {
    ${entityMessages
      .map(
        (message: DescMessage): string =>
          `["${message.typeName}"]: "${entityNames.get(message.typeName) ?? throw_()}"`,
      )
      .join(",\n")}
} as const

/** Entity type keys to their message classes */
export const ${createSymbol("entityMessageTypes")} = {
    ${entityMessages
      .map(
        (message: DescMessage): string =>
          `${entityNames.get(message.typeName) ?? throw_()}: ${file.import(`${message.name}:${message.name}_pb`, false, toProtoGeneratedFilePath(message))}`,
      )
      .join(",\n")}
}`)
  file.write()
  return generatedSymbols
}

const hasRequiredField = (message: DescMessage): boolean =>
  message.fields.some((field) => {
    const options = getFieldOptions(field)
    if (field.fieldKind === "message" && field.message.name === "Pointer") {
      return (options.pointer ?? throw_()).required
    }
    if (field.fieldKind === "message") {
      return hasRequiredField(field.message)
    }
    return false
  })
