import type { CrossfaderConstructor } from "@gen/document/v1/entity/crossfader/v1/crossfader_nexus"
import type { Defaults } from "./default-type"
import { defaultDisplayParams } from "./shared"

export const crossfaderDefaults: Defaults<CrossfaderConstructor> = {
  ...defaultDisplayParams,
  displayName: "Crossfader",
  postGain: 1,
  crossfade: 0,
  panning: 0,
  blendModeIndex: 1,
  channelA: {
    preGain: 1,
    eqLowFrequencyHz: 260,
    eqLowGainDb: 0,
    lowKillEnabled: false,
    eqMidFrequencyHz: 1500,
    eqMidGainDb: 0,
    midKillEnabled: false,
    eqHighFrequencyHz: 4200,
    eqHighGainDb: 0,
    highKillEnabled: false,
  },
  channelB: {
    preGain: 1,
    eqLowFrequencyHz: 260,
    eqLowGainDb: 0,
    lowKillEnabled: false,
    eqMidFrequencyHz: 1500,
    eqMidGainDb: 0,
    midKillEnabled: false,
    eqHighFrequencyHz: 4200,
    eqHighGainDb: 0,
    highKillEnabled: false,
  },
  presetName: "",
}
