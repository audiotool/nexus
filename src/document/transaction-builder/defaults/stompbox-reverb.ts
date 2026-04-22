import type { StompboxReverbConstructor } from "@gen/document/v1/entity/stompbox_reverb/v1/stompbox_reverb_nexus"
import type { Defaults } from "./default-type"
import { defaultDisplayParams } from "./shared"

export const stompboxReverbDefaults: Defaults<StompboxReverbConstructor> = {
  ...defaultDisplayParams,
  displayName: "Reverb",
  roomSizeFactor: 0.8,
  preDelayTimeMs: 160,
  feedbackFactor: 0.6669999957084656,
  dampFactor: 0.1,
  mix: 0.2,
  isActive: true,
  presetName: "",
}
