import {
  anyEntityToTypeKey,
  packEntity,
  unpackEntity,
  type EntityMessage,
  type EntityTypeKey,
} from "@document/entity-utils"
import type { Preset } from "@gen/document/v1/preset/v1/preset_pb"
import { throw_ } from "@utils/lang"
import toposort from "toposort"
import { visitPointers } from "./update-preset-pointers"

/** Contains all infos needed to apply a preset. */
export type PreparedPreset = {
  /** Contains the preset entities, with `relatives` sorted in topo order */
  preset: Preset

  /** Entities which, if they have a pointer to the main entity, should be removed. E.g. rasselbockPattern. */
  entitiesToRemovePointingToMain: EntityTypeKey[]
}

/**
 * Turns a {@link Preset} into a {@link PreparedPreset}. Means, extract the entities
 * we need to remove that point to main, and toposorting the relatives.
 */
export const preparePreset = (preset: Preset): PreparedPreset => {
  preset.relatives = toposortEntities(
    preset.relatives.map((e) => unpackEntity(e) ?? throw_()),
  ).map((e) => packEntity(e))

  const key = anyEntityToTypeKey(preset.target) ?? throw_("invalid preset")
  return {
    preset,
    entitiesToRemovePointingToMain:
      PRESET_TARGET_RELATIVE_TYPES[
        key as keyof typeof PRESET_TARGET_RELATIVE_TYPES
      ] ?? throw_("preset with unexpected main entity type"),
  }
}

export const toposortEntities = (
  entities: EntityMessage[],
): EntityMessage[] => {
  const entityMap = new Map(entities.map((entity) => [entity.id, entity]))

  const links: [string, string][] = []
  entities.forEach((entity) => {
    visitPointers(entity, (pointer) => {
      if (entityMap.has(pointer.entityId)) {
        links.push([entity.id, pointer.entityId])
      }
    })
  })

  const toposorted = toposort(links)
    .reverse()
    .map((id) => entityMap.get(id) ?? throw_())
  const unsorted = entities.filter((entity) => !toposorted.includes(entity))

  return [...toposorted, ...unsorted]
}

/** Maps every entity type in the document to a value indicating whether
 * the entity has a preset, and if so, which "relatives" the preset has:
 * * if mapping to undefiend: no presets for this entity
 * * if mapping to a list of entity types: the entity has presets, and the list are relatives
 *
 * reference: https://docs.google.com/spreadsheets/d/12wrDGgGQSAKhbdFVIiCcKt7wMMpVYlZl8Hqo343uDZA
 */
export const PRESET_TARGET_RELATIVE_TYPES = {
  // synthesizers
  bassline: ["basslinePattern", "groove"],
  pulverisateur: ["microTuningOctave"],
  heisenberg: ["microTuningOctave"],
  tonematrix: ["tonematrixPattern", "groove", "microTuningOctave"],
  space: ["microTuningOctave"],

  // drum machines
  machiniste: ["machinistePattern", "sample", "groove"],
  beatbox8: ["beatbox8Pattern", "groove"],
  beatbox9: ["beatbox9Pattern", "groove"],

  // pedals
  stompboxChorus: [],
  stompboxCompressor: [],
  stompboxCrusher: [],
  stompboxDelay: [],
  stompboxFlanger: [],
  stompboxGate: [],
  stompboxParametricEqualizer: [],
  stompboxPhaser: [],
  stompboxPitchDelay: [],
  stompboxReverb: [],
  stompboxSlope: [],
  stompboxStereoDetune: [],
  stompboxTube: [],

  // other effects
  quasar: [],
  rasselbock: ["rasselbockPattern"],
  pulsar: [],
  quantum: [],
  curve: [],
  graphicalEQ: [],
  gravity: [],
  autoFilter: [],
  waveshaper: ["waveshaperAnchor"],
  helmholtz: [],
  stereoEnhancer: [],
  exciter: [],
  ringModulator: undefined,
  panorama: [],
  tinyGain: undefined,

  // mixer
  minimixer: undefined,
  kobolt: undefined,
  centroid: undefined,
  crossfader: [],
  bandSplitter: [],
  audioSplitter: undefined,
  audioMerger: undefined,
  matrixArpeggiator: ["matrixArpeggiatorPattern", "groove"],
  noteSplitter: [],

  // no presets
  audioDevice: undefined,
  spitfireLabsVst3Plugin: undefined,
  mixerMaster: undefined,

  // no presets
  beatbox8Pattern: undefined,
  beatbox9Pattern: undefined,
  waveshaperAnchor: undefined,
  basslinePattern: undefined,
  tonematrixPattern: undefined,
  machinistePattern: undefined,
  rasselbockPattern: undefined,
  matrixArpeggiatorPattern: undefined,
  config: undefined,
  desktopAudioCable: undefined,
  desktopNoteCable: undefined,
  groove: undefined,
  microTuningOctave: undefined,
  sample: undefined,
  audioRegion: undefined,
  automationEvent: undefined,
  automationCollection: undefined,
  automationRegion: undefined,
  automationTrack: undefined,
  note: undefined,
  noteCollection: undefined,
  noteRegion: undefined,
  noteTrack: undefined,
  patternRegion: undefined,
  patternTrack: undefined,
  tempoAutomationTrack: undefined,
  mixerAux: undefined,
  mixerChannel: undefined,
  mixerAuxRoute: undefined,
  mixerDelayAux: undefined,
  mixerGroup: undefined,
  mixerReverbAux: undefined,
  mixerStripGrouping: undefined,
  mixerSideChainCable: undefined,
  audioTrack: undefined,
  centroidChannel: undefined,
  gakki: [],
} as const satisfies Record<EntityTypeKey, EntityTypeKey[] | undefined>

type AllDeviceEntities = typeof PRESET_TARGET_RELATIVE_TYPES
export type DevicePresetEntityType = {
  [K in keyof AllDeviceEntities]: AllDeviceEntities[K] extends undefined
    ? never
    : K
}[keyof AllDeviceEntities]
