// THIS FILE IS GENERATED - DO NOT EDIT
// Copyright 2026 Audiotool Inc.

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
   * range | [300, 800]*/
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
  /**
   *  The project's root key index.
   *  - 0: no key set
   *  - 1: C
   *  - 2: C♯ / D♭
   *  - 3: D
   *  - 4: D♯ / E♭
   *  - 5: E
   *  - 6: F
   *  - 7: F♯ / G♭
   *  - 8: G
   *  - 9: G♯ / A♭
   *  - 10: A
   *  - 11: A♯ / B♭
   *  - 12: B
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 12]*/
  keyIndex: PrimitiveField<number, "mut">
  /**
   *  The project's scale index.
   *  - 0: no scale set
   *  - 1: Ionian major. Intervals: 0 2 4 5 7 9 11.
   *  - 2: Lydian major. Intervals: 0 2 4 6 7 9 11.
   *  - 3: Hindu. Intervals: 0 2 4 5 7 8 10.
   *  - 4: Ethiopian. Intervals: 0 2 4 5 7 8 11.
   *  - 5: Hungarian major. Intervals: 0 3 4 6 7 9 10.
   *  - 6: Enigmatic. Intervals: 0 1 4 6 8 10 11.
   *  - 7: Bhairav. Intervals: 0 1 4 5 7 8 11.
   *  - 8: Mixolydian. Intervals: 0 2 4 5 7 9 10.
   *  - 9: Mixolydian augmented. Intervals: 0 2 4 5 8 9 10.
   *  - 10: Lydian dominant. Intervals: 0 2 4 6 7 9 10.
   *  - 11: Leading whole tone. Intervals: 0 2 4 6 8 10 11.
   *  - 12: Natural minor. Intervals: 0 2 3 5 7 8 10.
   *  - 13: Harmonic minor. Intervals: 0 2 3 5 7 8 11.
   *  - 14: Melodic minor. Intervals: 0 2 3 5 7 9 11.
   *  - 15: Dorian minor. Intervals: 0 2 3 5 7 9 10.
   *  - 16: Phrygian minor. Intervals: 0 1 3 5 7 8 10.
   *  - 17: Locrian minor. Intervals: 0 1 3 5 6 8 10.
   *  - 18: Super locrian minor. Intervals: 0 1 3 4 6 8 10.
   *  - 19: Neapolitan minor. Intervals: 0 1 3 5 7 8 11.
   *  - 20: Javanese minor. Intervals: 0 1 3 5 7 9 10.
   *  - 21: Hungarian gypsy. Intervals: 0 2 3 6 7 8 10.
   *  - 22: Hungarian minor. Intervals: 0 2 3 6 7 8 11.
   *  - 23: Todi minor. Intervals: 0 1 3 6 7 8 11.
   *  - 24: Pentatonic major. Intervals: 0 2 4 7 9.
   *  - 25: Pentatonic minor. Intervals: 0 3 5 7 10.
   *  - 26: Hirajoshi. Intervals: 0 2 3 7 8.
   *  - 27: Iwato. Intervals: 0 1 5 6 10.
   *  - 28: Japanese. Intervals: 0 1 5 7 8.
   *  - 29: Egyptian. Intervals: 0 2 5 7 10.
   *  - 30: Chinese. Intervals: 0 4 6 7 11.
   *  - 31: Balinese. Intervals: 0 1 3 7 8.
   *  - 32: Pelog. Intervals: 0 1 3 7 10.
   *  - 33: Blues. Intervals: 0 3 5 6 7 10.
   *  - 34: Major blues. Intervals: 0 3 4 5 7 10.
   *  - 35: Augmented. Intervals: 0 3 4 7 8 11.
   *  - 36: Whole tone. Intervals: 0 2 4 6 8 10.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 36]*/
  scaleIndex: PrimitiveField<number, "mut">
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
   * range | [300, 800]*/
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
  /**
   *  The project's root key index.
   *  - 0: no key set
   *  - 1: C
   *  - 2: C♯ / D♭
   *  - 3: D
   *  - 4: D♯ / E♭
   *  - 5: E
   *  - 6: F
   *  - 7: F♯ / G♭
   *  - 8: G
   *  - 9: G♯ / A♭
   *  - 10: A
   *  - 11: A♯ / B♭
   *  - 12: B
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 12]*/
  keyIndex?: number
  /**
   *  The project's scale index.
   *  - 0: no scale set
   *  - 1: Ionian major. Intervals: 0 2 4 5 7 9 11.
   *  - 2: Lydian major. Intervals: 0 2 4 6 7 9 11.
   *  - 3: Hindu. Intervals: 0 2 4 5 7 8 10.
   *  - 4: Ethiopian. Intervals: 0 2 4 5 7 8 11.
   *  - 5: Hungarian major. Intervals: 0 3 4 6 7 9 10.
   *  - 6: Enigmatic. Intervals: 0 1 4 6 8 10 11.
   *  - 7: Bhairav. Intervals: 0 1 4 5 7 8 11.
   *  - 8: Mixolydian. Intervals: 0 2 4 5 7 9 10.
   *  - 9: Mixolydian augmented. Intervals: 0 2 4 5 8 9 10.
   *  - 10: Lydian dominant. Intervals: 0 2 4 6 7 9 10.
   *  - 11: Leading whole tone. Intervals: 0 2 4 6 8 10 11.
   *  - 12: Natural minor. Intervals: 0 2 3 5 7 8 10.
   *  - 13: Harmonic minor. Intervals: 0 2 3 5 7 8 11.
   *  - 14: Melodic minor. Intervals: 0 2 3 5 7 9 11.
   *  - 15: Dorian minor. Intervals: 0 2 3 5 7 9 10.
   *  - 16: Phrygian minor. Intervals: 0 1 3 5 7 8 10.
   *  - 17: Locrian minor. Intervals: 0 1 3 5 6 8 10.
   *  - 18: Super locrian minor. Intervals: 0 1 3 4 6 8 10.
   *  - 19: Neapolitan minor. Intervals: 0 1 3 5 7 8 11.
   *  - 20: Javanese minor. Intervals: 0 1 3 5 7 9 10.
   *  - 21: Hungarian gypsy. Intervals: 0 2 3 6 7 8 10.
   *  - 22: Hungarian minor. Intervals: 0 2 3 6 7 8 11.
   *  - 23: Todi minor. Intervals: 0 1 3 6 7 8 11.
   *  - 24: Pentatonic major. Intervals: 0 2 4 7 9.
   *  - 25: Pentatonic minor. Intervals: 0 3 5 7 10.
   *  - 26: Hirajoshi. Intervals: 0 2 3 7 8.
   *  - 27: Iwato. Intervals: 0 1 5 6 10.
   *  - 28: Japanese. Intervals: 0 1 5 7 8.
   *  - 29: Egyptian. Intervals: 0 2 5 7 10.
   *  - 30: Chinese. Intervals: 0 4 6 7 11.
   *  - 31: Balinese. Intervals: 0 1 3 7 8.
   *  - 32: Pelog. Intervals: 0 1 3 7 10.
   *  - 33: Blues. Intervals: 0 3 5 6 7 10.
   *  - 34: Major blues. Intervals: 0 3 4 5 7 10.
   *  - 35: Augmented. Intervals: 0 3 4 7 8 11.
   *  - 36: Whole tone. Intervals: 0 2 4 6 8 10.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 36]*/
  scaleIndex?: number
}

