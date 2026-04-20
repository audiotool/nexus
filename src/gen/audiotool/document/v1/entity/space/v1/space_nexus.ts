// THIS FILE IS GENERATED - DO NOT EDIT
// Copyright 2026 Audiotool Inc.

import { PrimitiveField } from "@document/fields"
import { type NexusLocation } from "@document/location"
import { NexusObject } from "@document/object"
import { type Empty } from "@gen/document/v1/empty_nexus"
import {
  type AdsrEnvelope,
  type AdsrEnvelopeConstructor,
} from "@gen/document/v1/entity/adsr_envelope/v1/adsr_envelope_nexus"

/**
 *
 * key | value
 * --- | ---
 * type | entity
 * key | `"space"`
 * is | {@link api.TargetType.NoteTrackPlayer}
 *
 *
 *  The Space is a wavetable synthesizer.
 *
 *  It features 2 wavetables called "A" and "B", which can be independently adjusted
 *  and mixed together.
 *
 *
 * @category Device Entities*/
export type Space = {
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
   *  Micro tuning.
   *
   *
   * key | value
   * --- | ---
   * default | empty location
   * required | false
   * targets | {@link api.TargetType.MicroTuning}, meaning one of: <br />{@link entities.MicroTuningOctave}*/
  microTuning: PrimitiveField<NexusLocation, "mut">
  /**
   *  Gain of the synthesizer. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 0.7079399824142456
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  gain: PrimitiveField<number, "mut">
  /**
   *  Multi purpose parameter to widen the stereo image of the sound.
   *
   *  In the negative range (-1..0) the widening happens by phase shifting the two channels
   *  (resulting in a wider perceived stereo sound without pitch shift), while
   *  in the positive range (0 ..1) the widening happens by detuning the voices, with
   *  the right channel being pitched down and the right channel being pitched up
   *  on a range between 0 and 12 semitones.
   *
   *  If the value is at -1, both voices are equal (resulting in a mono sound).
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  stereoDetuneShift: PrimitiveField<number, "mut">
  /**
   *  Global tuning of the synth, moves all notes played by a given amount of semitones.
   *  +/-12 semitones is equivalent to +/- 1 octave.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-12, 12]
   * is | {@link api.TargetType.AutomatableParameter}*/
  tuneSemitones: PrimitiveField<number, "mut">
  /**
   *  Tuning of wavetable "A".
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-12, 12]
   * is | {@link api.TargetType.AutomatableParameter}*/
  tuneASemitones: PrimitiveField<number, "mut">
  /**
   *  Tuning of wavetable "B".
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-12, 12]
   * is | {@link api.TargetType.AutomatableParameter}*/
  tuneBSemitones: PrimitiveField<number, "mut">
  /**
   *  Glide time between notes in milliseconds.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 5000]
   * is | {@link api.TargetType.AutomatableParameter}*/
  glideMs: PrimitiveField<number, "mut">
  /**
   *  Mixes the two wavetables A and B. -1 means only wavetable A is used, 1.0 means only wavetable B is used.
   *
   *
   * key | value
   * --- | ---
   * default | -1
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  mixAB: PrimitiveField<number, "mut">
  /**
   *  The amount by which the LFO modulates the mix_a_b parameter.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  lfoMixModulationDepth: PrimitiveField<number, "mut">
  /**
   *  The amount by which the LFO modulates the gain parameter.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  lfoGainModulationDepth: PrimitiveField<number, "mut">
  /**
   *  The amount by which the LFO modulates the stereo_detune_shift parameter.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  lfoStereoDetuneShiftModulationDepth: PrimitiveField<number, "mut">
  /**
   *  The amount by which the LFO modulates the panning of the signal.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  lfoPanningModulationDepth: PrimitiveField<number, "mut">
  /**
   *  The amount by which the modulation envelope modulates the mix_a_b parameter.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  envelopeMixModulationDepth: PrimitiveField<number, "mut">
  /**
   *  The amount by which the modulation envelope modulates the tune_semitones parameter.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  envelopeTuneModulationDepth: PrimitiveField<number, "mut">
  /**
   *  The amount by which the modulation envelope modulates the LFO rate.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  envelopeLfoRateModulationDepth: PrimitiveField<number, "mut">
  /**
   *  The amount by which the modulation envelope modulates the LFO amount.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  envelopeLfoAmountModulationDepth: PrimitiveField<number, "mut">
  /**
   *  The amount by which the velocity modulates the gain parameter.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  velocityGainModulationDepth: PrimitiveField<number, "mut">
  /**
   *  The amount by which the note velocity modulates the mix_a_b parameter.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  velocityMixModulationDepth: PrimitiveField<number, "mut">
  /**
   *  The amount by which the keyboard (i.e. note pitch) modulates the mix_a_b parameter.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  keyboardMixModulationDepth: PrimitiveField<number, "mut">
  /**
   *  Selects the play mode of the synth for notes.
   *  - 0: invalid
   *  - 1: Mono       At most once note is played at once with slight overlap during release. An incoming note
   *                cuts already playing notes, starting from the attack phase.
   *  - 2: Legato     At most once note is played at once. Incoming notes cut already playing notes, skipping the attack phase of notes,
   *                essentially acting as if the currently playing note's pitch was changed to the new note.
   *  - 3: Polyphone  Multiple notes/chords can be played simultaneously.
   *
   *
   * key | value
   * --- | ---
   * default | 3
   * range | [1, 3]
   * is | {@link api.TargetType.AutomatableParameter}*/
  notePlayModeIndex: PrimitiveField<number, "mut">
  /**
   *  Parameters for the space LFO.
   */
  lfo: NexusObject<SpaceLFO>
  /**
   *  The adsr envelope that modulates the gain of the synth.
   */
  amplitudeEnvelope: NexusObject<AdsrEnvelope>
  /**
   *  The adsr envelope that can be used to modulate other parameters of the synth.
   */
  modulationEnvelope: NexusObject<AdsrEnvelope>
  /**
   *  Whether the modulation envelope's release phase is used or not.
   *
   *
   * key | value
   * --- | ---
   * default | false
   * is | {@link api.TargetType.AutomatableParameter}*/
  modulationEnvelopeHasRelease: PrimitiveField<boolean, "mut">
  /**
   *  The parameters for the wavetable "A".
   */
  soundA: NexusObject<SpaceSound>
  /**
   *  The parameters for the wavetable "B".
   */
  soundB: NexusObject<SpaceSound>
  /**
   *  Notes Input.
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.NotesInput}*/
  notesInput: NexusObject<Empty>
  /**
   *  Single Output.
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioOutput}*/
  audioOutput: NexusObject<Empty>
  /**
   *  Whether the device is active or not
   *
   *
   * key | value
   * --- | ---
   * default | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  isActive: PrimitiveField<boolean, "mut">
}
/** @internal */

export type SpaceConstructor = {
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
   *  Micro tuning.
   *
   *
   * key | value
   * --- | ---
   * default | empty location
   * required | false*/
  microTuning?: NexusLocation
  /**
   *  Gain of the synthesizer. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 0.7079399824142456
   * range | [0, 1]*/
  gain?: number
  /**
   *  Multi purpose parameter to widen the stereo image of the sound.
   *
   *  In the negative range (-1..0) the widening happens by phase shifting the two channels
   *  (resulting in a wider perceived stereo sound without pitch shift), while
   *  in the positive range (0 ..1) the widening happens by detuning the voices, with
   *  the right channel being pitched down and the right channel being pitched up
   *  on a range between 0 and 12 semitones.
   *
   *  If the value is at -1, both voices are equal (resulting in a mono sound).
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]*/
  stereoDetuneShift?: number
  /**
   *  Global tuning of the synth, moves all notes played by a given amount of semitones.
   *  +/-12 semitones is equivalent to +/- 1 octave.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-12, 12]*/
  tuneSemitones?: number
  /**
   *  Tuning of wavetable "A".
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-12, 12]*/
  tuneASemitones?: number
  /**
   *  Tuning of wavetable "B".
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-12, 12]*/
  tuneBSemitones?: number
  /**
   *  Glide time between notes in milliseconds.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 5000]*/
  glideMs?: number
  /**
   *  Mixes the two wavetables A and B. -1 means only wavetable A is used, 1.0 means only wavetable B is used.
   *
   *
   * key | value
   * --- | ---
   * default | -1
   * range | [-1, 1]*/
  mixAB?: number
  /**
   *  The amount by which the LFO modulates the mix_a_b parameter.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]*/
  lfoMixModulationDepth?: number
  /**
   *  The amount by which the LFO modulates the gain parameter.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]*/
  lfoGainModulationDepth?: number
  /**
   *  The amount by which the LFO modulates the stereo_detune_shift parameter.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]*/
  lfoStereoDetuneShiftModulationDepth?: number
  /**
   *  The amount by which the LFO modulates the panning of the signal.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]*/
  lfoPanningModulationDepth?: number
  /**
   *  The amount by which the modulation envelope modulates the mix_a_b parameter.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]*/
  envelopeMixModulationDepth?: number
  /**
   *  The amount by which the modulation envelope modulates the tune_semitones parameter.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]*/
  envelopeTuneModulationDepth?: number
  /**
   *  The amount by which the modulation envelope modulates the LFO rate.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]*/
  envelopeLfoRateModulationDepth?: number
  /**
   *  The amount by which the modulation envelope modulates the LFO amount.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]*/
  envelopeLfoAmountModulationDepth?: number
  /**
   *  The amount by which the velocity modulates the gain parameter.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  velocityGainModulationDepth?: number
  /**
   *  The amount by which the note velocity modulates the mix_a_b parameter.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]*/
  velocityMixModulationDepth?: number
  /**
   *  The amount by which the keyboard (i.e. note pitch) modulates the mix_a_b parameter.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]*/
  keyboardMixModulationDepth?: number
  /**
   *  Selects the play mode of the synth for notes.
   *  - 0: invalid
   *  - 1: Mono       At most once note is played at once with slight overlap during release. An incoming note
   *                cuts already playing notes, starting from the attack phase.
   *  - 2: Legato     At most once note is played at once. Incoming notes cut already playing notes, skipping the attack phase of notes,
   *                essentially acting as if the currently playing note's pitch was changed to the new note.
   *  - 3: Polyphone  Multiple notes/chords can be played simultaneously.
   *
   *
   * key | value
   * --- | ---
   * default | 3
   * range | [1, 3]*/
  notePlayModeIndex?: number
  /**
   *  Parameters for the space LFO.
   */
  lfo?: SpaceLFOConstructor
  /**
   *  The adsr envelope that modulates the gain of the synth.
   */
  amplitudeEnvelope?: AdsrEnvelopeConstructor
  /**
   *  The adsr envelope that can be used to modulate other parameters of the synth.
   */
  modulationEnvelope?: AdsrEnvelopeConstructor
  /**
   *  Whether the modulation envelope's release phase is used or not.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  modulationEnvelopeHasRelease?: boolean
  /**
   *  The parameters for the wavetable "A".
   */
  soundA?: SpaceSoundConstructor
  /**
   *  The parameters for the wavetable "B".
   */
  soundB?: SpaceSoundConstructor
  /**
   *  Whether the device is active or not
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
 * type | object
 *
 *  The Space's LFO parameters.
 *
 *
 * @category Device Fields*/
export type SpaceLFO = {
  /**
   *  Selects the waveform of the lfo.
   *  - 0: invalid
   *  - 1: Sine
   *  - 2: Triangle
   *  - 3: Sawtooth Up
   *  - 4: Square
   *  - 5: Random
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 5]
   * is | {@link api.TargetType.AutomatableParameter}*/
  waveformIndex: PrimitiveField<number, "mut">
  /**
   *  The rate of the LFO, expressed as a normalized value.
   *  The meaning of the value depends on the is_synced flag:
   *  - if is_synced is false, the value maps exponentially to Hz (0.1 .. 100.0) with formula:
   *        hz = 0.1 * 1000^value
   *  - if is_synced is true, then the value is quantized to one of 30 bar time durations.
   *    The bar time durations are:
   *       1/256, 1/192, 1/128, 1/96, 1/64, 1/48, 1/32, 1/24, 1/16,
   *       1/12, 1/8, 1/6, 3/16, 1/4, 5/16, 1/3, 3/8, 7/16, 1/2, 9/16, 7/12, 5/8,
   *       2/3, 3/4, 5/6, 7/8, 1/1, 2/1, 3/1, 4/1.
   *
   *
   * key | value
   * --- | ---
   * default | 0.25
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  rateNormalized: PrimitiveField<number, "mut">
  /**
   *  The LFO's phase offset.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  phaseOffset: PrimitiveField<number, "mut">
  /**
   *  Whether rate_normalized is synced to the project tempo or not.
   *
   *
   * key | value
   * --- | ---
   * default | false
   * is | {@link api.TargetType.AutomatableParameter}*/
  isSynced: PrimitiveField<boolean, "mut">
  /**
   *  If this is true, the LFO retriggers for every incoming note. Otherwise
   *  it starts at project time 0.
   *
   *
   * key | value
   * --- | ---
   * default | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  doesRetrigger: PrimitiveField<boolean, "mut">
}
/** @internal */

export type SpaceLFOConstructor = {
  /**
   *  Selects the waveform of the lfo.
   *  - 0: invalid
   *  - 1: Sine
   *  - 2: Triangle
   *  - 3: Sawtooth Up
   *  - 4: Square
   *  - 5: Random
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 5]*/
  waveformIndex?: number
  /**
   *  The rate of the LFO, expressed as a normalized value.
   *  The meaning of the value depends on the is_synced flag:
   *  - if is_synced is false, the value maps exponentially to Hz (0.1 .. 100.0) with formula:
   *        hz = 0.1 * 1000^value
   *  - if is_synced is true, then the value is quantized to one of 30 bar time durations.
   *    The bar time durations are:
   *       1/256, 1/192, 1/128, 1/96, 1/64, 1/48, 1/32, 1/24, 1/16,
   *       1/12, 1/8, 1/6, 3/16, 1/4, 5/16, 1/3, 3/8, 7/16, 1/2, 9/16, 7/12, 5/8,
   *       2/3, 3/4, 5/6, 7/8, 1/1, 2/1, 3/1, 4/1.
   *
   *
   * key | value
   * --- | ---
   * default | 0.25
   * range | [0, 1]*/
  rateNormalized?: number
  /**
   *  The LFO's phase offset.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  phaseOffset?: number
  /**
   *  Whether rate_normalized is synced to the project tempo or not.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  isSynced?: boolean
  /**
   *  If this is true, the LFO retriggers for every incoming note. Otherwise
   *  it starts at project time 0.
   *
   *
   * key | value
   * --- | ---
   * default | true*/
  doesRetrigger?: boolean
}

/**
 *
 * key | value
 * --- | ---
 * type | object
 *
 *  Datastructure for the Space's Wavetable (aka "sound"). A few of these parameters
 *  have a "qualitative" name, such as "dispersion", "metal", etc.
 *
 *  The exact description of these parameters on the synth are complex and likely not useful
 *  when creating the sound, so they're left out.
 *
 *  The comb filter parameters don't control a comb filter on the sound itself, but on its
 *  overtones.
 *
 *
 * @category Device Fields*/
export type SpaceSound = {
  /**
   *  Controls the "disperse" quality of the sound.
   *
   *
   * key | value
   * --- | ---
   * default | 0.5
   * range | [0, 1]*/
  dispersion: PrimitiveField<number, "mut">
  /**
   *  Controls the "vaporization" quality of the sound.
   *
   *
   * key | value
   * --- | ---
   * default | 0.20000000298023224
   * range | [0, 1]*/
  vaporisation: PrimitiveField<number, "mut">
  /**
   *  Controls the "brightness" quality of the sound, affecting the gains of higher overtones.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]*/
  brightness: PrimitiveField<number, "mut">
  /**
   *  Controls the "metal" quality of the sound.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  metal: PrimitiveField<number, "mut">
  /**
   *  Controls "separation" quality of the sound.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 4]*/
  separation: PrimitiveField<number, "mut">
  /**
   *  Number of harmonics in the sound. More harmonics results in a more "rich"/complex
   *  sound.
   *
   *
   * key | value
   * --- | ---
   * default | 32
   * range | [1, 32]*/
  harmonicsCount: PrimitiveField<number, "mut">
  /**
   *  Comb filter amount - 0 means no filtering, 1 means maximum filtering. No unit.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  combFilterAmount: PrimitiveField<number, "mut">
  /**
   *  The comb filter's "rate", controlling the interval of the sine wave that filters the
   *  wavetable's frequency. Higher values mean more peaks & valleys, lower means fewer.
   *
   *
   * key | value
   * --- | ---
   * default | 0.15000000596046448
   * range | [0, 1]*/
  combFilterRate: PrimitiveField<number, "mut">
  /**
   *  The width of the comb filter. Low values mean the filter filters in the form of a square
   *  wave, high values mean it filters in the form of a sine wave. No unit.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  combFilterWidth: PrimitiveField<number, "mut">
}
/** @internal */

export type SpaceSoundConstructor = {
  /**
   *  Controls the "disperse" quality of the sound.
   *
   *
   * key | value
   * --- | ---
   * default | 0.5
   * range | [0, 1]*/
  dispersion?: number
  /**
   *  Controls the "vaporization" quality of the sound.
   *
   *
   * key | value
   * --- | ---
   * default | 0.20000000298023224
   * range | [0, 1]*/
  vaporisation?: number
  /**
   *  Controls the "brightness" quality of the sound, affecting the gains of higher overtones.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]*/
  brightness?: number
  /**
   *  Controls the "metal" quality of the sound.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  metal?: number
  /**
   *  Controls "separation" quality of the sound.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 4]*/
  separation?: number
  /**
   *  Number of harmonics in the sound. More harmonics results in a more "rich"/complex
   *  sound.
   *
   *
   * key | value
   * --- | ---
   * default | 32
   * range | [1, 32]*/
  harmonicsCount?: number
  /**
   *  Comb filter amount - 0 means no filtering, 1 means maximum filtering. No unit.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  combFilterAmount?: number
  /**
   *  The comb filter's "rate", controlling the interval of the sine wave that filters the
   *  wavetable's frequency. Higher values mean more peaks & valleys, lower means fewer.
   *
   *
   * key | value
   * --- | ---
   * default | 0.15000000596046448
   * range | [0, 1]*/
  combFilterRate?: number
  /**
   *  The width of the comb filter. Low values mean the filter filters in the form of a square
   *  wave, high values mean it filters in the form of a sine wave. No unit.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  combFilterWidth?: number
}

