import type { StompboxChorusConstructor } from "@gen/document/v1/entity/stompbox_chorus/v1/stompbox_chorus_nexus"
import type { Defaults } from "./default-type"
import { defaultDisplayParams } from "./shared"

export const stompboxChorusDefaults: Defaults<StompboxChorusConstructor> = {
  ...defaultDisplayParams,
  displayName: "Chorus",
  delayTimeMs: 20,
  feedbackFactor: 0,
  lfoFrequencyHz: 0.10000000149011612,
  lfoModulationDepth: 0.49000000953674316,
  spreadFactor: 0.5049999952316284,
  isActive: true,
  presetName: "",
  mix: 0,
}
