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
 * key | `"beatbox8"`
 * is | {@link api.TargetType.NoteTrackPlayer}, {@link api.TargetType.PatternTrackPlayer}
 *
 *
 *  Data structure for the beatbox 8 drum-machine
 *
 *
 * @category Device Entities*/
export type Beatbox8 = {
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
   *  Empty fields which Beatbox8Patterns can point to. At most one pattern
   *  can point to a given element in this list.
   *
   *
   * key | value
   * --- | ---
   * element is | {@link api.TargetType.Beatbox8PatternSlot}*/
  patternSlots: ArrayField<NexusObject<Empty>, 28>
  /**
   *  The index of the currently selected pattern. Results in the device playing that pattern, unless
   *  a pattern track is connected.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 27]*/
  patternIndex: PrimitiveField<number, "mut">
  /**
   *  Parameters for the beatbox8 Bassdrum instrument..
   */
  bassdrum: NexusObject<Beatbox8Bassdrum>
  /**
   *  Parameters for the beatbox8 Snaredrum instrument.
   */
  snaredrum: NexusObject<Beatbox8Snaredrum>
  /**
   *  Parameters for the beatbox8 Low tom/low conga.
   */
  tomCongaLow: NexusObject<Beatbox8TomCongaLow>
  /**
   *  Parameters for the beatbox8 Mid tom/mid conga.
   */
  tomCongaMid: NexusObject<Beatbox8TomCongaMid>
  /**
   *  Parameters for the beatbox8 High tom/high conga.
   */
  tomCongaHigh: NexusObject<Beatbox8TomCongaHigh>
  /**
   *  Parameters for the beatbox8 Rimshot/claves.
   */
  rimClaves: NexusObject<Beatbox8RimClaves>
  /**
   *  Parameters for the beatbox8 Handclap/maracas.
   */
  clapMaracas: NexusObject<Beatbox8ClapMaracas>
  /**
   *  Parameters for the beatbox8 Cowbell instrument.
   */
  cowbell: NexusObject<Beatbox8Cowbell>
  /**
   *  Parameters for the beatbox8 Cymbal instrument.
   */
  cymbal: NexusObject<Beatbox8Cymbal>
  /**
   *  Parameters for the beatbox8 Open hihat instrument.
   */
  openHihat: NexusObject<Beatbox8OpenHihat>
  /**
   *  Parameters for the beatbox8 Closed hihat instrument.
   */
  closedHihat: NexusObject<Beatbox8ClosedHihat>
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

export type Beatbox8Constructor = {
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
   *  The index of the currently selected pattern. Results in the device playing that pattern, unless
   *  a pattern track is connected.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 27]*/
  patternIndex?: number
  /**
   *  Parameters for the beatbox8 Bassdrum instrument..
   */
  bassdrum?: Beatbox8BassdrumConstructor
  /**
   *  Parameters for the beatbox8 Snaredrum instrument.
   */
  snaredrum?: Beatbox8SnaredrumConstructor
  /**
   *  Parameters for the beatbox8 Low tom/low conga.
   */
  tomCongaLow?: Beatbox8TomCongaLowConstructor
  /**
   *  Parameters for the beatbox8 Mid tom/mid conga.
   */
  tomCongaMid?: Beatbox8TomCongaMidConstructor
  /**
   *  Parameters for the beatbox8 High tom/high conga.
   */
  tomCongaHigh?: Beatbox8TomCongaHighConstructor
  /**
   *  Parameters for the beatbox8 Rimshot/claves.
   */
  rimClaves?: Beatbox8RimClavesConstructor
  /**
   *  Parameters for the beatbox8 Handclap/maracas.
   */
  clapMaracas?: Beatbox8ClapMaracasConstructor
  /**
   *  Parameters for the beatbox8 Cowbell instrument.
   */
  cowbell?: Beatbox8CowbellConstructor
  /**
   *  Parameters for the beatbox8 Cymbal instrument.
   */
  cymbal?: Beatbox8CymbalConstructor
  /**
   *  Parameters for the beatbox8 Open hihat instrument.
   */
  openHihat?: Beatbox8OpenHihatConstructor
  /**
   *  Parameters for the beatbox8 Closed hihat instrument.
   */
  closedHihat?: Beatbox8ClosedHihatConstructor
}

/**
 *
 * key | value
 * --- | ---
 * type | entity
 * key | `"beatbox8Pattern"`
 * is |
 *
 *
 *  A pattern of the beatbox8. A beatbox8 pattern is a sequence of "steps", each step can have at most
 *  step can contain zero, one or multiple active instruments. Further, each step can
 *  be "accented", resulting in all instruments being played louder on that step.
 *
 *  The step duration depends on the step_scale_index field.
 *
 *
 * @category Device Entities*/
export type Beatbox8Pattern = {
  /**
   *  The beatbox8 this pattern belongs to, also includes the index of the pattern.
   *
   *
   * key | value
   * --- | ---
   * default | no default, required
   * required | true
   * targets | {@link api.TargetType.Beatbox8PatternSlot}, meaning one of: <br />{@link entities.Beatbox8.patternSlots}
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
   *  Number of steps before the pattern repeats.
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
  steps: ArrayField<NexusObject<Beatbox8PatternStep>, 64>
}
/** @internal */

export type Beatbox8PatternConstructor = {
  /**
   *  The beatbox8 this pattern belongs to, also includes the index of the pattern.
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
   *  Number of steps before the pattern repeats.
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
  steps?: Beatbox8PatternStepConstructor[] & { length: 64 }
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
export type Beatbox8PatternStep = {
  /**
   *  Whether the bassdrum is active in this step.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  bassdrumIsActive: PrimitiveField<boolean, "mut">
  /**
   *  Whether the snaredrum is active in this step.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  snaredrumIsActive: PrimitiveField<boolean, "mut">
  /**
   *  Whether the low tom/low conga is active in this step.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  tomCongaLowIsActive: PrimitiveField<boolean, "mut">
  /**
   *  Whether the mid tom/mid conga is active in this step.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  tomCongaMidIsActive: PrimitiveField<boolean, "mut">
  /**
   *  Whether the high tom/high conga is active in this step.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  tomCongaHighIsActive: PrimitiveField<boolean, "mut">
  /**
   *  Whether the rimshot/claves is active in this step.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  rimClavesIsActive: PrimitiveField<boolean, "mut">
  /**
   *  Whether the handclap/maracas is active in this step.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  clapMaracasIsActive: PrimitiveField<boolean, "mut">
  /**
   *  Whether the cowbell is active in this step.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  cowbellIsActive: PrimitiveField<boolean, "mut">
  /**
   *  Whether the cymbal is active in this step.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  cymbalIsActive: PrimitiveField<boolean, "mut">
  /**
   *  Whether the open hihat is active in this step.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  openHihatIsActive: PrimitiveField<boolean, "mut">
  /**
   *  Whether the closed hihat is active in this step.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  closedHihatIsActive: PrimitiveField<boolean, "mut">
  /**
   *  If this is true, all active instruments in this step are accented, i.e. they are played louder than the other steps.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  isAccented: PrimitiveField<boolean, "mut">
}
/** @internal */

export type Beatbox8PatternStepConstructor = {
  /**
   *  Whether the bassdrum is active in this step.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  bassdrumIsActive?: boolean
  /**
   *  Whether the snaredrum is active in this step.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  snaredrumIsActive?: boolean
  /**
   *  Whether the low tom/low conga is active in this step.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  tomCongaLowIsActive?: boolean
  /**
   *  Whether the mid tom/mid conga is active in this step.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  tomCongaMidIsActive?: boolean
  /**
   *  Whether the high tom/high conga is active in this step.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  tomCongaHighIsActive?: boolean
  /**
   *  Whether the rimshot/claves is active in this step.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  rimClavesIsActive?: boolean
  /**
   *  Whether the handclap/maracas is active in this step.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  clapMaracasIsActive?: boolean
  /**
   *  Whether the cowbell is active in this step.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  cowbellIsActive?: boolean
  /**
   *  Whether the cymbal is active in this step.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  cymbalIsActive?: boolean
  /**
   *  Whether the open hihat is active in this step.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  openHihatIsActive?: boolean
  /**
   *  Whether the closed hihat is active in this step.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  closedHihatIsActive?: boolean
  /**
   *  If this is true, all active instruments in this step are accented, i.e. they are played louder than the other steps.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  isAccented?: boolean
}

/**
 *
 * key | value
 * --- | ---
 * type | object
 *
 *  Parameters for the beatbox8 Bassdrum instrument.
 *
 *
 * @category Device Fields*/
export type Beatbox8Bassdrum = {
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
   *  Bassdrum tone. 0 is lower, 1 is higher. No unit.
   *
   *
   * key | value
   * --- | ---
   * default | 0.6000000238418579
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  tone: PrimitiveField<number, "mut">
  /**
   *  Decay time of the bassdrum. 0 is shorter, 1 is longer. No unit.
   *
   *
   * key | value
   * --- | ---
   * default | 0.2750000059604645
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

export type Beatbox8BassdrumConstructor = {
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
   *  Bassdrum tone. 0 is lower, 1 is higher. No unit.
   *
   *
   * key | value
   * --- | ---
   * default | 0.6000000238418579
   * range | [0, 1]*/
  tone?: number
  /**
   *  Decay time of the bassdrum. 0 is shorter, 1 is longer. No unit.
   *
   *
   * key | value
   * --- | ---
   * default | 0.2750000059604645
   * range | [0, 1]*/
  decay?: number
}

/**
 *
 * key | value
 * --- | ---
 * type | object
 *
 *  Parameters for the beatbox8 Snaredrum instrument.
 *
 *
 * @category Device Fields*/
export type Beatbox8Snaredrum = {
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
   *  Instrument tone/pitch. 0 is lower, 1 is higher. No unit.
   *
   *
   * key | value
   * --- | ---
   * default | 0.5
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  tone: PrimitiveField<number, "mut">
  /**
   *  Controls the snappiness. 0 is snappier, 1 is more mellow. No unit.
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

export type Beatbox8SnaredrumConstructor = {
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
   *  Instrument tone/pitch. 0 is lower, 1 is higher. No unit.
   *
   *
   * key | value
   * --- | ---
   * default | 0.5
   * range | [0, 1]*/
  tone?: number
  /**
   *  Controls the snappiness. 0 is snappier, 1 is more mellow. No unit.
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
 *  Parameters for the beatbox8 Low tom/low conga instrument.
 *
 *
 * @category Device Fields*/
export type Beatbox8TomCongaLow = {
  /**
   *  Tom/low conga gain. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  gain: PrimitiveField<number, "mut">
  /**
   *  Tuning/pitch. 0 is lower, 1 is higher. No unit.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  tuning: PrimitiveField<number, "mut">
  /**
   *  Whether the instrument is set to tom or conga.
   *  - 0: invalid
   *  - 1: low tom
   *  - 2: low conga
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 2]
   * is | {@link api.TargetType.AutomatableParameter}*/
  instrumentTypeIndex: PrimitiveField<number, "mut">
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

export type Beatbox8TomCongaLowConstructor = {
  /**
   *  Tom/low conga gain. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]*/
  gain?: number
  /**
   *  Tuning/pitch. 0 is lower, 1 is higher. No unit.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  tuning?: number
  /**
   *  Whether the instrument is set to tom or conga.
   *  - 0: invalid
   *  - 1: low tom
   *  - 2: low conga
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 2]*/
  instrumentTypeIndex?: number
}

/**
 *
 * key | value
 * --- | ---
 * type | object
 *
 *  Parameters for the beatbox8 Mid tom/mid conga instrument.
 *
 *
 * @category Device Fields*/
export type Beatbox8TomCongaMid = {
  /**
   *  Tom/mid conga gain. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  gain: PrimitiveField<number, "mut">
  /**
   *  Tuning/pitch. 0 is lower, 1 is higher. No unit.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  tuning: PrimitiveField<number, "mut">
  /**
   *  Whether the instrument is set to tom or conga.
   *  - 0: invalid
   *  - 1: mid tom
   *  - 2: mid conga
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 2]
   * is | {@link api.TargetType.AutomatableParameter}*/
  instrumentTypeIndex: PrimitiveField<number, "mut">
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

export type Beatbox8TomCongaMidConstructor = {
  /**
   *  Tom/mid conga gain. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]*/
  gain?: number
  /**
   *  Tuning/pitch. 0 is lower, 1 is higher. No unit.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  tuning?: number
  /**
   *  Whether the instrument is set to tom or conga.
   *  - 0: invalid
   *  - 1: mid tom
   *  - 2: mid conga
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 2]*/
  instrumentTypeIndex?: number
}

/**
 *
 * key | value
 * --- | ---
 * type | object
 *
 *  Parameters for the beatbox8 High tom/high conga instrument.
 *
 *
 * @category Device Fields*/
export type Beatbox8TomCongaHigh = {
  /**
   *  Tom/high conga gain. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  gain: PrimitiveField<number, "mut">
  /**
   *  Tuning/pitch. 0 is lower, 1 is higher. No unit.
   *
   *
   * key | value
   * --- | ---
   * default | 0.6000000238418579
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  tuning: PrimitiveField<number, "mut">
  /**
   *  Whether the instrument is set to tom or conga
   *  - 0: invalid
   *  - 1: high tom
   *  - 2: high conga
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 2]
   * is | {@link api.TargetType.AutomatableParameter}*/
  instrumentTypeIndex: PrimitiveField<number, "mut">
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

export type Beatbox8TomCongaHighConstructor = {
  /**
   *  Tom/high conga gain. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]*/
  gain?: number
  /**
   *  Tuning/pitch. 0 is lower, 1 is higher. No unit.
   *
   *
   * key | value
   * --- | ---
   * default | 0.6000000238418579
   * range | [0, 1]*/
  tuning?: number
  /**
   *  Whether the instrument is set to tom or conga
   *  - 0: invalid
   *  - 1: high tom
   *  - 2: high conga
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 2]*/
  instrumentTypeIndex?: number
}

/**
 *
 * key | value
 * --- | ---
 * type | object
 *
 *  Parameters for the beatbox8 Rimshot/claves instrument.
 *
 *
 * @category Device Fields*/
export type Beatbox8RimClaves = {
  /**
   *  Rimshot/claves gain. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  gain: PrimitiveField<number, "mut">
  /**
   *  Whether the instrument is set to claves or rimshot.
   *  - 0: invalid
   *  - 1: rimshot
   *  - 2: claves
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 2]
   * is | {@link api.TargetType.AutomatableParameter}*/
  instrumentTypeIndex: PrimitiveField<number, "mut">
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

export type Beatbox8RimClavesConstructor = {
  /**
   *  Rimshot/claves gain. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]*/
  gain?: number
  /**
   *  Whether the instrument is set to claves or rimshot.
   *  - 0: invalid
   *  - 1: rimshot
   *  - 2: claves
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 2]*/
  instrumentTypeIndex?: number
}

/**
 *
 * key | value
 * --- | ---
 * type | object
 *
 *  Parameters for the beatbox8 Handclap/maracas instrument.
 *
 *
 * @category Device Fields*/
export type Beatbox8ClapMaracas = {
  /**
   *  Maracas gain. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  gain: PrimitiveField<number, "mut">
  /**
   *  Whether the instrument is set to handclap or maracas.
   *  - 0: invalid
   *  - 1: handclap
   *  - 2: maracas
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 2]
   * is | {@link api.TargetType.AutomatableParameter}*/
  instrumentTypeIndex: PrimitiveField<number, "mut">
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

export type Beatbox8ClapMaracasConstructor = {
  /**
   *  Maracas gain. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]*/
  gain?: number
  /**
   *  Whether the instrument is set to handclap or maracas.
   *  - 0: invalid
   *  - 1: handclap
   *  - 2: maracas
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 2]*/
  instrumentTypeIndex?: number
}

/**
 *
 * key | value
 * --- | ---
 * type | object
 *
 *  Parameters for the beatbox8 Cowbell instrument.
 *
 *
 * @category Device Fields*/
export type Beatbox8Cowbell = {
  /**
   *  Cowbell gain. Equivalent to a dB range of [-inf, 0.0].
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

export type Beatbox8CowbellConstructor = {
  /**
   *  Cowbell gain. Equivalent to a dB range of [-inf, 0.0].
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
 *  Parameters for the beatbox8 Cymbal instrument.
 *
 *
 * @category Device Fields*/
export type Beatbox8Cymbal = {
  /**
   *  Cymbal gain. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  gain: PrimitiveField<number, "mut">
  /**
   *  Instrument tone. 0 is lower, 1 is higher. No unit.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  tone: PrimitiveField<number, "mut">
  /**
   *  Decay time for the instrument. 0 is shorter, 1 is longer. No unit.
   *
   *
   * key | value
   * --- | ---
   * default | 0
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

export type Beatbox8CymbalConstructor = {
  /**
   *  Cymbal gain. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]*/
  gain?: number
  /**
   *  Instrument tone. 0 is lower, 1 is higher. No unit.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  tone?: number
  /**
   *  Decay time for the instrument. 0 is shorter, 1 is longer. No unit.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  decay?: number
}

/**
 *
 * key | value
 * --- | ---
 * type | object
 *
 *  Parameters for the beatbox8 Open hihat instrument.
 *
 *
 * @category Device Fields*/
export type Beatbox8OpenHihat = {
  /**
   *  Open hihat gain. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  gain: PrimitiveField<number, "mut">
  /**
   *  Decay time for the instrument. 0 is shorter, 1 is longer. No unit.
   *
   *
   * key | value
   * --- | ---
   * default | 0.8220000267028809
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

export type Beatbox8OpenHihatConstructor = {
  /**
   *  Open hihat gain. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]*/
  gain?: number
  /**
   *  Decay time for the instrument. 0 is shorter, 1 is longer. No unit.
   *
   *
   * key | value
   * --- | ---
   * default | 0.8220000267028809
   * range | [0, 1]*/
  decay?: number
}

/**
 *
 * key | value
 * --- | ---
 * type | object
 *
 *  Parameters for the beatbox8 Closed hihat instrument.
 *
 *
 * @category Device Fields*/
export type Beatbox8ClosedHihat = {
  /**
   *  Closed hihat gain. Equivalent to a dB range of [-inf, 0.0].
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

export type Beatbox8ClosedHihatConstructor = {
  /**
   *  Closed hihat gain. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]*/
  gain?: number
}

