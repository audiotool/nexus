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
 * key | `"stompboxParametricEqualizer"`
 * is |
 *
 *
 *  A parametric equalizer in the form of a stompbox.
 *
 *
 * @category Device Entities*/
export type StompboxParametricEqualizer = {
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
   *  The center frequency of the range being EQ'd.
   *
   *
   * key | value
   * --- | ---
   * default | 3600
   * range | [31, 12000]
   * is | {@link api.TargetType.AutomatableParameter}*/
  frequencyHz: PrimitiveField<number, "mut">
  /**
   *  The width of the affected frequency range.
   *
   *
   * key | value
   * --- | ---
   * default | 0.15000000596046448
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  bandwidthFactor: PrimitiveField<number, "mut">
  /**
   *  Gain applied to the frequency range in dB.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-12, 12]
   * is | {@link api.TargetType.AutomatableParameter}*/
  postGainDb: PrimitiveField<number, "mut">
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

export type StompboxParametricEqualizerConstructor = {
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
   *  The center frequency of the range being EQ'd.
   *
   *
   * key | value
   * --- | ---
   * default | 3600
   * range | [31, 12000]*/
  frequencyHz?: number
  /**
   *  The width of the affected frequency range.
   *
   *
   * key | value
   * --- | ---
   * default | 0.15000000596046448
   * range | [0, 1]*/
  bandwidthFactor?: number
  /**
   *  Gain applied to the frequency range in dB.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-12, 12]*/
  postGainDb?: number
  /**
   *  Whether the stompbox is active or not. When is_active=false, audio signal bypasses the device.
   *
   *
   * key | value
   * --- | ---
   * default | true*/
  isActive?: boolean
}

