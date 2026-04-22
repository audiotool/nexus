import { NexusLocation } from "@document/location"
import type {
  TonematrixConstructor,
  TonematrixPatternConstructor,
  TonematrixStepConstructor,
} from "@gen/document/v1/entity/tonematrix/v1/tonematrix_nexus"
import type { Defaults } from "./default-type"
import { defaultDisplayParams } from "./shared"

export const tonematrixStepDefaults: Defaults<TonematrixStepConstructor> = {
  notes: Array.from({ length: 16 }, () => false),
}

export const tonematrixPatternDefaults: Defaults<TonematrixPatternConstructor> =
  {
    ...defaultDisplayParams,
    groove: new NexusLocation(),
    steps: Array.from({ length: 16 }, () => tonematrixStepDefaults),
  }

export const tonematrixDefaults: Defaults<TonematrixConstructor> = {
  ...defaultDisplayParams,
  displayName: "Tone Matrix",
  patternIndex: 0,
  microTuning: new NexusLocation(),
  isActive: true,
  presetName: "",
}
