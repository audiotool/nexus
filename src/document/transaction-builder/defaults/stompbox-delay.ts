import type { StompboxDelayConstructor } from "@gen/document/v1/entity/stompbox_delay/v1/stompbox_delay_nexus"
import type { Defaults } from "./default-type"
import { defaultDisplayParams } from "./shared"

export const stompboxDelayDefaults: Defaults<StompboxDelayConstructor> = {
  ...defaultDisplayParams,
  displayName: "Delay",
  stepCount: 3,
  stepLengthIndex: 1,
  feedbackFactor: Math.fround(0.4),
  mix: Math.fround(0.2),
  isActive: true,
  presetName: "",
}
