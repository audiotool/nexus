import { packEntity, type EntityMessage } from "@document/entity-utils"
import { Preset } from "@gen/document/v1/preset/v1/preset_pb"
import { throw_ } from "@utils/lang"
import type { NexusEntity } from "../entity"
import type { EntityQuery } from "../query/entity"
import { deduplicateEntitiesById, visitPointers } from "./entity-message-utils"
import { entityToPbMessage } from "./entity-to-pb"
import {
  PRESET_TARGET_RELATIVE_TYPES,
  type DevicePresetEntityType,
} from "./prepare-preset"

export const createDevicePreset = (
  entity: NexusEntity<DevicePresetEntityType>,
  entities: EntityQuery,
): Preset => {
  // selects all entities of types that could be relatives
  const relativesQuery = entities.ofTypes(
    ...(PRESET_TARGET_RELATIVE_TYPES[entity.entityType] ?? throw_()),
  )

  // entities owned by the device, e.g. patterns, key samples and their layers
  const owned = collectTransitively([entity], (current) =>
    relativesQuery.pointingTo.entities(current.id).get(),
  )

  // entities the device and its owned entities depend on, e.g. grooves and
  // samples; these can be shared, so their other users are never followed
  const dependencies = collectTransitively([entity, ...owned], (current) =>
    relativesQuery.pointedToBy.entities(current.id).get(),
  )

  const target = entityToPbMessage(entity, false)
  const relatives = deduplicateEntitiesById([...owned, ...dependencies]).map(
    (relative) => entityToPbMessage(relative, false),
  )

  // update all entity ids
  updateUuids([target, ...relatives])

  return new Preset({
    relatives: relatives.map((relative) => packEntity(relative)),
    target: packEntity(target),
  })
}

/**
 * Collects all entities reachable from `start` via `next`, excluding `start`
 * itself.
 */
const collectTransitively = (
  /** The entities to start from. */
  start: NexusEntity[],
  /** A function that returns the entities reachable from the given entity. */
  next: (entity: NexusEntity) => NexusEntity[],
): NexusEntity[] => {
  const collected = new Map<string, NexusEntity>()
  const pending = start.flatMap(next)

  while (pending.length > 0) {
    const current = pending.pop() ?? throw_()
    if (collected.has(current.id)) {
      continue
    }
    collected.set(current.id, current)
    pending.push(...next(current))
  }

  return [...collected.values()]
}

/** Updates all entity ids found, to random UUIDs for each new id found.
 * Leaves empty pointers untouched.
 */
const updateUuids = (entities: EntityMessage[]) => {
  // update all entity ids, to a new random UUID, or emtpy, if the pointer is empty
  const uuidMap = new Map<string, string>()
  uuidMap.set("", "")
  const getUuid = (uuid: string) => {
    uuidMap.set(uuid, uuidMap.get(uuid) ?? crypto.randomUUID())

    return uuidMap.get(uuid) ?? throw_()
  }

  entities.forEach((entity) => {
    const uuid = getUuid(entity.id)
    entity.id = uuid
    visitPointers(entity, (pointer) => {
      pointer.entityId = getUuid(pointer.entityId)
    })
  })
}
