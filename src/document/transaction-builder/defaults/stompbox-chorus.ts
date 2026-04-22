import type { StompboxChorusConstructor } from "@gen/document/v1/entity/stompbox_chorus/v1/stompbox_chorus_nexus"
import type { Defaults } from "./default-type"
import { defaultDisplayParams } from "./shared"

export const stompboxChorusDefaults: Defaults<StompboxChorusConstructor> = {
  ...defaultDisplayParams,
  displayName: "Chorus",
  delayTimeMs: 20,
  feedbackFactor: 0,
  lfoFrequencyHz: 0.33329999446868896,
  lfoModulationDepth: 1,
  spreadFactor: 0,
  isActive: true,
  presetName: "",
}
