import type { MinimixerConstructor } from "@gen/document/v1/entity/minimixer/v1/minimixer_nexus"
import type { Defaults } from "./default-type"
import { defaultDisplayParams } from "./shared"

export const minimixerDefaults: Defaults<MinimixerConstructor> = {
  ...defaultDisplayParams,
  displayName: "Minimixer",
  gain: 1,
  auxSendGain: 1,
  auxIsPreGain: true,
  channel1: {
    gain: 1,
    panning: 0,
    auxSendGain: 0,
    auxIsPreGain: false,
    isMuted: false,
    isSoloed: false,
  },
  channel2: {
    gain: 1,
    panning: 0,
    auxSendGain: 0,
    auxIsPreGain: false,
    isMuted: false,
    isSoloed: false,
  },
  channel3: {
    gain: 1,
    panning: 0,
    auxSendGain: 0,
    auxIsPreGain: false,
    isMuted: false,
    isSoloed: false,
  },
  channel4: {
    gain: 1,
    panning: 0,
    auxSendGain: 0,
    auxIsPreGain: false,
    isMuted: false,
    isSoloed: false,
  },
}
