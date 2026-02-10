// THIS FILE IS GENERATED - DO NOT EDIT
// Copyright 2025 Audiotool Inc.

import { PrimitiveField } from "@document/fields"
import { NexusObject } from "@document/object"
import { type Empty } from "@gen/document/v1/empty_nexus"

/**
 *
 * key | value
 * --- | ---
 * type | entity
 * key | `"pulsar"`
 * is |
 *
 *
 *  The Pulsar delay is an advanced delay effect.
 *
 *  The pre-delay allows adjusting the delay time for the left and right channel independently,
 *  and further allows panning the left/right channel for the pre-delay independently.
 *
 *  The main delay controls allow applying a filter, setting sync and unsynced delay times, and applying
 *  a LFO to modulate the delay amount continuously.
 *
 *
 * @category Device Entities*/
export type Pulsar = {
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
   *  Semibreve (music time) duration of the pre-delay of the left channel.
   *  Is added with the milliseconds delay time internally to calculate the actual pre-delay time.
   *  - 0: invalid
   *  - 1:  0    semibreve
   *  - 2:  1/16 semibreve
   *  - 3:  1/12 semibreve
   *  - 4:  1/8  semibreve
   *  - 5:  1/6  semibreve
   *  - 6:  3/16 semibreve
   *  - 7:  1/4  semibreve
   *  - 8:  5/16 semibreve
   *  - 9:  1/3  semibreve
   *  - 10:  3/8  semibreve
   *  - 11: 7/16 semibreve
   *  - 12: 1/2  semibreve
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 12]
   * is | {@link api.TargetType.AutomatableParameter}*/
  preDelayLeftTimeSemibreveIndex: PrimitiveField<number, "mut">
  /**
   *  Milliseconds duration of the pre-delay of the left channel. Added to pre_delay_left_time_semibreve internally.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 500]
   * is | {@link api.TargetType.AutomatableParameter}*/
  preDelayLeftTimeMs: PrimitiveField<number, "mut">
  /**
   *  Panning of the left channel of the pre-delay. This value controls the panning of the delayed signal.
   *  -1 is fully left (unchanged), 0 is centered, 1 is fully right.
   *
   *
   * key | value
   * --- | ---
   * default | -1
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  preDelayLeftPanning: PrimitiveField<number, "mut">
  /**
   *  Semibreve (music time) duration of the pre-delay of the right channel.
   *  Is added with the milliseconds delay time internally to calculate the actual pre-delay time.
   *  - 0: invalid
   *  - 1:  0/1  semibreve
   *  - 2:  1/16 semibreve
   *  - 3:  1/12 semibreve
   *  - 4:  1/8  semibreve
   *  - 5:  1/6  semibreve
   *  - 6:  3/16 semibreve
   *  - 7:  1/4  semibreve
   *  - 8:  5/16 semibreve
   *  - 9:  1/3  semibreve
   *  - 10: 3/8  semibreve
   *  - 11: 7/16 semibreve
   *  - 12: 1/2  semibreve
   *
   *
   * key | value
   * --- | ---
   * default | 3
   * range | [1, 12]
   * is | {@link api.TargetType.AutomatableParameter}*/
  preDelayRightTimeSemibreveIndex: PrimitiveField<number, "mut">
  /**
   *  Milliseconds duration of the pre-delay of the right channel. Added to pre_delay_right_time_semibreve internally.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 500]
   * is | {@link api.TargetType.AutomatableParameter}*/
  preDelayRightTimeMs: PrimitiveField<number, "mut">
  /**
   *  Panning of the right channel of the pre-delay. This value controls the panning of the delayed signal.
   *  -1 is fully left, 0 is centered, 1 is fully right (unchanged).
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  preDelayRightPanning: PrimitiveField<number, "mut">
  /**
   *  Semibreve (music time) duration of the main delay feedback.
   *  Is added with the milliseconds delay time internally to calculate the actual interval time
   *  - 0: invalid
   *  - 1:  0    semibreve
   *  - 2:  1/16 semibreve
   *  - 3:  1/12 semibreve
   *  - 4:  1/8  semibreve
   *  - 5:  1/6  semibreve
   *  - 6:  3/16 semibreve
   *  - 7:  1/4  semibreve
   *  - 8:  5/16 semibreve
   *  - 9:  1/3  semibreve
   *  - 10:  3/8  semibreve
   *  - 11: 7/16 semibreve
   *  - 12: 1/2  semibreve
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 12]
   * is | {@link api.TargetType.AutomatableParameter}*/
  feedbackDelayTimeSemibreveIndex: PrimitiveField<number, "mut">
  /**
   *  Milliseconds duration of the main delay feedback. Added to feedback_delay_time_semibreve internally.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 500]
   * is | {@link api.TargetType.AutomatableParameter}*/
  feedbackDelayTimeMs: PrimitiveField<number, "mut">
  /**
   *  The delay-time modulating LFO's speed in Hz.
   *
   *
   * key | value
   * --- | ---
   * default | 5
   * range | [0.10000000149011612, 25]
   * is | {@link api.TargetType.AutomatableParameter}*/
  lfoSpeedHz: PrimitiveField<number, "mut">
  /**
   *  The delay-time modulating LFO's depth in milliseconds.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 50]
   * is | {@link api.TargetType.AutomatableParameter}*/
  lfoModulationDepthMs: PrimitiveField<number, "mut">
  /**
   *  The feedback factor of the main delay.
   *
   *
   * key | value
   * --- | ---
   * default | 0.699999988079071
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  feedbackFactor: PrimitiveField<number, "mut">
  /**
   *  This controls to what extend the signal swaps left/right channel on every feedback cycle:
   *  1: fully swapped,
   *  0.5: turned into mono
   *  0: unmodified
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  stereoCrossFactor: PrimitiveField<number, "mut">
  /**
   *  The min frequency cutoff for the highpass filter applied to the feedback signal.
   *
   *
   * key | value
   * --- | ---
   * default | 20
   * range | [20, 20000]
   * is | {@link api.TargetType.AutomatableParameter}*/
  filterMinHz: PrimitiveField<number, "mut">
  /**
   *  The max frequency cutoff for the lowpass filter applied to the feedback signal.
   *
   *
   * key | value
   * --- | ---
   * default | 20000
   * range | [20, 20000]
   * is | {@link api.TargetType.AutomatableParameter}*/
  filterMaxHz: PrimitiveField<number, "mut">
  /**
   *  The gain applied to the (unprocessed) incoming signal that's added to the output mix. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  dryGain: PrimitiveField<number, "mut">
  /**
   *  The gain applied to the (processed) delayed signal that's added to the output mix. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 0.699999988079071
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  wetGain: PrimitiveField<number, "mut">
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

export type PulsarConstructor = {
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
   *  Semibreve (music time) duration of the pre-delay of the left channel.
   *  Is added with the milliseconds delay time internally to calculate the actual pre-delay time.
   *  - 0: invalid
   *  - 1:  0    semibreve
   *  - 2:  1/16 semibreve
   *  - 3:  1/12 semibreve
   *  - 4:  1/8  semibreve
   *  - 5:  1/6  semibreve
   *  - 6:  3/16 semibreve
   *  - 7:  1/4  semibreve
   *  - 8:  5/16 semibreve
   *  - 9:  1/3  semibreve
   *  - 10:  3/8  semibreve
   *  - 11: 7/16 semibreve
   *  - 12: 1/2  semibreve
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 12]*/
  preDelayLeftTimeSemibreveIndex?: number
  /**
   *  Milliseconds duration of the pre-delay of the left channel. Added to pre_delay_left_time_semibreve internally.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 500]*/
  preDelayLeftTimeMs?: number
  /**
   *  Panning of the left channel of the pre-delay. This value controls the panning of the delayed signal.
   *  -1 is fully left (unchanged), 0 is centered, 1 is fully right.
   *
   *
   * key | value
   * --- | ---
   * default | -1
   * range | [-1, 1]*/
  preDelayLeftPanning?: number
  /**
   *  Semibreve (music time) duration of the pre-delay of the right channel.
   *  Is added with the milliseconds delay time internally to calculate the actual pre-delay time.
   *  - 0: invalid
   *  - 1:  0/1  semibreve
   *  - 2:  1/16 semibreve
   *  - 3:  1/12 semibreve
   *  - 4:  1/8  semibreve
   *  - 5:  1/6  semibreve
   *  - 6:  3/16 semibreve
   *  - 7:  1/4  semibreve
   *  - 8:  5/16 semibreve
   *  - 9:  1/3  semibreve
   *  - 10: 3/8  semibreve
   *  - 11: 7/16 semibreve
   *  - 12: 1/2  semibreve
   *
   *
   * key | value
   * --- | ---
   * default | 3
   * range | [1, 12]*/
  preDelayRightTimeSemibreveIndex?: number
  /**
   *  Milliseconds duration of the pre-delay of the right channel. Added to pre_delay_right_time_semibreve internally.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 500]*/
  preDelayRightTimeMs?: number
  /**
   *  Panning of the right channel of the pre-delay. This value controls the panning of the delayed signal.
   *  -1 is fully left, 0 is centered, 1 is fully right (unchanged).
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [-1, 1]*/
  preDelayRightPanning?: number
  /**
   *  Semibreve (music time) duration of the main delay feedback.
   *  Is added with the milliseconds delay time internally to calculate the actual interval time
   *  - 0: invalid
   *  - 1:  0    semibreve
   *  - 2:  1/16 semibreve
   *  - 3:  1/12 semibreve
   *  - 4:  1/8  semibreve
   *  - 5:  1/6  semibreve
   *  - 6:  3/16 semibreve
   *  - 7:  1/4  semibreve
   *  - 8:  5/16 semibreve
   *  - 9:  1/3  semibreve
   *  - 10:  3/8  semibreve
   *  - 11: 7/16 semibreve
   *  - 12: 1/2  semibreve
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 12]*/
  feedbackDelayTimeSemibreveIndex?: number
  /**
   *  Milliseconds duration of the main delay feedback. Added to feedback_delay_time_semibreve internally.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 500]*/
  feedbackDelayTimeMs?: number
  /**
   *  The delay-time modulating LFO's speed in Hz.
   *
   *
   * key | value
   * --- | ---
   * default | 5
   * range | [0.10000000149011612, 25]*/
  lfoSpeedHz?: number
  /**
   *  The delay-time modulating LFO's depth in milliseconds.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 50]*/
  lfoModulationDepthMs?: number
  /**
   *  The feedback factor of the main delay.
   *
   *
   * key | value
   * --- | ---
   * default | 0.699999988079071
   * range | [0, 1]*/
  feedbackFactor?: number
  /**
   *  This controls to what extend the signal swaps left/right channel on every feedback cycle:
   *  1: fully swapped,
   *  0.5: turned into mono
   *  0: unmodified
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]*/
  stereoCrossFactor?: number
  /**
   *  The min frequency cutoff for the highpass filter applied to the feedback signal.
   *
   *
   * key | value
   * --- | ---
   * default | 20
   * range | [20, 20000]*/
  filterMinHz?: number
  /**
   *  The max frequency cutoff for the lowpass filter applied to the feedback signal.
   *
   *
   * key | value
   * --- | ---
   * default | 20000
   * range | [20, 20000]*/
  filterMaxHz?: number
  /**
   *  The gain applied to the (unprocessed) incoming signal that's added to the output mix. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]*/
  dryGain?: number
  /**
   *  The gain applied to the (processed) delayed signal that's added to the output mix. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 0.699999988079071
   * range | [0, 1]*/
  wetGain?: number
  /**
   *  Whether the device is active or not. When is_active=false, audio signal bypasses the device.
   *
   *
   * key | value
   * --- | ---
   * default | true*/
  isActive?: boolean
}

