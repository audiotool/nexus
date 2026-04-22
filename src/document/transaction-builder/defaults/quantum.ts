import type {
  QuantumBandConstructor,
  QuantumConstructor,
} from "@gen/document/v1/entity/quantum/v1/quantum_nexus"
import type { Defaults } from "./default-type"
import { defaultDisplayParams } from "./shared"

export const quantumBandDefaults: Defaults<QuantumBandConstructor> = {
  thresholdDb: -10,
  ratio: 4,
  kneeDb: 3,
  attackMs: 5,
  releaseMs: 50,
  makeupGainDb: 0,
  isCompressorActive: true,
  isMuted: false,
  isSoloed: false,
}

export const quantumDefaults: Defaults<QuantumConstructor> = {
  ...defaultDisplayParams,
  displayName: "Quantum",
  gainDb: 0,
  spectrumModeIndex: 3,
  rmsWindowMs: 5,
  bands: [
    quantumBandDefaults,
    quantumBandDefaults,
    quantumBandDefaults,
    quantumBandDefaults,
  ],
  splitFrequencyHz: [120, 2000, 10000],
  isActive: true,
  presetName: "",
}
