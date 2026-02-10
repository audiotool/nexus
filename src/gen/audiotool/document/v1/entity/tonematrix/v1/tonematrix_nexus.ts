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
 * key | `"tonematrix"`
 * is | {@link api.TargetType.NoteTrackPlayer}, {@link api.TargetType.PatternTrackPlayer}
 *
 *
 *  The tonematrix is a simple pattern based synth that has a grid ("matrix")
 *  with 16x16 steps on which notes can be turned on or off. The notes of
 *  the 16 pitches are pentatonic starting from C4 (C4, D4, F4, G4, A4; C5, D5, etc)
 *
 *  The sound each step produces is a simple sine with a random panning.
 *
 *
 * @category Device Entities*/
export type Tonematrix = {
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
   *  The currently selected and displayed pattern index. Results in the device playing that pattern, unless
   *  a pattern track is connected to it.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 7]*/
  patternIndex: PrimitiveField<number, "mut">
  /**
   *  Empty fields which TonematrixPatterns can point to. At most one TonematrixPattern
   *  can point to a specific element in this list.
   *
   *
   * key | value
   * --- | ---
   * element is | {@link api.TargetType.TonematrixPatternSlot}*/
  patternSlots: ArrayField<NexusObject<Empty>, 8>
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
   *  Output for the device's notes
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.NotesOutput}*/
  noteOutput: NexusObject<Empty>
  /**
   *  Device main audio out
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioOutput}*/
  audioOutput: NexusObject<Empty>
  /**
   *  Whether the tonematrix is active or not. When is_active=false, no audio or notes are produced by the tonematrix.
   *
   *
   * key | value
   * --- | ---
   * default | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  isActive: PrimitiveField<boolean, "mut">
}
/** @internal */

export type TonematrixConstructor = {
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
   *  The currently selected and displayed pattern index. Results in the device playing that pattern, unless
   *  a pattern track is connected to it.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 7]*/
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
   *  Whether the tonematrix is active or not. When is_active=false, no audio or notes are produced by the tonematrix.
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
 * key | `"tonematrixPattern"`
 * is |
 *
 *
 *  A tonematrix pattern entity.
 *
 *
 * @category Device Entities*/
export type TonematrixPattern = {
  /**
   *  The slot in the tonematrix that this pattern belongs to.
   *
   *
   * key | value
   * --- | ---
   * default | no default, required
   * required | true
   * targets | {@link api.TargetType.TonematrixPatternSlot}, meaning one of: <br />{@link entities.Tonematrix.patternSlots}
   * immutable | true*/
  slot: PrimitiveField<NexusLocation, "immut">
  /**
   *  The steps in this pattern; a list of 16 elements, each representing a step in the pattern.
   */
  steps: ArrayField<NexusObject<TonematrixStep>, 16>
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
}
/** @internal */

export type TonematrixPatternConstructor = {
  /**
   *  The slot in the tonematrix that this pattern belongs to.
   *
   *
   * key | value
   * --- | ---
   * default | no default, required
   * required | true
   * immutable | true*/
  slot: NexusLocation
  /**
   *  The steps in this pattern; a list of 16 elements, each representing a step in the pattern.
   */
  steps?: TonematrixStepConstructor[] & { length: 16 }
  /**
   *  Every pattern can have a groove applied individually.
   *
   *
   * key | value
   * --- | ---
   * default | empty location
   * required | false*/
  groove?: NexusLocation
}

/**
 *
 * key | value
 * --- | ---
 * type | object
 *
 *  A step for a tonematrix pattern.
 *
 *
 * @category Device Fields*/
export type TonematrixStep = {
  /**
   *  Represents which notes are active (0 is top, 15 is bottom).
   *  Notes are pentatonic starting from C4 (at the bottom), so notes are
   *  in reverse order: C4, D4, F4, G4, A4; C5, D5, etc.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  notes: ArrayField<PrimitiveField<boolean, "mut">, 16>
}
/** @internal */

export type TonematrixStepConstructor = {
  /**
   *  Represents which notes are active (0 is top, 15 is bottom).
   *  Notes are pentatonic starting from C4 (at the bottom), so notes are
   *  in reverse order: C4, D4, F4, G4, A4; C5, D5, etc.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  notes?: boolean[] & { length: 16 }
}

