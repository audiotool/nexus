// THIS FILE IS GENERATED - DO NOT EDIT
// Copyright 2026 Audiotool Inc.

import { ArrayField, PrimitiveField } from "@document/fields"
import { type NexusLocation } from "@document/location"
import { NexusObject } from "@document/object"
import { type Empty } from "@gen/document/v1/empty_nexus"

/**
 *
 * key | value
 * --- | ---
 * type | entity
 * key | `"helmholtz"`
 * is |
 *
 *
 *  The Helmholtz is a device that has up to 5 short delay lines
 *  that can be tuned to make certain frequencies resonate,
 *  resulting in something akin to a comb filter, i.e. a filter
 *  that filters out frequencies that are multiples of a certain frequency.
 *
 *  The filter frequencies can be set to specific notes such as C4, D3, etc.
 *
 *  Because it's implemented with delay lines, the Helmholtz sounds like
 *  it's "resonating" and highlighting certain frequencies and their overtones,
 *  and the resonance frequencies will sound after the incoming signal has become quiet.
 *
 *
 * @category Device Entities*/
export type Helmholtz = {
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
   *  Reference to the microtuning.
   *
   *
   * key | value
   * --- | ---
   * default | empty location
   * required | false
   * targets | {@link api.TargetType.MicroTuning}, meaning one of: <br />{@link entities.MicroTuningOctave}*/
  microTuning: PrimitiveField<NexusLocation, "mut">
  /**
   *  This device's output gain. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 0.7079399824142456
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  gain: PrimitiveField<number, "mut">
  /**
   *  The decay time of the delay lines. Increasing this value will make the
   *  Helmholtz resonate for longer and louder after the incoming signal has become quiet.
   *  No unit.
   *
   *
   * key | value
   * --- | ---
   * default | 0.75
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  decayTime: PrimitiveField<number, "mut">
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
   *  Whether the device is active or not. When is_active=false, audio signal bypasses the device.
   *
   *
   * key | value
   * --- | ---
   * default | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  isActive: PrimitiveField<boolean, "mut">
  /**
   *  The 5 filters/delay lines of the Helmholtz.
   */
  filters: ArrayField<NexusObject<HelmholtzFilter>, 5>
  /**
   *  Audio input.
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioInput}*/
  audioInput: NexusObject<Empty>
  /**
   *  Audio output.
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioOutput}*/
  audioOutput: NexusObject<Empty>
}
/** @internal */

export type HelmholtzConstructor = {
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
   *  Reference to the microtuning.
   *
   *
   * key | value
   * --- | ---
   * default | empty location
   * required | false*/
  microTuning?: NexusLocation
  /**
   *  This device's output gain. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 0.7079399824142456
   * range | [0, 1]*/
  gain?: number
  /**
   *  The decay time of the delay lines. Increasing this value will make the
   *  Helmholtz resonate for longer and louder after the incoming signal has become quiet.
   *  No unit.
   *
   *
   * key | value
   * --- | ---
   * default | 0.75
   * range | [0, 1]*/
  decayTime?: number
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
   *  Whether the device is active or not. When is_active=false, audio signal bypasses the device.
   *
   *
   * key | value
   * --- | ---
   * default | true*/
  isActive?: boolean
  /**
   *  The 5 filters/delay lines of the Helmholtz.
   */
  filters?: HelmholtzFilterConstructor[] & { length: 5 }
}

/**
 *
 * key | value
 * --- | ---
 * type | object
 *
 *  One of the 5 filters/delay lines of the Helmholtz.
 *
 *
 * @category Device Fields*/
export type HelmholtzFilter = {
  /**
   *  Whether the filter is active or not. When is_active=false, the filter doesn't produce any sound.
   *
   *
   * key | value
   * --- | ---
   * default | false
   * is | {@link api.TargetType.AutomatableParameter}*/
  isActive: PrimitiveField<boolean, "mut">
  /**
   *  Gain applied to the signal after the filter. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  gain: PrimitiveField<number, "mut">
  /**
   *  Pans the signal to left/right. -1 is fully left, 0 is centered (unchanged), 1 is fully right.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  panning: PrimitiveField<number, "mut">
  /**
   *  The frequency this filter will resonate at. Is a midi note, e.g. C4 is 60, D4 is 62, etc.
   *
   *
   * key | value
   * --- | ---
   * default | 60
   * range | [0, 127]
   * is | {@link api.TargetType.AutomatableParameter}*/
  frequencyNote: PrimitiveField<number, "mut">
  /**
   *  Detune the filter frequency by a given amount of semitones, these are added
   *  to the frequency_note. You can detune the filter frequency by up
   *  to 7 semitones (a perfect fifth, the dominant) above or down to
   *  7 semitones below (a perfect fourth, the subdominant) the original note.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-7, 7]
   * is | {@link api.TargetType.AutomatableParameter}*/
  frequencyTuneSemitones: PrimitiveField<number, "mut">
}
/** @internal */

export type HelmholtzFilterConstructor = {
  /**
   *  Whether the filter is active or not. When is_active=false, the filter doesn't produce any sound.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  isActive?: boolean
  /**
   *  Gain applied to the signal after the filter. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]*/
  gain?: number
  /**
   *  Pans the signal to left/right. -1 is fully left, 0 is centered (unchanged), 1 is fully right.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]*/
  panning?: number
  /**
   *  The frequency this filter will resonate at. Is a midi note, e.g. C4 is 60, D4 is 62, etc.
   *
   *
   * key | value
   * --- | ---
   * default | 60
   * range | [0, 127]*/
  frequencyNote?: number
  /**
   *  Detune the filter frequency by a given amount of semitones, these are added
   *  to the frequency_note. You can detune the filter frequency by up
   *  to 7 semitones (a perfect fifth, the dominant) above or down to
   *  7 semitones below (a perfect fourth, the subdominant) the original note.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-7, 7]*/
  frequencyTuneSemitones?: number
}

