import { NexusLocation } from "@document/location"
import type { PulverisateurConstructor } from "@gen/document/v1/entity/pulverisateur/v1/pulverisateur_nexus"
import type { Defaults } from "./default-type"
import { defaultDisplayParams } from "./shared"

const channelDefaults = {
  isActive: true,
  panning: 0,
  gain: 1,
}

const oscillatorDefaults = {
  tuneSemitones: 0,
  tuneOctaves: 0,
  waveform: 0,
}

export const pulverisateurDefaults: Defaults<PulverisateurConstructor> = {
  ...defaultDisplayParams,
  displayName: "Pulverisateur",
  isActive: true,
  microTuning: new NexusLocation(),
  gain: 0.707946,
  glideTimeMs: 0,
  tuneSemitones: 0,
  playModeIndex: 2,
  oscillatorA: {
    channel: channelDefaults,
    oscillator: oscillatorDefaults,
  },
  oscillatorB: {
    channel: {
      ...channelDefaults,
      isActive: false,
    },
    oscillator: oscillatorDefaults,
    hardSyncToOscillatorA: false,
  },
  oscillatorC: {
    channel: {
      ...channelDefaults,
      isActive: false,
    },
    oscillator: oscillatorDefaults,
    doesTrackKeyboard: true,
  },
  noise: {
    channel: {
      ...channelDefaults,
      isActive: false,
    },
    color: 1,
  },
  audio: {
    channel: { ...channelDefaults, isActive: false },
    drive: 0,
  },
  filter: {
    modeIndex: 1,
    cutoffFrequencyHz: 15500,
    resonance: 0,
    filterSpacing: 0,
    keyboardTrackingAmount: 0,
  },
  lfo: {
    waveform: 0,
    rateIsSynced: false,
    rateNormalized: 0.25,
    restartOnNote: false,
    targetsOscillatorAPitch: false,
    targetsOscillatorBPitch: false,
    targetsOscillatorCPitch: false,
    targetsFilterCutoff: false,
    targetsPulseWidth: false,
    modulationDepth: 0,
  },
  filterEnvelope: {
    attackMs: 1,
    decayMs: 500,
    decayIsLooped: false,
    sustainFactor: 0,
    releaseMs: 1,
    modulationDepth: 0,
  },
  amplitudeEnvelope: {
    attackMs: 1,
    decayMs: 500,
    decayIsLooped: false,
    sustainFactor: 0,
    releaseMs: 1,
  },
  presetName: "",
}
