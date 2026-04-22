import type {
  Beatbox9Constructor,
  Beatbox9PatternConstructor,
  Beatbox9PatternStepConstructor,
} from "@gen/document/v1/entity/beatbox9/v1/beatbox9_nexus"
import { NexusLocation } from "@document/location"
import type { Defaults } from "./default-type"
import { defaultDisplayParams } from "./shared"

export const beatbox9PatternStepDefaults: Defaults<Beatbox9PatternStepConstructor> =
  {
    bassdrumStepIndex: 0,
    snaredrumStepIndex: 0,
    tomLowStepIndex: 0,
    tomMidStepIndex: 0,
    tomHighStepIndex: 0,
    rimStepIndex: 0,
    clapStepIndex: 0,
    closedHihatStepIndex: 0,
    openHihatStepIndex: 0,
    crashStepIndex: 0,
    rideStepIndex: 0,
  }

export const beatbox9PatternDefaults: Defaults<Beatbox9PatternConstructor> = {
  ...defaultDisplayParams,
  length: 16,
  stepScaleIndex: 3,
  groove: new NexusLocation(),
  steps: Array.from({ length: 64 }, () => beatbox9PatternStepDefaults),
}

export const beatbox9Defaults: Defaults<Beatbox9Constructor> = {
  ...defaultDisplayParams,
  displayName: "Beatbox 9",
  gain: 0.7079399824142456,
  accentAmount: 0.5,
  patternIndex: 0,
  isActive: true,
  bassdrum: {
    gain: 1,
    tone: Math.fround(0.6),
    attack: 1,
    decay: 0.3149999976158142,
  },
  snaredrum: {
    gain: 1,
    tune: Math.fround(0.7),
    tone: 0.1837099939584732,
    snappy: 1,
  },
  tomLow: {
    gain: 1,
    tune: 0,
    decay: Math.fround(0.671),
  },
  tomMid: {
    gain: 1,
    tune: 0,
    decay: Math.fround(0.671),
  },
  tomHigh: {
    gain: 1,
    tune: 0,
    decay: Math.fround(0.671),
  },
  rim: {
    gain: 1,
  },
  clap: {
    gain: 1,
  },
  hihat: {
    gain: 1,
    closedDecay: 0.5,
    openDecay: 0.5,
  },
  crash: {
    gain: 1,
    tune: 0.5,
  },
  ride: {
    gain: 1,
    tune: 0.5,
  },
  presetName: "",
}
