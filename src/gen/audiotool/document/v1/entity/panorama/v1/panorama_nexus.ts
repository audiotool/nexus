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
 * key | `"panorama"`
 * is |
 *
 *
 *  The Panorama is a simple device that allows manipulation of the
 *  stereo signal. The left/right channel can be be independently
 *  moved to left/right, and their amplitudes can be independently adjusted.
 *
 *
 * @category Device Entities*/
export type Panorama = {
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
   *  Gain factor applied to the left channel. Can go negative, which reverses the phase of the signal.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  leftFactor: PrimitiveField<number, "mut">
  /**
   *  Gain factor applied to the right channel. Can go negative, which reverses the phase of the signal.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  rightFactor: PrimitiveField<number, "mut">
  /**
   *  Pans the left channel to left/right. -1 is fully left (unchanged), 0 is centered, 1 is fully right.
   *
   *
   * key | value
   * --- | ---
   * default | -1
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  leftPanning: PrimitiveField<number, "mut">
  /**
   *  Pans the right channel to left/right. -1 is fully left, 0 is centered, 1 is fully right (unchanged).
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  rightPanning: PrimitiveField<number, "mut">
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
  /**
   *  Whether the device is active or not. When is_active=false, the effect is bypassed.
   *
   *
   * key | value
   * --- | ---
   * default | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  isActive: PrimitiveField<boolean, "mut">
}
/** @internal */

export type PanoramaConstructor = {
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
   *  Gain factor applied to the left channel. Can go negative, which reverses the phase of the signal.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [-1, 1]*/
  leftFactor?: number
  /**
   *  Gain factor applied to the right channel. Can go negative, which reverses the phase of the signal.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [-1, 1]*/
  rightFactor?: number
  /**
   *  Pans the left channel to left/right. -1 is fully left (unchanged), 0 is centered, 1 is fully right.
   *
   *
   * key | value
   * --- | ---
   * default | -1
   * range | [-1, 1]*/
  leftPanning?: number
  /**
   *  Pans the right channel to left/right. -1 is fully left, 0 is centered, 1 is fully right (unchanged).
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [-1, 1]*/
  rightPanning?: number
  /**
   *  Whether the device is active or not. When is_active=false, the effect is bypassed.
   *
   *
   * key | value
   * --- | ---
   * default | true*/
  isActive?: boolean
}

