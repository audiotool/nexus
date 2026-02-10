// THIS FILE IS GENERATED - DO NOT EDIT
// Copyright 2025 Audiotool Inc.

import { PrimitiveField } from "@document/fields"

/**
 *
 * key | value
 * --- | ---
 * type | object
 *
 *  The equalizer module used in various mixer strips. This is not an entity but a submessage used by other strips.
 *
 *  The mixer eq is a 4-band eq with a low shelf, a high shelf, and two mid bands.
 *
 *
 * @category Mixer Fields*/
export type MixerEq = {
  /**
   *  Low shelf filter frequency in hertz.
   *
   *
   * key | value
   * --- | ---
   * default | 60
   * range | [35, 220]
   * is | {@link api.TargetType.AutomatableParameter}*/
  lowShelfFrequencyHz: PrimitiveField<number, "mut">
  /**
   *  Low shelf filter gain in decibels.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-18, 18]
   * is | {@link api.TargetType.AutomatableParameter}*/
  lowShelfGainDb: PrimitiveField<number, "mut">
  /**
   *  Low-mid shelf filter frequency in hertz.
   *
   *
   * key | value
   * --- | ---
   * default | 500
   * range | [200, 700]
   * is | {@link api.TargetType.AutomatableParameter}*/
  lowMidFrequencyHz: PrimitiveField<number, "mut">
  /**
   *  Low mid shelf filter gain in decibels.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-18, 18]
   * is | {@link api.TargetType.AutomatableParameter}*/
  lowMidGainDb: PrimitiveField<number, "mut">
  /**
   *  High mid shelf filter frequency in hertz.
   *
   *
   * key | value
   * --- | ---
   * default | 4800
   * range | [1600, 7200]
   * is | {@link api.TargetType.AutomatableParameter}*/
  highMidFrequencyHz: PrimitiveField<number, "mut">
  /**
   *  High mid shelf filter gain in decibels.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-18, 18]
   * is | {@link api.TargetType.AutomatableParameter}*/
  highMidGainDb: PrimitiveField<number, "mut">
  /**
   *  High shelf filter frequency in hertz.
   *
   *
   * key | value
   * --- | ---
   * default | 12000
   * range | [10000, 16000]
   * is | {@link api.TargetType.AutomatableParameter}*/
  highShelfFrequencyHz: PrimitiveField<number, "mut">
  /**
   *  High shelf gain ("air").
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-18, 18]
   * is | {@link api.TargetType.AutomatableParameter}*/
  highShelfGainDb: PrimitiveField<number, "mut">
  /**
   *  Whether the equalizer is active or not. If is_active=false, the equalizer is bypassed.
   *
   *
   * key | value
   * --- | ---
   * default | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  isActive: PrimitiveField<boolean, "mut">
}
/** @internal */

export type MixerEqConstructor = {
  /**
   *  Low shelf filter frequency in hertz.
   *
   *
   * key | value
   * --- | ---
   * default | 60
   * range | [35, 220]*/
  lowShelfFrequencyHz?: number
  /**
   *  Low shelf filter gain in decibels.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-18, 18]*/
  lowShelfGainDb?: number
  /**
   *  Low-mid shelf filter frequency in hertz.
   *
   *
   * key | value
   * --- | ---
   * default | 500
   * range | [200, 700]*/
  lowMidFrequencyHz?: number
  /**
   *  Low mid shelf filter gain in decibels.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-18, 18]*/
  lowMidGainDb?: number
  /**
   *  High mid shelf filter frequency in hertz.
   *
   *
   * key | value
   * --- | ---
   * default | 4800
   * range | [1600, 7200]*/
  highMidFrequencyHz?: number
  /**
   *  High mid shelf filter gain in decibels.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-18, 18]*/
  highMidGainDb?: number
  /**
   *  High shelf filter frequency in hertz.
   *
   *
   * key | value
   * --- | ---
   * default | 12000
   * range | [10000, 16000]*/
  highShelfFrequencyHz?: number
  /**
   *  High shelf gain ("air").
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-18, 18]*/
  highShelfGainDb?: number
  /**
   *  Whether the equalizer is active or not. If is_active=false, the equalizer is bypassed.
   *
   *
   * key | value
   * --- | ---
   * default | true*/
  isActive?: boolean
}

