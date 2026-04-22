import type { AutoFilterConstructor } from "@gen/document/v1/entity/auto_filter/v1/auto_filter_nexus"
import type { Defaults } from "./default-type"
import { defaultDisplayParams } from "./shared"

export const autoFilterDefaults: Defaults<AutoFilterConstructor> = {
  ...defaultDisplayParams,
  displayName: "Auto Filter",
  thresholdGain: 0.5,
  attackMs: 62.5,
  sustainMs: 62.5,
  releaseMs: 62.5,
  filterModeIndex: 1,
  cutoffFrequencyHz: 300,
  filterModulationDepth: 1,
  filterResonance: 1.4142135381698608,
  gain: 1,
  mix: 1,
  isActive: true,
  presetName: "",
}
