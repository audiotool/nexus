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
 * key | `"beatbox9"`
 * is | {@link api.TargetType.NoteTrackPlayer}, {@link api.TargetType.PatternTrackPlayer}
 *
 *
 *  Data structure for the beatbox 9 drum-machine
 *
 *
 * @category Device Entities*/
export type Beatbox9 = {
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
   * default | 0.7079457640647888
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  gain: PrimitiveField<number, "mut">
  /**
   *  The loudness of unaccented notes. 0 is quieter, 1 is louder. No unit.
   *
   *
   * key | value
   * --- | ---
   * default | 0.5
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  accentAmount: PrimitiveField<number, "mut">
  /**
   *  Whether the device is active or not. When is_active=false, no audio is produced.
   *
   *
   * key | value
   * --- | ---
   * default | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  isActive: PrimitiveField<boolean, "mut">
  /**
   *  Empty fields which Beatbox9Patterns can point to. At most one pattern can point to a specific element in this list.
   *
   *
   * key | value
   * --- | ---
   * element is | {@link api.TargetType.Beatbox9PatternSlot}*/
  patternSlots: ArrayField<NexusObject<Empty>, 28>
  /**
   *  The index of the currently selected pattern
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 27]*/
  patternIndex: PrimitiveField<number, "mut">
  /**
   *  Bassdrum instrument
   */
  bassdrum: NexusObject<Beatbox9Bassdrum>
  /**
   *  Snaredrum instrument
   */
  snaredrum: NexusObject<Beatbox9Snaredrum>
  /**
   *  Low tom.
   */
  tomLow: NexusObject<Beatbox9Tom>
  /**
   *  Mid tom.
   */
  tomMid: NexusObject<Beatbox9Tom>
  /**
   *  High tom.
   */
  tomHigh: NexusObject<Beatbox9Tom>
  /**
   *  Rimshot
   */
  rim: NexusObject<Beatbox9Rim>
  /**
   *  Handclap
   */
  clap: NexusObject<Beatbox9Clap>
  /**
   *  hihat instrument
   */
  hihat: NexusObject<Beatbox9Hihat>
  /**
   *  Crash
   */
  crash: NexusObject<Beatbox9Crash>
  /**
   *  Ride
   */
  ride: NexusObject<Beatbox9Ride>
  /**
   *  Single Output
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioOutput}*/
  audioOutput: NexusObject<Empty>
  /**
   *  Notes Input.
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.NotesInput}*/
  notesInput: NexusObject<Empty>
}
/** @internal */

export type Beatbox9Constructor = {
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
   * default | 0.7079457640647888
   * range | [0, 1]*/
  gain?: number
  /**
   *  The loudness of unaccented notes. 0 is quieter, 1 is louder. No unit.
   *
   *
   * key | value
   * --- | ---
   * default | 0.5
   * range | [0, 1]*/
  accentAmount?: number
  /**
   *  Whether the device is active or not. When is_active=false, no audio is produced.
   *
   *
   * key | value
   * --- | ---
   * default | true*/
  isActive?: boolean
  /**
   *  The index of the currently selected pattern
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 27]*/
  patternIndex?: number
  /**
   *  Bassdrum instrument
   */
  bassdrum?: Beatbox9BassdrumConstructor
  /**
   *  Snaredrum instrument
   */
  snaredrum?: Beatbox9SnaredrumConstructor
  /**
   *  Low tom.
   */
  tomLow?: Beatbox9TomConstructor
  /**
   *  Mid tom.
   */
  tomMid?: Beatbox9TomConstructor
  /**
   *  High tom.
   */
  tomHigh?: Beatbox9TomConstructor
  /**
   *  Rimshot
   */
  rim?: Beatbox9RimConstructor
  /**
   *  Handclap
   */
  clap?: Beatbox9ClapConstructor
  /**
   *  hihat instrument
   */
  hihat?: Beatbox9HihatConstructor
  /**
   *  Crash
   */
  crash?: Beatbox9CrashConstructor
  /**
   *  Ride
   */
  ride?: Beatbox9RideConstructor
}

/**
 *
 * key | value
 * --- | ---
 * type | entity
 * key | `"beatbox9Pattern"`
 * is |
 *
 *
 *  A pattern for the composer
 *
 *
 * @category Device Entities*/
export type Beatbox9Pattern = {
  /**
   *  The beatbox9 this pattern belongs to, also includes the index of the pattern.
   *
   *
   * key | value
   * --- | ---
   * default | no default, required
   * required | true
   * targets | {@link api.TargetType.Beatbox9PatternSlot}, meaning one of: <br />{@link entities.Beatbox9.patternSlots}
   * immutable | true*/
  slot: PrimitiveField<NexusLocation, "immut">
  /**
   *  Every pattern can have a groove applied individually
   *
   *
   * key | value
   * --- | ---
   * default | empty location
   * required | false
   * targets | {@link api.TargetType.Groove}, meaning one of: <br />{@link entities.Groove}*/
  groove: PrimitiveField<NexusLocation, "mut">
  /**
   *  Length of the pattern
   *
   *
   * key | value
   * --- | ---
   * default | 16
   * range | [1, 64]*/
  length: PrimitiveField<number, "mut">
  /**
   *  The duration of each step in ticks.
   *
   *  - 0: invalid
   *  - 1: 6 steps per 1/4th note = 1/24th semibreve (640 ticks) per step
   *  - 2: 3 steps per 1/4th note = 1/12th semibreve (1280 ticks) per step
   *  - 3: 4 steps per 1/4th note = 1/16th semibreve (960 ticks) per step
   *  - 4: 8 steps per 1/4th note = 1/32nd semibreve (480 ticks) per step
   *
   *
   * key | value
   * --- | ---
   * default | 3
   * range | [1, 4]*/
  stepScaleIndex: PrimitiveField<number, "mut">
  /**
   *  Steps inside the current pattern.
   */
  steps: ArrayField<NexusObject<Beatbox9PatternStep>, 64>
}
/** @internal */

export type Beatbox9PatternConstructor = {
  /**
   *  The beatbox9 this pattern belongs to, also includes the index of the pattern.
   *
   *
   * key | value
   * --- | ---
   * default | no default, required
   * required | true
   * immutable | true*/
  slot: NexusLocation
  /**
   *  Every pattern can have a groove applied individually
   *
   *
   * key | value
   * --- | ---
   * default | empty location
   * required | false*/
  groove?: NexusLocation
  /**
   *  Length of the pattern
   *
   *
   * key | value
   * --- | ---
   * default | 16
   * range | [1, 64]*/
  length?: number
  /**
   *  The duration of each step in ticks.
   *
   *  - 0: invalid
   *  - 1: 6 steps per 1/4th note = 1/24th semibreve (640 ticks) per step
   *  - 2: 3 steps per 1/4th note = 1/12th semibreve (1280 ticks) per step
   *  - 3: 4 steps per 1/4th note = 1/16th semibreve (960 ticks) per step
   *  - 4: 8 steps per 1/4th note = 1/32nd semibreve (480 ticks) per step
   *
   *
   * key | value
   * --- | ---
   * default | 3
   * range | [1, 4]*/
  stepScaleIndex?: number
  /**
   *  Steps inside the current pattern.
   */
  steps?: Beatbox9PatternStepConstructor[] & { length: 64 }
}

/**
 *
 * key | value
 * --- | ---
 * type | object
 *
 *  A single step inside a pattern
 *
 *
 * @category Device Fields*/
export type Beatbox9PatternStep = {
  /**
   *  Whether the bassdrum is active in this step.
   *  - 0: off
   *  - 1: active
   *  - 2: active and accented
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 2]*/
  bassdrumStepIndex: PrimitiveField<number, "mut">
  /**
   *  Whether the snaredrum is active in this step.
   *  - 0: off
   *  - 1: active
   *  - 2: active and accented
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 2]*/
  snaredrumStepIndex: PrimitiveField<number, "mut">
  /**
   *  Whether the low tom is active in this step.
   *  - 0: off
   *  - 1: active
   *  - 2: active and accented
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 2]*/
  tomLowStepIndex: PrimitiveField<number, "mut">
  /**
   *  Whether the mid tom is active in this step.
   *  - 0: off
   *  - 1: active
   *  - 2: active and accented
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 2]*/
  tomMidStepIndex: PrimitiveField<number, "mut">
  /**
   *  Whether the high tom is active in this step.
   *  - 0: off
   *  - 1: active
   *  - 2: active and accented
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 2]*/
  tomHighStepIndex: PrimitiveField<number, "mut">
  /**
   *  Whether the rimshot is active in this step.
   *  - 0: off
   *  - 1: active
   *  - 2: active and accented
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 2]*/
  rimStepIndex: PrimitiveField<number, "mut">
  /**
   *  Whether the handclap is active in this step.
   *  - 0: off
   *  - 1: active
   *  - 2: active and accented
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 2]*/
  clapStepIndex: PrimitiveField<number, "mut">
  /**
   *  Whether the closed hihat is active in this step.
   *  - 0: off
   *  - 1: active
   *  - 2: active and accented
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 2]*/
  closedHihatStepIndex: PrimitiveField<number, "mut">
  /**
   *  Whether the open hihat is active in this step.
   *  - 0: off
   *  - 1: active
   *  - 2: active and accented
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 2]*/
  openHihatStepIndex: PrimitiveField<number, "mut">
  /**
   *  Whether the crash is active in this step.
   *  - 0: off
   *  - 1: active
   *  - 2: active and accented
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 2]*/
  crashStepIndex: PrimitiveField<number, "mut">
  /**
   *  Whether the ride is active in this step.
   *  - 0: off
   *  - 1: active
   *  - 2: active and accented
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 2]*/
  rideStepIndex: PrimitiveField<number, "mut">
}
/** @internal */

export type Beatbox9PatternStepConstructor = {
  /**
   *  Whether the bassdrum is active in this step.
   *  - 0: off
   *  - 1: active
   *  - 2: active and accented
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 2]*/
  bassdrumStepIndex?: number
  /**
   *  Whether the snaredrum is active in this step.
   *  - 0: off
   *  - 1: active
   *  - 2: active and accented
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 2]*/
  snaredrumStepIndex?: number
  /**
   *  Whether the low tom is active in this step.
   *  - 0: off
   *  - 1: active
   *  - 2: active and accented
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 2]*/
  tomLowStepIndex?: number
  /**
   *  Whether the mid tom is active in this step.
   *  - 0: off
   *  - 1: active
   *  - 2: active and accented
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 2]*/
  tomMidStepIndex?: number
  /**
   *  Whether the high tom is active in this step.
   *  - 0: off
   *  - 1: active
   *  - 2: active and accented
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 2]*/
  tomHighStepIndex?: number
  /**
   *  Whether the rimshot is active in this step.
   *  - 0: off
   *  - 1: active
   *  - 2: active and accented
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 2]*/
  rimStepIndex?: number
  /**
   *  Whether the handclap is active in this step.
   *  - 0: off
   *  - 1: active
   *  - 2: active and accented
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 2]*/
  clapStepIndex?: number
  /**
   *  Whether the closed hihat is active in this step.
   *  - 0: off
   *  - 1: active
   *  - 2: active and accented
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 2]*/
  closedHihatStepIndex?: number
  /**
   *  Whether the open hihat is active in this step.
   *  - 0: off
   *  - 1: active
   *  - 2: active and accented
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 2]*/
  openHihatStepIndex?: number
  /**
   *  Whether the crash is active in this step.
   *  - 0: off
   *  - 1: active
   *  - 2: active and accented
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 2]*/
  crashStepIndex?: number
  /**
   *  Whether the ride is active in this step.
   *  - 0: off
   *  - 1: active
   *  - 2: active and accented
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 2]*/
  rideStepIndex?: number
}

/**
 *
 * key | value
 * --- | ---
 * type | object
 *
 *  Bassdrum
 *
 *
 * @category Device Fields*/
export type Beatbox9Bassdrum = {
  /**
   *  Bassdrum gain. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  gain: PrimitiveField<number, "mut">
  /**
   *  Bassdrum tone/pitch, a higher value makes it sound higher. No unit.
   *
   *
   * key | value
   * --- | ---
   * default | 0.6000000238418579
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  tone: PrimitiveField<number, "mut">
  /**
   *  Attack time for the instrument. 0 is shorter, 1 is longer. No unit.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  attack: PrimitiveField<number, "mut">
  /**
   *  Decay time for the instrument. 0 is shorter, 1 is longer. No unit.
   *
   *
   * key | value
   * --- | ---
   * default | 0.3149999976158142
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  decay: PrimitiveField<number, "mut">
  /**
   *  Single Output
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioOutput}*/
  audioOutput: NexusObject<Empty>
}
/** @internal */

export type Beatbox9BassdrumConstructor = {
  /**
   *  Bassdrum gain. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]*/
  gain?: number
  /**
   *  Bassdrum tone/pitch, a higher value makes it sound higher. No unit.
   *
   *
   * key | value
   * --- | ---
   * default | 0.6000000238418579
   * range | [0, 1]*/
  tone?: number
  /**
   *  Attack time for the instrument. 0 is shorter, 1 is longer. No unit.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]*/
  attack?: number
  /**
   *  Decay time for the instrument. 0 is shorter, 1 is longer. No unit.
   *
   *
   * key | value
   * --- | ---
   * default | 0.3149999976158142
   * range | [0, 1]*/
  decay?: number
}

/**
 *
 * key | value
 * --- | ---
 * type | object
 *
 *  Snaredrum
 *
 *
 * @category Device Fields*/
export type Beatbox9Snaredrum = {
  /**
   *  Snaredrum gain. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  gain: PrimitiveField<number, "mut">
  /**
   *  Influence the pitch of the snaredrum. 0 is lower, 1 is higher. No unit.
   *
   *
   * key | value
   * --- | ---
   * default | 0.699999988079071
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  tune: PrimitiveField<number, "mut">
  /**
   *  Controls the snaredrum's "tone", controls the decay duration of the noisy component
   *  of the snare sound. 0 is shorter, 1 is longer. No unit.
   *
   *
   * key | value
   * --- | ---
   * default | 0.1837099939584732
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  tone: PrimitiveField<number, "mut">
  /**
   *  Controls the snaredrum's "snappiness"m, corresponding roughly to the amount of
   *  high frequency content. 0 is snappier, 1 is more mellow. No unit.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  snappy: PrimitiveField<number, "mut">
  /**
   *  Single Output
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioOutput}*/
  audioOutput: NexusObject<Empty>
}
/** @internal */

export type Beatbox9SnaredrumConstructor = {
  /**
   *  Snaredrum gain. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]*/
  gain?: number
  /**
   *  Influence the pitch of the snaredrum. 0 is lower, 1 is higher. No unit.
   *
   *
   * key | value
   * --- | ---
   * default | 0.699999988079071
   * range | [0, 1]*/
  tune?: number
  /**
   *  Controls the snaredrum's "tone", controls the decay duration of the noisy component
   *  of the snare sound. 0 is shorter, 1 is longer. No unit.
   *
   *
   * key | value
   * --- | ---
   * default | 0.1837099939584732
   * range | [0, 1]*/
  tone?: number
  /**
   *  Controls the snaredrum's "snappiness"m, corresponding roughly to the amount of
   *  high frequency content. 0 is snappier, 1 is more mellow. No unit.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]*/
  snappy?: number
}

/**
 *
 * key | value
 * --- | ---
 * type | object
 *
 *  Tom
 *
 *
 * @category Device Fields*/
export type Beatbox9Tom = {
  /**
   *  Tom gain. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  gain: PrimitiveField<number, "mut">
  /**
   *  Tune of the tom; a lower value makes it sound lower. No unit.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  tune: PrimitiveField<number, "mut">
  /**
   *  Decay time for the instrument. Higher values make the sound longer. No unit.
   *
   *
   * key | value
   * --- | ---
   * default | 0.6710000038146973
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  decay: PrimitiveField<number, "mut">
  /**
   *  Single Output
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioOutput}*/
  audioOutput: NexusObject<Empty>
}
/** @internal */

export type Beatbox9TomConstructor = {
  /**
   *  Tom gain. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]*/
  gain?: number
  /**
   *  Tune of the tom; a lower value makes it sound lower. No unit.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  tune?: number
  /**
   *  Decay time for the instrument. Higher values make the sound longer. No unit.
   *
   *
   * key | value
   * --- | ---
   * default | 0.6710000038146973
   * range | [0, 1]*/
  decay?: number
}

/**
 *
 * key | value
 * --- | ---
 * type | object
 *
 *  Rimshot
 *
 *
 * @category Device Fields*/
export type Beatbox9Rim = {
  /**
   *  Rimshot gain. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  gain: PrimitiveField<number, "mut">
  /**
   *  Single Output
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioOutput}*/
  audioOutput: NexusObject<Empty>
}
/** @internal */

export type Beatbox9RimConstructor = {
  /**
   *  Rimshot gain. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]*/
  gain?: number
}

/**
 *
 * key | value
 * --- | ---
 * type | object
 *
 *  Handclap
 *
 *
 * @category Device Fields*/
export type Beatbox9Clap = {
  /**
   *  Handclap gain. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  gain: PrimitiveField<number, "mut">
  /**
   *  Single Output
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioOutput}*/
  audioOutput: NexusObject<Empty>
}
/** @internal */

export type Beatbox9ClapConstructor = {
  /**
   *  Handclap gain. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]*/
  gain?: number
}

/**
 *
 * key | value
 * --- | ---
 * type | object
 *
 *  Hihat
 *
 *
 * @category Device Fields*/
export type Beatbox9Hihat = {
  /**
   *  Hihat gain. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  gain: PrimitiveField<number, "mut">
  /**
   *  Closed decay time for the instrument. 0 is shorter, 1 is longer. No unit.
   *
   *
   * key | value
   * --- | ---
   * default | 0.5
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  closedDecay: PrimitiveField<number, "mut">
  /**
   *  Open decay time for the instrument. 0 is shorter, 1 is longer. No unit.
   *
   *
   * key | value
   * --- | ---
   * default | 0.5
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  openDecay: PrimitiveField<number, "mut">
  /**
   *  Single Output
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioOutput}*/
  audioOutput: NexusObject<Empty>
}
/** @internal */

export type Beatbox9HihatConstructor = {
  /**
   *  Hihat gain. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]*/
  gain?: number
  /**
   *  Closed decay time for the instrument. 0 is shorter, 1 is longer. No unit.
   *
   *
   * key | value
   * --- | ---
   * default | 0.5
   * range | [0, 1]*/
  closedDecay?: number
  /**
   *  Open decay time for the instrument. 0 is shorter, 1 is longer. No unit.
   *
   *
   * key | value
   * --- | ---
   * default | 0.5
   * range | [0, 1]*/
  openDecay?: number
}

/**
 *
 * key | value
 * --- | ---
 * type | object
 *
 *  Crash
 *
 *
 * @category Device Fields*/
export type Beatbox9Crash = {
  /**
   *  Crash gain. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  gain: PrimitiveField<number, "mut">
  /**
   *  The crash's tone; a lower value makes it sound lower. No unit.
   *
   *
   * key | value
   * --- | ---
   * default | 0.5
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  tune: PrimitiveField<number, "mut">
  /**
   *  Single Output
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioOutput}*/
  audioOutput: NexusObject<Empty>
}
/** @internal */

export type Beatbox9CrashConstructor = {
  /**
   *  Crash gain. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]*/
  gain?: number
  /**
   *  The crash's tone; a lower value makes it sound lower. No unit.
   *
   *
   * key | value
   * --- | ---
   * default | 0.5
   * range | [0, 1]*/
  tune?: number
}

/**
 *
 * key | value
 * --- | ---
 * type | object
 *
 *  Ride
 *
 *
 * @category Device Fields*/
export type Beatbox9Ride = {
  /**
   *  Ride gain. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  gain: PrimitiveField<number, "mut">
  /**
   *  The ride's tone; a lower value makes it sound lower. No unit.
   *
   *
   * key | value
   * --- | ---
   * default | 0.5
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  tune: PrimitiveField<number, "mut">
  /**
   *  Single Output
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioOutput}*/
  audioOutput: NexusObject<Empty>
}
/** @internal */

export type Beatbox9RideConstructor = {
  /**
   *  Ride gain. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]*/
  gain?: number
  /**
   *  The ride's tone; a lower value makes it sound lower. No unit.
   *
   *
   * key | value
   * --- | ---
   * default | 0.5
   * range | [0, 1]*/
  tune?: number
}

