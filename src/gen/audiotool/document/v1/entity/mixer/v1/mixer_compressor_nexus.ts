// THIS FILE IS GENERATED - DO NOT EDIT
// Copyright 2026 Audiotool Inc.

import { PrimitiveField } from "@document/fields"
import { NexusObject } from "@document/object"
import { type Empty } from "@gen/document/v1/empty_nexus"

/**
 *
 * key | value
 * --- | ---
 * type | object
 *
 *  Compressor for channel and group strips. This is not an entity but a submessage used by other strips.
 *
 *
 * @category Mixer Fields*/
export type MixerCompressor = {
  /**
   *  Attack speed of the compressor.
   *
   *
   * key | value
   * --- | ---
   * default | 15
   * range | [0.0010000000474974513, 200]
   * is | {@link api.TargetType.AutomatableParameter}*/
  attackMs: PrimitiveField<number, "mut">
  /**
   *  Release speed of the compressor.
   *
   *
   * key | value
   * --- | ---
   * default | 100
   * range | [0.0010000000474974513, 2000]
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
   *  Selects the compressor detection mode.
   *  - 0: invalid
   *  - 1: Rms
   *  - 2: Peak
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 2]
   * is | {@link api.TargetType.AutomatableParameter}*/
  detectionModeIndex: PrimitiveField<number, "mut">
  /**
   *  Ratio of the compressor.
   *
   *
   * key | value
   * --- | ---
   * default | 2
   * range | [1, 50]
   * is | {@link api.TargetType.AutomatableParameter}*/
  ratio: PrimitiveField<number, "mut">
  /**
   *  Threshold decibels of the compressor.
   *
   *
   * key | value
   * --- | ---
   * default | -10
   * range | [-48, 0]
   * is | {@link api.TargetType.AutomatableParameter}*/
  thresholdDb: PrimitiveField<number, "mut">
  /**
   *  Whether the compressor is active or not. If is_active=false, the compressor is bypassed.
   *
   *
   * key | value
   * --- | ---
   * default | false
   * is | {@link api.TargetType.AutomatableParameter}*/
  isActive: PrimitiveField<boolean, "mut">
  /**
   *  Side chain input for this compressor.
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.MixerSideChainInput}*/
  sideChainInput: NexusObject<Empty>
}
/** @internal */

export type MixerCompressorConstructor = {
  /**
   *  Attack speed of the compressor.
   *
   *
   * key | value
   * --- | ---
   * default | 15
   * range | [0.0010000000474974513, 200]*/
  attackMs?: number
  /**
   *  Release speed of the compressor.
   *
   *
   * key | value
   * --- | ---
   * default | 100
   * range | [0.0010000000474974513, 2000]*/
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
   *  Selects the compressor detection mode.
   *  - 0: invalid
   *  - 1: Rms
   *  - 2: Peak
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 2]*/
  detectionModeIndex?: number
  /**
   *  Ratio of the compressor.
   *
   *
   * key | value
   * --- | ---
   * default | 2
   * range | [1, 50]*/
  ratio?: number
  /**
   *  Threshold decibels of the compressor.
   *
   *
   * key | value
   * --- | ---
   * default | -10
   * range | [-48, 0]*/
  thresholdDb?: number
  /**
   *  Whether the compressor is active or not. If is_active=false, the compressor is bypassed.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  isActive?: boolean
}

