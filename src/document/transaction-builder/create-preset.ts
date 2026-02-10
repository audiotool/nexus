import { packEntity, type EntityMessage } from "@document/entity-utils"
import { Preset } from "@gen/document/v1/preset/v1/preset_pb"
import { throw_ } from "@utils/lang"
import type { NexusEntity } from "../entity"
import type { EntityQuery } from "../query/entity"
import { entityToPbMessage } from "./entity-to-pb"
import {
  PRESET_TARGET_RELATIVE_TYPES,
  type DevicePresetEntityType,
} from "./prepare-preset"
import { visitPointers } from "./update-preset-pointers"

export const createDevicePreset = (
  entity: NexusEntity<DevicePresetEntityType>,
  entities: EntityQuery,
): Preset => {
  // construct target entity message
  const target = entityToPbMessage(entity, false)

  let relatives: EntityMessage[]
  {
    // selects all entities of types that could be relatives
    const relativesQuery = entities.ofTypes(
      ...(PRESET_TARGET_RELATIVE_TYPES[entity.entityType] ?? throw_()),
    )
    relatives = [
      // select entities that point from/tom target entity
      ...relativesQuery.pointingTo.entities(entity.id).get(),
      ...relativesQuery.pointedToBy.entities(entity.id).get(),
    ]
      .map((relative) => [
        // select entities that point from/to any relatives entity
        ...relativesQuery.pointingTo.entities(relative.id).get(),
        ...relativesQuery.pointedToBy.entities(relative.id).get(),
        relative,
      ])
      .flat()
      .map((entity) => entityToPbMessage(entity, false))
  }
  // construct relatives entity messages

  // update all entity ids
  updateUuids([target, ...relatives])

  return new Preset({
    relatives: relatives.map((e) => packEntity(e)),
    target: packEntity(target),
  })
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
