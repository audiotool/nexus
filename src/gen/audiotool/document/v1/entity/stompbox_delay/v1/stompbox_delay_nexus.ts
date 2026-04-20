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
 * key | `"stompboxDelay"`
 * is |
 *
 *
 *  A simple delay effect in the form of a stompbox.
 *
 *  The effective delay time is step_count*step_length.
 *
 *
 * @category Device Entities*/
export type StompboxDelay = {
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
   *  Count of delay steps.
   *
   *
   * key | value
   * --- | ---
   * default | 3
   * range | [1, 7]
   * is | {@link api.TargetType.AutomatableParameter}*/
  stepCount: PrimitiveField<number, "mut">
  /**
   *  Selects the length of each delay step as bar time.
   *  - 0: invalid
   *  - 1: 1/16 bars
   *  - 2: 1/8T bars
   *  - 3: 1/8  bars
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 3]
   * is | {@link api.TargetType.AutomatableParameter}*/
  stepLengthIndex: PrimitiveField<number, "mut">
  /**
   *  How much of the original signal is fed back into the delay line.
   *
   *
   * key | value
   * --- | ---
   * default | 0.4000000059604645
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  feedbackFactor: PrimitiveField<number, "mut">
  /**
   *  Controls the mix between the incoming and the effect signal. 0 ("dry") means 0% effect
   *  applied, 1 ("wet") means 100% effect applied; values between mixes the two linearly.
   *
   *
   * key | value
   * --- | ---
   * default | 0.20000000298023224
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  mix: PrimitiveField<number, "mut">
  /**
   *  Whether the stompbox is active or not. When is_active=false, audio signal bypasses the device
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

export type StompboxDelayConstructor = {
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
   *  Count of delay steps.
   *
   *
   * key | value
   * --- | ---
   * default | 3
   * range | [1, 7]*/
  stepCount?: number
  /**
   *  Selects the length of each delay step as bar time.
   *  - 0: invalid
   *  - 1: 1/16 bars
   *  - 2: 1/8T bars
   *  - 3: 1/8  bars
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 3]*/
  stepLengthIndex?: number
  /**
   *  How much of the original signal is fed back into the delay line.
   *
   *
   * key | value
   * --- | ---
   * default | 0.4000000059604645
   * range | [0, 1]*/
  feedbackFactor?: number
  /**
   *  Controls the mix between the incoming and the effect signal. 0 ("dry") means 0% effect
   *  applied, 1 ("wet") means 100% effect applied; values between mixes the two linearly.
   *
   *
   * key | value
   * --- | ---
   * default | 0.20000000298023224
   * range | [0, 1]*/
  mix?: number
  /**
   *  Whether the stompbox is active or not. When is_active=false, audio signal bypasses the device
   *
   *
   * key | value
   * --- | ---
   * default | true*/
  isActive?: boolean
}

