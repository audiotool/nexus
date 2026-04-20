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
 * key | `"bandSplitter"`
 * is |
 *
 *
 *  The band splitter splits the audio signal into three non-overlapping
 *  frequency sub-bands.
 *
 *
 * @category Device Entities*/
export type BandSplitter = {
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
   *  Frequency where the low band stops, and the middle band starts.
   *
   *
   * key | value
   * --- | ---
   * default | 360
   * range | [20, 20000]
   * is | {@link api.TargetType.AutomatableParameter}*/
  filterLowHz: PrimitiveField<number, "mut">
  /**
   *  Frequency where the middle band stops, and the high band starts.
   *
   *
   * key | value
   * --- | ---
   * default | 3600
   * range | [20, 20000]
   * is | {@link api.TargetType.AutomatableParameter}*/
  filterHighHz: PrimitiveField<number, "mut">
  /**
   *  Gain multiplier applied to the high frequency band output.
   *  Equivalent to a dB range of [-inf, 18.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 7.943282127380371]
   * is | {@link api.TargetType.AutomatableParameter}*/
  highGain: PrimitiveField<number, "mut">
  /**
   *  Single Output.
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioOutput}*/
  highAudioOutput: NexusObject<Empty>
  /**
   *  Gain multiplier applied to the mid frequency band output.
   *  Equivalent to a dB range of [-inf, 18.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 7.943282127380371]
   * is | {@link api.TargetType.AutomatableParameter}*/
  midGain: PrimitiveField<number, "mut">
  /**
   *  Single Output.
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioOutput}*/
  midAudioOutput: NexusObject<Empty>
  /**
   *  Gain multiplier applied to the low frequency band output.
   *  Equivalent to a dB range of [-inf, 18.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 7.943282127380371]
   * is | {@link api.TargetType.AutomatableParameter}*/
  lowGain: PrimitiveField<number, "mut">
  /**
   *  Audio output for the low frequency band.
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioOutput}*/
  lowAudioOutput: NexusObject<Empty>
  /**
   *  Audio input that will be split into frequency bands.
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioInput}*/
  audioInput: NexusObject<Empty>
}
/** @internal */

export type BandSplitterConstructor = {
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
   *  Frequency where the low band stops, and the middle band starts.
   *
   *
   * key | value
   * --- | ---
   * default | 360
   * range | [20, 20000]*/
  filterLowHz?: number
  /**
   *  Frequency where the middle band stops, and the high band starts.
   *
   *
   * key | value
   * --- | ---
   * default | 3600
   * range | [20, 20000]*/
  filterHighHz?: number
  /**
   *  Gain multiplier applied to the high frequency band output.
   *  Equivalent to a dB range of [-inf, 18.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 7.943282127380371]*/
  highGain?: number
  /**
   *  Gain multiplier applied to the mid frequency band output.
   *  Equivalent to a dB range of [-inf, 18.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 7.943282127380371]*/
  midGain?: number
  /**
   *  Gain multiplier applied to the low frequency band output.
   *  Equivalent to a dB range of [-inf, 18.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 7.943282127380371]*/
  lowGain?: number
}

