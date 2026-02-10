import type { DescField, DescFile, DescMessage } from "@bufbuild/protobuf"
import type { Schema } from "@bufbuild/protoplugin/ecmascript"
import { GeneratedFile } from "./file"
import { gatherFieldTargets } from "./gather-field-targets"
import { generateNexusTypes } from "./generate-nexus-types"
import { generateSchemaDetails } from "./generate-schema-details"
import { generateSchemaPaths } from "./generate-schema-paths"
import { generateTypes } from "./generate-types"
import { toTypeName, typeNameToEntityName } from "./utils"

export const PACKAGE_PATH: string = "audiotool/document/v1/"
export const ENTITY_PATH: string = `@gen/${PACKAGE_PATH}`

export const generateTs = (schema: Schema): void => {
  // we only want to generate entities and empty  - not options, no pointer, not engine message, not
  // presets, no document_service.
  // so we match whether the filename is audiotool/document/v1/[X], where [X] must be
  // either empty.proto, pointer.proto, or entity/*.
  //
  // The  reason we don't need pointer is because it's replaced by NexusLocation.

  const files = schema.files.filter((f) =>
    /^audiotool\/document\/v1\/(empty|entity\/.*)$/.exec(f.name),
  )

  // all messages we will process
  const messages = files.flatMap((file) => file.messages)

  /** contains a map <message.typeName -> entity type key> */
  const entityNames = new Map<string, string>()

  const entityMessages = messages.filter((message) => messageIsEntity(message))
  entityMessages.forEach((message) => {
    // set the local name
    entityNames.set(message.typeName, typeNameToEntityName(message.typeName))
  })

  // this array will contain the set of all symbols we can import using `GeneratedFile`
  const importSymbols: Array<[string, string]> = [
    ["Options", "@gen/document/v1/opt/opt_pb"],
    ["ArrayField", "@document/fields"],
    ["PrimitiveField", "@document/fields"],
    ["NexusObject", "@document/object"],
    ["NexusLocation", "@document/location"],
    ["NexusLocationConstructor", "@document/location"],
    ["MessageOptionsSymbol", "@document/options-symbol"],
    ["ArrayOfSize", "@utils/lang"],
    ["EntityTypeKey", "@document/entity-utils"],
    ["SchemaDetails", "@document/schema/schema-details"],
    ["ScalarType", "@bufbuild/protobuf"],
  ]

  const targetTypes = gatherFieldTargets(
    files.map((file) => file.messages).flat(),
    entityNames,
  )

  // generate nexus
  files.forEach((file: DescFile) => {
    const fileName: string = file.name + "_nexus.ts"

    const genFile = new GeneratedFile(
      schema.generateFile(fileName),
      importSymbols,
    )
    file.messages.forEach((message) => genFile.exclude(toTypeName(message)))
    generateNexusTypes(genFile, file.messages, entityNames, targetTypes)
  })

  /** generates a new file, passes it to fa file generator function, collects
   * import symbols generated during the creation of the file for later usage.
   */
  const generateUtilsFile = (
    fileName: string,
    generateFile: (file: GeneratedFile) => string[] | void,
  ) => {
    const path = `${PACKAGE_PATH}utils/${fileName}.ts`
    const file = new GeneratedFile(schema.generateFile(path), importSymbols)
    const symbols = generateFile(file)
    symbols?.forEach((symbol) => {
      importSymbols.push([symbol, path])
    })
  }

  // create util files
  // generateUtilsFile("utils", (file) => generateOptions(file, messages))
  generateUtilsFile("types", (file) =>
    generateTypes(file, messages, entityNames),
  )
  generateUtilsFile("schema", (file) => {
    generateSchemaDetails(file, messages)
  })
  generateUtilsFile("path", (file) =>
    generateSchemaPaths(file, [...messages], entityNames),
  )
}

/** Returns true if `message` is an entity, i.e. has an `id` field with index 1 */
export const messageIsEntity = (message: DescMessage): boolean =>
  message.fields.some(
    (field: DescField) => field.name === "id" && field.number === 1,
  )
