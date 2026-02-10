import { throw_ } from "@utils/lang"
import type { NexusEntity } from "../entity"
import { ArrayField, PrimitiveField, type PrimitiveType } from "../fields"
import { NexusLocation } from "../location"
import { NexusObject } from "../object"

/** removes a source/target pair from a reference map, cleaning up in the process */
export const removeSourceTarget = (
  references: Map<NexusLocation, NexusLocation[]>,
  source: NexusLocation,
  target: NexusLocation,
): boolean => {
  let oldSources = references.get(target)
  if (oldSources === undefined) {
    return false
  }
  oldSources = oldSources.filter((s) => !s.equals(source))
  if (oldSources.length === 0) {
    references.delete(target)
  } else {
    references.set(target, oldSources)
  }
  return true
}

/** Adds a source/target pair to a reference map */
export const addSourceTarget = (
  references: Map<NexusLocation, NexusLocation[]>,
  source: NexusLocation,
  target: NexusLocation,
) => {
  const newSources = [...(references.get(target) ?? []), source]
  references.set(target, newSources)
}

/** Function that calls a `visit` function on every pointer field of a nexus object/entity */
export const visitPointers = (
  obj: NexusObject,
  visit: (from: NexusLocation, to: NexusLocation) => void,
) => {
  Object.values(obj.fields).forEach((field) => {
    // primitive fields of type nexus location
    if (
      field instanceof PrimitiveField &&
      field.value instanceof NexusLocation
    ) {
      if (!field.value.isEmpty()) {
        visit(field.location, field.value)
      }
      return
    }

    // field is an array field
    if (field instanceof ArrayField) {
      // containing nexus objects
      if (field.array[0] instanceof NexusObject) {
        // the field is an array of objects
        field.array.forEach((item: NexusObject) => visitPointers(item, visit))
        return
      }

      // contains primitive fields to nexus location
      if (
        field.array[0] instanceof PrimitiveField &&
        field.array[0].value instanceof NexusLocation
      ) {
        // the field is an array of pointers
        field.array
          .filter(
            (target: PrimitiveField<NexusLocation>) => !target.value.isEmpty(),
          )
          .forEach((target: PrimitiveField<NexusLocation>) =>
            visit(field.location, target.value),
          )
        return
      }
      // else, field is primitive field of other type
      return
    }

    if (field instanceof NexusObject) {
      // the field is an object
      visitPointers(field, visit)
    }
  })
}

/** Update a nexus field. Resolves the field and calls start/stop pointing
 * to at the right time if the value is a NexusLocation.
 */
export const applyUpdate = <P extends PrimitiveType>(
  entity: NexusEntity,
  location: NexusLocation,
  value: P,
  callbacks?: {
    /** Called if the update is on a NexusLocation & causes a pointer field to point to something */
    onStartPointingTo(from: NexusLocation, to: NexusLocation): void
    /** Called if the update is on a NexusLocation & causes a pointer field to stop pointing to something */
    onStopPointingTo(from: NexusLocation, to: NexusLocation): void
  },
) => {
  const field =
    entity._resolveField(location.fieldIndex) ??
    throw_(`can't find updated field ${location}`)
  if (!(field instanceof PrimitiveField)) {
    throw "received update on non-primitive field"
  }

  if (!(value instanceof NexusLocation)) {
    field._setValue(value)
    return
  }

  const oldTarget = field.value as NexusLocation

  if (!oldTarget.isEmpty()) {
    // notify stopPointingTo-listeners
    callbacks?.onStopPointingTo(field.location, oldTarget)
  }

  field._setValue(value)

  const newTarget = value
  if (!newTarget.isEmpty()) {
    callbacks?.onStartPointingTo(field.location, newTarget)
  }
}
