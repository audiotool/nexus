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
 * key | `"curve"`
 * is |
 *
 *
 *  The curve is a graphical equalizer that has 7 band eqs:
 *  - 1 low pass
 *  - 1 low shelf
 *  - 3 fully parametric peak filters
 *  - 1 high pass
 *  - 1 high shelf
 *
 *
 * @category Device Entities*/
export type Curve = {
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
   *  Gain applied to the signal after equalization.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-24, 24]
   * is | {@link api.TargetType.AutomatableParameter}*/
  gainDb: PrimitiveField<number, "mut">
  /**
   *  Whether the equalizer is active or not. When is_active=false, audio signal bypasses the device
   *
   *
   * key | value
   * --- | ---
   * default | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  isActive: PrimitiveField<boolean, "mut">
  /**
   *  Selects the spectrum mode of the equalizer. This only affects the visual representation
   *  in the DAW.
   *  - 0: invalid
   *  - 1: Off   - no spectrum is displayed
   *  - 2: Pre   - the spectrum is displayed before the equalizer is applied
   *  - 3: Post  - the spectrum is displayed after the equalizer is applied
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 3]*/
  spectrumModeIndex: PrimitiveField<number, "mut">
  /**
   *  The low pass filter.
   */
  lowPass: NexusObject<CurvePass>
  /**
   *  The high pass filter.
   */
  highPass: NexusObject<CurvePass>
  /**
   *  The low shelf filter.
   */
  lowShelf: NexusObject<CurveShelf>
  /**
   *  The high shelf filter.
   */
  highShelf: NexusObject<CurveShelf>
  /**
   *  The first peak filter.
   */
  peak1: NexusObject<CurvePeak>
  /**
   *  The second peak filter.
   */
  peak2: NexusObject<CurvePeak>
  /**
   *  The third peak filter.
   */
  peak3: NexusObject<CurvePeak>
  /**
   *  Audio Input.
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

export type CurveConstructor = {
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
   *  Gain applied to the signal after equalization.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-24, 24]*/
  gainDb?: number
  /**
   *  Whether the equalizer is active or not. When is_active=false, audio signal bypasses the device
   *
   *
   * key | value
   * --- | ---
   * default | true*/
  isActive?: boolean
  /**
   *  Selects the spectrum mode of the equalizer. This only affects the visual representation
   *  in the DAW.
   *  - 0: invalid
   *  - 1: Off   - no spectrum is displayed
   *  - 2: Pre   - the spectrum is displayed before the equalizer is applied
   *  - 3: Post  - the spectrum is displayed after the equalizer is applied
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 3]*/
  spectrumModeIndex?: number
  /**
   *  The low pass filter.
   */
  lowPass?: CurvePassConstructor
  /**
   *  The high pass filter.
   */
  highPass?: CurvePassConstructor
  /**
   *  The low shelf filter.
   */
  lowShelf?: CurveShelfConstructor
  /**
   *  The high shelf filter.
   */
  highShelf?: CurveShelfConstructor
  /**
   *  The first peak filter.
   */
  peak1?: CurvePeakConstructor
  /**
   *  The second peak filter.
   */
  peak2?: CurvePeakConstructor
  /**
   *  The third peak filter.
   */
  peak3?: CurvePeakConstructor
}

/**
 *
 * key | value
 * --- | ---
 * type | object
 *
 *  Curve high/low pass filter.
 *
 *
 * @category Device Fields*/
export type CurvePass = {
  /**
   *  The cutoff frequency of the filter.
   *
   *
   * key | value
   * --- | ---
   * default | 40
   * range | [20, 20000]
   * is | {@link api.TargetType.AutomatableParameter}*/
  cutoffFrequencyHz: PrimitiveField<number, "mut">
  /**
   *  The high/low pass filter slope/order, controlling how "steep" the filter curve is:
   *  - 0: invalid
   *  - 1: 12dB
   *  - 2: 24dB
   *  - 3: 36dB
   *  - 4: 48dB
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 4]*/
  filterSlopeIndex: PrimitiveField<number, "mut">
  /**
   *  The high/low pass Q parameter, controls the bandwidth and resonance of the filter.
   *
   *
   * key | value
   * --- | ---
   * default | 0.7099999785423279
   * range | [0.009999999776482582, 10]
   * is | {@link api.TargetType.AutomatableParameter}*/
  q: PrimitiveField<number, "mut">
  /**
   *  Whether this filter is enabled. If is_enabled=false,
   *
   *
   * key | value
   * --- | ---
   * default | false
   * is | {@link api.TargetType.AutomatableParameter}*/
  isEnabled: PrimitiveField<boolean, "mut">
}
/** @internal */

export type CurvePassConstructor = {
  /**
   *  The cutoff frequency of the filter.
   *
   *
   * key | value
   * --- | ---
   * default | 40
   * range | [20, 20000]*/
  cutoffFrequencyHz?: number
  /**
   *  The high/low pass filter slope/order, controlling how "steep" the filter curve is:
   *  - 0: invalid
   *  - 1: 12dB
   *  - 2: 24dB
   *  - 3: 36dB
   *  - 4: 48dB
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 4]*/
  filterSlopeIndex?: number
  /**
   *  The high/low pass Q parameter, controls the bandwidth and resonance of the filter.
   *
   *
   * key | value
   * --- | ---
   * default | 0.7099999785423279
   * range | [0.009999999776482582, 10]*/
  q?: number
  /**
   *  Whether this filter is enabled. If is_enabled=false,
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  isEnabled?: boolean
}

/**
 *
 * key | value
 * --- | ---
 * type | object
 *
 *  Curve low/high shelf filter.
 *
 *
 * @category Device Fields*/
export type CurveShelf = {
  /**
   *  The center frequency of the filter.
   *
   *
   * key | value
   * --- | ---
   * default | 10000
   * range | [20, 20000]
   * is | {@link api.TargetType.AutomatableParameter}*/
  centerFrequencyHz: PrimitiveField<number, "mut">
  /**
   *  The gain of the filter in dB.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-40, 40]
   * is | {@link api.TargetType.AutomatableParameter}*/
  gainDb: PrimitiveField<number, "mut">
  /**
   *  Whether this shelf filter is enabled. If is_enabled=false, the filter is disabled.
   *
   *
   * key | value
   * --- | ---
   * default | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  isEnabled: PrimitiveField<boolean, "mut">
}
/** @internal */

export type CurveShelfConstructor = {
  /**
   *  The center frequency of the filter.
   *
   *
   * key | value
   * --- | ---
   * default | 10000
   * range | [20, 20000]*/
  centerFrequencyHz?: number
  /**
   *  The gain of the filter in dB.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-40, 40]*/
  gainDb?: number
  /**
   *  Whether this shelf filter is enabled. If is_enabled=false, the filter is disabled.
   *
   *
   * key | value
   * --- | ---
   * default | true*/
  isEnabled?: boolean
}

/**
 *
 * key | value
 * --- | ---
 * type | object
 *
 *  Curve peak filter.
 *
 *
 * @category Device Fields*/
export type CurvePeak = {
  /**
   *  The center frequency of the peak.
   *
   *
   * key | value
   * --- | ---
   * default | 4000
   * range | [20, 20000]
   * is | {@link api.TargetType.AutomatableParameter}*/
  centerFrequencyHz: PrimitiveField<number, "mut">
  /**
   *  The gain of the peak in dB.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-40, 40]
   * is | {@link api.TargetType.AutomatableParameter}*/
  gainDb: PrimitiveField<number, "mut">
  /**
   *  The bandwidth of the peak, aka Q factor.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0.009999999776482582, 10]
   * is | {@link api.TargetType.AutomatableParameter}*/
  q: PrimitiveField<number, "mut">
  /**
   *  Whether this peak filter is enabled. If is_enabled=false, the filter is disabled.
   *
   *
   * key | value
   * --- | ---
   * default | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  isEnabled: PrimitiveField<boolean, "mut">
}
/** @internal */

export type CurvePeakConstructor = {
  /**
   *  The center frequency of the peak.
   *
   *
   * key | value
   * --- | ---
   * default | 4000
   * range | [20, 20000]*/
  centerFrequencyHz?: number
  /**
   *  The gain of the peak in dB.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-40, 40]*/
  gainDb?: number
  /**
   *  The bandwidth of the peak, aka Q factor.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0.009999999776482582, 10]*/
  q?: number
  /**
   *  Whether this peak filter is enabled. If is_enabled=false, the filter is disabled.
   *
   *
   * key | value
   * --- | ---
   * default | true*/
  isEnabled?: boolean
}

