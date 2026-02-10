import type { AnyMessage, FieldInfo, Message } from "@bufbuild/protobuf"
import {
  getEntityTypeKeyFromProtoName,
  type EntityConstructorType,
  type EntityMessage,
  type EntityTypeKey,
} from "@document/entity-utils"
import { Pointer } from "@gen/document/v1/pointer_pb"
import { assert } from "@utils/lang"
import type { NexusLocation } from "../location"

/** Given an entity message and an object of type constructor type, applies the constructor
 * type's fields to the entity message, in place.
 */
export const updateEntityMessageWithConstructor = (
  msg: EntityMessage,
  args: EntityConstructorType, // unknown for simplicity, but actually a constructor type
) => {
  const entityKey = getEntityTypeKeyFromProtoName(msg.getType().name)
  updateProtoMessage(entityKey, msg, args)
}

/**
 * Updates a proto message with constructor parameters. See usage for examples.
 */
export const updateProtoMessage = (
  entityKey: EntityTypeKey,
  msg: Message<AnyMessage>,
  args: { [i: string]: unknown },
) => {
  msg
    .getType()
    .fields.list()
    .forEach((field) => {
      // if the field doesn't have an overwriting arg, skip it
      if (!(field.localName in args) || args[field.localName] === undefined) {
        return
      }
      // cast the message to a map of strings to unkown elements which we might overwrite with elements
      // from `args`
      const fieldMap = msg as unknown as { [i: string]: unknown }

      if (!field.repeated) {
        fieldMap[field.localName] = toFieldValue(
          entityKey,
          field,
          fieldMap[field.localName],
          args[field.localName],
        )
        return
      }

      // if the field is repeated, both the argument to overwrite and the field value must be arrays
      const argArr = args[field.localName] as unknown[]
      const msgArr = fieldMap[field.localName] as unknown[]

      // we're only checking if argArr is an array, since if msgArr isn't an array, the FieldInfo must be incorrect
      assert(
        Array.isArray(argArr),
        `tried overriding repeated field ${field.localName} of message ${
          msg.getType().typeName
        } with non-array field`,
      )

      // check that the lengths of the arrays are the same
      assert(
        argArr.length === msgArr.length,
        `tried overriding repeated field ${field.localName} with array of different length`,
      )

      // and overwrite each element
      argArr.forEach((val, i) => {
        msgArr[i] = toFieldValue(entityKey, field, msgArr[i], val)
      })
      return
    })
}
/**
 * Takes a FieldInfo describing a field, the current field value, and the new value which should
 * replace currentVal, and returns the new value with which we can replace currentValue.
 */
const toFieldValue = (
  entityKey: EntityTypeKey,
  field: FieldInfo,
  currentVal: unknown,
  newVal: unknown,
): unknown => {
  switch (field.kind) {
    case "message": {
      if (field.T.name === Pointer.name) {
        const loc = newVal as NexusLocation
        return new Pointer({
          fieldIndex: loc.fieldIndex.slice(),
          entityId: loc.entityId,
        })
      }

      updateProtoMessage(
        entityKey,
        currentVal as Message<AnyMessage>,
        newVal as { [i: string]: unknown },
      )
      return currentVal
    }
    case "scalar": {
      return newVal
    }
  }
}
