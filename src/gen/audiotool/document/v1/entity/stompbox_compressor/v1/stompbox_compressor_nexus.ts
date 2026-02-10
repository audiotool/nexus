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
 * key | `"stompboxCompressor"`
 * is |
 *
 *
 *  A simple compressor in the form of a stompbox.
 *
 *
 * @category Device Entities*/
export type StompboxCompressor = {
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
   *  Attack speed of the compressor.
   *
   *
   * key | value
   * --- | ---
   * default | 5
   * range | [1, 100]
   * is | {@link api.TargetType.AutomatableParameter}*/
  attackMs: PrimitiveField<number, "mut">
  /**
   *  Release speed of the compressor.
   *
   *
   * key | value
   * --- | ---
   * default | 25
   * range | [1, 600]
   * is | {@link api.TargetType.AutomatableParameter}*/
  releaseMs: PrimitiveField<number, "mut">
  /**
   *  Makeup gain applied to the signal after compression.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-12, 12]
   * is | {@link api.TargetType.AutomatableParameter}*/
  makeupGainDb: PrimitiveField<number, "mut">
  /**
   *  Selects the compressor detection mode.
   *  - 0: invalid
   *  - 1: moving average
   *  - 2: peak
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
   * default | 0.4000000059604645
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  ratio: PrimitiveField<number, "mut">
  /**
   *  Threshold above which compression kicks in.
   *
   *
   * key | value
   * --- | ---
   * default | -15
   * range | [-24, 0]
   * is | {@link api.TargetType.AutomatableParameter}*/
  thresholdDb: PrimitiveField<number, "mut">
  /**
   *  Whether the stompbox is active or not. When is_active=false, audio signal bypasses the device
   *
   *
   * key | value
   * --- | ---
   * default | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  isActive: PrimitiveField<boolean, "mut">
  /**
   *  Primary Input.
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioInput}*/
  audioInput: NexusObject<Empty>
  /**
   *  Side Chain Input.
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioInput}*/
  sideChainInput: NexusObject<Empty>
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

export type StompboxCompressorConstructor = {
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
   *  Attack speed of the compressor.
   *
   *
   * key | value
   * --- | ---
   * default | 5
   * range | [1, 100]*/
  attackMs?: number
  /**
   *  Release speed of the compressor.
   *
   *
   * key | value
   * --- | ---
   * default | 25
   * range | [1, 600]*/
  releaseMs?: number
  /**
   *  Makeup gain applied to the signal after compression.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-12, 12]*/
  makeupGainDb?: number
  /**
   *  Selects the compressor detection mode.
   *  - 0: invalid
   *  - 1: moving average
   *  - 2: peak
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
   * default | 0.4000000059604645
   * range | [0, 1]*/
  ratio?: number
  /**
   *  Threshold above which compression kicks in.
   *
   *
   * key | value
   * --- | ---
   * default | -15
   * range | [-24, 0]*/
  thresholdDb?: number
  /**
   *  Whether the stompbox is active or not. When is_active=false, audio signal bypasses the device
   *
   *
   * key | value
   * --- | ---
   * default | true*/
  isActive?: boolean
}

