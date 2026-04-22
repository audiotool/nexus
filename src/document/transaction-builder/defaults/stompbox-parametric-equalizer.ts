import type { StompboxParametricEqualizerConstructor } from "@gen/document/v1/entity/stompbox_parametric_equalizer/v1/stompbox_parametric_equalizer_nexus"
import type { Defaults } from "./default-type"
import { defaultDisplayParams } from "./shared"

export const stompboxParametricEqualizerDefaults: Defaults<StompboxParametricEqualizerConstructor> =
  {
    ...defaultDisplayParams,
    displayName: "Parametric EQ",
    frequencyHz: 3600,
    bandwidthFactor: 0.15000000596046448,
    postGainDb: 0,
    isActive: true,
    presetName: "",
  }
