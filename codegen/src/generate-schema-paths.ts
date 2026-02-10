import type { DescMessage } from "@bufbuild/protobuf"
import { localName } from "@bufbuild/protoplugin/ecmascript"
import type { GeneratedFile } from "./file"
import { messageIsEntity } from "./ts-generator"

export const generateSchemaPaths = (
  file: GeneratedFile,
  messages: DescMessage[],
  entityNames: Map<string, string>,
): void => {
  file.print("")
  file.print("/** @internal\n Array type, Arr<0 | 1> expands to [0] | [1] */")
  file.print("export type Arr<N extends number> = `[${N}]`")
  file.print("")
  file.print(
    `/** Submessage type. Use like: Submessage<"foo", SubmessageType> to get fields "foo", "foo/x" etc */`,
  )
  file.print(
    "/** @internal */",
    "export type Submessage<Name extends string, Subtypes extends string> = Name | `${Name}/${Subtypes}`\n\n",
  )

  messages = messages.filter(
    (message) => !["Empty", "Pointer"].includes(message.name),
  )

  file.print(
    messages
      .map((message) => {
        let fields: string

        if (message.fields.length === 0) {
          fields = `""`
        } else {
          fields = message.fields
            .filter(
              (field) =>
                !(
                  messageIsEntity(message) &&
                  field.name === "id" &&
                  field.number === 1
                ),
            )
            .map((field) => {
              const fieldName = `"${localName(field)}"`
              if (
                field.fieldKind === "message" &&
                !["Empty", "Pointer"].includes(field.message.name)
              ) {
                const messageTypeName = toPathTypeName(field.message)
                if (field.repeated) {
                  return `Submessage<${fieldName}, Submessage<Arr<number>, ${messageTypeName}>>`
                } else {
                  return `Submessage<${fieldName}, ${messageTypeName}>`
                }
              }
              if (field.repeated) {
                const fieldNumbers = [...Array(5).keys()]
                  .map((i) => `${i}`)
                  .join(" | ")
                return `Submessage<${fieldName}, Arr<${fieldNumbers}>>`
              }
              return fieldName
            })
            .join("\n    | ")
        }
        return `/** @internal */\nexport type ${toPathTypeName(message)} = ${fields === "" ? "never" : fields}`
      })
      .join("\n\n"),
  )
  file.print(`\n\n /** This is a generated type that is a subset of \`string\` that represents a path
 * to a field in the schema.
 *
 * Examples:
 * \`\`\`ts
 * import { SchemaPath } from "@audiotool/nexus/utils"
 *
 * "/desktopAudioCable" satisfies SchemaPath
 * "/desktopAudioCable/audioInput" satisfies SchemaPath
 * "/heisenberg/pitchEnvelope/releaseBendFactor" satisfies SchemaPath
 * "/heisenberg/operators/0/pitchEnvelope/releaseBendFactor" satisfies SchemaPath
 * \`\`\`
 *
 * Converter functions:
 * * {@link document.schemaLocationToSchemaPath}
 * * {@link document.schemaPathToSchemaLocation}
 */\n`)
  file.print(`export type SchemaPath = \`/$\{${messages
    .filter((msg) => messageIsEntity(msg))
    .map(
      (msg) =>
        `Submessage<"${entityNames.get(msg.typeName) ?? localName(msg)}", ${toPathTypeName(msg)}>`,
    )
    .join(" | \n")}
  }\``)

  file.write()
}

const toPathTypeName = (message: DescMessage): string => `${message.name}Path`
