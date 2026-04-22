import type { StompboxStereoDetuneConstructor } from "@gen/document/v1/entity/stompbox_stereo_detune/v1/stompbox_stereo_detune_nexus"
import type { Defaults } from "./default-type"
import { defaultDisplayParams } from "./shared"

export const stompboxStereoDetuneDefaults: Defaults<StompboxStereoDetuneConstructor> =
  {
    ...defaultDisplayParams,
    displayName: "Stereo Detune",
    detuneSemitones: 0.25,
    delayTimeMs: 14,
    isActive: true,
    presetName: "",
  }
