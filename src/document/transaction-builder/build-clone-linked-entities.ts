import type { Modification } from "@gen/document/v1/document_service_pb"
import toposort from "toposort"

import type {
  EntityConstructorType,
  EntityMessage,
  EntityTypeKey,
} from "@document/entity-utils"
import { throw_ } from "@utils/lang"
import { NexusEntity } from "../entity"
import { NexusLocation } from "../location"
import { buildCreateModification } from "./build-modifications"
import { createDefaultEntityMessage } from "./create-default-entity"
import { entityToConstructorType } from "./entity-to-constructor-type"
import { mapConstructorLocations } from "./map-constructor-locations"
import { updateEntityMessageWithConstructor } from "./update-pb-message"

/** @internal */
export type _EntityWithOverwrites<T extends EntityTypeKey> = {
  entity: NexusEntity<T>
  overwrites?: EntityConstructorType<T>
}

/**
 * Expands to
 *
 * ```ts
 * type _EntityWithArg<T> = {
 *  entity: NexusEntity<T>
 *  overwrites?: ConstructorTypes[T]
 * }
 * ```
 *
 * except for when except when `T`
 * is one of multiple options:
 *
 * If `T` is `"output" | "tonematrix"`, this type expands to
 * ```
 * _EntityWithArg<"output"> | _EntityWithArg<"tonematrix">
 * ```
 *
 * rather than
 * ```
 * _EntityWithArg<"output" | "tonematrix">
 * ```
 *
 * which causes typescript to make sure that the `entity` field matches
 * the type of the `overwrites` field, and doesn't just take the type
 * union for either of these fields.
 *
 */
export type EntityWithOverwrites<T extends EntityTypeKey = EntityTypeKey> = {
  [K in T]: _EntityWithOverwrites<K>
}[T]

/**
 * /**
 * @internal
 *  Builds a list of modifications that clone a list of given entities.
 *
 * The entities are cloned such that pointers from and to the entities in the passed
 * list are updated to point to the new entities.
 *
 * Pointers from or to entities outside the list are left as-is.
 *
 * Returns the list of modifications creating the new entities, and a map
 * that maps the old entity ids to the new entity ids.
 *
 */
export const buildModificationsForCloneLinkedEntities = (
  ...entities: (EntityWithOverwrites | NexusEntity)[]
): {
  modifications: Modification[]
  uuidMap: Map<string, string>
} => {
  const entitiesWithOverwrites = entities.map((entity) =>
    entity instanceof NexusEntity
      ? { entity }
      : (entity as _EntityWithOverwrites<EntityTypeKey>),
  )

  /*
    Implementation note:

    We have to:
    1. create a map from old to new ids
    2. clone all entity objects
    3. update all pointer within the new entities if they point to an entity with id in the map from 1.
    4. sort the entities topologically, so they are created in the correct order
    5. turn the sorted entity list into a list of `Create` modifications
  */

  const oldToNewUuidsMap: Map<string, string> = new Map()
  entitiesWithOverwrites.forEach((e) =>
    oldToNewUuidsMap.set(e.entity.id, crypto.randomUUID()),
  )

  // contains the old entities, indexed by uuid - this will remove duplicates
  const oldEntitiesMap: Map<
    string,
    _EntityWithOverwrites<EntityTypeKey>
  > = new Map()
  entitiesWithOverwrites.forEach((e) => oldEntitiesMap.set(e.entity.id, e))

  // will create the new entities, as pb messages
  const newEntityPbMessages: Map<string, [EntityTypeKey, EntityMessage]> =
    new Map()

  // This will create a list of [[uuid, uuid], ...] of links between the new uuids,
  // so we can later sort them topologically. The toposort library only supports `===` comparison,
  // so we serialize all uuids to strings.
  const newEntityPointers: [string, string][] = []

  // now go through all the old entities and...
  ;[...oldEntitiesMap.values()].forEach(({ entity: oldEntity, overwrites }) => {
    // ... convert to constructor type
    const constructor = entityToConstructorType(oldEntity)

    // ... create a new proto message for the entity with default values, set its id
    const newMsg = createDefaultEntityMessage(oldEntity.entityType)
    newMsg.id = oldToNewUuidsMap.get(oldEntity.id) ?? throw_()

    // ... map the locations of the new constructor to the new uuids,
    //     and update the list `newEntityPointers`
    const updatedConstructor = mapConstructorLocations(constructor, (loc) => {
      // check if the pointer points to a uuid in the old set of uuids
      const uuidMappedToNew = oldToNewUuidsMap.get(loc.entityId)
      if (uuidMappedToNew !== undefined) {
        // if it does, update `newEntityPointers`, and create a new `NexusLocation`
        newEntityPointers.push([newMsg.id, uuidMappedToNew])

        return new NexusLocation(uuidMappedToNew, loc.entityType, [
          ...loc.fieldIndex,
        ])
      }

      // otherwise, keep the location as-is
      return loc
    })

    // now, update the new message with the constructor we just updated with the new location
    updateEntityMessageWithConstructor(newMsg, updatedConstructor)
    if (overwrites !== undefined) {
      // overwrite the new message with the overwrites. Note that the overites don't have to be considered
      // in `newEntityPointers`, since overwritten pointers can only point to entities that are not in the
      // newly cloned set of entities.
      updateEntityMessageWithConstructor(newMsg, overwrites)
    }

    // and insert into map
    newEntityPbMessages.set(newMsg.id, [oldEntity.entityType, newMsg])
  })

  // entities that have pointers from/to them are in this list in sorted order.
  const toposorted = toposort(newEntityPointers).reverse()
  // all other entities are in here, their order doesn't matter
  const unsorted = [...newEntityPbMessages.keys()].filter(
    (id) => !toposorted.includes(id),
  )
  return {
    modifications: [...toposorted, ...unsorted].map((id) => {
      const [, msg] = newEntityPbMessages.get(id) ?? throw_()
      return buildCreateModification(msg)
    }),
    uuidMap: oldToNewUuidsMap,
  }
}
