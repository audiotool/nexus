import type { StompboxFlangerConstructor } from "@gen/document/v1/entity/stompbox_flanger/v1/stompbox_flanger_nexus"
import type { Defaults } from "./default-type"
import { defaultDisplayParams } from "./shared"

export const stompboxFlangerDefaults: Defaults<StompboxFlangerConstructor> = {
  ...defaultDisplayParams,
  displayName: "Flanger",
  delayTimeMs: 3,
  feedbackFactor: 1,
  lfoFrequencyHz: 0.03999999910593033,
  lfoModulationDepth: 1,
  isActive: true,
  presetName: "",
}
