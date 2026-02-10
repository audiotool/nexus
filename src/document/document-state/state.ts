import { mustUnpackEntity, type EntityTypeKey } from "@document/entity-utils"
import type {
  Create,
  Delete,
  Modification,
  Update,
} from "@gen/document/v1/document_service_pb"
import { HashMap } from "@utils/hash-map"
import { throw_ } from "@utils/lang"
import type { NexusEntity, NexusEntityUnion } from "../entity"
import type { PrimitiveType } from "../fields"
import { NexusLocation } from "../location"
import { createEntity } from "./create-entity"
import { extractPbUpdateValue } from "./extract-update-value"
import {
  addSourceTarget,
  applyUpdate,
  removeSourceTarget,
  visitPointers,
} from "./utils"

export type ModificationCallbacks = {
  onStartPointingTo: (from: NexusLocation, to: NexusLocation) => void
  onStopPointingTo: (from: NexusLocation, to: NexusLocation) => void
  onUpdate: (location: NexusLocation, value: PrimitiveType) => void
  onCreate: (entity: NexusEntity) => void
  onDelete: (entity: NexusEntity) => void
}

/**
 * @internal
 * This type represents the current "state" of the Nexus document that can be updated
 * with modifications. It is the primary place where entities are "stored".
 */
export type NexusDocumentState = {
  /** Holds all entities currently in the document. */
  readonly entities: ReadonlyMap<string, NexusEntityUnion>

  /** Holds all references in the document. `references[loc]` contains all locations
   * pointing to `loc`.
   */
  readonly references: ReadonlyMap<NexusLocation, NexusLocation[]>

  /** Apply a modification to the document state. */
  applyModification(modification: Modification): void

  /** Calculate statistics for debugging purposes. */
  getStats(): {
    entities: number
    references: number
  }

  /** for unit testing, let's us make an id resolve to a specific entity type when constructing location */
  _addEntityTypeForId(id: string, entityType: EntityTypeKey): void
}

export const nexusDocumentState = (props?: {
  entities?: Map<string, NexusEntity>
  references?: Map<NexusLocation, NexusLocation[]>
  callbacks?: Partial<ModificationCallbacks>
}): NexusDocumentState => {
  // Potential for optimization: Both create & remove iterate every field of an entity in order
  // to find all pointer fields of an entity. This could be fairly slow for large & many entities,
  // removal of a few rasselbock entities with patterns could cause iteration of thousands of fields.
  // Since we already know which fields can have pointers at compile time, we could statically generate
  // accessors for these fields and thus only check the few pointers fields.
  const entities = props?.entities ?? new Map()
  const references = props?.references ?? new HashMap()
  const callbacks: ModificationCallbacks = {
    onCreate: () => {},
    onDelete: () => {},
    onStartPointingTo: () => {},
    onStopPointingTo: () => {},
    onUpdate: () => {},
    ...(props?.callbacks ?? {}),
  }

  // for tests, this allows resolving types of entities that don't exist
  const debugEntityTypeMap = new Map<string, EntityTypeKey>()
  const getEntityType = (id: string) =>
    entities.get(id)?.entityType ?? debugEntityTypeMap.get(id)

  // apply a create modification
  const create = (create: Create) => {
    const entity = createEntity(
      getEntityType,
      mustUnpackEntity(
        create.entity ?? throw_("received empty create modification"),
      ),
    )

    entities.set(entity.id, entity)

    visitPointers(entity, (from, to) => {
      addSourceTarget(references, from, to)
      callbacks.onStartPointingTo(from, to)
    })

    callbacks.onCreate(entity)
  }

  // apply a delete modification
  const delete_ = (delete_: Delete) => {
    const id = delete_.entityId
    const entity = entities.get(id) ?? throw_("can't find deleted entity")
    entities.delete(id)

    // note: might be less efficient than needed, but it's simpler, leaving for now
    visitPointers(entity, (from, to) => {
      removeSourceTarget(references, from, to)
      callbacks.onStopPointingTo(from, to)
    })

    callbacks.onDelete(entity)
  }

  // apply an update modification
  const update = (update: Update) => {
    const pointer = update.field ?? throw_("received update without pointer")
    const location = NexusLocation.fromPointerMessage(getEntityType, pointer)

    const entity =
      entities.get(location.entityId) ?? throw_("can't find updated entity")

    const value = extractPbUpdateValue(update.value, getEntityType)

    applyUpdate(entity, location, value, {
      onStopPointingTo: (source, target) => {
        removeSourceTarget(references, source, target) || throw_()
        callbacks.onStopPointingTo(source, target)
      },
      onStartPointingTo: (source, target) => {
        addSourceTarget(references, source, target)
        callbacks.onStartPointingTo(source, target)
      },
    })

    callbacks.onUpdate(location, value)
  }

  return {
    entities,
    references,

    applyModification(modification: Modification) {
      const mod = modification.modification
      switch (mod.case) {
        case "create": {
          create(mod.value)
          break
        }

        case "delete": {
          delete_(mod.value)
          break
        }

        case "update": {
          update(mod.value)
          break
        }
      }
    },

    getStats() {
      return {
        entities: entities.size,
        references: references
          .values()
          .reduce((sum, refs) => sum + refs.length, 0),
      }
    },

    _addEntityTypeForId(id: string, entityType: EntityTypeKey) {
      debugEntityTypeMap.set(id, entityType)
    },
  }
}
