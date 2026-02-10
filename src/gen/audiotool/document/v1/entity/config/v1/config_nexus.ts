// THIS FILE IS GENERATED - DO NOT EDIT
// Copyright 2025 Audiotool Inc.

import { PrimitiveField } from "@document/fields"
import { type NexusLocation } from "@document/location"

/**
 *
 * key | value
 * --- | ---
 * type | entity
 * key | `"config"`
 * is |
 *
 *
 *  Represents the global project configuration.
 *
 *  At most one config object can exist in a project.
 *  The audio engine will assume some sensible default values for the config parameters
 *  before the config object is created, and will keep the values set by the last
 *  config object if a config object is removed. When a new config object is created,
 *  the audio engine will use the values from the new config object.
 *
 *
 * @category Utility Entities*/
export type Config = {
  /**
   *  Global tempo in beats per minute of the project. Has no effect when tempo automation is used.
   *
   *
   * key | value
   * --- | ---
   * default | 125
   * range | [30, 1000]*/
  tempoBpm: PrimitiveField<number, "mut">
  /**
   *  The base frequency in hertz of the project. The base frequency tunes the A4 note,
   *  from which the frequency of all other notes are calculated.
   *
   *
   * key | value
   * --- | ---
   * default | 440
   * range | [400, 800]*/
  baseFrequencyHz: PrimitiveField<number, "mut">
  /**
   *  The numerator of the time signature.
   *
   *
   * key | value
   * --- | ---
   * default | 4
   * range | [1, 32]*/
  signatureNumerator: PrimitiveField<number, "mut">
  /**
   *  The denominator of the time signature.
   *
   *
   * key | value
   * --- | ---
   * default | 4
   * range | [1, 32]*/
  signatureDenominator: PrimitiveField<number, "mut">
  /**
   *  The complete duration of the track in ticks.
   *
   *
   * key | value
   * --- | ---
   * default | 1966080
   * range | full*/
  durationTicks: PrimitiveField<number, "mut">
  /**
   *  The default groove pointer.
   *
   *  In the DAW, the default groove is used in various places to assign grooves to entities
   *  such as tracks or instruments. It can also be configure in the top bar of the DAW.
   *
   *
   * key | value
   * --- | ---
   * default | no default, required
   * required | true
   * targets | {@link api.TargetType.Groove}, meaning one of: <br />{@link entities.Groove}
   * immutable | true*/
  defaultGroove: PrimitiveField<NexusLocation, "immut">
}
/** @internal */

export type ConfigConstructor = {
  /**
   *  Global tempo in beats per minute of the project. Has no effect when tempo automation is used.
   *
   *
   * key | value
   * --- | ---
   * default | 125
   * range | [30, 1000]*/
  tempoBpm?: number
  /**
   *  The base frequency in hertz of the project. The base frequency tunes the A4 note,
   *  from which the frequency of all other notes are calculated.
   *
   *
   * key | value
   * --- | ---
   * default | 440
   * range | [400, 800]*/
  baseFrequencyHz?: number
  /**
   *  The numerator of the time signature.
   *
   *
   * key | value
   * --- | ---
   * default | 4
   * range | [1, 32]*/
  signatureNumerator?: number
  /**
   *  The denominator of the time signature.
   *
   *
   * key | value
   * --- | ---
   * default | 4
   * range | [1, 32]*/
  signatureDenominator?: number
  /**
   *  The complete duration of the track in ticks.
   *
   *
   * key | value
   * --- | ---
   * default | 1966080
   * range | full*/
  durationTicks?: number
  /**
   *  The default groove pointer.
   *
   *  In the DAW, the default groove is used in various places to assign grooves to entities
   *  such as tracks or instruments. It can also be configure in the top bar of the DAW.
   *
   *
   * key | value
   * --- | ---
   * default | no default, required
   * required | true
   * immutable | true*/
  defaultGroove: NexusLocation
}

