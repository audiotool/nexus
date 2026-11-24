import type {
  TinySamplerConstructor,
  TinySamplerSampleConstructor,
  TinySamplerSampleLayerConstructor,
} from "@gen/document/v1/entity/tiny_sampler/v1/tiny_sampler_nexus"
import { NexusLocation } from "../../location"
import type { Defaults } from "./default-type"
import { defaultDisplayParams } from "./shared"

export const tinySamplerDefaults: Defaults<TinySamplerConstructor> = {
  ...defaultDisplayParams,
  displayName: "Tiny Sampler",
  presetName: "",
  gainFactor: 1,
  overrideVelocity: 0,
  velocityImpactFactor: 1,
  isActive: true,
  microTuning: new NexusLocation(),
}

export const tinySamplerSampleDefaults: Defaults<TinySamplerSampleConstructor> =
  {
    midiKey: 60,
    gain: 1,
  }

// play the sample as recorded: no attack, full sustain, short release
const envelopeDefaults = {
  isSynced: false,
  attackTimeNormalized: 0,
  attackSlopeFactor: 0,
  decayTimeNormalized: 0.25,
  decaySlopeFactor: 0,
  decayIsLooped: false,
  sustainFactor: 1,
  // ~100ms
  releaseTimeNormalized: 0.14,
  releaseSlopeFactor: 0,
}

export const tinySamplerSampleLayerDefaults: Defaults<TinySamplerSampleLayerConstructor> =
  {
    sample: new NexusLocation(),
    pitchCorrectionCents: 0,
    // both filters are open
    lowPassCutoffFrequencyHz: 19500,
    highPassCutoffFrequencyHz: 19,
    levelEnvelope: envelopeDefaults,
    // scales the cutoff; fully open while sustaining, closing in the release
    // like the level does
    filterEnvelope: envelopeDefaults,
    velocityLevelEnvelopeAmount: 0,
    velocityFilterEnvelopeAmount: 0,
    velocityDecayModulation: 0,
    startPct: 0,
    endPct: 1,
    // the last part of the sample, once the loop is turned on
    sustainLoopStartPct: 0.7,
    sustainLoopEndPct: 1,
    sustainLoopIsActive: false,
    // crossfade at the loop turnover
    loopOverlapMs: 5,
    // pitch shift
    timestretchMode: 1,
    gain: 1,
    // played at every velocity, with full gain
    velocityGainRiseStart: 0,
    velocityGainRiseEnd: 0,
    velocityGainFallStart: 1,
    velocityGainFallEnd: 1,
    index: 0,
  }
