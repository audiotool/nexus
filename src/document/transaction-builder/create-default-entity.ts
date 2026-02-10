import type {
  AnyMessage,
  FieldInfo,
  MessageType,
  PartialMessage,
} from "@bufbuild/protobuf"
import type { EntityMessage, EntityTypeKey } from "@document/entity-utils"
import { Pointer } from "@gen/document/v1/pointer_pb"
import { entityMessageTypes } from "@gen/document/v1/utils/types"

import { assert } from "@utils/lang"
import { _getSchemaLocatorDetails } from "../schema/get-schema-details-from-locator"
import type { _SchemaLocator } from "../schema/schema-locator"

/** Generates a proto-message for an entity filled with the default values annotated using field options,
 * the `id` field assigned a new uuid, and all submessages initialized.
 */
export const createDefaultEntityMessage = <T extends EntityTypeKey>(
  name: T,
): EntityMessage<T> =>
  createDefaultMessage(
    name as _SchemaLocator,
    entityMessageTypes[name],
  ) as EntityMessage<T>

/** Constructs a proto message that contains all the default values specified
 * using proto field annotations, or proto-default values if no defaults are
 * annotated. Will always create submessages.
 *
 * Attempts were made to properly type this using `EntityMessageTypes`, without success - please
 * do it if you can!
 */
const createDefaultMessage = (
  schemaPath: _SchemaLocator,
  type: MessageType<AnyMessage>,
): AnyMessage =>
  new type(
    Object.fromEntries(
      type.fields.list().map((field) => {
        if (field.name === "id" && field.no === 1) {
          return ["id", crypto.randomUUID()]
        }
        return [
          field.localName,
          getDefaultFieldValue(
            `${schemaPath}:${field.no}` as _SchemaLocator,
            field,
          ),
        ]
      }),
    ) as PartialMessage<AnyMessage>,
  )

/** Returns the default value of a field as specified using field Options.
 * Will always create submessages. Will fall back to proto-defaults if no
 * value is set.
 */
const getDefaultFieldValue = (
  path: _SchemaLocator,
  field: FieldInfo,
): unknown => {
  const details = _getSchemaLocatorDetails(path)
  switch (details.type) {
    case "object": {
      assert(field.kind === "message", "field is not a message")
      return createDefaultMessage(path, field.T)
    }
    case "array": {
      assert(field.repeated, "field is not repeated")
      return new Array(details.length)
        .fill(undefined)
        .map(() => getDefaultFieldValue(`${path}:[]` as _SchemaLocator, field))
    }
    case "primitive": {
      switch (details.primitive.type) {
        case "boolean":
        case "number": {
          return details.primitive.default
        }
        case "string": {
          return ""
        }
        case "bytes": {
          return new Uint8Array()
        }
        case "nexus-location": {
          return new Pointer()
        }
        default: {
          details.primitive satisfies never
        }
      }
    }
  }
}
