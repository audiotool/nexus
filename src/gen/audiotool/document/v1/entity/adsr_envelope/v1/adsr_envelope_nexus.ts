// THIS FILE IS GENERATED - DO NOT EDIT
// Copyright 2025 Audiotool Inc.

import { PrimitiveField } from "@document/fields"

/**
 *
 * key | value
 * --- | ---
 * type | object
 *
 *  ADSR Envelope, used by the Heisenberg and Space synths. Not an entity on its own.
 *
 *
 * @category Utility Fields*/
export type AdsrEnvelope = {
  /**
   *  Wether the envelope is in time sync or not. This affects the meaning of the time values below.
   *
   *
   * key | value
   * --- | ---
   * default | false
   * is | {@link api.TargetType.AutomatableParameter}*/
  isSynced: PrimitiveField<boolean, "mut">
  /**
   *  The attack time of this envelope, expressed as a normalized value.
   *  The meaning of the value depends on the is_synced flag:
   *  - if is_synced is false, the value maps linearly to milliseconds (1.0 .. 10_000.0).
   *  - if is_synced is true, then the value is quantized to one of 30 bar time durations.
   *    The bar time durations are:
   *       1/256, 1/192, 1/128, 1/96, 1/64, 1/48, 1/32, 1/24, 1/16,
   *       1/12, 1/8, 1/6, 3/16, 1/4, 5/16, 1/3, 3/8, 7/16, 1/2, 9/16, 7/12, 5/8,
   *       2/3, 3/4, 5/6, 7/8, 1/1, 2/1, 3/1, 4/1.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  attackTimeNormalized: PrimitiveField<number, "mut">
  /**
   *  Slope factor of the attack phase of the envelope. 0 is linear, < 0 slopes up, > 0 slopes down.
   *
   *
   * key | value
   * --- | ---
   * default | -0.5
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  attackSlopeFactor: PrimitiveField<number, "mut">
  /**
   *  The attack time of this envelope, expressed as a normalized value.
   *  The meaning of the value depends on the is_synced flag:
   *  - if is_synced is false, the value maps linearly to milliseconds (1.0 .. 10_000.0).
   *  - if is_synced is true, then the value is quantized to one of 30 bar time durations.
   *    The bar time durations are:
   *       1/256, 1/192, 1/128, 1/96, 1/64, 1/48, 1/32, 1/24, 1/16,
   *       1/12, 1/8, 1/6, 3/16, 1/4, 5/16, 1/3, 3/8, 7/16, 1/2, 9/16, 7/12, 5/8,
   *       2/3, 3/4, 5/6, 7/8, 1/1, 2/1, 3/1, 4/1.
   *
   *
   * key | value
   * --- | ---
   * default | 0.25
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  decayTimeNormalized: PrimitiveField<number, "mut">
  /**
   *  Slope factor of the decay phase of the envelope. 0 is linear, < 0 slopes up, > 0 slopes down.
   *
   *
   * key | value
   * --- | ---
   * default | 0.5
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  decaySlopeFactor: PrimitiveField<number, "mut">
  /**
   *  Whether the decay phase is looped or not. If decay_is_looped=true, the decay phase
   *  will repeat indefinitely, going forward and backward.
   *
   *
   * key | value
   * --- | ---
   * default | false
   * is | {@link api.TargetType.AutomatableParameter}*/
  decayIsLooped: PrimitiveField<boolean, "mut">
  /**
   *  Sustain factor of the envelope.
   *
   *
   * key | value
   * --- | ---
   * default | 0.5
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  sustainFactor: PrimitiveField<number, "mut">
  /**
   *  The attack time of this envelope, expressed as a normalized value.
   *  The meaning of the value depends on the is_synced flag:
   *  - if is_synced is false, the value maps linearly to milliseconds (1.0 .. 10_000.0).
   *  - if is_synced is true, then the value is quantized to one of 30 bar time durations.
   *    The bar time durations are:
   *       1/256, 1/192, 1/128, 1/96, 1/64, 1/48, 1/32, 1/24, 1/16,
   *       1/12, 1/8, 1/6, 3/16, 1/4, 5/16, 1/3, 3/8, 7/16, 1/2, 9/16, 7/12, 5/8,
   *       2/3, 3/4, 5/6, 7/8, 1/1, 2/1, 3/1, 4/1.
   *
   *
   * key | value
   * --- | ---
   * default | 0.25
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  releaseTimeNormalized: PrimitiveField<number, "mut">
  /**
   *  Slope factor of the release phase of the envelope. 0 is linear, < 0 slopes up, > 0 slopes down.
   *
   *
   * key | value
   * --- | ---
   * default | 0.5
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  releaseSlopeFactor: PrimitiveField<number, "mut">
}
/** @internal */

export type AdsrEnvelopeConstructor = {
  /**
   *  Wether the envelope is in time sync or not. This affects the meaning of the time values below.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  isSynced?: boolean
  /**
   *  The attack time of this envelope, expressed as a normalized value.
   *  The meaning of the value depends on the is_synced flag:
   *  - if is_synced is false, the value maps linearly to milliseconds (1.0 .. 10_000.0).
   *  - if is_synced is true, then the value is quantized to one of 30 bar time durations.
   *    The bar time durations are:
   *       1/256, 1/192, 1/128, 1/96, 1/64, 1/48, 1/32, 1/24, 1/16,
   *       1/12, 1/8, 1/6, 3/16, 1/4, 5/16, 1/3, 3/8, 7/16, 1/2, 9/16, 7/12, 5/8,
   *       2/3, 3/4, 5/6, 7/8, 1/1, 2/1, 3/1, 4/1.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  attackTimeNormalized?: number
  /**
   *  Slope factor of the attack phase of the envelope. 0 is linear, < 0 slopes up, > 0 slopes down.
   *
   *
   * key | value
   * --- | ---
   * default | -0.5
   * range | [-1, 1]*/
  attackSlopeFactor?: number
  /**
   *  The attack time of this envelope, expressed as a normalized value.
   *  The meaning of the value depends on the is_synced flag:
   *  - if is_synced is false, the value maps linearly to milliseconds (1.0 .. 10_000.0).
   *  - if is_synced is true, then the value is quantized to one of 30 bar time durations.
   *    The bar time durations are:
   *       1/256, 1/192, 1/128, 1/96, 1/64, 1/48, 1/32, 1/24, 1/16,
   *       1/12, 1/8, 1/6, 3/16, 1/4, 5/16, 1/3, 3/8, 7/16, 1/2, 9/16, 7/12, 5/8,
   *       2/3, 3/4, 5/6, 7/8, 1/1, 2/1, 3/1, 4/1.
   *
   *
   * key | value
   * --- | ---
   * default | 0.25
   * range | [0, 1]*/
  decayTimeNormalized?: number
  /**
   *  Slope factor of the decay phase of the envelope. 0 is linear, < 0 slopes up, > 0 slopes down.
   *
   *
   * key | value
   * --- | ---
   * default | 0.5
   * range | [-1, 1]*/
  decaySlopeFactor?: number
  /**
   *  Whether the decay phase is looped or not. If decay_is_looped=true, the decay phase
   *  will repeat indefinitely, going forward and backward.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  decayIsLooped?: boolean
  /**
   *  Sustain factor of the envelope.
   *
   *
   * key | value
   * --- | ---
   * default | 0.5
   * range | [0, 1]*/
  sustainFactor?: number
  /**
   *  The attack time of this envelope, expressed as a normalized value.
   *  The meaning of the value depends on the is_synced flag:
   *  - if is_synced is false, the value maps linearly to milliseconds (1.0 .. 10_000.0).
   *  - if is_synced is true, then the value is quantized to one of 30 bar time durations.
   *    The bar time durations are:
   *       1/256, 1/192, 1/128, 1/96, 1/64, 1/48, 1/32, 1/24, 1/16,
   *       1/12, 1/8, 1/6, 3/16, 1/4, 5/16, 1/3, 3/8, 7/16, 1/2, 9/16, 7/12, 5/8,
   *       2/3, 3/4, 5/6, 7/8, 1/1, 2/1, 3/1, 4/1.
   *
   *
   * key | value
   * --- | ---
   * default | 0.25
   * range | [0, 1]*/
  releaseTimeNormalized?: number
  /**
   *  Slope factor of the release phase of the envelope. 0 is linear, < 0 slopes up, > 0 slopes down.
   *
   *
   * key | value
   * --- | ---
   * default | 0.5
   * range | [-1, 1]*/
  releaseSlopeFactor?: number
}

