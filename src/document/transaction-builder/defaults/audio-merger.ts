import type { AudioMergerConstructor } from "@gen/document/v1/entity/audio_merger/v1/audio_merger_nexus"
import type { Defaults } from "./default-type"
import { defaultDisplayParams } from "./shared"

export const audioMergerDefaults: Defaults<AudioMergerConstructor> = {
  ...defaultDisplayParams,
  displayName: "Merger",
  blendModeIndex: 1,
  mergeCoords: {
    x: 0.3333333432674408,
    y: 0,
  },
}
