// THIS FILE IS GENERATED - DO NOT EDIT
// Copyright 2025 Audiotool Inc.

import { ArrayField, PrimitiveField } from "@document/fields"
import { type NexusLocation } from "@document/location"
import { NexusObject } from "@document/object"
import { type Empty } from "@gen/document/v1/empty_nexus"

/**
 *
 * key | value
 * --- | ---
 * type | entity
 * key | `"bassline"`
 * is | {@link api.TargetType.PatternTrackPlayer}, {@link api.TargetType.NoteTrackPlayer}
 *
 *
 *  The bassline is inspired by a very famous bass synthesizer.
 *
 *
 * @category Device Entities*/
export type Bassline = {
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
   *  This device's output gain. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 0.7079399824142456
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  gain: PrimitiveField<number, "mut">
  /**
   *  This parameter detunes every note (whether incoming or from the step sequencer)
   *  by a specified number of semitones. +/-12 semitones is equivalent to +/- 1 octave.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-12, 12]
   * is | {@link api.TargetType.AutomatableParameter}*/
  tuneSemitones: PrimitiveField<number, "mut">
  /**
   *  Cutoff frequency for the low-pass filter.
   *
   *
   * key | value
   * --- | ---
   * default | 220
   * range | [220, 12000]
   * is | {@link api.TargetType.AutomatableParameter}*/
  cutoffFrequencyHz: PrimitiveField<number, "mut">
  /**
   *  Filter resonance. No unit.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  filterResonance: PrimitiveField<number, "mut">
  /**
   *  Controls the impact of the filter envelope on the filter cutoff frequency.
   *
   *
   * key | value
   * --- | ---
   * default | 0.10000000149011612
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  filterEnvelopeModulationDepth: PrimitiveField<number, "mut">
  /**
   *  The duration of the decay stage of the filter envelope.
   *  No unit; 0 is shorter, 1 is longer.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  filterDecay: PrimitiveField<number, "mut">
  /**
   *  The accent factor affects the signal's volume and filter behavior
   *  of notes that are marked with "accent", relative to the non-accented ones.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  accent: PrimitiveField<number, "mut">
  /**
   *  Selects the waveform used by the Synth:
   *  - 0: invalid
   *  - 1: sawtooth
   *  - 2: square
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 2]
   * is | {@link api.TargetType.AutomatableParameter}*/
  waveformIndex: PrimitiveField<number, "mut">
  /**
   *  The index of the currently selected pattern. Controls which pattern the bassline
   *  currently plays back, unless a pattern track is connected to it.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 27]*/
  patternIndex: PrimitiveField<number, "mut">
  /**
   *  Empty fields which BasslinePatterns can point to. At most one pattern
   *  can point to a given element in this list.
   *
   *
   * key | value
   * --- | ---
   * element is | {@link api.TargetType.BasslinePatternSlot}*/
  patternSlots: ArrayField<NexusObject<Empty>, 28>
  /**
   *  Reference to the microtuning.
   *
   *
   * key | value
   * --- | ---
   * default | empty location
   * required | false
   * targets | {@link api.TargetType.MicroTuning}, meaning one of: <br />{@link entities.MicroTuningOctave}*/
  microTuning: PrimitiveField<NexusLocation, "mut">
  /**
   *  The filter can be used with external input.
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioInput}*/
  audioInput: NexusObject<Empty>
  /**
   *  Device output.
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioOutput}*/
  audioOutput: NexusObject<Empty>
  /**
   *  Whether the bassline is active or not. When is_active=false no audio is
   *  produced by the bassline nor is the input audio audible.
   *
   *
   * key | value
   * --- | ---
   * default | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  isActive: PrimitiveField<boolean, "mut">
}
/** @internal */

export type BasslineConstructor = {
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
   *  This device's output gain. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 0.7079399824142456
   * range | [0, 1]*/
  gain?: number
  /**
   *  This parameter detunes every note (whether incoming or from the step sequencer)
   *  by a specified number of semitones. +/-12 semitones is equivalent to +/- 1 octave.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-12, 12]*/
  tuneSemitones?: number
  /**
   *  Cutoff frequency for the low-pass filter.
   *
   *
   * key | value
   * --- | ---
   * default | 220
   * range | [220, 12000]*/
  cutoffFrequencyHz?: number
  /**
   *  Filter resonance. No unit.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]*/
  filterResonance?: number
  /**
   *  Controls the impact of the filter envelope on the filter cutoff frequency.
   *
   *
   * key | value
   * --- | ---
   * default | 0.10000000149011612
   * range | [0, 1]*/
  filterEnvelopeModulationDepth?: number
  /**
   *  The duration of the decay stage of the filter envelope.
   *  No unit; 0 is shorter, 1 is longer.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  filterDecay?: number
  /**
   *  The accent factor affects the signal's volume and filter behavior
   *  of notes that are marked with "accent", relative to the non-accented ones.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]*/
  accent?: number
  /**
   *  Selects the waveform used by the Synth:
   *  - 0: invalid
   *  - 1: sawtooth
   *  - 2: square
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 2]*/
  waveformIndex?: number
  /**
   *  The index of the currently selected pattern. Controls which pattern the bassline
   *  currently plays back, unless a pattern track is connected to it.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 27]*/
  patternIndex?: number
  /**
   *  Reference to the microtuning.
   *
   *
   * key | value
   * --- | ---
   * default | empty location
   * required | false*/
  microTuning?: NexusLocation
  /**
   *  Whether the bassline is active or not. When is_active=false no audio is
   *  produced by the bassline nor is the input audio audible.
   *
   *
   * key | value
   * --- | ---
   * default | true*/
  isActive?: boolean
}

/**
 *
 * key | value
 * --- | ---
 * type | entity
 * key | `"basslinePattern"`
 * is |
 *
 *
 *  A bassline pattern. Can point to a "pattern slot" of the bassline.
 *
 *  A bassline pattern is a sequence of "steps", each step can have at most
 *  one active note. One step is always 1/16th note long.
 *
 *
 * @category Device Fields*/
export type BasslinePattern = {
  /**
   *  The Bassline this pattern belongs to, also includes the index of the pattern.
   *
   *
   * key | value
   * --- | ---
   * default | no default, required
   * required | true
   * targets | {@link api.TargetType.BasslinePatternSlot}, meaning one of: <br />{@link entities.Bassline.patternSlots}
   * immutable | true*/
  slot: PrimitiveField<NexusLocation, "immut">
  /**
   *  Every pattern can have a groove applied individually.
   *
   *
   * key | value
   * --- | ---
   * default | empty location
   * required | false
   * targets | {@link api.TargetType.Groove}, meaning one of: <br />{@link entities.Groove}*/
  groove: PrimitiveField<NexusLocation, "mut">
  /**
   *  Length of the pattern in steps.
   *
   *
   * key | value
   * --- | ---
   * default | 16
   * range | [1, 99]*/
  length: PrimitiveField<number, "mut">
  /**
   *  Storage for the steps of a pattern.
   */
  steps: ArrayField<NexusObject<BasslineStep>, 99>
}
/** @internal */

export type BasslinePatternConstructor = {
  /**
   *  The Bassline this pattern belongs to, also includes the index of the pattern.
   *
   *
   * key | value
   * --- | ---
   * default | no default, required
   * required | true
   * immutable | true*/
  slot: NexusLocation
  /**
   *  Every pattern can have a groove applied individually.
   *
   *
   * key | value
   * --- | ---
   * default | empty location
   * required | false*/
  groove?: NexusLocation
  /**
   *  Length of the pattern in steps.
   *
   *
   * key | value
   * --- | ---
   * default | 16
   * range | [1, 99]*/
  length?: number
  /**
   *  Storage for the steps of a pattern.
   */
  steps?: BasslineStepConstructor[] & { length: 99 }
}

/**
 *
 * key | value
 * --- | ---
 * type | object
 *
 *  a single step in a BasslinePattern
 *
 *
 * @category Device Fields*/
export type BasslineStep = {
  /**
   *  MIDI key that specifies the note to be played in combination with transpose. For pattern steps, it covers one octave only.
   *
   *
   * key | value
   * --- | ---
   * default | 36
   * range | [36, 48]*/
  key: PrimitiveField<number, "mut">
  /**
   *  In the bassline, each step can be transposed one octave up or down.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]*/
  transposeOctaves: PrimitiveField<number, "mut">
  /**
   *  Controls whether the note for this step is active. If `is_active=false`, the note for this step is not played.
   *
   *
   * key | value
   * --- | ---
   * default | true*/
  isActive: PrimitiveField<boolean, "mut">
  /**
   *  If this is true, the note for this step slides from the last note played.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  doesSlide: PrimitiveField<boolean, "mut">
  /**
   *  If this is true, the note for this step is accented, i.e. it is played louder than the other notes.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  isAccented: PrimitiveField<boolean, "mut">
}
/** @internal */

export type BasslineStepConstructor = {
  /**
   *  MIDI key that specifies the note to be played in combination with transpose. For pattern steps, it covers one octave only.
   *
   *
   * key | value
   * --- | ---
   * default | 36
   * range | [36, 48]*/
  key?: number
  /**
   *  In the bassline, each step can be transposed one octave up or down.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]*/
  transposeOctaves?: number
  /**
   *  Controls whether the note for this step is active. If `is_active=false`, the note for this step is not played.
   *
   *
   * key | value
   * --- | ---
   * default | true*/
  isActive?: boolean
  /**
   *  If this is true, the note for this step slides from the last note played.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  doesSlide?: boolean
  /**
   *  If this is true, the note for this step is accented, i.e. it is played louder than the other notes.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  isAccented?: boolean
}

