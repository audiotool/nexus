// THIS FILE IS GENERATED - DO NOT EDIT
// Copyright 2025 Audiotool Inc.

import { PrimitiveField } from "@document/fields"

/**
 *
 * key | value
 * --- | ---
 * type | object
 *
 *  Low- and high-pass filter for channel, group and aux strips.
 *  It's a simple filter with fixed filter gains at 4th order (i.e. 24dB/octave).
 *  Not an entity but a submessage used by other strips.
 *
 *
 * @category Mixer Fields*/
export type MixerTrimFilter = {
  /**
   *  High pass cutoff frequency.
   *
   *
   * key | value
   * --- | ---
   * default | 20
   * range | [20, 20000]
   * is | {@link api.TargetType.AutomatableParameter}*/
  highPassCutoffFrequencyHz: PrimitiveField<number, "mut">
  /**
   *  Low pass cutoff frequency.
   *
   *
   * key | value
   * --- | ---
   * default | 20000
   * range | [20, 20000]
   * is | {@link api.TargetType.AutomatableParameter}*/
  lowPassCutoffFrequencyHz: PrimitiveField<number, "mut">
  /**
   *  Whether the trim filter is active or not. If is_active=false, the trim filter is bypassed.
   *
   *
   * key | value
   * --- | ---
   * default | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  isActive: PrimitiveField<boolean, "mut">
}
/** @internal */

export type MixerTrimFilterConstructor = {
  /**
   *  High pass cutoff frequency.
   *
   *
   * key | value
   * --- | ---
   * default | 20
   * range | [20, 20000]*/
  highPassCutoffFrequencyHz?: number
  /**
   *  Low pass cutoff frequency.
   *
   *
   * key | value
   * --- | ---
   * default | 20000
   * range | [20, 20000]*/
  lowPassCutoffFrequencyHz?: number
  /**
   *  Whether the trim filter is active or not. If is_active=false, the trim filter is bypassed.
   *
   *
   * key | value
   * --- | ---
   * default | true*/
  isActive?: boolean
}

