import type { StompboxGateConstructor } from "@gen/document/v1/entity/stompbox_gate/v1/stompbox_gate_nexus"
import type { Defaults } from "./default-type"
import { defaultDisplayParams } from "./shared"

export const stompboxGateDefaults: Defaults<StompboxGateConstructor> = {
  ...defaultDisplayParams,
  displayName: "Gate",
  attackMs: 10,
  releaseMs: 50,
  postGain: 1,
  isInverted: false,
  holdMs: 100,
  thresholdGain: 0.10000000149011612,
  isActive: true,
  presetName: "",
}
