import type {
  WaveshaperAnchorConstructor,
  WaveshaperConstructor,
} from "@gen/document/v1/entity/waveshaper/v1/waveshaper_nexus"
import type { Defaults } from "./default-type"
import { defaultDisplayParams } from "./shared"

export const waveshaperDefaults: Defaults<WaveshaperConstructor> = {
  ...defaultDisplayParams,
  displayName: "Waveshaper",
  preGain: 1,
  mix: 1,
  autoDrive: 0,
  attackMs: 5,
  releaseMs: 50,
  thresholdGain: 1,
  invertEnvelope: false,
  finalSlope: 0,
  finalY: 1,
  isActive: true,
  disableOversampling: false,
  presetName: "",
}

export const waveshaperAnchorDefaults: Defaults<WaveshaperAnchorConstructor> = {
  x: 0,
  y: 0,
  slope: 0,
}
