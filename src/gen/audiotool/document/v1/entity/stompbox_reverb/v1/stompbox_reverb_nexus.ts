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
 * key | `"stompboxReverb"`
 * is |
 *
 *
 *  A reverb effect in the form of a stompbox.
 *
 *  Simulates a signal bouncing around in a closed space.
 *
 *
 * @category Device Entities*/
export type StompboxReverb = {
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
   *  Determines the size of the virtual enclosed space.
   *
   *
   * key | value
   * --- | ---
   * default | 0.800000011920929
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  roomSizeFactor: PrimitiveField<number, "mut">
  /**
   *  Determines the length of time it takes for the echo to come back. (The length of the gap between the echos).
   *
   *
   * key | value
   * --- | ---
   * default | 160
   * range | [8, 500]
   * is | {@link api.TargetType.AutomatableParameter}*/
  preDelayTimeMs: PrimitiveField<number, "mut">
  /**
   *  Allows adjustment of how much of the processed signal is fed back into the effect.
   *
   *
   * key | value
   * --- | ---
   * default | 0.6669999957084656
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  feedbackFactor: PrimitiveField<number, "mut">
  /**
   *  Control over the level of the devices low-pass filter. Low frequencies are passed while high frequencies are filtered out.
   *
   *
   * key | value
   * --- | ---
   * default | 0.10000000149011612
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  dampFactor: PrimitiveField<number, "mut">
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

export type StompboxReverbConstructor = {
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
   *  Determines the size of the virtual enclosed space.
   *
   *
   * key | value
   * --- | ---
   * default | 0.800000011920929
   * range | [0, 1]*/
  roomSizeFactor?: number
  /**
   *  Determines the length of time it takes for the echo to come back. (The length of the gap between the echos).
   *
   *
   * key | value
   * --- | ---
   * default | 160
   * range | [8, 500]*/
  preDelayTimeMs?: number
  /**
   *  Allows adjustment of how much of the processed signal is fed back into the effect.
   *
   *
   * key | value
   * --- | ---
   * default | 0.6669999957084656
   * range | [0, 1]*/
  feedbackFactor?: number
  /**
   *  Control over the level of the devices low-pass filter. Low frequencies are passed while high frequencies are filtered out.
   *
   *
   * key | value
   * --- | ---
   * default | 0.10000000149011612
   * range | [0, 1]*/
  dampFactor?: number
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

