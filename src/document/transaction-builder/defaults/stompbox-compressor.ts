import type { StompboxCompressorConstructor } from "@gen/document/v1/entity/stompbox_compressor/v1/stompbox_compressor_nexus"
import type { Defaults } from "./default-type"
import { defaultDisplayParams } from "./shared"

export const stompboxCompressorDefaults: Defaults<StompboxCompressorConstructor> =
  {
    ...defaultDisplayParams,
    displayName: "Compressor",
    attackMs: 10,
    releaseMs: 50,
    makeupGainDb: 1.4838908910751343,
    detectionModeIndex: 2,
    ratio: 0.6014999747276306,
    thresholdDb: -24,
    isActive: true,
    presetName: "",
  }
