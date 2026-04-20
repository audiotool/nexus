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
 * key | `"gravity"`
 * is |
 *
 *
 *  The gravity is your off the shelf compressor.
 *
 *  The compressor "compresses" the louder portions of a signal to lower levels.
 *  It has an envelope configuring the compressor curve which is triggered
 *  when the signal gain average over a configurable rms window size exceeds
 *  a certain threshold.
 *
 *
 * @category Device Entities*/
export type Gravity = {
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
   *  The level in dB on which the device starts compressing.
   *
   *
   * key | value
   * --- | ---
   * default | -10
   * range | [-40, 0]
   * is | {@link api.TargetType.AutomatableParameter}*/
  thresholdDb: PrimitiveField<number, "mut">
  /**
   *  The strength of the compressor
   *
   *
   * key | value
   * --- | ---
   * default | 4
   * range | [1, 50]
   * is | {@link api.TargetType.AutomatableParameter}*/
  ratio: PrimitiveField<number, "mut">
  /**
   *  The width of the knee in decibels. A wider knee is a more rounded compression curve.
   *
   *
   * key | value
   * --- | ---
   * default | 3
   * range | [0, 24]
   * is | {@link api.TargetType.AutomatableParameter}*/
  kneeDbRange: PrimitiveField<number, "mut">
  /**
   *  Makeup gain apllied to the signal after compression.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-24, 24]
   * is | {@link api.TargetType.AutomatableParameter}*/
  makeupGainDb: PrimitiveField<number, "mut">
  /**
   *  The attack time in milliseconds. Controls how quickly compression kicks in.
   *
   *
   * key | value
   * --- | ---
   * default | 5
   * range | [0, 1000]
   * is | {@link api.TargetType.AutomatableParameter}*/
  attackMs: PrimitiveField<number, "mut">
  /**
   *  Whether the release_time_normalized is synchronized with the tempo.
   *
   *
   * key | value
   * --- | ---
   * default | false
   * is | {@link api.TargetType.AutomatableParameter}*/
  releaseIsSynced: PrimitiveField<boolean, "mut">
  /**
   *  The time for the compressor to release when the input level is dropping below the threshold.
   *
   *  The meaning of the value depends on the release_is_synced flag:
   *  - if release_is_synced is false, the value maps to milliseconds (0.0 .. 1_000.0) with formula:
   *        millis = 1000.0 * value^4.3219281
   *  - if release_is_synced is true, then the value is quantized to one of 30 bar time durations.
   *    The bar time durations are:
   *    0, 1/256, 1/192, 1/128, 1/96, 1/64, 1/48, 1/32, 1/24, 1/16, 1/12, 1/8, 1/6,
   *    3/16, 1/4, 5/16, 1/3, 3/8, 7/16, 1/2, 9/16, 7/12, 5/8, 2/3, 3/4, 5/6, 7/8, 1/1.
   *
   *
   * key | value
   * --- | ---
   * default | 0.5
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  releaseTimeNormalized: PrimitiveField<number, "mut">
  /**
   *  Allows adjustment of the duration of the window during which the signal peak
   *  is detected that triggers the compressor, in milliseconds. If this is 0,
   *  the compressor will trigger on the first peak sample.
   *
   *
   * key | value
   * --- | ---
   * default | 5
   * range | [0, 30]
   * is | {@link api.TargetType.AutomatableParameter}*/
  rmsWindowMs: PrimitiveField<number, "mut">
  /**
   *  Whether the device is active or not. When is_active=false, audio signal bypasses the device.
   *
   *
   * key | value
   * --- | ---
   * default | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  isActive: PrimitiveField<boolean, "mut">
  /**
   *  Single Output
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioOutput}*/
  audioOutput: NexusObject<Empty>
  /**
   *  Single Input
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioInput}*/
  audioInput: NexusObject<Empty>
  /**
   *  Side Chain Input
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioInput}*/
  sideChainInput: NexusObject<Empty>
}
/** @internal */

export type GravityConstructor = {
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
   *  The level in dB on which the device starts compressing.
   *
   *
   * key | value
   * --- | ---
   * default | -10
   * range | [-40, 0]*/
  thresholdDb?: number
  /**
   *  The strength of the compressor
   *
   *
   * key | value
   * --- | ---
   * default | 4
   * range | [1, 50]*/
  ratio?: number
  /**
   *  The width of the knee in decibels. A wider knee is a more rounded compression curve.
   *
   *
   * key | value
   * --- | ---
   * default | 3
   * range | [0, 24]*/
  kneeDbRange?: number
  /**
   *  Makeup gain apllied to the signal after compression.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-24, 24]*/
  makeupGainDb?: number
  /**
   *  The attack time in milliseconds. Controls how quickly compression kicks in.
   *
   *
   * key | value
   * --- | ---
   * default | 5
   * range | [0, 1000]*/
  attackMs?: number
  /**
   *  Whether the release_time_normalized is synchronized with the tempo.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  releaseIsSynced?: boolean
  /**
   *  The time for the compressor to release when the input level is dropping below the threshold.
   *
   *  The meaning of the value depends on the release_is_synced flag:
   *  - if release_is_synced is false, the value maps to milliseconds (0.0 .. 1_000.0) with formula:
   *        millis = 1000.0 * value^4.3219281
   *  - if release_is_synced is true, then the value is quantized to one of 30 bar time durations.
   *    The bar time durations are:
   *    0, 1/256, 1/192, 1/128, 1/96, 1/64, 1/48, 1/32, 1/24, 1/16, 1/12, 1/8, 1/6,
   *    3/16, 1/4, 5/16, 1/3, 3/8, 7/16, 1/2, 9/16, 7/12, 5/8, 2/3, 3/4, 5/6, 7/8, 1/1.
   *
   *
   * key | value
   * --- | ---
   * default | 0.5
   * range | [0, 1]*/
  releaseTimeNormalized?: number
  /**
   *  Allows adjustment of the duration of the window during which the signal peak
   *  is detected that triggers the compressor, in milliseconds. If this is 0,
   *  the compressor will trigger on the first peak sample.
   *
   *
   * key | value
   * --- | ---
   * default | 5
   * range | [0, 30]*/
  rmsWindowMs?: number
  /**
   *  Whether the device is active or not. When is_active=false, audio signal bypasses the device.
   *
   *
   * key | value
   * --- | ---
   * default | true*/
  isActive?: boolean
}

