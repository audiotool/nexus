// THIS FILE IS GENERATED - DO NOT EDIT
// Copyright 2026 Audiotool Inc.

import { ArrayField, PrimitiveField } from "@document/fields"

/**
 *
 * key | value
 * --- | ---
 * type | entity
 * key | `"microTuningOctave"`
 * is | {@link api.TargetType.MicroTuning}
 *
 *
 *  A micro tuning allows to change the tonal scale to something
 *  outside the classical western scale. It allows each key in the
 *  12 tone scale to be detuned individually.
 *
 *
 * @category Utility Entities*/
export type MicroTuningOctave = {
  /**
   *  How much each note in every octave is detuned.
   *
   *  Note start at C and end at B.
   *
   *  Example: semitones[0] = 1, semitones[1..11] = 0 means we have detuned
   *  every C to be the same as C#, and the remainder left in place, creating
   *  a scale where no C can be played.
   *
   *  frequency[note] * 2^(semitones[note] / 12)
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]*/
  semitones: ArrayField<PrimitiveField<number, "mut">, 12>
  /**
   *  The name of this micro tuning octave.
   */
  displayName: PrimitiveField<string, "mut">
}
/** @internal */

export type MicroTuningOctaveConstructor = {
  /**
   *  How much each note in every octave is detuned.
   *
   *  Note start at C and end at B.
   *
   *  Example: semitones[0] = 1, semitones[1..11] = 0 means we have detuned
   *  every C to be the same as C#, and the remainder left in place, creating
   *  a scale where no C can be played.
   *
   *  frequency[note] * 2^(semitones[note] / 12)
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]*/
  semitones?: number[] & { length: 12 }
  /**
   *  The name of this micro tuning octave.
   */
  displayName?: string
}

