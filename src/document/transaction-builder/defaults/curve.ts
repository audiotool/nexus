import type { CurveConstructor } from "@gen/document/v1/entity/curve/v1/curve_nexus"
import type { Defaults } from "./default-type"
import { defaultDisplayParams } from "./shared"

export const curveDefaults: Defaults<CurveConstructor> = {
  ...defaultDisplayParams,
  displayName: "Curve",
  isActive: true,
  gainDb: 0,
  spectrumModeIndex: 3,
  peak1: {
    isEnabled: false,
    centerFrequencyHz: 240,
    gainDb: 0,
    q: 1,
  },
  peak2: {
    isEnabled: true,
    centerFrequencyHz: 1000,
    gainDb: 0,
    q: 1,
  },
  peak3: {
    isEnabled: false,
    centerFrequencyHz: 4000,
    gainDb: 0,
    q: 1,
  },
  lowPass: {
    cutoffFrequencyHz: 18000,
    q: 0.71,
    isEnabled: false,
    filterSlopeIndex: 1,
  },
  highPass: {
    cutoffFrequencyHz: 40,
    q: 0.71,
    isEnabled: false,
    filterSlopeIndex: 1,
  },
  lowShelf: {
    centerFrequencyHz: 80,
    gainDb: 0,
    isEnabled: true,
  },
  highShelf: {
    centerFrequencyHz: 10000,
    gainDb: 0,
    isEnabled: true,
  },
  presetName: "",
}
