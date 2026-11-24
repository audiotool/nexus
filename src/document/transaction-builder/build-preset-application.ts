import { unpackEntity, type EntityTypeKey } from "@document/entity-utils"
import type { Modification } from "@gen/document/v1/document_service_pb"
import { throw_ } from "@utils/lang"
import {
  buildModificationForRemove,
  buildModificationForRemoveWithDependencies,
} from "."
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
    ...buildPresetApplicationRemovals(
      entities,
      mainEntity,
      presetInfo.entitiesToRemovePointingToMain,
    ),

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

/** Entities a preset application deletes, in deletion order. */
const buildPresetApplicationRemovals = (
  entities: EntityQuery,
  mainEntity: NexusEntity,
  relativeTypes: EntityTypeKey[],
): Modification[] => {
  const relativesToRemove = entities
    .ofTypes(...relativeTypes)
    .pointingTo.entities(mainEntity.id)
    .get()

  return [
    ...relativesToRemove.flatMap((entity) =>
      buildModificationForRemoveWithDependencies(entity.id, entities),
    ),
    ...collectLeftoverRemovals(entities, mainEntity, relativesToRemove),
  ]
}

const collectLeftoverRemovals = (
  entities: EntityQuery,
  mainEntity: NexusEntity,
  relativesToRemove: NexusEntity[],
): Modification[] => {
  if (mainEntity.entityType !== "tinySampler") {
    return []
  }

  // removing the key samples of a tiny sampler also removes their layers and
  // the automation of those layers, but leaves behind the samples of the
  // layers and the event collections of the automation regions, unless
  // something else uses them
  const layers = entities
    .ofTypes("tinySamplerSampleLayer")
    .pointingTo.entities(...relativesToRemove.map((relative) => relative.id))
    .get()
  const automationRegions = entities
    .ofTypes("automationRegion")
    .pointingTo.entities(
      ...entities
        .ofTypes("automationTrack")
        .pointingTo.entities(...layers.map((layer) => layer.id))
        .get()
        .map((track) => track.id),
    )
    .get()
  const removedEntityIds = new Set(
    [...layers, ...automationRegions].map((entity) => entity.id),
  )

  const unusedSampleIds = new Set(
    layers
      .map((layer) => layer.fields.sample.value.entityId)
      .filter(
        (sampleId) =>
          sampleId !== "" &&
          entities.pointingTo
            .entities(sampleId)
            .get()
            .every((user) => removedEntityIds.has(user.id)),
      ),
  )
  // events are removed along with their collection, so they don't count as users
  const unusedCollectionIds = new Set(
    automationRegions
      .map((region) => region.fields.collection.value.entityId)
      .filter((collectionId) =>
        entities
          .ofTypes("audioRegion", "automationRegion")
          .pointingTo.entities(collectionId)
          .get()
          .every((user) => removedEntityIds.has(user.id)),
      ),
  )

  return [
    ...entities
      .ofTypes("automationEvent")
      .pointingTo.entities(...unusedCollectionIds)
      .get()
      .map((event) => buildModificationForRemove(event.id)),
    ...[...unusedCollectionIds, ...unusedSampleIds].map((id) =>
      buildModificationForRemove(id),
    ),
  ]
}
