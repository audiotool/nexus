import type { Modification } from "@gen/document/v1/document_service_pb"

import type { EntityMessage } from "@document/entity-utils"
import { Pointer } from "@gen/document/v1/pointer_pb"
import { assert } from "@utils/lang"
import { protoDownCast } from "@utils/proto-down-cast"
import { buildModificationForFieldUpdate } from "."
import type { NexusEntity } from "../entity"
import {
  ArrayField,
  PrimitiveField,
  primitiveEquals,
  type NexusField,
  type PrimitiveType,
} from "../fields"
import { NexusLocation } from "../location"
import { NexusObject } from "../object"

/** Fields that are part of a device's workspace/UI state rather than its sound
 * and are preserved when a preset is applied to an existing device. */
const DEVICE_WORKSPACE_FIELDS = ["positionX", "positionY", "displayName"]

/** Takes an existing nexus entity, and a new entity message, that must be
 * of the same type as the existing entity.
 *
 * Then it builds modifications that update all fields of the existing entity
 * to the values in the new entites, except fields with identical values.
 *
 * If `presetName` is passed, the call is treated as the top-level of a preset
 * application to a device entity:
 * - the top-level `presetName` field is stamped with the passed `presetName`
 *   (regardless of what `msg` carries)
 * - the top-level `positionX`, `positionY` and `displayName` fields are left
 *   untouched (these are workspace/UI state, not part of the preset's sound)
 *
 * Nested submessages are updated normally; the special handling only applies
 * at the top level.
 */
export const buildPresetUpdateModifications = (
  entity: NexusEntity,
  msg: EntityMessage,
  presetName?: string,
): Modification[] =>
  buildModificationForObject(entity, msg, presetName !== undefined, presetName)

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

/** Returns modifications needed to update a nexus object.
 *
 * When `isPresetTargetEntity` is true, this call represents the top-level
 * device entity being updated by a preset application. In that case:
 * - `positionX`, `positionY` and `displayName` are skipped
 * - `presetName` is stamped with the `presetName` argument (ignoring `msg`)
 *
 * These behaviors intentionally do not recurse into submessages.
 */
const buildModificationForObject = (
  object: NexusObject,
  msg: unknown,
  isPresetTargetEntity: boolean = false,
  presetName?: string,
): Modification[] => {
  assert(typeof msg === "object", `msg is not an object`)
  return Object.entries(object.fields).flatMap(([key, field]) => {
    if (isPresetTargetEntity && DEVICE_WORKSPACE_FIELDS.includes(key)) {
      return []
    }

    if (
      isPresetTargetEntity &&
      key === "presetName" &&
      field instanceof PrimitiveField &&
      field._protoType === "string"
    ) {
      const nextValue = presetName ?? ""
      return field.value !== nextValue
        ? [buildModificationForFieldUpdate(field, nextValue)]
        : []
    }

    return buildModificationForField(
      field,
      (msg as Record<string, unknown>)[key],
    )
  })
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

  // else, field is a non-pointer primitive type - downcast and check for equality
  const downCasted = protoDownCast(field._protoType, msgValue as PrimitiveType)
  if (primitiveEquals(field.value, downCasted)) {
    return []
  }
  return [buildModificationForFieldUpdate(field, downCasted)]
}
