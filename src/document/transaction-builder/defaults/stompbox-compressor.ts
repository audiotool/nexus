import type { StompboxCompressorConstructor } from "@gen/document/v1/entity/stompbox_compressor/v1/stompbox_compressor_nexus"
import type { Defaults } from "./default-type"
import { defaultDisplayParams } from "./shared"

export const stompboxCompressorDefaults: Defaults<StompboxCompressorConstructor> =
  {
    ...defaultDisplayParams,
    displayName: "Compressor",
    attackMs: 5,
    releaseMs: 25,
    makeupGainDb: 0,
    detectionModeIndex: 1,
    ratio: 0.4000000059604645,
    thresholdDb: -15,
    isActive: true,
    presetName: "",
  }
