/**
 * @packageDocumentation
 * Contains types related to the Audiotool API.
 */

export {
  type NexusPreset,
  /** @deprecated Use `PresetsAPI` instead */
  type Presets,
  type PresetsAPI,
  /** @deprecated Use `PresetsAPI` instead */
  type PresetUtil,
} from "./preset-api"
export {
  type GmDrum,
  type GmDrumProgram,
  type GmDrumSlug,
  type GmInstrument,
  type GmInstrumentProgram,
  type GmInstrumentSlug,
} from "./presets"
export {
  type SampleFormat,
  type SampleKind,
  type SampleListOptions,
  type SampleListResult,
  type SampleMeta,
  type SamplePending,
  type SamplesAPI,
  type SampleUpload,
  type SampleUploadOptions,
  type SampleVisibility,
  type WaveformChannel,
  type WaveformResolution,
  type WaveformUrlOptions,
} from "./sample-api"
