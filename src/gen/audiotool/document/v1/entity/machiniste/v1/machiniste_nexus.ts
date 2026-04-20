// THIS FILE IS GENERATED - DO NOT EDIT
// Copyright 2026 Audiotool Inc.

import { ArrayField, PrimitiveField } from "@document/fields"
import { type NexusLocation } from "@document/location"
import { NexusObject } from "@document/object"
import { type Empty } from "@gen/document/v1/empty_nexus"

/**
 *
 * key | value
 * --- | ---
 * type | entity
 * key | `"machiniste"`
 * is | {@link api.TargetType.NoteTrackPlayer}, {@link api.TargetType.PatternTrackPlayer}
 *
 *
 *  data structure for the Machiniste sampler
 *
 *
 * @category Device Entities*/
export type Machiniste = {
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
   *  The backend name of the preset applied to this device, if any. Usually presets/{uuid}.
   *  This is used for record-keeping only and has no effect on the sound of the device.
   */
  presetName: PrimitiveField<string, "mut">
  /**
   *  Output gain of the main output channel. This only affects the sum signal, not
   *  the individual channels. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 0.7079399824142456
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  mainOutputGain: PrimitiveField<number, "mut">
  /**
   *  The sum output of all channels, influenced by the main_output_gain.
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioOutput}*/
  mainOutput: NexusObject<Empty>
  /**
   *  Global modulation depth applied to all notes.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  globalModulationDepth: PrimitiveField<number, "mut">
  /**
   *  Empty fields which MachinistePatterns can point to. At most one pattern
   *  can point to a specific element in this list.
   *
   *
   * key | value
   * --- | ---
   * element is | {@link api.TargetType.MachinistePatternSlot}*/
  patternSlots: ArrayField<NexusObject<Empty>, 32>
  /**
   *  The index of the currently selected pattern. Determines which pattern the Machiniste
   *  currently plays back, unless a pattern track is connected to it.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 31]*/
  patternIndex: PrimitiveField<number, "mut">
  /**
   *  Each channel's sample and modulation config.
   */
  channels: ArrayField<NexusObject<MachinisteChannel>, 9>
  /**
   *  Notes Input.
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.NotesInput}*/
  notesInput: NexusObject<Empty>
  /**
   *  Whether the device is active or not. If is_active=false, no sound is produced.
   *
   *
   * key | value
   * --- | ---
   * default | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  isActive: PrimitiveField<boolean, "mut">
}
/** @internal */

export type MachinisteConstructor = {
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
   *  The backend name of the preset applied to this device, if any. Usually presets/{uuid}.
   *  This is used for record-keeping only and has no effect on the sound of the device.
   */
  presetName?: string
  /**
   *  Output gain of the main output channel. This only affects the sum signal, not
   *  the individual channels. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 0.7079399824142456
   * range | [0, 1]*/
  mainOutputGain?: number
  /**
   *  Global modulation depth applied to all notes.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [-1, 1]*/
  globalModulationDepth?: number
  /**
   *  The index of the currently selected pattern. Determines which pattern the Machiniste
   *  currently plays back, unless a pattern track is connected to it.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 31]*/
  patternIndex?: number
  /**
   *  Each channel's sample and modulation config.
   */
  channels?: MachinisteChannelConstructor[] & { length: 9 }
  /**
   *  Whether the device is active or not. If is_active=false, no sound is produced.
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
 * key | `"machinistePattern"`
 * is |
 *
 *
 *  A machiniste pattern. Contains all steps for all channels in a single pattern.
 *  Can point to a "pattern slot" of the machiniste.
 *
 *
 * @category Device Entities*/
export type MachinistePattern = {
  /**
   *  The slot in a machiniste that this pattern belongs to.
   *
   *
   * key | value
   * --- | ---
   * default | no default, required
   * required | true
   * targets | {@link api.TargetType.MachinistePatternSlot}, meaning one of: <br />{@link entities.Machiniste.patternSlots}
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
   *  The duration of each step in ticks:
   *
   *  - 0: invalid
   *  - 1: 4 steps per 1/4th note = 1/16th semibreve (960 ticks) per step
   *  - 2: 8 steps per 1/4th note = 1/32nd semibreve (480 ticks) per step
   *  - 3: 3 steps per 1/4th note = 1/12th semibreve (1280 ticks) per step
   *  - 4: 6 steps per 1/4th note = 1/24th semibreve (640 ticks) per step
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 4]*/
  stepScaleIndex: PrimitiveField<number, "mut">
  /**
   *  Number of steps before the pattern repeats.
   *
   *
   * key | value
   * --- | ---
   * default | 16
   * range | [1, 128]*/
  length: PrimitiveField<number, "mut">
  /**
   *  Storage of the actual pattern steps for each of the 9 channels.
   */
  channelPatterns: ArrayField<NexusObject<MachinisteChannelPattern>, 9>
}
/** @internal */

export type MachinistePatternConstructor = {
  /**
   *  The slot in a machiniste that this pattern belongs to.
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
   *  The duration of each step in ticks:
   *
   *  - 0: invalid
   *  - 1: 4 steps per 1/4th note = 1/16th semibreve (960 ticks) per step
   *  - 2: 8 steps per 1/4th note = 1/32nd semibreve (480 ticks) per step
   *  - 3: 3 steps per 1/4th note = 1/12th semibreve (1280 ticks) per step
   *  - 4: 6 steps per 1/4th note = 1/24th semibreve (640 ticks) per step
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 4]*/
  stepScaleIndex?: number
  /**
   *  Number of steps before the pattern repeats.
   *
   *
   * key | value
   * --- | ---
   * default | 16
   * range | [1, 128]*/
  length?: number
  /**
   *  Storage of the actual pattern steps for each of the 9 channels.
   */
  channelPatterns?: MachinisteChannelPatternConstructor[] & { length: 9 }
}

/**
 *
 * key | value
 * --- | ---
 * type | object
 *
 *  Holds the pattern steps for a single machiniste chanel.
 *
 *
 * @category Device Fields*/
export type MachinisteChannelPattern = {
  /**
   *  Specifies whether the channel is grouped as "exclusive", preventing channels from playing notes on the same step
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  isExclusive: PrimitiveField<boolean, "mut">
  /**
   *  Specifies whether the channel is muted
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  isMuted: PrimitiveField<boolean, "mut">
  /**
   *  Storage of the pattern steps.
   */
  steps: ArrayField<NexusObject<MachinisteStep>, 128>
}
/** @internal */

export type MachinisteChannelPatternConstructor = {
  /**
   *  Specifies whether the channel is grouped as "exclusive", preventing channels from playing notes on the same step
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  isExclusive?: boolean
  /**
   *  Specifies whether the channel is muted
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  isMuted?: boolean
  /**
   *  Storage of the pattern steps.
   */
  steps?: MachinisteStepConstructor[] & { length: 128 }
}

/**
 *
 * key | value
 * --- | ---
 * type | object
 *
 *  The step information for a single step. Each step has a modulation depth
 *  and a boolean flag indicating whether the step is on or off.
 *  The modulation depth causes the note played for that step to be modulated
 *  by the modulation amount assigned to every parameter for that channel
 *  below.
 *
 *
 * @category Device Fields*/
export type MachinisteStep = {
  /**
   *  Whether the step is active. If is_active=false, the step is not played.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  isActive: PrimitiveField<boolean, "mut">
  /**
   *  The modulation depth for the step.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]*/
  modulationDepth: PrimitiveField<number, "mut">
}
/** @internal */

export type MachinisteStepConstructor = {
  /**
   *  Whether the step is active. If is_active=false, the step is not played.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  isActive?: boolean
  /**
   *  The modulation depth for the step.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]*/
  modulationDepth?: number
}

/**
 *
 * key | value
 * --- | ---
 * type | object
 *
 *  Holds the parameters, their modulation amount, and the loaded sample
 *  for a single channel.
 *
 *  The effective "modulation depth" for each step is the multiplication of
 *  the various modulation depths for this step & parameter, which are:
 *  - the global modulation depth
 *  - the parameter modulation depth
 *  - the step modulation depth
 *
 *  Call this "mod amount".
 *
 *  The effective parameter value used, in % of the parameter's full range, is:
 *  - -> if the modulation is positive:
 *         mod amount * (1 - parameter value) + parameter value
 *  - -> if the modulation is negative:
 *         mod amount * parameter value + parameter value
 *
 *
 * @category Device Fields*/
export type MachinisteChannel = {
  /**
   *  Audio sample to be played on this channel.
   *
   *
   * key | value
   * --- | ---
   * default | empty location
   * required | false
   * targets | {@link api.TargetType.Sample}, meaning one of: <br />{@link entities.Sample}*/
  sample: PrimitiveField<NexusLocation, "mut">
  /**
   *  This sets the starting point in the sample in % of the sample length.
   *  0 means start is at time 0, 1 means start is at the end of the sample.
   *
   *  If start > end, the sample is played backwards.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  startTrimFactor: PrimitiveField<number, "mut">
  /**
   *  Modulation depth of start_trim_factor. See message documentation for more details.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  startTrimModulationDepth: PrimitiveField<number, "mut">
  /**
   *  This sets the ending point in the sample in % of the sample length.
   *  0 means end is at time 0, 1 means end is at the end of the sample.
   *
   *  If start > end, the sample is played backwards.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  endTrimFactor: PrimitiveField<number, "mut">
  /**
   *  Modulation depth of end_trim_factor. See message documentation for more details.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  endTrimModulationDepth: PrimitiveField<number, "mut">
  /**
   *  Tunes the sample by a given amount of semitones by playing it at a different speed.
   *
   *  For example, -12 detunes the sample by 1 octave by playing it at half the original speed.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-24, 24]
   * is | {@link api.TargetType.AutomatableParameter}*/
  pitchSemitones: PrimitiveField<number, "mut">
  /**
   *  Modulation depth of tune. See message documentation for more details.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  pitchModulationDepth: PrimitiveField<number, "mut">
  /**
   *  Selects the sample filter type.
   *
   *  - 0: invalid
   *  - 1: no filter
   *  - 2: low-pass
   *  - 3: high-pass
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 3]
   * is | {@link api.TargetType.AutomatableParameter}*/
  filterTypeIndex: PrimitiveField<number, "mut">
  /**
   *  Filter cutoff, mapped to [28hz, 12000hz].
   *
   *
   * key | value
   * --- | ---
   * default | 6000
   * range | [28, 12000]
   * is | {@link api.TargetType.AutomatableParameter}*/
  cutoffFrequencyHz: PrimitiveField<number, "mut">
  /**
   *  Modulation depth of cutoff. See message documentation for more details.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  cutoffModulationDepth: PrimitiveField<number, "mut">
  /**
   *  Filter resonance. No unit.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  resonance: PrimitiveField<number, "mut">
  /**
   *  Modulation depth of resonance. See message documentation for more details.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  resonanceModulationDepth: PrimitiveField<number, "mut">
  /**
   *  At what point during the sample playback, in % of the sample length, the envelope peaks.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  envelopePeakRatio: PrimitiveField<number, "mut">
  /**
   *  Modulation depth of envelope ratio. See message documentation for more details.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  envelopeRatioModulationDepth: PrimitiveField<number, "mut">
  /**
   *  The steepness of the slope. 0 is linear, -1 slopes up, 1 slopes down.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  envelopeSlope: PrimitiveField<number, "mut">
  /**
   *  Modulation depth of envelope slope. See message documentation for more details.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  envelopeSlopeModulationDepth: PrimitiveField<number, "mut">
  /**
   *  Pans the signal to left/right. -1 is fully left, 0 is centered (unchanged), 1 is fully right.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  panning: PrimitiveField<number, "mut">
  /**
   *  Modulation depth of panning. See message documentation for more details.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  panningModulationDepth: PrimitiveField<number, "mut">
  /**
   *  Output gain of the channel. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 0.10000000149011612
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  gain: PrimitiveField<number, "mut">
  /**
   *  Modulation depth of gain. See message documentation for more details.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  gainModulationDepth: PrimitiveField<number, "mut">
  /**
   *  Individual channel output, if connected then the audio from
   *  this channel no longer outputs via the master output.
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioOutput}*/
  channelOutput: NexusObject<Empty>
}
/** @internal */

export type MachinisteChannelConstructor = {
  /**
   *  Audio sample to be played on this channel.
   *
   *
   * key | value
   * --- | ---
   * default | empty location
   * required | false*/
  sample?: NexusLocation
  /**
   *  This sets the starting point in the sample in % of the sample length.
   *  0 means start is at time 0, 1 means start is at the end of the sample.
   *
   *  If start > end, the sample is played backwards.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  startTrimFactor?: number
  /**
   *  Modulation depth of start_trim_factor. See message documentation for more details.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]*/
  startTrimModulationDepth?: number
  /**
   *  This sets the ending point in the sample in % of the sample length.
   *  0 means end is at time 0, 1 means end is at the end of the sample.
   *
   *  If start > end, the sample is played backwards.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]*/
  endTrimFactor?: number
  /**
   *  Modulation depth of end_trim_factor. See message documentation for more details.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]*/
  endTrimModulationDepth?: number
  /**
   *  Tunes the sample by a given amount of semitones by playing it at a different speed.
   *
   *  For example, -12 detunes the sample by 1 octave by playing it at half the original speed.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-24, 24]*/
  pitchSemitones?: number
  /**
   *  Modulation depth of tune. See message documentation for more details.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]*/
  pitchModulationDepth?: number
  /**
   *  Selects the sample filter type.
   *
   *  - 0: invalid
   *  - 1: no filter
   *  - 2: low-pass
   *  - 3: high-pass
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 3]*/
  filterTypeIndex?: number
  /**
   *  Filter cutoff, mapped to [28hz, 12000hz].
   *
   *
   * key | value
   * --- | ---
   * default | 6000
   * range | [28, 12000]*/
  cutoffFrequencyHz?: number
  /**
   *  Modulation depth of cutoff. See message documentation for more details.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]*/
  cutoffModulationDepth?: number
  /**
   *  Filter resonance. No unit.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  resonance?: number
  /**
   *  Modulation depth of resonance. See message documentation for more details.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]*/
  resonanceModulationDepth?: number
  /**
   *  At what point during the sample playback, in % of the sample length, the envelope peaks.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  envelopePeakRatio?: number
  /**
   *  Modulation depth of envelope ratio. See message documentation for more details.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]*/
  envelopeRatioModulationDepth?: number
  /**
   *  The steepness of the slope. 0 is linear, -1 slopes up, 1 slopes down.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [-1, 1]*/
  envelopeSlope?: number
  /**
   *  Modulation depth of envelope slope. See message documentation for more details.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]*/
  envelopeSlopeModulationDepth?: number
  /**
   *  Pans the signal to left/right. -1 is fully left, 0 is centered (unchanged), 1 is fully right.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]*/
  panning?: number
  /**
   *  Modulation depth of panning. See message documentation for more details.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]*/
  panningModulationDepth?: number
  /**
   *  Output gain of the channel. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 0.10000000149011612
   * range | [0, 1]*/
  gain?: number
  /**
   *  Modulation depth of gain. See message documentation for more details.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [-1, 1]*/
  gainModulationDepth?: number
}

