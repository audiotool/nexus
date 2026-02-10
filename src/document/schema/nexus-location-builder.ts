import {
  anyEntityToTypeKey,
  type EntityTypeKey,
  mustUnpackEntity,
} from "@document/entity-utils"
import type { Modification } from "@gen/document/v1/document_service_pb"
import type { Pointer } from "@gen/document/v1/pointer_pb"
import { throw_ } from "@utils/lang"
import type { NexusDocument } from "../document"
import { NexusLocation } from "../location"

/**
 * The returned object of this function can be used to create {@link NexusLocation} objects in cases
 * where the only information available that describes a nexus document state is a stream of modifications.
 *
 * This is rarely needed since we usually have a {@link NexusDocument} available that does what this object
 * does for us.
 *
 * A case where we don't have the document state is for example in the recording logic, where we parse
 * engine feedback messages containing modifications after they were applied to the engine; these are
 * out of sync with the document, hence might reference an entity that's already deleted. With this
 * function we can still resolve the type.
 *
 * The reason an object like this is needed is that in order to construct a {@link NexusLocation} object,
 * we need to know the entity type of the entity that the location points to, information that's not
 * available in a simple {@link Pointer} object.
 */
export const createModificationBasedLocationBuilder = (
  typeMap: Map<string, EntityTypeKey> = new Map(),
): {
  /** apply every modification in the document using this to make entity types resolvable */
  applyModification: (mod: Modification) => void
  /** like create location but throws if type can't be resolved */
  mustCreateLocation: (pointer: Pointer) => NexusLocation
  /** create a location, returns undefined if the type can't be resolved */
  createLocation: (pointer: Pointer) => NexusLocation | undefined
} => {
  const mustCreateLocation = (ptr: Pointer): NexusLocation => {
    if (ptr.entityId === "") {
      return new NexusLocation()
    }
    if (!typeMap.has(ptr.entityId)) {
      throw new Error(
        "couldn't find entity type of location with id " + ptr.entityId,
      )
    }

    return new NexusLocation(
      ptr.entityId,
      typeMap.get(ptr.entityId) ?? throw_(),
      ptr.fieldIndex,
    )
  }
  return {
    applyModification: (mod: Modification) => {
      switch (mod.modification.case) {
        case "create": {
          const entity = mustUnpackEntity(mod.modification.value.entity)
          typeMap.set(
            entity.id,
            anyEntityToTypeKey(mod.modification.value.entity) ?? throw_(),
          )
          break
        }
        case "delete": {
          typeMap.delete(mod.modification.value.entityId)
          return
        }
      }
    },

    createLocation: (ptr: Pointer): NexusLocation | undefined => {
      if (ptr.entityId === "") {
        return new NexusLocation()
      }
      if (!typeMap.has(ptr.entityId)) {
        return undefined
      }
      return mustCreateLocation(ptr)
    },
    mustCreateLocation,
  }
}
