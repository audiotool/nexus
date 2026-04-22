import { NexusLocation } from "@document/location"
import type {
  RasselbockConstructor,
  RasselbockPatternConstructor,
  RasselbockRowPatternConstructor,
  RasselbockStepConstructor,
} from "@gen/document/v1/entity/rasselbock/v1/rasselbock_nexus"
import type { Defaults } from "./default-type"
import { defaultDisplayParams } from "./shared"

const createArray = <T>(length: number, init: (index: number) => T): T[] =>
  Array.from({ length }, (_, i) => init(i))

const channelConfigDefaults = {
  gain: 1,
  panning: 0,
  mix: 1,
  mixMode: 1,
  isMuted: false,
  isSoloed: false,
}

const rasselbockStepDefaults: Defaults<RasselbockStepConstructor> = {
  isOn: false,
  isEnd: false,
}

const rasselbockRowPatternDefaults: Defaults<RasselbockRowPatternConstructor> =
  {
    steps: Array.from({ length: 256 }, () => rasselbockStepDefaults),
  }

export const rasselbockPatternDefaults: Defaults<RasselbockPatternConstructor> =
  {
    ...defaultDisplayParams,
    length: 16,
    groove: new NexusLocation(),
    channelPatterns: createArray(5, () => rasselbockRowPatternDefaults),
    effectOrder: createArray(7, (i) => i),
    effectPatterns: createArray(7, () => rasselbockRowPatternDefaults),
  }

export const rasselbockDefaults: Defaults<RasselbockConstructor> = {
  ...defaultDisplayParams,
  displayName: "Rasselbock",
  patternIndex: 0,
  isActive: true,
  channelConfigs: createArray(5, () => channelConfigDefaults),
  shuffleConfig: {
    intervalIndex: 3,
    seed: 16777215,
    isMuted: false,
    isSoloed: false,
  },
  speedConfig: {
    speedRatioIndex: 6,
    isMuted: false,
    isSoloed: false,
  },
  stopConfig: {
    durationIndex: 5,
    doesSpinback: false,
    isMuted: false,
    isSoloed: false,
  },
  gateConfig: {
    intervalDurationIndex: 5,
    durationFactor: 0.5,
    isMuted: false,
    isSoloed: false,
  },
  stutterConfig: {
    intervalDurationIndex: 5,
    scaleFactor: 1,
    pitchSemitones: 0,
    isMuted: false,
    isSoloed: false,
  },
  scratchConfig: {
    rateBars: 4,
    modulationDepth: 1,
    modulationOffset: 1,
    modulationShapeIndex: 1,
    isMuted: false,
    isSoloed: false,
  },
  reverseConfig: {
    isMuted: false,
    isSoloed: false,
  },
  presetName: "",
}
