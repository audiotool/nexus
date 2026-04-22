import type { NoteSplitterConstructor } from "@gen/document/v1/entity/note_splitter/v1/note_splitter_nexus"
import type { Defaults } from "./default-type"
import { defaultDisplayParams } from "./shared"

export const noteSplitterDefaults: Defaults<NoteSplitterConstructor> = {
  ...defaultDisplayParams,
  displayName: "Note Splitter",
  channels: [
    {
      velocityModulation: 0,
      isMuted: false,
    },
    {
      velocityModulation: 0,
      isMuted: false,
    },
    {
      velocityModulation: 0,
      isMuted: false,
    },
  ],
  presetName: "",
}
