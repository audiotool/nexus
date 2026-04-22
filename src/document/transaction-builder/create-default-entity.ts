import type {
  AnyMessage,
  FieldInfo,
  MessageType,
  PartialMessage,
} from "@bufbuild/protobuf"
import type {
  EntityConstructorType,
  EntityMessage,
  EntityTypeKey,
} from "@document/entity-utils"
import { Empty } from "@gen/document/v1/empty_pb"
import { Pointer } from "@gen/document/v1/pointer_pb"
import { entityMessageTypes } from "@gen/document/v1/utils/types"

import { assert, throw_ } from "@utils/lang"
import { _getSchemaLocatorDetails } from "../schema/get-schema-details-from-locator"
import type { _SchemaLocator } from "../schema/schema-locator"
import { entityDefaultsMap } from "./defaults"
import type { Defaults } from "./defaults/default-type"

/** Generates a proto-message for an entity filled with the default values defined in
 * `entityDefaultsMap`, the `id` field assigned a new uuid, and all submessages initialized.
 */
export const createDefaultEntityMessage = <T extends EntityTypeKey>(
  name: T,
): EntityMessage<T> => {
  const defaults = entityDefaultsMap[name]
  if (defaults === undefined) {
    throw new Error(`No defaults found for entity type ${name}`)
  }
  return createDefaultMessage(
    name as _SchemaLocator,
    entityMessageTypes[name],
    defaults,
  ) as EntityMessage<T>
}

/** Constructs a proto message that contains all the default values specified by the
 * passed `defaults` object. Will always create submessages.
 *
 * Attempts were made to properly type this using `EntityMessageTypes`, without success - please
 * do it if you can!
 */
const createDefaultMessage = (
  schemaPath: _SchemaLocator,
  type: MessageType<AnyMessage>,
  defaults: Defaults<EntityConstructorType>,
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
            defaults,
          ),
        ]
      }),
    ) as PartialMessage<AnyMessage>,
  )

/** Returns the default value of a field as specified by the defaults map.
 * Will always create submessages. Falls back to proto defaults only for `Empty` /
 * `Pointer` messages which don't carry any value.
 */
const getDefaultFieldValue = (
  path: _SchemaLocator,
  field: FieldInfo,
  defaults: Defaults<EntityConstructorType>,
): unknown => {
  const details = _getSchemaLocatorDetails(path)

  switch (details.type) {
    case "object": {
      assert(field.kind === "message", "field is not a message")
      // the defaults object never contains values for `empty`
      // fields (since they don't contain value), so we can stop here
      if (field.T === Empty) {
        return {}
      }
      if (field.T === Pointer) {
        return new Pointer()
      }
      // When handling array element defaults (field.repeated is true),
      // `defaults` is already the element's defaults object.
      // For regular nested objects, we need to access defaults[field.localName].
      const nestedDefaults = field.repeated
        ? defaults
        : defaults?.[field.localName as keyof typeof defaults]
      return createDefaultMessage(
        path,
        field.T,
        nestedDefaults ??
          throw_(`No default value for field ${field.localName}`),
      )
    }
    case "array": {
      assert(field.repeated, "field is not repeated")
      return new Array(details.length).fill(undefined).map((_, i) => {
        if (field.kind === "message" && field.T === Empty) {
          return {}
        }
        return getDefaultFieldValue(
          `${path}:[]` as _SchemaLocator,
          field,
          defaults?.[field.localName as keyof typeof defaults]?.[i] ??
            throw_(`No default value for field ${field.localName}[${i}]`),
        )
      })
    }
    case "primitive": {
      if (field.kind === "message" && field.T === Pointer) {
        return new Pointer()
      }
      if (typeof defaults !== "object") {
        return defaults
      }
      return (
        defaults[field.localName as keyof typeof defaults] ??
        throw_(`No default value for field ${field.localName}`)
      )
    }
  }
}
