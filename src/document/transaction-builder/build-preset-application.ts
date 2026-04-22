import { unpackEntity } from "@document/entity-utils"
import type { Modification } from "@gen/document/v1/document_service_pb"
import { throw_ } from "@utils/lang"
import { buildModificationForRemove } from "."
import type { NexusEntity } from "../entity"
import type { EntityQuery } from "../query/entity"
import { buildCreateModification } from "./build-modifications"
import { buildPresetUpdateModifications } from "./build-preset-update"
import type { PreparedPreset } from "./prepare-preset"
import { updatePresetPointers } from "./update-preset-pointers"

/** @internal Builds a list of modifications that apply a preset to a main entity.
 *
 * `presetName` is the backend identifier of the applied preset (format
 * `presets/<uuid>`). It is stamped onto `mainEntity.presetName` so the document
 * records which preset is currently loaded. Pass an empty string to clear it.
 */
export const buildModificationsForPresetApplication = (
  entities: EntityQuery,
  presetInfo: PreparedPreset,
  mainEntity: NexusEntity,
  presetName: string,
): Modification[] => {
  // update `target` and `relative` entities in the preset to point to the existing
  // main entity, and hand our fresh uuids for all `secondary` entities
  presetInfo.preset = updatePresetPointers(presetInfo.preset, mainEntity.id)

  return [
    // remove entities pointing to target entity, we'll create new ones in next step
    ...entities
      .ofTypes(...presetInfo.entitiesToRemovePointingToMain)
      .pointingTo.entities(mainEntity.id)
      .get()
      .map((entity) => buildModificationForRemove(entity.id)),

    // build new entities pointing to target
    ...presetInfo.preset.relatives.map((entity) =>
      buildCreateModification(entity),
    ),

    // update existing target entity
    ...buildPresetUpdateModifications(
      mainEntity,
      unpackEntity(presetInfo.preset.target) ?? throw_(),
      presetName,
    ),
  ]
}
