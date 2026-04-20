// THIS FILE IS GENERATED - DO NOT EDIT
// Copyright 2026 Audiotool Inc.

import { PrimitiveField } from "@document/fields"
import { NexusObject } from "@document/object"
import { type Empty } from "@gen/document/v1/empty_nexus"

/**
 *
 * key | value
 * --- | ---
 * type | entity
 * key | `"autoFilter"`
 * is |
 *
 *
 *  The auto filter device.
 *
 *  The auto filter is a filter that low/high pass filter
 *  that filters the signal based on a configured cutoff frequency.
 *
 *  When the main input (or side-chain) signal passes a certain threshold gain,
 *  the cutoff frequency of the filter is pulled up or down in frequency according to
 *  an attack-sustain-release envelope.
 *
 *
 * @category Device Entities*/
export type AutoFilter = {
  /**
   *  The user-assigned name of this device.
   */
  displayName: PrimitiveField<string, "mut">
  /**
   *  X position on the desktop in the DAW.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | full*/
  positionX: PrimitiveField<number, "mut">
  /**
   *  Y position on the desktop in the DAW.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | full*/
  positionY: PrimitiveField<number, "mut">
  /**
   *  The backend name of the preset applied to this device, if any. Usually presets/{uuid}.
   *  This is used for record-keeping only and has no effect on the sound of the device.
   */
  presetName: PrimitiveField<string, "mut">
  /**
   *  The threshold gain above which the filter envelope is triggered. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 0.5
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  thresholdGain: PrimitiveField<number, "mut">
  /**
   *  The duration of the attack stage of the filter envelope.
   *
   *
   * key | value
   * --- | ---
   * default | 62.5
   * range | [1, 2000]
   * is | {@link api.TargetType.AutomatableParameter}*/
  attackMs: PrimitiveField<number, "mut">
  /**
   *  The duration of the sustain stage of the filter envelope.
   *
   *
   * key | value
   * --- | ---
   * default | 62.5
   * range | [1, 2000]
   * is | {@link api.TargetType.AutomatableParameter}*/
  sustainMs: PrimitiveField<number, "mut">
  /**
   *  The duration of the release stage of the filter envelope.
   *
   *
   * key | value
   * --- | ---
   * default | 62.5
   * range | [1, 2000]
   * is | {@link api.TargetType.AutomatableParameter}*/
  releaseMs: PrimitiveField<number, "mut">
  /**
   *  Filter mode of the filter that moves if passing above the threshold.
   *
   *  - 0: invalid
   *  - 1: LowPass
   *  - 2: LowPass Inverted
   *  - 3: HighPass
   *  - 4: HighPass Inverted
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 4]
   * is | {@link api.TargetType.AutomatableParameter}*/
  filterModeIndex: PrimitiveField<number, "mut">
  /**
   *  The cutoff frequency of the filter...:
   *  - if in inverted mode: when the filter is triggered
   *  - if in normal mode: when the filter is not triggered
   *
   *
   * key | value
   * --- | ---
   * default | 300
   * range | [18, 10000]
   * is | {@link api.TargetType.AutomatableParameter}*/
  cutoffFrequencyHz: PrimitiveField<number, "mut">
  /**
   *  Depth and direction of the filter modulation that is applied when the envelope
   *  is triggered:
   *  - if inverted mode, how far away the current filter cutoff frequency is at when
   *     the filter is not triggered (moving to the cutoff frequency when the envelope is triggered)
   *  - if normal mode, how far away the current filter cutoff frequency is at when
   *     the filter is triggered (staying at cutoff frequency when the envelope is not triggered)
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  filterModulationDepth: PrimitiveField<number, "mut">
  /**
   *  Filter resonance (Q factor). Lower values create more pronounced resonance peaks.
   *  Range: 0.01 (maximum resonance) to 1.4142 (minimum resonance, √2).
   *
   *
   * key | value
   * --- | ---
   * default | 1.4142135381698608
   * range | [0.009999999776482582, 1.4142135381698608]
   * is | {@link api.TargetType.AutomatableParameter}*/
  filterResonance: PrimitiveField<number, "mut">
  /**
   *  This device's output gain. Equivalent to a dB range of [-inf, 9.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 2.818382978439331]
   * is | {@link api.TargetType.AutomatableParameter}*/
  gain: PrimitiveField<number, "mut">
  /**
   *  Controls the mix between the incoming and the effect signal. 0 ("dry") means 0% effect
   *  applied, 1 ("wet") means 100% effect applied; values between mixes the two linearly.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  mix: PrimitiveField<number, "mut">
  /**
   *  The location of the audio input that is affected by the effect.
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioInput}*/
  audioInput: NexusObject<Empty>
  /**
   *  The location of the audio input for the side chain.
   *
   *  If this is connected to a cable, the
   *  auto filter uses that to determine if the filter should move or not; the effect still applies
   *  to the audio_input signal.
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioInput}*/
  sideChainInput: NexusObject<Empty>
  /**
   *  The location of the audio output containing the affected signal.
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioOutput}*/
  audioOutput: NexusObject<Empty>
  /**
   *  Whether this device is active or not. If is_active=false, the device's effect is bypassed.
   *
   *
   * key | value
   * --- | ---
   * default | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  isActive: PrimitiveField<boolean, "mut">
}
/** @internal */

export type AutoFilterConstructor = {
  /**
   *  The user-assigned name of this device.
   */
  displayName?: string
  /**
   *  X position on the desktop in the DAW.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | full*/
  positionX?: number
  /**
   *  Y position on the desktop in the DAW.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | full*/
  positionY?: number
  /**
   *  The backend name of the preset applied to this device, if any. Usually presets/{uuid}.
   *  This is used for record-keeping only and has no effect on the sound of the device.
   */
  presetName?: string
  /**
   *  The threshold gain above which the filter envelope is triggered. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 0.5
   * range | [0, 1]*/
  thresholdGain?: number
  /**
   *  The duration of the attack stage of the filter envelope.
   *
   *
   * key | value
   * --- | ---
   * default | 62.5
   * range | [1, 2000]*/
  attackMs?: number
  /**
   *  The duration of the sustain stage of the filter envelope.
   *
   *
   * key | value
   * --- | ---
   * default | 62.5
   * range | [1, 2000]*/
  sustainMs?: number
  /**
   *  The duration of the release stage of the filter envelope.
   *
   *
   * key | value
   * --- | ---
   * default | 62.5
   * range | [1, 2000]*/
  releaseMs?: number
  /**
   *  Filter mode of the filter that moves if passing above the threshold.
   *
   *  - 0: invalid
   *  - 1: LowPass
   *  - 2: LowPass Inverted
   *  - 3: HighPass
   *  - 4: HighPass Inverted
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 4]*/
  filterModeIndex?: number
  /**
   *  The cutoff frequency of the filter...:
   *  - if in inverted mode: when the filter is triggered
   *  - if in normal mode: when the filter is not triggered
   *
   *
   * key | value
   * --- | ---
   * default | 300
   * range | [18, 10000]*/
  cutoffFrequencyHz?: number
  /**
   *  Depth and direction of the filter modulation that is applied when the envelope
   *  is triggered:
   *  - if inverted mode, how far away the current filter cutoff frequency is at when
   *     the filter is not triggered (moving to the cutoff frequency when the envelope is triggered)
   *  - if normal mode, how far away the current filter cutoff frequency is at when
   *     the filter is triggered (staying at cutoff frequency when the envelope is not triggered)
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [-1, 1]*/
  filterModulationDepth?: number
  /**
   *  Filter resonance (Q factor). Lower values create more pronounced resonance peaks.
   *  Range: 0.01 (maximum resonance) to 1.4142 (minimum resonance, √2).
   *
   *
   * key | value
   * --- | ---
   * default | 1.4142135381698608
   * range | [0.009999999776482582, 1.4142135381698608]*/
  filterResonance?: number
  /**
   *  This device's output gain. Equivalent to a dB range of [-inf, 9.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 2.818382978439331]*/
  gain?: number
  /**
   *  Controls the mix between the incoming and the effect signal. 0 ("dry") means 0% effect
   *  applied, 1 ("wet") means 100% effect applied; values between mixes the two linearly.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]*/
  mix?: number
  /**
   *  Whether this device is active or not. If is_active=false, the device's effect is bypassed.
   *
   *
   * key | value
   * --- | ---
   * default | true*/
  isActive?: boolean
}

