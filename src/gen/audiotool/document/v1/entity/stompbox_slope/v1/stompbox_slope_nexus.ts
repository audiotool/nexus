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
 * key | `"stompboxSlope"`
 * is |
 *
 *
 *  The slope filter is a multi-mode filter without envelope, with lowpass,
 *  highpass, notch, and bandpass modes. The notch & bandpass filters are implemented
 *  as a low and high pass filter in parallel or series, respectively.
 *
 *
 * @category Device Entities*/
export type StompboxSlope = {
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
   *  Selects the filter mode of the slope.
   *  - 0: invalid
   *  - 1: Lowpass      a single lowpass filter
   *  - 2: Highpass     a single highpass filter
   *  - 3: Notch        a low and high pass filter in parallel
   *  - 4: Bandpass     a low and high pass filter in series
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 4]
   * is | {@link api.TargetType.AutomatableParameter}*/
  filterModeIndex: PrimitiveField<number, "mut">
  /**
   *  The cut-off frequency of the filter.
   *
   *
   * key | value
   * --- | ---
   * default | 300
   * range | [18, 10000]
   * is | {@link api.TargetType.AutomatableParameter}*/
  frequencyHz: PrimitiveField<number, "mut">
  /**
   *  The resonance of the filter. 0 means no resonance, 1 means maximum resonance. No unit.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  resonanceFactor: PrimitiveField<number, "mut">
  /**
   *  The spacing in hertz between the low and high pass filters. Only has an effect for notch and bandpass modes.
   *  This effectively controls the bandwidth of the bandpass/notch filter.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-500, 500]
   * is | {@link api.TargetType.AutomatableParameter}*/
  bandWidthHz: PrimitiveField<number, "mut">
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

export type StompboxSlopeConstructor = {
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
   *  Selects the filter mode of the slope.
   *  - 0: invalid
   *  - 1: Lowpass      a single lowpass filter
   *  - 2: Highpass     a single highpass filter
   *  - 3: Notch        a low and high pass filter in parallel
   *  - 4: Bandpass     a low and high pass filter in series
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 4]*/
  filterModeIndex?: number
  /**
   *  The cut-off frequency of the filter.
   *
   *
   * key | value
   * --- | ---
   * default | 300
   * range | [18, 10000]*/
  frequencyHz?: number
  /**
   *  The resonance of the filter. 0 means no resonance, 1 means maximum resonance. No unit.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]*/
  resonanceFactor?: number
  /**
   *  The spacing in hertz between the low and high pass filters. Only has an effect for notch and bandpass modes.
   *  This effectively controls the bandwidth of the bandpass/notch filter.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-500, 500]*/
  bandWidthHz?: number
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
   *  Whether the stompbox is active or not. When is_active=false, audio signal bypasses the device.
   *
   *
   * key | value
   * --- | ---
   * default | true*/
  isActive?: boolean
}

