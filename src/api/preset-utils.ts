import { Any } from "@bufbuild/protobuf"
import { anyEntityToTypeKey, EntityTypeKey } from "@document/entity-utils"
import { DevicePresetEntityType } from "@document/transaction-builder/prepare-preset"
import * as docpreset from "@gen/document/v1/preset/v1/preset_pb"
import { Preset } from "@gen/preset/v1/preset_pb"
import { PresetService } from "@gen/preset/v1/preset_service_connect"
import { createRetryingPromiseClient } from "@utils/grpc/retrying-client"
import type { KeepaliveTransport } from "../transport/types"
import { extractUuid } from "../utils/extract-uuid"
import {
  gmDrumPresetIdByProgram,
  gmDrums,
  gmInstrumentPresetIdByProgram,
  gmInstruments,
} from "./presets/generated"
import {
  gmDrumProgramBySlug,
  gmInstrumentProgramBySlug,
  type GmDrum,
  type GmDrumProgram,
  type GmDrumSlug,
  type GmInstrument,
  type GmInstrumentProgram,
  type GmInstrumentSlug,
} from "./presets/gm-slugs"

/**
 * A wrapper for the presets API that's more convenient to use than the raw
 * presets API.
 *
 * @example Apply a preset by id
 *
 * To get a preset id, right-click the preset in the preset browser in the
 * DAW and select "Copy Preset ID":
 * ```ts
 * const gakkiPreset = await client.presets.get("presets/e7cbee0e-1499-4356-a3e5-f788e58ef910")
 * await nexus.modify((t) => {
 *   t.createDeviceFromPreset(gakkiPreset)
 * })
 * ```
 *
 * @example Look up a GM instrument or drum kit by slug or program number
 *
 * ```ts
 * const frenchHorn = await client.presets.getInstrument("french-horn")
 * const jazzKit    = await client.presets.getDrums(32)
 * ```
 *
 * @example Build a preset picker UI
 *
 * {@link gmInstruments} and {@link gmDrums} expose the full GM catalog
 * synchronously, so pickers can render without a network round-trip:
 * ```ts
 * for (const instrument of client.presets.gmInstruments) {
 *   renderRow(instrument.displayName, instrument.category, instrument.tags)
 * }
 * // when the user picks one:
 * const preset = await client.presets.getInstrument(pickedInstrument)
 * ```
 *
 * See [API](../docs/api.md) for more information.
 */
export type PresetUtil = {
  /**
   * Search presets by device type, optionally filtering by a free-text query.
   * @param deviceType The entity type of the device for which to search presets
   * @param textSearch Optional text to filter presets by name or description
   * @returns Promise resolving to an array of matching presets
   */
  search: <T extends DevicePresetEntityType>(
    deviceType: T,
    textSearch?: string,
  ) => Promise<NexusPreset<T>[]>

  /**
   * Retrieves a specific preset by its name or id. Pass in a uuid or `presets/{uuid}`.
   * @param nameOrId The identifier of the preset, either an uuid or `presets/{uuid}`
   * @returns Promise resolving to the requested preset
   */
  get: (nameOrId: string) => Promise<NexusPreset>

  /**
   * Look up one of the 128 General MIDI melodic instrument presets on the
   * gakki sampler. The GM program number is 0-indexed per the MIDI 1.0 spec
   * (hardware commonly displays these as 1-128). Slugs mirror the DAW's
   * preset display names.
   *
   * Accepts a slug, a program number, or one of the {@link GmInstrument}
   * catalog entries exposed via {@link PresetUtil.gmInstruments} -- the
   * latter is handy when building a preset picker from the metadata array.
   *
   * @example
   * ```ts
   * const frenchHorn = await client.presets.getInstrument("french-horn")
   * const sameThing = await client.presets.getInstrument(60)
   * const fromMeta = await client.presets.getInstrument(
   *   client.presets.gmInstruments[60],
   * )
   * ```
   */
  getInstrument: (
    instrument: GmInstrumentSlug | GmInstrumentProgram | GmInstrument,
  ) => Promise<NexusPreset<"gakki">>

  /**
   * Look up one of the 8 General MIDI drum kits on the gakki sampler.
   *
   * GM reserves channel 10 for percussion. Unlike melodic instruments, drum
   * kits are identified by a sparse program number: 0, 8, 16, 24, 25, 32,
   * 40, 48 (Standard, Room, Power, Electronic, Analog, Jazz, Brush,
   * Orchestra respectively). Other numbers don't exist on the gakki sampler.
   *
   * Accepts a slug, a program number, or one of the {@link GmDrum} catalog
   * entries exposed via {@link PresetUtil.gmDrums}.
   *
   * @example
   * ```ts
   * const jazzKit = await client.presets.getDrums("jazz-kit")
   * const sameKit = await client.presets.getDrums(32)
   * ```
   */
  getDrums: (
    drum: GmDrumSlug | GmDrumProgram | GmDrum,
  ) => Promise<NexusPreset<"gakki">>

  /**
   * Static catalog of all 128 General MIDI melodic presets (display name,
   * category, tags, description, preset id) sorted by GM program number.
   * Available synchronously without a network round-trip -- intended for
   * populating preset pickers and search UIs.
   */
  gmInstruments: readonly GmInstrument[]

  /**
   * Static catalog of all 8 General MIDI drum kits, sorted by GM program
   * number. Available synchronously without a network round-trip.
   */
  gmDrums: readonly GmDrum[]
}

export const createPresetUtil = (transport: KeepaliveTransport) => {
  const client = createRetryingPromiseClient(PresetService, transport)

  const get = async (nameOrId: string): Promise<NexusPreset> => {
    const response = await client.getPreset({
      name: `presets/${extractUuid(nameOrId)}`,
    })
    if (response instanceof Error) {
      throw response
    }
    if (response.preset === undefined) {
      throw new Error(`No preset found for UUID "${extractUuid(nameOrId)}"`)
    }
    return fetchPresetData(response.preset)
  }

  return {
    search: async <T extends DevicePresetEntityType>(
      deviceType: T,
      textSearch?: string,
    ) => {
      const filter = `preset.device_type == '${presetDeviceTypeToDeviceKey[deviceType]}'`
      if (textSearch !== undefined && textSearch.length > 1) {
        // split search terms
        const searchString = textSearch.replace(/['"]/g, "").toLowerCase()
        const tokens = searchString.split(" ")
        textSearch = `${tokens.filter((t) => t.length > 1).join(" & ")}`
      }
      const response = await client.listPresets({
        filter,
        textSearch,
      })
      if (response instanceof Error) {
        throw response
      }
      return await Promise.all(
        response.presets.map(
          (p) => fetchPresetData(p) as Promise<NexusPreset<T>>,
        ),
      )
    },

    get,

    getInstrument: async (
      instrument: GmInstrumentSlug | GmInstrumentProgram | GmInstrument,
    ) => {
      const program =
        typeof instrument === "number"
          ? instrument
          : typeof instrument === "string"
            ? gmInstrumentProgramBySlug[instrument]
            : instrument.program
      const id = gmInstrumentPresetIdByProgram[program]
      if (id === undefined) {
        throw new Error(
          `No GM instrument preset for program ${String(instrument)}. Expected 0..127, a GmInstrumentSlug, or a GmInstrument.`,
        )
      }
      return (await get(id)) as NexusPreset<"gakki">
    },

    getDrums: async (drum: GmDrumSlug | GmDrumProgram | GmDrum) => {
      const program =
        typeof drum === "number"
          ? drum
          : typeof drum === "string"
            ? gmDrumProgramBySlug[drum]
            : drum.program
      const id = gmDrumPresetIdByProgram[program]
      if (id === undefined) {
        throw new Error(
          `No GM drum kit preset for program ${String(drum)}. Expected 0, 8, 16, 24, 25, 32, 40, 48, a GmDrumSlug, or a GmDrum.`,
        )
      }
      return (await get(id)) as NexusPreset<"gakki">
    },

    gmInstruments,
    gmDrums,
  } satisfies PresetUtil
}

export const presetDeviceTypeToDeviceKey: {
  [K in DevicePresetEntityType]: string
} = {
  autoFilter: "PRESET_DEVICE_TYPE_AUTO_FILTER",
  bandSplitter: "PRESET_DEVICE_TYPE_BAND_SPLITTER",
  bassline: "PRESET_DEVICE_TYPE_BASSLINE",
  beatbox8: "PRESET_DEVICE_TYPE_BEATBOX8",
  beatbox9: "PRESET_DEVICE_TYPE_BEATBOX9",
  crossfader: "PRESET_DEVICE_TYPE_CROSSFADER",
  curve: "PRESET_DEVICE_TYPE_CURVE",
  exciter: "PRESET_DEVICE_TYPE_EXCITER",
  graphicalEQ: "PRESET_DEVICE_TYPE_GRAPHICAL_EQ",
  gravity: "PRESET_DEVICE_TYPE_GRAVITY",
  heisenberg: "PRESET_DEVICE_TYPE_HEISENBERG",
  helmholtz: "PRESET_DEVICE_TYPE_HELMHOLTZ",
  machiniste: "PRESET_DEVICE_TYPE_MACHINISTE",
  matrixArpeggiator: "PRESET_DEVICE_TYPE_MATRIX",
  gakki: "PRESET_DEVICE_TYPE_GAKKI",
  noteSplitter: "PRESET_DEVICE_TYPE_NOTE_SPLITTER",
  panorama: "PRESET_DEVICE_TYPE_PANORAMA",
  pulsar: "PRESET_DEVICE_TYPE_PULSAR",
  pulverisateur: "PRESET_DEVICE_TYPE_PULVERISATEUR",
  quantum: "PRESET_DEVICE_TYPE_QUANTUM",
  quasar: "PRESET_DEVICE_TYPE_QUASAR",
  rasselbock: "PRESET_DEVICE_TYPE_RASSELBOCK",
  space: "PRESET_DEVICE_TYPE_SPACE",
  stereoEnhancer: "PRESET_DEVICE_TYPE_STEREO_ENHANCER",
  stompboxChorus: "PRESET_DEVICE_TYPE_STOMPBOX_CHORUS",
  stompboxCompressor: "PRESET_DEVICE_TYPE_STOMPBOX_COMPRESSOR",
  stompboxCrusher: "PRESET_DEVICE_TYPE_STOMPBOX_CRUSHER",
  stompboxDelay: "PRESET_DEVICE_TYPE_STOMPBOX_DELAY",
  stompboxFlanger: "PRESET_DEVICE_TYPE_STOMPBOX_FLANGER",
  stompboxGate: "PRESET_DEVICE_TYPE_STOMPBOX_GATE",
  stompboxParametricEqualizer:
    "PRESET_DEVICE_TYPE_STOMPBOX_PARAMETRIC_EQUALIZER",
  stompboxPhaser: "PRESET_DEVICE_TYPE_STOMPBOX_PHASER",
  stompboxPitchDelay: "PRESET_DEVICE_TYPE_STOMPBOX_PITCH_DELAY",
  stompboxReverb: "PRESET_DEVICE_TYPE_STOMPBOX_REVERB",
  stompboxSlope: "PRESET_DEVICE_TYPE_STOMPBOX_SLOPE",
  stompboxStereoDetune: "PRESET_DEVICE_TYPE_STOMPBOX_STEREO_DETUNE",
  stompboxTube: "PRESET_DEVICE_TYPE_STOMPBOX_TUBE",
  tonematrix: "PRESET_DEVICE_TYPE_TONEMATRIX",
  waveshaper: "PRESET_DEVICE_TYPE_WAVESHAPER",
} as const satisfies Partial<Record<EntityTypeKey, string>>

export type NexusPreset<
  T extends DevicePresetEntityType = DevicePresetEntityType,
> = {
  meta: Preset
  data: docpreset.Preset
  entityType: T
  /**
   * @internal
   * The backend preset identifier (format: `presets/<uuid>`). Stamped onto the
   * device's `presetName` field when the preset is applied. Consumers of the SDK
   * should not need to read or set this directly; it is populated when the preset
   * is fetched and consumed internally by {@link TransactionBuilder.applyPresetTo}.
   */
  _presetName: string
}

const fetchPresetData = async (prismaPreset: Preset): Promise<NexusPreset> => {
  const meta = prismaPreset
  const binary = await fetch(prismaPreset.dataUrl, {
    credentials: "omit",
  }).then((res) => res.arrayBuffer())
  const data = new docpreset.Preset()
  const ok = Any.fromBinary(new Uint8Array(binary)).unpackTo(data)
  if (!ok) {
    throw new Error("Failed to unpack preset data")
  }
  if (data.target === undefined) {
    throw new Error("Preset data does not contain a target")
  }
  const entityType = anyEntityToTypeKey(data.target) as DevicePresetEntityType
  if (entityType === undefined) {
    throw new Error("Preset data does not contain an entity")
  }

  return {
    meta,
    data,
    entityType,
    _presetName: prismaPreset.name,
  }
}
