import type { StompboxCrusherConstructor } from "@gen/document/v1/entity/stompbox_crusher/v1/stompbox_crusher_nexus"
import type { Defaults } from "./default-type"
import { defaultDisplayParams } from "./shared"

export const stompboxCrusherDefaults: Defaults<StompboxCrusherConstructor> = {
  ...defaultDisplayParams,
  displayName: "Crusher",
  preGain: 1,
  downsamplingFactor: 0,
  postGain: 1,
  bits: 8,
  mix: 1,
  isActive: true,
  presetName: "",
}
