import type { StompboxPitchDelayConstructor } from "@gen/document/v1/entity/stompbox_pitch_delay/v1/stompbox_pitch_delay_nexus"
import type { Defaults } from "./default-type"
import { defaultDisplayParams } from "./shared"

export const stompboxPitchDelayDefaults: Defaults<StompboxPitchDelayConstructor> =
  {
    ...defaultDisplayParams,
    displayName: "Pitch Delay",
    stepCount: 3,
    stepLengthIndex: 1,
    feedbackFactor: 0.6660000085830688,
    tuneFactor: 0.20000000298023224,
    mix: 0.699999988079071,
    isActive: true,
    presetName: "",
  }
