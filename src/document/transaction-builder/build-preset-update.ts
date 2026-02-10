import type { Modification } from "@gen/document/v1/document_service_pb"

import type { EntityMessage } from "@document/entity-utils"
import { Pointer } from "@gen/document/v1/pointer_pb"
import { assert } from "@utils/lang"
import { buildModificationForFieldUpdate } from "."
import type { NexusEntity } from "../entity"
import {
  ArrayField,
  PrimitiveField,
  type NexusField,
  type PrimitiveType,
} from "../fields"
import { NexusLocation } from "../location"
import { NexusObject } from "../object"

/** Takes an existing nexus entity, and a new entity message, that must be
 * of the same type as the existing entity.
 *
 * Then it builds modifications that update all fields of the existing entity
 * to the values in the new entites, except fields with identical values.
 */
export const buildPresetUpdateModifications = (
  entity: NexusEntity,
  msg: EntityMessage,
): Modification[] => buildModificationForObject(entity, msg)

/** Returns modifications needed to update an arbitrary nexus field */
const buildModificationForField = (
  field: NexusField,
  msgValue: unknown,
): Modification[] => {
  if (field instanceof PrimitiveField) {
    return buildUpdateForPrimitiveField(field, msgValue)
  }

  if (field instanceof ArrayField) {
    return buildModificationForArray(field, msgValue)
  }

  if (field instanceof NexusObject) {
    return buildModificationForObject(field, msgValue)
  }

  throw new Error(`unknown field type`)
}

/** Returns modifications needed to update a nexus object */
const buildModificationForObject = (
  object: NexusObject,
  msg: unknown,
): Modification[] => {
  assert(typeof msg === "object", `msg is not an object`)
  return Object.entries(object.fields).flatMap(([key, field]) =>
    buildModificationForField(field, (msg as Record<string, unknown>)[key]),
  )
}

/** Returns modifications needed to update an array field */
const buildModificationForArray = (
  field: ArrayField,
  msgValue: unknown,
): Modification[] => {
  // some asserts to make sure the field is of correct type
  assert(msgValue instanceof Array, `field is not an array`)
  assert(field.array.length === msgValue.length, `field has different lengths`)

  // potential for optimization: check field type of first element and use that for all elements
  return [...field.array.entries()].flatMap(([i, element]) =>
    buildModificationForField(element, msgValue[i]),
  )
}

/** Returns modifications needed to update a primitive field */
const buildUpdateForPrimitiveField = (
  field: PrimitiveField,
  msgValue: unknown,
): Modification[] => {
  assert(typeof field.value === typeof msgValue, `field has different types`)

  // if field is a NexusLocation, we first have to convert the NexusLocation
  if (field.value instanceof NexusLocation) {
    assert(
      msgValue instanceof Pointer,
      `tried updating a field that's not a pointer field with a NexusLocation`,
    )
    if (field.value.equalsPointer(msgValue)) {
      return []
    }
    return [buildModificationForFieldUpdate(field, msgValue)]
  }

  // else, field is a non-pointer primitive type - check for equality again
  if (field.value === msgValue) {
    return []
  }
  return [buildModificationForFieldUpdate(field, msgValue as PrimitiveType)]
}
