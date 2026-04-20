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
 * key | `"stompboxTube"`
 * is |
 *
 *
 *  The tube effect is a distortion effect that simulates the sound of a tube amp
 *  in the form of a stompbox.
 *
 *
 * @category Device Entities*/
export type StompboxTube = {
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
   *  Allows adjustment of the how much distortion is applied to the original signal.
   *
   *
   * key | value
   * --- | ---
   * default | 12
   * range | [0.10000000149011612, 12]
   * is | {@link api.TargetType.AutomatableParameter}*/
  drive: PrimitiveField<number, "mut">
  /**
   *  Acts as a hi-pass filter for the overtone spectrum.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-10, 10]
   * is | {@link api.TargetType.AutomatableParameter}*/
  tone: PrimitiveField<number, "mut">
  /**
   *  This device's output gain. Equivalent to a dB range of [-inf, 6.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 2]
   * is | {@link api.TargetType.AutomatableParameter}*/
  postGain: PrimitiveField<number, "mut">
  /**
   *  Whether the stompbox is active or not. When is_active=false, audio signal bypasses the device.
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

export type StompboxTubeConstructor = {
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
   *  Allows adjustment of the how much distortion is applied to the original signal.
   *
   *
   * key | value
   * --- | ---
   * default | 12
   * range | [0.10000000149011612, 12]*/
  drive?: number
  /**
   *  Acts as a hi-pass filter for the overtone spectrum.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-10, 10]*/
  tone?: number
  /**
   *  This device's output gain. Equivalent to a dB range of [-inf, 6.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 2]*/
  postGain?: number
  /**
   *  Whether the stompbox is active or not. When is_active=false, audio signal bypasses the device.
   *
   *
   * key | value
   * --- | ---
   * default | true*/
  isActive?: boolean
}

