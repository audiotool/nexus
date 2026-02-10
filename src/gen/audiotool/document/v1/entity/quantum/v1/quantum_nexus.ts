// THIS FILE IS GENERATED - DO NOT EDIT
// Copyright 2025 Audiotool Inc.

import { ArrayField, PrimitiveField } from "@document/fields"
import { NexusObject } from "@document/object"
import { type Empty } from "@gen/document/v1/empty_nexus"

/**
 *
 * key | value
 * --- | ---
 * type | entity
 * key | `"quantum"`
 * is |
 *
 *
 *  The Quantum device, a multi-band compressor. It's essentially a band splitter,
 *  then a compressor for each band, then a merger.
 *
 *
 * @category Device Entities*/
export type Quantum = {
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
   *  Gain of the compressor.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-24, 24]
   * is | {@link api.TargetType.AutomatableParameter}*/
  gainDb: PrimitiveField<number, "mut">
  /**
   *  Allows adjustment of the duration of the window during which the signal peak
   *  is detected that triggers the compressors, in milliseconds. If this is 0,
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
   *  Selects the spectrum mode of the quantum. This only affects the visual representation
   *  in the DAW.
   *  - 0: invalid
   *  - 1: Off   - no spectrum is displayed
   *  - 2: Pre   - the spectrum is displayed before the compression is applied
   *  - 3: Post  - the spectrum is displayed after the compression is applied
   *
   *
   * key | value
   * --- | ---
   * default | 2
   * range | [1, 3]*/
  spectrumModeIndex: PrimitiveField<number, "mut">
  /**
   *  The frequencies that split the different frequency bands for the band splitter.
   *  There are 4 frequency bands, thus 3 split points.
   *
   *  These frequencies should be ordered in magnitude. If they aren't, then the different
   *  bands might overlap or not produce any sound at all.
   *
   *
   * key | value
   * --- | ---
   * default | 20
   * range | [20, 20000]*/
  splitFrequencyHz: ArrayField<PrimitiveField<number, "mut">, 3>
  /**
   *  Compressor bands.
   */
  bands: ArrayField<NexusObject<QuantumBand>, 4>
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

export type QuantumConstructor = {
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
   *  Gain of the compressor.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-24, 24]*/
  gainDb?: number
  /**
   *  Allows adjustment of the duration of the window during which the signal peak
   *  is detected that triggers the compressors, in milliseconds. If this is 0,
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
  /**
   *  Selects the spectrum mode of the quantum. This only affects the visual representation
   *  in the DAW.
   *  - 0: invalid
   *  - 1: Off   - no spectrum is displayed
   *  - 2: Pre   - the spectrum is displayed before the compression is applied
   *  - 3: Post  - the spectrum is displayed after the compression is applied
   *
   *
   * key | value
   * --- | ---
   * default | 2
   * range | [1, 3]*/
  spectrumModeIndex?: number
  /**
   *  The frequencies that split the different frequency bands for the band splitter.
   *  There are 4 frequency bands, thus 3 split points.
   *
   *  These frequencies should be ordered in magnitude. If they aren't, then the different
   *  bands might overlap or not produce any sound at all.
   *
   *
   * key | value
   * --- | ---
   * default | 20
   * range | [20, 20000]*/
  splitFrequencyHz?: number[] & { length: 3 }
  /**
   *  Compressor bands.
   */
  bands?: QuantumBandConstructor[] & { length: 4 }
}

/**
 *
 * key | value
 * --- | ---
 * type | object
 *
 *  data structure for the Quantum compressor band
 *
 *
 * @category Device Fields*/
export type QuantumBand = {
  /**
   *  Threshold at which the compressor band starts compressing, expressed in dB.
   *
   *
   * key | value
   * --- | ---
   * default | -10
   * range | [-48, 0]
   * is | {@link api.TargetType.AutomatableParameter}*/
  thresholdDb: PrimitiveField<number, "mut">
  /**
   *  Ratio of the compressor band.
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
  kneeDb: PrimitiveField<number, "mut">
  /**
   *  Attack time of the compressor band.
   *
   *
   * key | value
   * --- | ---
   * default | 5
   * range | [0, 1000]
   * is | {@link api.TargetType.AutomatableParameter}*/
  attackMs: PrimitiveField<number, "mut">
  /**
   *  Release time of the compressor band.
   *
   *
   * key | value
   * --- | ---
   * default | 50
   * range | [0, 1000]
   * is | {@link api.TargetType.AutomatableParameter}*/
  releaseMs: PrimitiveField<number, "mut">
  /**
   *  Makeup gain applied to the signal after compression.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-24, 24]
   * is | {@link api.TargetType.AutomatableParameter}*/
  makeupGainDb: PrimitiveField<number, "mut">
  /**
   *  Whether the compressor is active for this band. If is_compressor_active is false,
   *  the compressor is disabled, but the frequency band is still added to the final signal.
   *
   *
   * key | value
   * --- | ---
   * default | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  isCompressorActive: PrimitiveField<boolean, "mut">
  /**
   *  Whether the compressor band is muted or not. If is_muted is true, the entire frequency
   *  band is muted.
   *
   *
   * key | value
   * --- | ---
   * default | false
   * is | {@link api.TargetType.AutomatableParameter}*/
  isMuted: PrimitiveField<boolean, "mut">
  /**
   *  Whether the compressor band is soloed or not. If is_soloed is true, only bands
   *  with is_soloed true are audible.
   *
   *
   * key | value
   * --- | ---
   * default | false
   * is | {@link api.TargetType.AutomatableParameter}*/
  isSoloed: PrimitiveField<boolean, "mut">
}
/** @internal */

export type QuantumBandConstructor = {
  /**
   *  Threshold at which the compressor band starts compressing, expressed in dB.
   *
   *
   * key | value
   * --- | ---
   * default | -10
   * range | [-48, 0]*/
  thresholdDb?: number
  /**
   *  Ratio of the compressor band.
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
  kneeDb?: number
  /**
   *  Attack time of the compressor band.
   *
   *
   * key | value
   * --- | ---
   * default | 5
   * range | [0, 1000]*/
  attackMs?: number
  /**
   *  Release time of the compressor band.
   *
   *
   * key | value
   * --- | ---
   * default | 50
   * range | [0, 1000]*/
  releaseMs?: number
  /**
   *  Makeup gain applied to the signal after compression.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-24, 24]*/
  makeupGainDb?: number
  /**
   *  Whether the compressor is active for this band. If is_compressor_active is false,
   *  the compressor is disabled, but the frequency band is still added to the final signal.
   *
   *
   * key | value
   * --- | ---
   * default | true*/
  isCompressorActive?: boolean
  /**
   *  Whether the compressor band is muted or not. If is_muted is true, the entire frequency
   *  band is muted.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  isMuted?: boolean
  /**
   *  Whether the compressor band is soloed or not. If is_soloed is true, only bands
   *  with is_soloed true are audible.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  isSoloed?: boolean
}

