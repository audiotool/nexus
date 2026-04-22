import type { AudioSplitterConstructor } from "@gen/document/v1/entity/audio_splitter/v1/audio_splitter_nexus"
import type { Defaults } from "./default-type"
import { defaultDisplayParams } from "./shared"

export const audioSplitterDefaults: Defaults<AudioSplitterConstructor> = {
  ...defaultDisplayParams,
  displayName: "Audio Splitter",
  blendModeIndex: 1,
  splitCoords: {
    x: 0.6666666865348816,
    y: 0,
  },
}
