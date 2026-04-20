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
 * key | `"stompboxCrusher"`
 * is |
 *
 *
 *  A bitcrusher in the form of a stompbox.
 *
 *
 * @category Device Entities*/
export type StompboxCrusher = {
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
   *  Allows for adjustment of the volume of the signal before it is processed.
   *  Equivalent to a dB range of [-inf, 27.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 22.387210845947266]
   * is | {@link api.TargetType.AutomatableParameter}*/
  preGain: PrimitiveField<number, "mut">
  /**
   *  How much the signal is downsampled - higher values result in more noisy output.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  downsamplingFactor: PrimitiveField<number, "mut">
  /**
   *  Allows control over the volume of the signal once it has been processed.
   *  Gain factors, equivalent to a dB range of [-inf, 9.0]. Default is unit gain.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 2.818382978439331]
   * is | {@link api.TargetType.AutomatableParameter}*/
  postGain: PrimitiveField<number, "mut">
  /**
   *  Bit depth of the signal. Lower bit depth results in more distortion.
   *
   *
   * key | value
   * --- | ---
   * default | 8
   * range | [1, 24]
   * is | {@link api.TargetType.AutomatableParameter}*/
  bits: PrimitiveField<number, "mut">
  /**
   *  Controls how much of the processed signal is mixed with the original, unprocessed signal.
   *  0 = 100% dry signal, 1 = 100% wet signal
   *
   *
   * key | value
   * --- | ---
   * default | 1
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

export type StompboxCrusherConstructor = {
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
   *  Allows for adjustment of the volume of the signal before it is processed.
   *  Equivalent to a dB range of [-inf, 27.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 22.387210845947266]*/
  preGain?: number
  /**
   *  How much the signal is downsampled - higher values result in more noisy output.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  downsamplingFactor?: number
  /**
   *  Allows control over the volume of the signal once it has been processed.
   *  Gain factors, equivalent to a dB range of [-inf, 9.0]. Default is unit gain.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 2.818382978439331]*/
  postGain?: number
  /**
   *  Bit depth of the signal. Lower bit depth results in more distortion.
   *
   *
   * key | value
   * --- | ---
   * default | 8
   * range | [1, 24]*/
  bits?: number
  /**
   *  Controls how much of the processed signal is mixed with the original, unprocessed signal.
   *  0 = 100% dry signal, 1 = 100% wet signal
   *
   *
   * key | value
   * --- | ---
   * default | 1
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

