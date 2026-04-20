import { packEntity, unpackEntity } from "@document/entity-utils"
import { Preset } from "@gen/document/v1/preset/v1/preset_pb"
import { throw_ } from "@utils/lang"
import { visitPointers } from "./entity-message-utils"

/** This function prepares the pointers of a new preset. It does two things:
 * * the target entity id of the preset gets replaced with an existing  entity id
 *   of an existing device - we'll update that existing entity
 * * all other entity ids get replaced with fresh uuids, as the preset doesn't have valid
 *   entity ids yet
 *
 *
 * This function assumes that all pointers in the preset are from & to entities in the preset,
 * otherwise this function throws.
 */
export const updatePresetPointers = (
  preset: Preset,
  newMainId: string,
): Preset => {
  const uuidMap = new Map<string, string>()
  const target = unpackEntity(preset.target) ?? throw_()
  // main entity id gets replaced with existing main entity id
  uuidMap.set(target.id, newMainId)

  // empty pointers remain empty
  uuidMap.set("", "")
  const relatives = preset.relatives.map((e) => unpackEntity(e) ?? throw_())

  // map uuids of all secondary entities
  relatives.forEach((entity) => {
    if (uuidMap.has(entity.id)) {
      throw new Error("duplicate entity id")
    }

    uuidMap.set(entity.id, crypto.randomUUID())
  })

  // update all pointers in the preset
  ;[target, ...relatives].forEach((entity) => {
    entity ??= throw_("can't happen")

    entity.id = uuidMap.get(entity.id) ?? throw_()

    // update any pointers in the entity
    visitPointers(entity, (pointer) => {
      if (!uuidMap.has(pointer.entityId)) {
        console.error("entity", entity.constructor.name, "pointer", pointer)
      }
      pointer.entityId =
        uuidMap.get(pointer.entityId) ??
        throw_("preset contains pointer to unknown entity")
    })
  })
  return new Preset({
    relatives: relatives.map((e) => packEntity(e)),
    target: packEntity(target),
  })
}
