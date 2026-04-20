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
 * key | `"quasar"`
 * is |
 *
 *
 *  The Quasar is a reverb effect that combines the simulation of a
 *  tank and plate reverb.
 *
 *
 * @category Device Entities*/
export type Quasar = {
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
   *  Pre-delay applied globally to all delays.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1000]
   * is | {@link api.TargetType.AutomatableParameter}*/
  preDelayMs: PrimitiveField<number, "mut">
  /**
   *  The frequency of the low-pass filter. The low-pass filter is applied to the
   *  signal after the pre-delay.
   *
   *
   * key | value
   * --- | ---
   * default | 20000
   * range | [20, 20000]
   * is | {@link api.TargetType.AutomatableParameter}*/
  lowPassFrequencyHz: PrimitiveField<number, "mut">
  /**
   *  The frequency of the high-pass filter. The high-pass filter is applied to the
   *  signal after the pre-delay.
   *
   *
   * key | value
   * --- | ---
   * default | 20
   * range | [20, 20000]
   * is | {@link api.TargetType.AutomatableParameter}*/
  highPassFrequencyHz: PrimitiveField<number, "mut">
  /**
   *  Selects the filter cutoff slope for both lowpass- and highpass-filters.
   *  - 0: invalid
   *  - 1: 12dB/Octave
   *  - 2: 24dB/Octave
   *  - 3: 36dB/Octave
   *  - 4: 48dB/Octave
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 4]
   * is | {@link api.TargetType.AutomatableParameter}*/
  filterSlopeIndex: PrimitiveField<number, "mut">
  /**
   *  Gain factor for the dry signal (not affected by reverb). Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 0.5011870265007019
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  dryGain: PrimitiveField<number, "mut">
  /**
   *  Gain factor for the wet (reverberated) signal. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 0.5011870265007019
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  wetGain: PrimitiveField<number, "mut">
  /**
   *  Whether the device is active or not. When is_active=false, audio signal bypasses the device
   *
   *
   * key | value
   * --- | ---
   * default | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  isActive: PrimitiveField<boolean, "mut">
  /**
   *  Controls the decay duration of the plate reverb tail. 0 means maximum decay time,
   *  1 means minimum decay time. No unit.
   *
   *
   * key | value
   * --- | ---
   * default | 0.75
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  plateDecay: PrimitiveField<number, "mut">
  /**
   *  Dampening factor of the plate decay. If you think of a plate reverb, the dampening restricts
   *  the vibration of the plate. 1 means maximum dampening, 0 means minimum dampening. No unit.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  plateDamp: PrimitiveField<number, "mut">
  /**
   *  The first of two diffusion parameters that "diffuses" the input signal across time.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  inputDiffusion: PrimitiveField<number, "mut">
  /**
   *  The second of two diffusion parameters that "diffuses" the input signal across time.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  tankDiffusion: PrimitiveField<number, "mut">
  /**
   *  The depth of the vibrato. 0 means no vibrato, 1 means maximum vibrato. No unit.
   *  Creates a "flutter" effect on the reverb tail.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  vibratoDepth: PrimitiveField<number, "mut">
  /**
   *  The frequency of the vibrato in Hz.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0.009999999776482582, 20]
   * is | {@link api.TargetType.AutomatableParameter}*/
  vibratoFrequencyHz: PrimitiveField<number, "mut">
  /**
   *  Single Input.
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioInput}*/
  audioInput: NexusObject<Empty>
  /**
   *  Single Output.
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioOutput}*/
  audioOutput: NexusObject<Empty>
}
/** @internal */

export type QuasarConstructor = {
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
   *  Pre-delay applied globally to all delays.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1000]*/
  preDelayMs?: number
  /**
   *  The frequency of the low-pass filter. The low-pass filter is applied to the
   *  signal after the pre-delay.
   *
   *
   * key | value
   * --- | ---
   * default | 20000
   * range | [20, 20000]*/
  lowPassFrequencyHz?: number
  /**
   *  The frequency of the high-pass filter. The high-pass filter is applied to the
   *  signal after the pre-delay.
   *
   *
   * key | value
   * --- | ---
   * default | 20
   * range | [20, 20000]*/
  highPassFrequencyHz?: number
  /**
   *  Selects the filter cutoff slope for both lowpass- and highpass-filters.
   *  - 0: invalid
   *  - 1: 12dB/Octave
   *  - 2: 24dB/Octave
   *  - 3: 36dB/Octave
   *  - 4: 48dB/Octave
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 4]*/
  filterSlopeIndex?: number
  /**
   *  Gain factor for the dry signal (not affected by reverb). Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 0.5011870265007019
   * range | [0, 1]*/
  dryGain?: number
  /**
   *  Gain factor for the wet (reverberated) signal. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 0.5011870265007019
   * range | [0, 1]*/
  wetGain?: number
  /**
   *  Whether the device is active or not. When is_active=false, audio signal bypasses the device
   *
   *
   * key | value
   * --- | ---
   * default | true*/
  isActive?: boolean
  /**
   *  Controls the decay duration of the plate reverb tail. 0 means maximum decay time,
   *  1 means minimum decay time. No unit.
   *
   *
   * key | value
   * --- | ---
   * default | 0.75
   * range | [0, 1]*/
  plateDecay?: number
  /**
   *  Dampening factor of the plate decay. If you think of a plate reverb, the dampening restricts
   *  the vibration of the plate. 1 means maximum dampening, 0 means minimum dampening. No unit.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  plateDamp?: number
  /**
   *  The first of two diffusion parameters that "diffuses" the input signal across time.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]*/
  inputDiffusion?: number
  /**
   *  The second of two diffusion parameters that "diffuses" the input signal across time.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]*/
  tankDiffusion?: number
  /**
   *  The depth of the vibrato. 0 means no vibrato, 1 means maximum vibrato. No unit.
   *  Creates a "flutter" effect on the reverb tail.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  vibratoDepth?: number
  /**
   *  The frequency of the vibrato in Hz.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0.009999999776482582, 20]*/
  vibratoFrequencyHz?: number
}

