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
 * key | `"stereoEnhancer"`
 * is |
 *
 *
 *  The StereoEnhancer widens or narrows the stereo width of a sound above
 *  a specified frequency.
 *
 *
 * @category Device Entities*/
export type StereoEnhancer = {
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
   *  If this is true, the delay is applied to the right channel.
   *
   *
   * key | value
   * --- | ---
   * default | false
   * is | {@link api.TargetType.AutomatableParameter}*/
  channelsAreInverted: PrimitiveField<boolean, "mut">
  /**
   *  Specifies the cut-off frequency above which the stereo processing will begin.
   *
   *
   * key | value
   * --- | ---
   * default | 11000
   * range | [32.70000076293945, 16744.0390625]
   * is | {@link api.TargetType.AutomatableParameter}*/
  frequencyHz: PrimitiveField<number, "mut">
  /**
   *  The stereo width of the signal above the cutoff frequency:
   *  - -1 means the signal is mixed to mono
   *  - 0  means unchanged
   *  - 1  means maximum width
   *
   *
   * key | value
   * --- | ---
   * default | 0.25
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  stereoWidth: PrimitiveField<number, "mut">
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
   *  Whether the device is active or not. When is_active=false, audio signal bypasses the device.
   *
   *
   * key | value
   * --- | ---
   * default | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  isActive: PrimitiveField<boolean, "mut">
}
/** @internal */

export type StereoEnhancerConstructor = {
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
   *  If this is true, the delay is applied to the right channel.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  channelsAreInverted?: boolean
  /**
   *  Specifies the cut-off frequency above which the stereo processing will begin.
   *
   *
   * key | value
   * --- | ---
   * default | 11000
   * range | [32.70000076293945, 16744.0390625]*/
  frequencyHz?: number
  /**
   *  The stereo width of the signal above the cutoff frequency:
   *  - -1 means the signal is mixed to mono
   *  - 0  means unchanged
   *  - 1  means maximum width
   *
   *
   * key | value
   * --- | ---
   * default | 0.25
   * range | [-1, 1]*/
  stereoWidth?: number
  /**
   *  Whether the device is active or not. When is_active=false, audio signal bypasses the device.
   *
   *
   * key | value
   * --- | ---
   * default | true*/
  isActive?: boolean
}

