import type { StompboxReverbConstructor } from "@gen/document/v1/entity/stompbox_reverb/v1/stompbox_reverb_nexus"
import type { Defaults } from "./default-type"
import { defaultDisplayParams } from "./shared"

export const stompboxReverbDefaults: Defaults<StompboxReverbConstructor> = {
  ...defaultDisplayParams,
  displayName: "Reverb",
  roomSizeFactor: 0.42782172560691833,
  preDelayTimeMs: 160,
  feedbackFactor: 0.5816629528999329,
  dampFactor: 0.10000000149011612,
  mix: 0.08155758678913116,
  isActive: true,
  presetName: "",
}
