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
 * key | `"matrixArpeggiator"`
 * is | {@link api.TargetType.NoteTrackPlayer}, {@link api.TargetType.PatternTrackPlayer}
 *
 *
 *  The MatrixArpeggiator is a pattern-based
 *  arpeggiator that generates notes based on:
 *  - the currently incoming notes (e.g. from a note track)
 *  - the arpeggiation parameters of the currently playing pattern
 *
 *
 * @category Device Entities*/
export type MatrixArpeggiator = {
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
   *  Whether the arpeggio is active or not. If is_active=false, the notes are passed
   *  through as chord without any arpeggio processing.
   *
   *
   * key | value
   * --- | ---
   * default | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  isActive: PrimitiveField<boolean, "mut">
  /**
   *  If this parameter is <0, then the absolute value of velocity overrides every incoming note's velocity.
   *  If this parameter is >0, then the incoming note's velocity is multiplied by this parameter.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  velocity: PrimitiveField<number, "mut">
  /**
   *  The interval with which notes are emitted.
   *
   *  - 0: invalid
   *  - 1: 1 bar
   *  - 2: 1/2 bars
   *  - 3: 1/4 bars
   *  - 4: 3/16 bars
   *  - 5: 1/8 bars
   *  - 6: 3/32 bars
   *  - 7: 1/16 bars
   *  - 8: 3/64 bars
   *  - 9: 1/32 bars
   *  - 10: 1/64 bars
   *  - 11: 1/128 bars
   *
   *
   * key | value
   * --- | ---
   * default | 7
   * range | [1, 11]
   * is | {@link api.TargetType.AutomatableParameter}*/
  stepLengthIndex: PrimitiveField<number, "mut">
  /**
   *  A note from the arpeggiation pattern is repeated for this many times
   *  before the next note is emitted.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 8]
   * is | {@link api.TargetType.AutomatableParameter}*/
  repeat: PrimitiveField<number, "mut">
  /**
   *  The duration of each note in relation to the current step duration. Can
   *  be up to two steps long, in which case the notes overlap.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 2]
   * is | {@link api.TargetType.AutomatableParameter}*/
  gateRatio: PrimitiveField<number, "mut">
  /**
   *  The mode of the arpeggio.
   *  - 0: invalid
   *  - 1: Up,
   *  - 2: Down,
   *  - 3: Up/Down,
   *  - 4: Zig Zack,
   *  - 5: Zig Zack +,
   *  - 6: Random
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 6]
   * is | {@link api.TargetType.AutomatableParameter}*/
  arpeggiationModeIndex: PrimitiveField<number, "mut">
  /**
   *  The seed used for the random mode, if selected.
   *
   *
   * key | value
   * --- | ---
   * default | 1000
   * range | [0, 9999]
   * is | {@link api.TargetType.AutomatableParameter}*/
  randomSeed: PrimitiveField<number, "mut">
  /**
   *  The arpeggiation pattern's octave range. The way this influences the arpeggiation
   *  pattern depends on arpeggiation_mode_index.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 4]
   * is | {@link api.TargetType.AutomatableParameter}*/
  octaves: PrimitiveField<number, "mut">
  /**
   *  If this flag is true, all incoming notes are assumed pressed until
   *  hold_notes_until_note is played, where all notes are released. This allows
   *  playing an arpeggiation pattern in real time while not keeping all notes pressed.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  holdNotes: PrimitiveField<boolean, "mut">
  /**
   *  This defines the note (in MIDI index, i.e. C4=60) that will release all held notes,
   *  if hold_notes is set to true.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 127]*/
  holdNotesUntilNote: PrimitiveField<number, "mut">
  /**
   *  If this flag is set to true, then the matrix behaves as though the parameters
   *  set on the pattern itself are ignored, with the exception of the pattern's length.
   *
   *  It essentially behaves as though the pattern is left to defaults.
   *
   *
   * key | value
   * --- | ---
   * default | false
   * is | {@link api.TargetType.AutomatableParameter}*/
  ignorePatternStepParameters: PrimitiveField<boolean, "mut">
  /**
   *  Whether the pattern is started from the start if a note is pressed after a period of silence.
   *  If this is false, the matrix pattern behaves as though the pattern continues playing
   *  even if no notes are produced.
   *
   *
   * key | value
   * --- | ---
   * default | false
   * is | {@link api.TargetType.AutomatableParameter}*/
  patternIsSynced: PrimitiveField<boolean, "mut">
  /**
   *  Empty fields which MatrixPatterns can point to.
   *  This field has an implicit validation rule, which is that at most one MatrixPattern
   *  can point to a specific element in this list.
   *
   *
   * key | value
   * --- | ---
   * element is | {@link api.TargetType.MatrixArpeggiatorPatternSlot}*/
  patternSlots: ArrayField<NexusObject<Empty>, 4>
  /**
   *  The index of the currently selected pattern. Results in the device playing that pattern, unless
   *  a pattern track is connected to it.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 3]*/
  patternIndex: PrimitiveField<number, "mut">
  /**
   *  Notes Input.
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.NotesInput}*/
  notesInput: NexusObject<Empty>
  /**
   *  Output for the device's notes
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.NotesOutput}*/
  notesOutput: NexusObject<Empty>
}
/** @internal */

export type MatrixArpeggiatorConstructor = {
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
   *  Whether the arpeggio is active or not. If is_active=false, the notes are passed
   *  through as chord without any arpeggio processing.
   *
   *
   * key | value
   * --- | ---
   * default | true*/
  isActive?: boolean
  /**
   *  If this parameter is <0, then the absolute value of velocity overrides every incoming note's velocity.
   *  If this parameter is >0, then the incoming note's velocity is multiplied by this parameter.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [-1, 1]*/
  velocity?: number
  /**
   *  The interval with which notes are emitted.
   *
   *  - 0: invalid
   *  - 1: 1 bar
   *  - 2: 1/2 bars
   *  - 3: 1/4 bars
   *  - 4: 3/16 bars
   *  - 5: 1/8 bars
   *  - 6: 3/32 bars
   *  - 7: 1/16 bars
   *  - 8: 3/64 bars
   *  - 9: 1/32 bars
   *  - 10: 1/64 bars
   *  - 11: 1/128 bars
   *
   *
   * key | value
   * --- | ---
   * default | 7
   * range | [1, 11]*/
  stepLengthIndex?: number
  /**
   *  A note from the arpeggiation pattern is repeated for this many times
   *  before the next note is emitted.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 8]*/
  repeat?: number
  /**
   *  The duration of each note in relation to the current step duration. Can
   *  be up to two steps long, in which case the notes overlap.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 2]*/
  gateRatio?: number
  /**
   *  The mode of the arpeggio.
   *  - 0: invalid
   *  - 1: Up,
   *  - 2: Down,
   *  - 3: Up/Down,
   *  - 4: Zig Zack,
   *  - 5: Zig Zack +,
   *  - 6: Random
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 6]*/
  arpeggiationModeIndex?: number
  /**
   *  The seed used for the random mode, if selected.
   *
   *
   * key | value
   * --- | ---
   * default | 1000
   * range | [0, 9999]*/
  randomSeed?: number
  /**
   *  The arpeggiation pattern's octave range. The way this influences the arpeggiation
   *  pattern depends on arpeggiation_mode_index.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 4]*/
  octaves?: number
  /**
   *  If this flag is true, all incoming notes are assumed pressed until
   *  hold_notes_until_note is played, where all notes are released. This allows
   *  playing an arpeggiation pattern in real time while not keeping all notes pressed.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  holdNotes?: boolean
  /**
   *  This defines the note (in MIDI index, i.e. C4=60) that will release all held notes,
   *  if hold_notes is set to true.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 127]*/
  holdNotesUntilNote?: number
  /**
   *  If this flag is set to true, then the matrix behaves as though the parameters
   *  set on the pattern itself are ignored, with the exception of the pattern's length.
   *
   *  It essentially behaves as though the pattern is left to defaults.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  ignorePatternStepParameters?: boolean
  /**
   *  Whether the pattern is started from the start if a note is pressed after a period of silence.
   *  If this is false, the matrix pattern behaves as though the pattern continues playing
   *  even if no notes are produced.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  patternIsSynced?: boolean
  /**
   *  The index of the currently selected pattern. Results in the device playing that pattern, unless
   *  a pattern track is connected to it.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 3]*/
  patternIndex?: number
}

/**
 *
 * key | value
 * --- | ---
 * type | entity
 * key | `"matrixArpeggiatorPattern"`
 * is |
 *
 *
 *  A pattern of the matrix arpeggiator. Contains step-specific parameters such as
 *  velocity and mute, and the pattern length.
 *
 *
 * @category Device Fields*/
export type MatrixArpeggiatorPattern = {
  /**
   *  The Matrix this pattern belongs to, also includes the index of the pattern.
   *
   *
   * key | value
   * --- | ---
   * default | no default, required
   * required | true
   * targets | {@link api.TargetType.MatrixArpeggiatorPatternSlot}, meaning one of: <br />{@link entities.MatrixArpeggiator.patternSlots}
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
   *  The length of the pattern in steps. The duration of each step is controlled
   *  by the step_length_index parameter of the matrix arpeggiator.
   *
   *
   * key | value
   * --- | ---
   * default | 16
   * range | [1, 64]*/
  length: PrimitiveField<number, "mut">
  /**
   *  The 64 steps of the pattern.
   */
  steps: ArrayField<NexusObject<MatrixArpeggiatorPatternStep>, 64>
}
/** @internal */

export type MatrixArpeggiatorPatternConstructor = {
  /**
   *  The Matrix this pattern belongs to, also includes the index of the pattern.
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
   *  The length of the pattern in steps. The duration of each step is controlled
   *  by the step_length_index parameter of the matrix arpeggiator.
   *
   *
   * key | value
   * --- | ---
   * default | 16
   * range | [1, 64]*/
  length?: number
  /**
   *  The 64 steps of the pattern.
   */
  steps?: MatrixArpeggiatorPatternStepConstructor[] & { length: 64 }
}

/**
 *
 * key | value
 * --- | ---
 * type | object
 *
 *  A step in a matrix arpeggiator pattern.
 *
 *
 * @category Device Fields*/
export type MatrixArpeggiatorPatternStep = {
  /**
   *  Whether the step's velocity is overridden by the step_velocity parameter; otherwise,
   *  the velocity defined by the matrix arpeggiator's velocity parameter is used.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  overrideVelocity: PrimitiveField<boolean, "mut">
  /**
   *  The velocity to use for this step. If override_velocity is false, the velocity defined
   *  by the matrix arpeggiator's velocity parameter is used, and this parameter is ignored.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]*/
  stepVelocity: PrimitiveField<number, "mut">
  /**
   *  Whether the step is muted or not. Muted steps are not played.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  isMuted: PrimitiveField<boolean, "mut">
  /**
   *  Whether the step is tied or not. Tied steps are "tied together" with the next
   *  step, resulting in a single note being played for both steps. If multiple
   *  steps in a row are tied together, the first tied step is played longer.
   *
   *  The parameters of a step following a tied step are ignored.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  isTied: PrimitiveField<boolean, "mut">
  /**
   *  If this is true, then in this step a chord is played made up of all notes
   *  currently entering the arpeggiator.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  isChord: PrimitiveField<boolean, "mut">
}
/** @internal */

export type MatrixArpeggiatorPatternStepConstructor = {
  /**
   *  Whether the step's velocity is overridden by the step_velocity parameter; otherwise,
   *  the velocity defined by the matrix arpeggiator's velocity parameter is used.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  overrideVelocity?: boolean
  /**
   *  The velocity to use for this step. If override_velocity is false, the velocity defined
   *  by the matrix arpeggiator's velocity parameter is used, and this parameter is ignored.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]*/
  stepVelocity?: number
  /**
   *  Whether the step is muted or not. Muted steps are not played.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  isMuted?: boolean
  /**
   *  Whether the step is tied or not. Tied steps are "tied together" with the next
   *  step, resulting in a single note being played for both steps. If multiple
   *  steps in a row are tied together, the first tied step is played longer.
   *
   *  The parameters of a step following a tied step are ignored.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  isTied?: boolean
  /**
   *  If this is true, then in this step a chord is played made up of all notes
   *  currently entering the arpeggiator.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  isChord?: boolean
}

