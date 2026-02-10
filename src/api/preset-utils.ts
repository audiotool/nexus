import { Any } from "@bufbuild/protobuf"
import { anyEntityToTypeKey, EntityTypeKey } from "@document/entity-utils"
import { DevicePresetEntityType } from "@document/transaction-builder/prepare-preset"
import * as docpreset from "@gen/document/v1/preset/v1/preset_pb"
import { Preset } from "@gen/preset/v1/preset_pb"
import { PresetService } from "@gen/preset/v1/preset_service_connect"
import type { KeepaliveTransport } from "@utils/grpc/keepalive-transport"
import { createRetryingPromiseClient } from "@utils/grpc/retrying-client"
import { extractUuid } from "../utils/extract-uuid"

/**
 * A wrapper for the presets API that's more convenient to use than the raw presets API.
 *
 * @example
 *
 * To get a preset id, you can right click the preset in the preset browser
 * in the DAW and select "Copy Preset ID". Apply the preset as follows:
 * ```ts
 * // assuming we copied a gakki preset id
 * const gakkiPreset = await client.api.presets.get("presets/e7cbee0e-1499-4356-a3e5-f788e58ef910")
 * await nexus.modify(t => {
 *   const gakki = t.create("gakki", {})
 *   t.applyPresetTo(gakki, gakkiPreset)
 * })
 * ```
 *
 * See [API](../docs/api.md) for more information.
 */
export type PresetUtil = {
  /**
   * Lists presets with optional filtering by device type and text search
   * @param deviceType The entity type of the device for which to list presets
   * @param textSearch Optional text to filter presets by name or description
   * @returns Promise resolving to an array of matching presets
   */
  list: <T extends DevicePresetEntityType>(
    deviceType: T,
    textSearch?: string,
  ) => Promise<NexusPreset<T>[]>

  /**
   * Retrieves a specific preset by its name or id. Pass in a uuid or `presets/{uuid}`.
   * @param nameOrId The identifier of the preset, either an uuid or `presets/{uuid}`
   * @returns Promise resolving to the requested preset
   */
  get: (nameOrId: string) => Promise<NexusPreset>
}

export const createPresetUtil = (transport: KeepaliveTransport) => {
  const client = createRetryingPromiseClient(PresetService, transport)

  return {
    list: async <T extends DevicePresetEntityType>(
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

    get: async (nameOrId: string) => {
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
    },
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
  }
}
