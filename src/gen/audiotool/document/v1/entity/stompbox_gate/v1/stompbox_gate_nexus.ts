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
 * key | `"stompboxGate"`
 * is |
 *
 *
 *  A gate effect in the form of a stompbox.s
 *
 *
 * @category Device Entities*/
export type StompboxGate = {
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
   *  Sets the amount of time for the Gate to change from open to closed, can give the effect of the sound fading in.
   *
   *
   * key | value
   * --- | ---
   * default | 10
   * range | [1, 100]
   * is | {@link api.TargetType.AutomatableParameter}*/
  attackMs: PrimitiveField<number, "mut">
  /**
   *  Sets the amount of time the Gate takes to go from closed to open.
   *  A fast release will abruptly cut of the sound once it has fallen below the given threshold,
   *  a slower release will smoothly change from closed to open much like a slow fade out.
   *
   *
   * key | value
   * --- | ---
   * default | 50
   * range | [10, 600]
   * is | {@link api.TargetType.AutomatableParameter}*/
  releaseMs: PrimitiveField<number, "mut">
  /**
   *  Gain applied to the signal after the effect. Equivalent to a dB range of [-inf, 9.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 2.818382978439331]
   * is | {@link api.TargetType.AutomatableParameter}*/
  postGain: PrimitiveField<number, "mut">
  /**
   *  Selects the gate mode whether it is inverse or not.
   *  By default, the gate effect is off and can be triggered to turn on.
   *  If inverted, the gate is on (the signal off) by default and can be triggered to turn off.
   *
   *
   * key | value
   * --- | ---
   * default | false
   * is | {@link api.TargetType.AutomatableParameter}*/
  isInverted: PrimitiveField<boolean, "mut">
  /**
   *  Allows definition of the amount of time the Gate will stay open after the signal falls below the given threshold.
   *
   *
   * key | value
   * --- | ---
   * default | 100
   * range | [0.009999999776482582, 2000]
   * is | {@link api.TargetType.AutomatableParameter}*/
  holdMs: PrimitiveField<number, "mut">
  /**
   *  Threshold of the gate, any signals with gain levels below the the threshold will be muted.
   *
   *
   * key | value
   * --- | ---
   * default | 0.6665999889373779
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  thresholdGain: PrimitiveField<number, "mut">
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
   *  Primary Input.
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioInput}*/
  audioInput: NexusObject<Empty>
  /**
   *  Side Chain Input.
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioInput}*/
  sideChainInput: NexusObject<Empty>
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

export type StompboxGateConstructor = {
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
   *  Sets the amount of time for the Gate to change from open to closed, can give the effect of the sound fading in.
   *
   *
   * key | value
   * --- | ---
   * default | 10
   * range | [1, 100]*/
  attackMs?: number
  /**
   *  Sets the amount of time the Gate takes to go from closed to open.
   *  A fast release will abruptly cut of the sound once it has fallen below the given threshold,
   *  a slower release will smoothly change from closed to open much like a slow fade out.
   *
   *
   * key | value
   * --- | ---
   * default | 50
   * range | [10, 600]*/
  releaseMs?: number
  /**
   *  Gain applied to the signal after the effect. Equivalent to a dB range of [-inf, 9.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 2.818382978439331]*/
  postGain?: number
  /**
   *  Selects the gate mode whether it is inverse or not.
   *  By default, the gate effect is off and can be triggered to turn on.
   *  If inverted, the gate is on (the signal off) by default and can be triggered to turn off.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  isInverted?: boolean
  /**
   *  Allows definition of the amount of time the Gate will stay open after the signal falls below the given threshold.
   *
   *
   * key | value
   * --- | ---
   * default | 100
   * range | [0.009999999776482582, 2000]*/
  holdMs?: number
  /**
   *  Threshold of the gate, any signals with gain levels below the the threshold will be muted.
   *
   *
   * key | value
   * --- | ---
   * default | 0.6665999889373779
   * range | [0, 1]*/
  thresholdGain?: number
  /**
   *  Whether the stompbox is active or not. When is_active=false, audio signal bypasses the device
   *
   *
   * key | value
   * --- | ---
   * default | true*/
  isActive?: boolean
}

