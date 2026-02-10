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
 * key | `"graphicalEQ"`
 * is |
 *
 *
 *  The GraphicalEQ is an equalizer with two parametric peak filters.
 *
 *  Each filter has a special parameter "panning" that results in the
 *  filter gain of the left channel to be the mirror of the right.
 *
 *
 * @category Device Entities*/
export type GraphicalEQ = {
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
   *  The first peak filter. In the DAW UI, parameters are shown to the left.
   */
  filter1: NexusObject<GraphicalEQFilter>
  /**
   *  The second peak filter. In the DAW UI, parameters are shown to the right.
   */
  filter2: NexusObject<GraphicalEQFilter>
  /**
   *  Controls the mix between the incoming and the effect signal. 0 ("dry") means 0% effect
   *  applied, 1 ("wet") means 100% effect applied; values between mixes the two linearly.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  mix: PrimitiveField<number, "mut">
  /**
   *  Gain applied to the signal after equalization.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-18, 18]
   * is | {@link api.TargetType.AutomatableParameter}*/
  gainDb: PrimitiveField<number, "mut">
  /**
   *  Audio input.
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioInput}*/
  audioInput: NexusObject<Empty>
  /**
   *  Audio output.
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

export type GraphicalEQConstructor = {
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
   *  The first peak filter. In the DAW UI, parameters are shown to the left.
   */
  filter1?: GraphicalEQFilterConstructor
  /**
   *  The second peak filter. In the DAW UI, parameters are shown to the right.
   */
  filter2?: GraphicalEQFilterConstructor
  /**
   *  Controls the mix between the incoming and the effect signal. 0 ("dry") means 0% effect
   *  applied, 1 ("wet") means 100% effect applied; values between mixes the two linearly.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]*/
  mix?: number
  /**
   *  Gain applied to the signal after equalization.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-18, 18]*/
  gainDb?: number
  /**
   *  Whether the device is active or not. When is_active=false, audio signal bypasses the device.
   *
   *
   * key | value
   * --- | ---
   * default | true*/
  isActive?: boolean
}

/**
 *
 * key | value
 * --- | ---
 * type | object
 *
 *  The graphical equalizer filter.
 *
 *
 * @category Device Fields*/
export type GraphicalEQFilter = {
  /**
   *  The gain of the filter in decibels.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-18, 18]
   * is | {@link api.TargetType.AutomatableParameter}*/
  gainDb: PrimitiveField<number, "mut">
  /**
   *  The filter peak frequency in hertz.
   *
   *
   * key | value
   * --- | ---
   * default | 3800
   * range | [32, 17000]
   * is | {@link api.TargetType.AutomatableParameter}*/
  frequencyHz: PrimitiveField<number, "mut">
  /**
   *  Filter Q factor, controls the bandwidth and resonance of the filter.
   *
   *
   * key | value
   * --- | ---
   * default | 0.07000000029802322
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  q: PrimitiveField<number, "mut">
  /**
   *  Stereo separation of the filter. If 0, both filter gains are equal.
   *  If 1, the left channel is fully boosted and the right channel is fully attenuated.
   *  If -1, the right channel is fully boosted and the left channel is fully attenuated.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  stereoSeparation: PrimitiveField<number, "mut">
}
/** @internal */

export type GraphicalEQFilterConstructor = {
  /**
   *  The gain of the filter in decibels.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-18, 18]*/
  gainDb?: number
  /**
   *  The filter peak frequency in hertz.
   *
   *
   * key | value
   * --- | ---
   * default | 3800
   * range | [32, 17000]*/
  frequencyHz?: number
  /**
   *  Filter Q factor, controls the bandwidth and resonance of the filter.
   *
   *
   * key | value
   * --- | ---
   * default | 0.07000000029802322
   * range | [0, 1]*/
  q?: number
  /**
   *  Stereo separation of the filter. If 0, both filter gains are equal.
   *  If 1, the left channel is fully boosted and the right channel is fully attenuated.
   *  If -1, the right channel is fully boosted and the left channel is fully attenuated.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]*/
  stereoSeparation?: number
}

