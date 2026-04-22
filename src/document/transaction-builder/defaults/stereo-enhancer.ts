import type { StereoEnhancerConstructor } from "@gen/document/v1/entity/stereo_enhancer/v1/stereo_enhancer_nexus"
import type { Defaults } from "./default-type"
import { defaultDisplayParams } from "./shared"

export const stereoEnhancerDefaults: Defaults<StereoEnhancerConstructor> = {
  ...defaultDisplayParams,
  displayName: "Stereo Enhancer",
  isActive: true,
  channelsAreInverted: false,
  frequencyHz: 11000,
  stereoWidth: 0.25,
  presetName: "",
}
