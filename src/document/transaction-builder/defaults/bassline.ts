import type {
  BasslineConstructor,
  BasslinePatternConstructor,
  BasslineStepConstructor,
} from "@gen/document/v1/entity/bassline/v1/bassline_nexus"
import { NexusLocation } from "@document/location"
import type { Defaults } from "./default-type"
import { defaultDisplayParams } from "./shared"

export const basslineStepDefaults: Defaults<BasslineStepConstructor> = {
  key: 36,
  transposeOctaves: 0,
  isActive: true,
  doesSlide: false,
  isAccented: false,
}

export const basslinePatternDefaults: Defaults<BasslinePatternConstructor> = {
  ...defaultDisplayParams,
  steps: Array.from({ length: 99 }, () => basslineStepDefaults),
  length: 16,
  groove: new NexusLocation(),
}

export const basslineDefaults: Defaults<BasslineConstructor> = {
  ...defaultDisplayParams,
  displayName: "Bassline",
  gain: 0.70794,
  tuneSemitones: 0,
  cutoffFrequencyHz: 220,
  filterResonance: 1,
  filterEnvelopeModulationDepth: 0.10000000149011612,
  filterDecay: 0,
  accent: 1,
  waveformIndex: 1,
  patternIndex: 0,
  isActive: true,
  presetName: "",
} as Defaults<BasslineConstructor>
