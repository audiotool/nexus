import type { StompboxCrusherConstructor } from "@gen/document/v1/entity/stompbox_crusher/v1/stompbox_crusher_nexus"
import type { Defaults } from "./default-type"
import { defaultDisplayParams } from "./shared"

export const stompboxCrusherDefaults: Defaults<StompboxCrusherConstructor> = {
  ...defaultDisplayParams,
  displayName: "Crusher",
  preGain: 1.1660150289535522,
  downsamplingFactor: 0.01753758266568184,
  postGain: 2.3091726303100586,
  bits: 22,
  mix: 0.6602628231048584,
  isActive: true,
  presetName: "",
}
