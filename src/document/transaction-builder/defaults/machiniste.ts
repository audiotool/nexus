import { NexusLocation } from "@document/location"
import type {
  MachinisteChannelConstructor,
  MachinisteChannelPatternConstructor,
  MachinisteConstructor,
  MachinistePatternConstructor,
  MachinisteStepConstructor,
} from "@gen/document/v1/entity/machiniste/v1/machiniste_nexus"
import type { Defaults } from "./default-type"
import { defaultDisplayParams } from "./shared"

export const machinisteStepDefaults: Defaults<MachinisteStepConstructor> = {
  isActive: false,
  modulationDepth: 1,
}

export const machinisteChannelPatternDefaults: Defaults<MachinisteChannelPatternConstructor> =
  {
    isExclusive: false,
    isMuted: false,
    steps: Array.from({ length: 128 }, () => machinisteStepDefaults),
  }

export const machinistePatternDefaults: Defaults<MachinistePatternConstructor> =
  {
    ...defaultDisplayParams,
    length: 16,
    stepScaleIndex: 1,
    groove: new NexusLocation(),
    channelPatterns: Array.from(
      { length: 9 },
      () => machinisteChannelPatternDefaults,
    ),
  }

export const machinisteChannelDefaults: Defaults<MachinisteChannelConstructor> =
  {
    sample: new NexusLocation(),
    startTrimFactor: 0,
    startTrimModulationDepth: 0,
    endTrimFactor: 1,
    endTrimModulationDepth: 0,
    pitchSemitones: 0,
    pitchModulationDepth: 0,
    filterTypeIndex: 1,
    cutoffFrequencyHz: 6000,
    cutoffModulationDepth: 0,
    resonance: 0,
    resonanceModulationDepth: 0,
    envelopePeakRatio: 0,
    envelopeRatioModulationDepth: 0,
    envelopeSlope: 1,
    envelopeSlopeModulationDepth: 0,
    panning: 0,
    panningModulationDepth: 0,
    gain: 0.1,
    gainModulationDepth: 1,
  }

export const machinisteDefaults: Defaults<MachinisteConstructor> = {
  ...defaultDisplayParams,
  displayName: "Machiniste",
  channels: new Array(9).fill(machinisteChannelDefaults),
  mainOutputGain: 0.70794,
  globalModulationDepth: 1,
  patternIndex: 0,
  isActive: true,
  presetName: "",
}
