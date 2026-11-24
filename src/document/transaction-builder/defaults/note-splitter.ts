import type {
  NoteSplitterChannelConstructor,
  NoteSplitterConstructor,
} from "@gen/document/v1/entity/note_splitter/v1/note_splitter_nexus"
import type { Defaults } from "./default-type"
import { defaultDisplayParams } from "./shared"

const noteSplitterChannelDefaults: Defaults<NoteSplitterChannelConstructor> = {
  velocityModulation: 0,
  isMuted: false,
  rangeLowerLimitPitch: 0,
  rangeUpperLimitPitch: 0,
  transposeSemitones: 0,
  velocityRangeFadeFactor: 0,
}

export const noteSplitterDefaults: Defaults<NoteSplitterConstructor> = {
  ...defaultDisplayParams,
  displayName: "Note Splitter",
  channels: [
    noteSplitterChannelDefaults,
    noteSplitterChannelDefaults,
    noteSplitterChannelDefaults,
  ],
  presetName: "",
}
