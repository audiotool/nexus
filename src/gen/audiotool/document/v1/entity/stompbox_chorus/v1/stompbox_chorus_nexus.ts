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
 * key | `"stompboxChorus"`
 * is |
 *
 *
 *  A chorus effect in the form of a stompbox.
 *
 *
 * @category Device Entities*/
export type StompboxChorus = {
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
   *  Allows control of the Chorus' short delay. Higher values results in a more
   *  noticeable chorus effect.
   *
   *
   * key | value
   * --- | ---
   * default | 20
   * range | [20, 40]
   * is | {@link api.TargetType.AutomatableParameter}*/
  delayTimeMs: PrimitiveField<number, "mut">
  /**
   *  Controls the amount of the signal that is fed back into the effect after
   *  the delay line. A higher value means the chorus sounds longer.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  feedbackFactor: PrimitiveField<number, "mut">
  /**
   *  Allows adjustment of the speed of the chorus effect in hertz.
   *
   *
   * key | value
   * --- | ---
   * default | 0.33329999446868896
   * range | [0.10000000149011612, 5]
   * is | {@link api.TargetType.AutomatableParameter}*/
  lfoFrequencyHz: PrimitiveField<number, "mut">
  /**
   *  The amount the LFO influences the delay_time_ms parameter.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  lfoModulationDepth: PrimitiveField<number, "mut">
  /**
   *  Allows adjustment of the perceived width of the of effect.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  spreadFactor: PrimitiveField<number, "mut">
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

export type StompboxChorusConstructor = {
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
   *  Allows control of the Chorus' short delay. Higher values results in a more
   *  noticeable chorus effect.
   *
   *
   * key | value
   * --- | ---
   * default | 20
   * range | [20, 40]*/
  delayTimeMs?: number
  /**
   *  Controls the amount of the signal that is fed back into the effect after
   *  the delay line. A higher value means the chorus sounds longer.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  feedbackFactor?: number
  /**
   *  Allows adjustment of the speed of the chorus effect in hertz.
   *
   *
   * key | value
   * --- | ---
   * default | 0.33329999446868896
   * range | [0.10000000149011612, 5]*/
  lfoFrequencyHz?: number
  /**
   *  The amount the LFO influences the delay_time_ms parameter.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]*/
  lfoModulationDepth?: number
  /**
   *  Allows adjustment of the perceived width of the of effect.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  spreadFactor?: number
  /**
   *  Whether the stompbox is active or not. When is_active=false, audio signal bypasses the device
   *
   *
   * key | value
   * --- | ---
   * default | true*/
  isActive?: boolean
}

