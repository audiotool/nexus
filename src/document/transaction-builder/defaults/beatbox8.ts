import type {
  Beatbox8Constructor,
  Beatbox8PatternConstructor,
  Beatbox8PatternStepConstructor,
} from "@gen/document/v1/entity/beatbox8/v1/beatbox8_nexus"
import { NexusLocation } from "@document/location"
import type { Defaults } from "./default-type"
import { defaultDisplayParams } from "./shared"

export const beatbox8PatternStepDefaults: Defaults<Beatbox8PatternStepConstructor> =
  {
    bassdrumIsActive: false,
    snaredrumIsActive: false,
    tomCongaLowIsActive: false,
    tomCongaMidIsActive: false,
    tomCongaHighIsActive: false,
    rimClavesIsActive: false,
    clapMaracasIsActive: false,
    cowbellIsActive: false,
    cymbalIsActive: false,
    openHihatIsActive: false,
    closedHihatIsActive: false,
    isAccented: false,
  }

export const beatbox8PatternDefaults: Defaults<Beatbox8PatternConstructor> = {
  ...defaultDisplayParams,
  length: 16,
  stepScaleIndex: 3,
  groove: new NexusLocation(),
  steps: Array.from({ length: 64 }, () => beatbox8PatternStepDefaults),
}

export const beatbox8Defaults: Defaults<Beatbox8Constructor> = {
  ...defaultDisplayParams,
  displayName: "Beatbox 8",
  gain: 0.70794,
  accentAmount: 0.5,
  patternIndex: 0,
  isActive: true,
  bassdrum: {
    gain: 1,
    tone: 0.6,
    decay: 0.2750000059604645,
  },
  snaredrum: {
    gain: 1,
    tone: 0.5,
    snappy: 1,
  },
  tomCongaLow: {
    gain: 1,
    tuning: 0,
    instrumentTypeIndex: 1,
  },
  tomCongaMid: {
    gain: 1,
    tuning: 0,
    instrumentTypeIndex: 1,
  },
  tomCongaHigh: {
    gain: 1,
    tuning: 0.6000000238418579,
    instrumentTypeIndex: 1,
  },
  rimClaves: {
    gain: 1,
    instrumentTypeIndex: 1,
  },
  clapMaracas: {
    gain: 1,
    instrumentTypeIndex: 1,
  },
  cowbell: {
    gain: 1,
  },
  cymbal: {
    gain: 1,
    tone: 0,
    decay: 0,
  },
  openHihat: {
    gain: 1,
    decay: 0.8220000267028809,
  },
  closedHihat: {
    gain: 1,
  },
  presetName: "",
}
