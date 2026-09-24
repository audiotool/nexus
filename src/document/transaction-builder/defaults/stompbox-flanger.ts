import type { StompboxFlangerConstructor } from "@gen/document/v1/entity/stompbox_flanger/v1/stompbox_flanger_nexus"
import type { Defaults } from "./default-type"
import { defaultDisplayParams } from "./shared"

export const stompboxFlangerDefaults: Defaults<StompboxFlangerConstructor> = {
  ...defaultDisplayParams,
  displayName: "Flanger",
  delayTimeMs: 1,
  feedbackFactor: 0,
  lfoFrequencyHz: 0.13232196867465973,
  lfoModulationDepth: 0.740399956703186,
  isActive: true,
  presetName: "",
  mix: 0,
}
