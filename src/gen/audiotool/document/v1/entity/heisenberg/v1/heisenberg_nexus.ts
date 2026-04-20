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
 * key | `"heisenberg"`
 * is | {@link api.TargetType.NoteTrackPlayer}
 *
 *
 *  data structure for the Heisenberg FM synth
 *
 *
 * @category Device Entities*/
export type Heisenberg = {
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
   *  Global tuning of the synth, moves all notes played by a given amount of semitones.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-12, 12]
   * is | {@link api.TargetType.AutomatableParameter}*/
  tuneSemitones: PrimitiveField<number, "mut">
  /**
   *  Gain of the synthesizer. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 0.7079460024833679
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  gain: PrimitiveField<number, "mut">
  /**
   *  Selects the play mode of the synthesizer. The play mode determines how notes are played:
   *  - 0: invalid
   *  - 1: Mono
   *  - 2: Legato
   *  - 3: Polyphone Legato
   *  - 4: Polyphone
   *
   *  Mono:
   *  At most once note is played at once with slight overlap during release. An incoming note
   *  cuts already playing notes.
   *
   *  Legato:
   *  Same as mono, but attack is omitted when a new incoming note cut off an already playing note.
   *  a note that is in release phase gets cut off.
   *
   *  Polyphone:
   *  Multiple notes/chords can be played simultaneously.
   *
   *  PolyLegato:
   *  Similar to legato, but notes are allowed to ring out (i.e. if a note is in the release phase,
   *  legato would cut it off, while PolyLegato lets it ring out, that way achieving a somewhoat polyphonic
   *  effect)
   *
   *
   * key | value
   * --- | ---
   * default | 3
   * range | [1, 4]
   * is | {@link api.TargetType.AutomatableParameter}*/
  playModeIndex: PrimitiveField<number, "mut">
  /**
   *  Glide time controls the duration that a note's pitch "glides" to the next note
   *  once played. When in Mono or Legato mode, notes will glide if they overlap;
   *  in Polyphone mode, notes will glide if they don't overlap.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 5000]
   * is | {@link api.TargetType.AutomatableParameter}*/
  glideMs: PrimitiveField<number, "mut">
  /**
   *  Multiplier for the velocity of the notes, controlling their loudness. No unit.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  velocityFactor: PrimitiveField<number, "mut">
  /**
   *  Setting this parameter to > 1 will create multiple voices per note.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 4]
   * is | {@link api.TargetType.AutomatableParameter}*/
  unisonoCount: PrimitiveField<number, "mut">
  /**
   *  If there's multiple voices per note (i.e. if unisono_count  > 1), increasing
   *  this parameter will detune all voices from each other more by up to 1 semitone.
   *  Increasing this parameter creates a "wider" sound.
   *  If unisono_count is 1, this parameter has no effect.
   *
   *
   * key | value
   * --- | ---
   * default | 0.0010000000474974513
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  unisonoDetuneSemitones: PrimitiveField<number, "mut">
  /**
   *  Spreads the voices across the stereo field. 0 is centered, 1 moves some voices
   *  to the right, some to the left. -1 moves them in the opposite direction.
   *
   *
   * key | value
   * --- | ---
   * default | 0.5
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  unisonoStereoSpreadFactor: PrimitiveField<number, "mut">
  /**
   *  Selects the operator detune mode. This value affects which detune mode is shown in the DAW
   *  for each operator's detune gauge. It doesn't have an effect on the produced audio.
   *  - 0: invalid
   *  - 1: Semitone  - show's semitone to detune an operator
   *  - 2: Ratio     - show's the frequency ratio to detune an operator
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 2]*/
  operatorDetuneModeIndex: PrimitiveField<number, "mut">
  /**
   *  Operator "A" of the Heisenberg.
   */
  operatorA: NexusObject<HeisenbergOperator>
  /**
   *  Operator "B" of the Heisenberg.
   */
  operatorB: NexusObject<HeisenbergOperator>
  /**
   *  Operator "C" of the Heisenberg.
   */
  operatorC: NexusObject<HeisenbergOperator>
  /**
   *  Operator "D" of the Heisenberg.
   */
  operatorD: NexusObject<HeisenbergOperator>
  /**
   *  The "main" envelope of the Heisenberg. Is always applied to the entire synth's gain, but can
   *  also be assigned to individual operators inside the operator message.
   */
  envelopeMain: NexusObject<AdsrEnvelope>
  /**
   *  The "env 1" envelope of the Heisenberg. Can be assigned to individual operators inside the operator message.
   */
  envelope2: NexusObject<AdsrEnvelope>
  /**
   *  The "env 2" envelope of the Heisenberg. Can be assigned to individual operators inside the operator message.
   */
  envelope3: NexusObject<AdsrEnvelope>
  /**
   *  The Heisenberg pitch envelope. Can be assigned to the individual operators inside the operator message.
   */
  pitchEnvelope: NexusObject<HeisenbergPitchEnvelope>
  /**
   *  The first LFO of the Heisenberg. Can be assigned to the individual operators inside the operator message.
   */
  lfo1: NexusObject<HeisenbergLFO>
  /**
   *  The second LFO of the Heisenberg. Can be assigned to the individual operators inside the operator message.
   */
  lfo2: NexusObject<HeisenbergLFO>
  /**
   *  The Heisenberg filter configuration.
   */
  filter: NexusObject<HeisenbergFilter>
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
   *  Whether the device is active or not. When is_active=false, the heisenberg is silent.
   *
   *
   * key | value
   * --- | ---
   * default | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  isActive: PrimitiveField<boolean, "mut">
}
/** @internal */

export type HeisenbergConstructor = {
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
   *  Global tuning of the synth, moves all notes played by a given amount of semitones.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-12, 12]*/
  tuneSemitones?: number
  /**
   *  Gain of the synthesizer. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 0.7079460024833679
   * range | [0, 1]*/
  gain?: number
  /**
   *  Selects the play mode of the synthesizer. The play mode determines how notes are played:
   *  - 0: invalid
   *  - 1: Mono
   *  - 2: Legato
   *  - 3: Polyphone Legato
   *  - 4: Polyphone
   *
   *  Mono:
   *  At most once note is played at once with slight overlap during release. An incoming note
   *  cuts already playing notes.
   *
   *  Legato:
   *  Same as mono, but attack is omitted when a new incoming note cut off an already playing note.
   *  a note that is in release phase gets cut off.
   *
   *  Polyphone:
   *  Multiple notes/chords can be played simultaneously.
   *
   *  PolyLegato:
   *  Similar to legato, but notes are allowed to ring out (i.e. if a note is in the release phase,
   *  legato would cut it off, while PolyLegato lets it ring out, that way achieving a somewhoat polyphonic
   *  effect)
   *
   *
   * key | value
   * --- | ---
   * default | 3
   * range | [1, 4]*/
  playModeIndex?: number
  /**
   *  Glide time controls the duration that a note's pitch "glides" to the next note
   *  once played. When in Mono or Legato mode, notes will glide if they overlap;
   *  in Polyphone mode, notes will glide if they don't overlap.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 5000]*/
  glideMs?: number
  /**
   *  Multiplier for the velocity of the notes, controlling their loudness. No unit.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]*/
  velocityFactor?: number
  /**
   *  Setting this parameter to > 1 will create multiple voices per note.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 4]*/
  unisonoCount?: number
  /**
   *  If there's multiple voices per note (i.e. if unisono_count  > 1), increasing
   *  this parameter will detune all voices from each other more by up to 1 semitone.
   *  Increasing this parameter creates a "wider" sound.
   *  If unisono_count is 1, this parameter has no effect.
   *
   *
   * key | value
   * --- | ---
   * default | 0.0010000000474974513
   * range | [0, 1]*/
  unisonoDetuneSemitones?: number
  /**
   *  Spreads the voices across the stereo field. 0 is centered, 1 moves some voices
   *  to the right, some to the left. -1 moves them in the opposite direction.
   *
   *
   * key | value
   * --- | ---
   * default | 0.5
   * range | [-1, 1]*/
  unisonoStereoSpreadFactor?: number
  /**
   *  Selects the operator detune mode. This value affects which detune mode is shown in the DAW
   *  for each operator's detune gauge. It doesn't have an effect on the produced audio.
   *  - 0: invalid
   *  - 1: Semitone  - show's semitone to detune an operator
   *  - 2: Ratio     - show's the frequency ratio to detune an operator
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 2]*/
  operatorDetuneModeIndex?: number
  /**
   *  Operator "A" of the Heisenberg.
   */
  operatorA?: HeisenbergOperatorConstructor
  /**
   *  Operator "B" of the Heisenberg.
   */
  operatorB?: HeisenbergOperatorConstructor
  /**
   *  Operator "C" of the Heisenberg.
   */
  operatorC?: HeisenbergOperatorConstructor
  /**
   *  Operator "D" of the Heisenberg.
   */
  operatorD?: HeisenbergOperatorConstructor
  /**
   *  The "main" envelope of the Heisenberg. Is always applied to the entire synth's gain, but can
   *  also be assigned to individual operators inside the operator message.
   */
  envelopeMain?: AdsrEnvelopeConstructor
  /**
   *  The "env 1" envelope of the Heisenberg. Can be assigned to individual operators inside the operator message.
   */
  envelope2?: AdsrEnvelopeConstructor
  /**
   *  The "env 2" envelope of the Heisenberg. Can be assigned to individual operators inside the operator message.
   */
  envelope3?: AdsrEnvelopeConstructor
  /**
   *  The Heisenberg pitch envelope. Can be assigned to the individual operators inside the operator message.
   */
  pitchEnvelope?: HeisenbergPitchEnvelopeConstructor
  /**
   *  The first LFO of the Heisenberg. Can be assigned to the individual operators inside the operator message.
   */
  lfo1?: HeisenbergLFOConstructor
  /**
   *  The second LFO of the Heisenberg. Can be assigned to the individual operators inside the operator message.
   */
  lfo2?: HeisenbergLFOConstructor
  /**
   *  The Heisenberg filter configuration.
   */
  filter?: HeisenbergFilterConstructor
  /**
   *  Whether the device is active or not. When is_active=false, the heisenberg is silent.
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
 *  One of the 4 operators of the heisenberg. In the UI, they're also called
 *  "A", "B", "C" and "D".
 *
 *
 * @category Device Fields*/
export type HeisenbergOperator = {
  /**
   *  The operator's gain. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  gain: PrimitiveField<number, "mut">
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
   *  The detuning factor of this operator. Acts as a multiplier of the frequency the
   *  operator is playing.
   *
   *  The number of semitones this operator is detuned from is calculated as follows:
   *  semitone = (12.0 * Math.log(detune_factor)) / Math.log(2.0)
   *
   *  In the DAW, this is shown either as "semitone" or "ratio" depending on the operator_detune_mode_index
   *  field of the heisenberg itself. The 'semitone" mode shows the number of semitones to detune,
   *  down/up to 99.999 semitones. If detune_factor is above or below this semitone range,
   *  looking at the ratio in semitone mode will show "--.-----"
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 64]
   * is | {@link api.TargetType.AutomatableParameter}*/
  detuneFactor: PrimitiveField<number, "mut">
  /**
   *  Offset in Hz of the final frequency produced. Added to the operator frequency
   *  after the detune factor has been applied.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-9999.990234375, 9999.990234375]
   * is | {@link api.TargetType.AutomatableParameter}*/
  frequencyOffsetHz: PrimitiveField<number, "mut">
  /**
   *  Selects the waveform shape the operator produces.
   *  - 0: invalid
   *  - 1: Sinus
   *  - 2: Parabola
   *  - 3: Circle
   *  - 4: Triangle
   *  - 5: Sawtooth Up
   *  - 6: Sawtooth Down
   *  - 7: Square
   *  - 8: Andrew Wiles
   *  - 9: Ernest Rutherford
   *  - 10: Wilhelm Conrad Röntgen
   *  - 11: Peter Higgs
   *  - 12: Gottfried Wilhelm Leibniz;
   *  - 13: Alan Turing
   *  - 14: Hans Geiger
   *  - 15: Hermann von Helmholtz
   *  - 16: Jean Baptiste Joseph Fourier
   *  - 17: James Clerk Maxwell
   *  - 18: Formant I
   *  - 19: Formant II
   *  - 20: Formant III
   *  - 21: Formant IV
   *  - 22: Blaise Pascal
   *  - 23: Pierre de Fermat
   *  - 24: Carl Friedrich Gauß
   *  - 25: Isaac Newton
   *  - 26: Marie Curie
   *  - 27: Nikola Tesla
   *  - 28: Alessandro Volta
   *  - 29: Bernhard Riemann
   *  - 30: André Weil
   *  - 31: David Hilbert
   *  - 32: Pierre-Simon Laplace
   *  - 33: Andreas Christian Doppler
   *  - 34: Paul Dirac
   *  - 35: Max Planck
   *  - 36: André-Marie Ampère
   *  - 37: Max Born
   *  - 38: Richard Feynman
   *  - 39: Johannes Kepler
   *  - 40: Heinrich Hertz
   *  - 41: August Ferdinand Möbius
   *  - 42: Robert Moog;
   *  - 43: Albert Einstein
   *  - 44: Erwin Schrödinger
   *  - 45: Galileo Galilei
   *  - 46: Michael Faraday
   *  - 47: Leonhard Euler
   *  - 48: Werner Heisenberg
   *  - 49: Kurt Gödel
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 49]
   * is | {@link api.TargetType.AutomatableParameter}*/
  waveformIndex: PrimitiveField<number, "mut">
  /**
   *  Whether the pitch envelope influences the pitch of the operator. The pitch
   *  envelope affects the pitch of the operator multiplicatively.
   *
   *
   * key | value
   * --- | ---
   * default | false
   * is | {@link api.TargetType.AutomatableParameter}*/
  usePitchEnvelope: PrimitiveField<boolean, "mut">
  /**
   *  Setting this factor to > 0 offsets the phase of this operator by
   *  the pre-modulation signal of operator "A" (the first operator of the 4)
   *  multiplied by this factor.
   *
   *  Note that for all operators, phase modulation is the last step,
   *  after LFOs, envelopes, frequency offsets etc.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  modulationFactorA: PrimitiveField<number, "mut">
  /**
   *  Setting this factor to > 0 offsets the phase of this operator by
   *  the pre-modulation signal of operator "B" (the second operator of the 4)
   *  multiplied by this factor.
   *
   *  Note that for all operators, phase modulation is the last step,
   *  after LFOs, envelopes, frequency offsets etc.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  modulationFactorB: PrimitiveField<number, "mut">
  /**
   *  Setting this factor to > 0 offsets the phase of this operator by
   *  the pre-modulation signal of operator "C" (the third operator of the 4)
   *  multiplied by this factor.
   *
   *  Note that for all operators, phase modulation is the last step,
   *  after LFOs, envelopes, frequency offsets etc.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  modulationFactorC: PrimitiveField<number, "mut">
  /**
   *  Setting this factor to > 0 offsets the phase of this operator by
   *  the pre-modulation signal of operator "D" (the fourth operator of the 4)
   *  multiplied by this factor.
   *
   *  Note that for all operators, phase modulation is the last step,
   *  after LFOs, envelopes, frequency offsets etc.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  modulationFactorD: PrimitiveField<number, "mut">
  /**
   *  The extent to which a note's velocity influences this specific operator's
   *  amplitude. 0.0 means no influence, 1.0 means full influence. 0.25 means
   *  the operator's amplitude is between 0.75 and 1 depending on the note's velocity.
   *
   *  Full formula:
   *  factor = (1 - velocity_amplitude_modulation_depth) + note_velocity * velocity_amplitude_modulation_depth
   *
   *  Note that a note's velocity still influences the signal's amplitude overall
   *  after the operator's signals have been added together.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  velocityAmplitudeModulationDepth: PrimitiveField<number, "mut">
  /**
   *  The extent to which the main envelope influences this operator's amplitude.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  envelopeMainAmplitudeModulationDepth: PrimitiveField<number, "mut">
  /**
   *  The extent to which envelope 2 influences this operator's amplitude.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  envelope2AmplitudeModulationDepth: PrimitiveField<number, "mut">
  /**
   *  The extent to which envelope 3 influences this operator's amplitude.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  envelope3AmplitudeModulationDepth: PrimitiveField<number, "mut">
  /**
   *  The extent to which LFO 1 influences this operator's amplitude.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  lfo1AmplitudeModulationDepth: PrimitiveField<number, "mut">
  /**
   *  The extent to which LFO 2 influences this operator's amplitude.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  lfo2AmplitudeModulationDepth: PrimitiveField<number, "mut">
}
/** @internal */

export type HeisenbergOperatorConstructor = {
  /**
   *  The operator's gain. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  gain?: number
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
   *  The detuning factor of this operator. Acts as a multiplier of the frequency the
   *  operator is playing.
   *
   *  The number of semitones this operator is detuned from is calculated as follows:
   *  semitone = (12.0 * Math.log(detune_factor)) / Math.log(2.0)
   *
   *  In the DAW, this is shown either as "semitone" or "ratio" depending on the operator_detune_mode_index
   *  field of the heisenberg itself. The 'semitone" mode shows the number of semitones to detune,
   *  down/up to 99.999 semitones. If detune_factor is above or below this semitone range,
   *  looking at the ratio in semitone mode will show "--.-----"
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 64]*/
  detuneFactor?: number
  /**
   *  Offset in Hz of the final frequency produced. Added to the operator frequency
   *  after the detune factor has been applied.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-9999.990234375, 9999.990234375]*/
  frequencyOffsetHz?: number
  /**
   *  Selects the waveform shape the operator produces.
   *  - 0: invalid
   *  - 1: Sinus
   *  - 2: Parabola
   *  - 3: Circle
   *  - 4: Triangle
   *  - 5: Sawtooth Up
   *  - 6: Sawtooth Down
   *  - 7: Square
   *  - 8: Andrew Wiles
   *  - 9: Ernest Rutherford
   *  - 10: Wilhelm Conrad Röntgen
   *  - 11: Peter Higgs
   *  - 12: Gottfried Wilhelm Leibniz;
   *  - 13: Alan Turing
   *  - 14: Hans Geiger
   *  - 15: Hermann von Helmholtz
   *  - 16: Jean Baptiste Joseph Fourier
   *  - 17: James Clerk Maxwell
   *  - 18: Formant I
   *  - 19: Formant II
   *  - 20: Formant III
   *  - 21: Formant IV
   *  - 22: Blaise Pascal
   *  - 23: Pierre de Fermat
   *  - 24: Carl Friedrich Gauß
   *  - 25: Isaac Newton
   *  - 26: Marie Curie
   *  - 27: Nikola Tesla
   *  - 28: Alessandro Volta
   *  - 29: Bernhard Riemann
   *  - 30: André Weil
   *  - 31: David Hilbert
   *  - 32: Pierre-Simon Laplace
   *  - 33: Andreas Christian Doppler
   *  - 34: Paul Dirac
   *  - 35: Max Planck
   *  - 36: André-Marie Ampère
   *  - 37: Max Born
   *  - 38: Richard Feynman
   *  - 39: Johannes Kepler
   *  - 40: Heinrich Hertz
   *  - 41: August Ferdinand Möbius
   *  - 42: Robert Moog;
   *  - 43: Albert Einstein
   *  - 44: Erwin Schrödinger
   *  - 45: Galileo Galilei
   *  - 46: Michael Faraday
   *  - 47: Leonhard Euler
   *  - 48: Werner Heisenberg
   *  - 49: Kurt Gödel
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 49]*/
  waveformIndex?: number
  /**
   *  Whether the pitch envelope influences the pitch of the operator. The pitch
   *  envelope affects the pitch of the operator multiplicatively.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  usePitchEnvelope?: boolean
  /**
   *  Setting this factor to > 0 offsets the phase of this operator by
   *  the pre-modulation signal of operator "A" (the first operator of the 4)
   *  multiplied by this factor.
   *
   *  Note that for all operators, phase modulation is the last step,
   *  after LFOs, envelopes, frequency offsets etc.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  modulationFactorA?: number
  /**
   *  Setting this factor to > 0 offsets the phase of this operator by
   *  the pre-modulation signal of operator "B" (the second operator of the 4)
   *  multiplied by this factor.
   *
   *  Note that for all operators, phase modulation is the last step,
   *  after LFOs, envelopes, frequency offsets etc.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  modulationFactorB?: number
  /**
   *  Setting this factor to > 0 offsets the phase of this operator by
   *  the pre-modulation signal of operator "C" (the third operator of the 4)
   *  multiplied by this factor.
   *
   *  Note that for all operators, phase modulation is the last step,
   *  after LFOs, envelopes, frequency offsets etc.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  modulationFactorC?: number
  /**
   *  Setting this factor to > 0 offsets the phase of this operator by
   *  the pre-modulation signal of operator "D" (the fourth operator of the 4)
   *  multiplied by this factor.
   *
   *  Note that for all operators, phase modulation is the last step,
   *  after LFOs, envelopes, frequency offsets etc.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  modulationFactorD?: number
  /**
   *  The extent to which a note's velocity influences this specific operator's
   *  amplitude. 0.0 means no influence, 1.0 means full influence. 0.25 means
   *  the operator's amplitude is between 0.75 and 1 depending on the note's velocity.
   *
   *  Full formula:
   *  factor = (1 - velocity_amplitude_modulation_depth) + note_velocity * velocity_amplitude_modulation_depth
   *
   *  Note that a note's velocity still influences the signal's amplitude overall
   *  after the operator's signals have been added together.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  velocityAmplitudeModulationDepth?: number
  /**
   *  The extent to which the main envelope influences this operator's amplitude.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  envelopeMainAmplitudeModulationDepth?: number
  /**
   *  The extent to which envelope 2 influences this operator's amplitude.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  envelope2AmplitudeModulationDepth?: number
  /**
   *  The extent to which envelope 3 influences this operator's amplitude.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  envelope3AmplitudeModulationDepth?: number
  /**
   *  The extent to which LFO 1 influences this operator's amplitude.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  lfo1AmplitudeModulationDepth?: number
  /**
   *  The extent to which LFO 2 influences this operator's amplitude.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  lfo2AmplitudeModulationDepth?: number
}

/**
 *
 * key | value
 * --- | ---
 * type | object
 *
 *  The two LFO's for the Heisenberg that can be used to modulate the operators's
 *  amplitude.
 *
 *
 * @category Device Fields*/
export type HeisenbergLFO = {
  /**
   *  Whether the LFO is synced to the project tempo. When synced, the
   *  rate_normalized value below maps to "bar time" and as such depends on the project
   *  tempo. When not synced, the rate_normalized value maps to "Hz" and as such is
   *  independent of the project tempo.
   *
   *
   * key | value
   * --- | ---
   * default | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  isSynced: PrimitiveField<boolean, "mut">
  /**
   *  If true, the LFO will restart its phase when a note is played.
   *
   *
   * key | value
   * --- | ---
   * default | false
   * is | {@link api.TargetType.AutomatableParameter}*/
  doesRestart: PrimitiveField<boolean, "mut">
  /**
   *  The rate of the LFO, expressed as a normalized value.
   *  The meaning of the value depends on the is_synced flag:
   *  - if is_synced is false, the value maps exponentially to Hz (0.01 .. 500.0) with formula:
   *        hz = 0.01 * 50000^value
   *  - if is_synced is true, then the value is quantized to one of 30 bar time durations.
   *    The bar time durations are:
   *       1/256, 1/192, 1/128, 1/96, 1/64, 1/48, 1/32, 1/24, 1/16,
   *       1/12, 1/8, 1/6, 3/16, 1/4, 5/16, 1/3, 3/8, 7/16, 1/2, 9/16, 7/12, 5/8,
   *       2/3, 3/4, 5/6, 7/8, 1/1, 2/1, 3/1, 4/1.
   *
   *
   * key | value
   * --- | ---
   * default | 0.5
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  rateNormalized: PrimitiveField<number, "mut">
  /**
   *  Phase offset factor of the LFO, in percentage of the entire phase.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  offsetFactor: PrimitiveField<number, "mut">
  /**
   *  The delay before the LFO enters the blend phase on every note trigger, expressed as a normalized value.
   *  During the delay phase, the LFO is not active.
   *
   *  The meaning of the value depends on the is_synced flag:
   *  - if is_synced is false, the value maps to milliseconds (1.0 .. 5000.0) with formula:
   *        millis = 1.0 + 4999.0 * value^3.3245278
   *  - if is_synced is true, then the value is quantized to one of 30 bar time durations.
   *    The bar time durations are:
   *       0, 1/256, 1/192, 1/128, 1/96, 1/64, 1/48, 1/32, 1/24, 1/16,
   *       1/12, 1/8, 1/6, 3/16, 1/4, 5/16, 1/3, 3/8, 7/16, 1/2, 9/16, 7/12, 5/8,
   *       2/3, 3/4, 5/6, 7/8, 1/1, 2/1, 3/1, 4/1.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  delayTimeNormalized: PrimitiveField<number, "mut">
  /**
   *  The duration of the blend phase of the LFO during which the LFO transitions from
   *  no offset to full offset, expressed as a normalized value.
   *
   *  The meaning of the value depends on the is_synced flag:
   *  - if is_synced is false, the value maps to milliseconds (1.0 .. 5000.0) with formula:
   *        millis = 1.0 + 4999.0 * value^3.3245278
   *  - if is_synced is true, then the value is quantized to one of 30 bar time durations.
   *    The bar time durations are:
   *       0, 1/256, 1/192, 1/128, 1/96, 1/64, 1/48, 1/32, 1/24, 1/16,
   *       1/12, 1/8, 1/6, 3/16, 1/4, 5/16, 1/3, 3/8, 7/16, 1/2, 9/16, 7/12, 5/8,
   *       2/3, 3/4, 5/6, 7/8, 1/1, 2/1, 3/1, 4/1.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  blendTimeNormalized: PrimitiveField<number, "mut">
  /**
   *  Selects the waveform of the LFO:
   *  - 0: invalid
   *  - 1: Sinus
   *  - 2: Parabola
   *  - 3: Circle
   *  - 4: Triangle
   *  - 5: Sawtooth Up
   *  - 6: Sawtooth Down
   *  - 7: Square
   *  - 8: Andrew Wiles
   *  - 9: Ernest Rutherford
   *  - 10: Wilhelm Conrad Röntgen
   *  - 11: Peter Higgs
   *  - 12: Gottfried Wilhelm Leibniz;
   *  - 13: Alan Turing
   *  - 14: Hans Geiger
   *  - 15: Hermann von Helmholtz
   *  - 16: Jean Baptiste Joseph Fourier
   *  - 17: James Clerk Maxwell
   *  - 18: Formant I
   *  - 19: Formant II
   *  - 20: Formant III
   *  - 21: Formant IV
   *  - 22: Blaise Pascal
   *  - 23: Pierre de Fermat
   *  - 24: Carl Friedrich Gauß
   *  - 25: Isaac Newton
   *  - 26: Marie Curie
   *  - 27: Nikola Tesla
   *  - 28: Alessandro Volta
   *  - 29: Bernhard Riemann
   *  - 30: André Weil
   *  - 31: David Hilbert
   *  - 32: Pierre-Simon Laplace
   *  - 33: Andreas Christian Doppler
   *  - 34: Paul Dirac
   *  - 35: Max Planck
   *  - 36: André-Marie Ampère
   *  - 37: Max Born
   *  - 38: Richard Feynman
   *  - 39: Johannes Kepler
   *  - 40: Heinrich Hertz
   *  - 41: August Ferdinand Möbius
   *  - 42: Robert Moog;
   *  - 43: Albert Einstein
   *  - 44: Erwin Schrödinger
   *  - 45: Galileo Galilei
   *  - 46: Michael Faraday
   *  - 47: Leonhard Euler
   *  - 48: Werner Heisenberg
   *  - 49: Kurt Gödel
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 49]
   * is | {@link api.TargetType.AutomatableParameter}*/
  waveformIndex: PrimitiveField<number, "mut">
}
/** @internal */

export type HeisenbergLFOConstructor = {
  /**
   *  Whether the LFO is synced to the project tempo. When synced, the
   *  rate_normalized value below maps to "bar time" and as such depends on the project
   *  tempo. When not synced, the rate_normalized value maps to "Hz" and as such is
   *  independent of the project tempo.
   *
   *
   * key | value
   * --- | ---
   * default | true*/
  isSynced?: boolean
  /**
   *  If true, the LFO will restart its phase when a note is played.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  doesRestart?: boolean
  /**
   *  The rate of the LFO, expressed as a normalized value.
   *  The meaning of the value depends on the is_synced flag:
   *  - if is_synced is false, the value maps exponentially to Hz (0.01 .. 500.0) with formula:
   *        hz = 0.01 * 50000^value
   *  - if is_synced is true, then the value is quantized to one of 30 bar time durations.
   *    The bar time durations are:
   *       1/256, 1/192, 1/128, 1/96, 1/64, 1/48, 1/32, 1/24, 1/16,
   *       1/12, 1/8, 1/6, 3/16, 1/4, 5/16, 1/3, 3/8, 7/16, 1/2, 9/16, 7/12, 5/8,
   *       2/3, 3/4, 5/6, 7/8, 1/1, 2/1, 3/1, 4/1.
   *
   *
   * key | value
   * --- | ---
   * default | 0.5
   * range | [0, 1]*/
  rateNormalized?: number
  /**
   *  Phase offset factor of the LFO, in percentage of the entire phase.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  offsetFactor?: number
  /**
   *  The delay before the LFO enters the blend phase on every note trigger, expressed as a normalized value.
   *  During the delay phase, the LFO is not active.
   *
   *  The meaning of the value depends on the is_synced flag:
   *  - if is_synced is false, the value maps to milliseconds (1.0 .. 5000.0) with formula:
   *        millis = 1.0 + 4999.0 * value^3.3245278
   *  - if is_synced is true, then the value is quantized to one of 30 bar time durations.
   *    The bar time durations are:
   *       0, 1/256, 1/192, 1/128, 1/96, 1/64, 1/48, 1/32, 1/24, 1/16,
   *       1/12, 1/8, 1/6, 3/16, 1/4, 5/16, 1/3, 3/8, 7/16, 1/2, 9/16, 7/12, 5/8,
   *       2/3, 3/4, 5/6, 7/8, 1/1, 2/1, 3/1, 4/1.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  delayTimeNormalized?: number
  /**
   *  The duration of the blend phase of the LFO during which the LFO transitions from
   *  no offset to full offset, expressed as a normalized value.
   *
   *  The meaning of the value depends on the is_synced flag:
   *  - if is_synced is false, the value maps to milliseconds (1.0 .. 5000.0) with formula:
   *        millis = 1.0 + 4999.0 * value^3.3245278
   *  - if is_synced is true, then the value is quantized to one of 30 bar time durations.
   *    The bar time durations are:
   *       0, 1/256, 1/192, 1/128, 1/96, 1/64, 1/48, 1/32, 1/24, 1/16,
   *       1/12, 1/8, 1/6, 3/16, 1/4, 5/16, 1/3, 3/8, 7/16, 1/2, 9/16, 7/12, 5/8,
   *       2/3, 3/4, 5/6, 7/8, 1/1, 2/1, 3/1, 4/1.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  blendTimeNormalized?: number
  /**
   *  Selects the waveform of the LFO:
   *  - 0: invalid
   *  - 1: Sinus
   *  - 2: Parabola
   *  - 3: Circle
   *  - 4: Triangle
   *  - 5: Sawtooth Up
   *  - 6: Sawtooth Down
   *  - 7: Square
   *  - 8: Andrew Wiles
   *  - 9: Ernest Rutherford
   *  - 10: Wilhelm Conrad Röntgen
   *  - 11: Peter Higgs
   *  - 12: Gottfried Wilhelm Leibniz;
   *  - 13: Alan Turing
   *  - 14: Hans Geiger
   *  - 15: Hermann von Helmholtz
   *  - 16: Jean Baptiste Joseph Fourier
   *  - 17: James Clerk Maxwell
   *  - 18: Formant I
   *  - 19: Formant II
   *  - 20: Formant III
   *  - 21: Formant IV
   *  - 22: Blaise Pascal
   *  - 23: Pierre de Fermat
   *  - 24: Carl Friedrich Gauß
   *  - 25: Isaac Newton
   *  - 26: Marie Curie
   *  - 27: Nikola Tesla
   *  - 28: Alessandro Volta
   *  - 29: Bernhard Riemann
   *  - 30: André Weil
   *  - 31: David Hilbert
   *  - 32: Pierre-Simon Laplace
   *  - 33: Andreas Christian Doppler
   *  - 34: Paul Dirac
   *  - 35: Max Planck
   *  - 36: André-Marie Ampère
   *  - 37: Max Born
   *  - 38: Richard Feynman
   *  - 39: Johannes Kepler
   *  - 40: Heinrich Hertz
   *  - 41: August Ferdinand Möbius
   *  - 42: Robert Moog;
   *  - 43: Albert Einstein
   *  - 44: Erwin Schrödinger
   *  - 45: Galileo Galilei
   *  - 46: Michael Faraday
   *  - 47: Leonhard Euler
   *  - 48: Werner Heisenberg
   *  - 49: Kurt Gödel
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 49]*/
  waveformIndex?: number
}

/**
 *
 * key | value
 * --- | ---
 * type | object
 *
 *  The Heisenberg pitch envelope is a ADSR envelope that controls the pitch detune of the notes played.
 *  The enveloped can be toggled on or off on each operator using the use_pitch_envelope flag.
 *  If active, the pitch envelope detunes each incoming note's pitch by a certain factor.
 *
 *
 * @category Device Fields*/
export type HeisenbergPitchEnvelope = {
  /**
   *  Wether the pitch envelope is in time sync or not. This affects the meaning of the time values below.
   *
   *
   * key | value
   * --- | ---
   * default | false
   * is | {@link api.TargetType.AutomatableParameter}*/
  isSynced: PrimitiveField<boolean, "mut">
  /**
   *  If enabled, the decay phase of the envelope will loop. Looping means playing
   *  the decay phase "back and forth".
   *  - 0: invalid
   *  - 1: Off
   *  - 2: Gate       loops the decay phase until the note is released; then it loops until
   *                the end of the currently playing decay phase, then enters the release phase and stops.
   *  - 3: Infinity   the decay phase will loop forever.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 3]
   * is | {@link api.TargetType.AutomatableParameter}*/
  loopDecayIndex: PrimitiveField<number, "mut">
  /**
   *  The value of the attack phase of the envelope. The amount detuned is this factor multiplied
   *  by the semitone value below.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  attackRangeFactor: PrimitiveField<number, "mut">
  /**
   *  The attack time of the pitch envelope, expressed as a normalized value.
   *  The meaning of the value depends on the is_synced flag:
   *  - if is_synced is false, the value maps to milliseconds (1.0 .. 10_000.0) with formula:
   *        millis = 1.0 + 9999.0 * value^2.3225053
   *  - if is_synced is true, then the value is quantized to one of 30 bar time durations.
   *    The bar time durations are:
   *       1/256, 1/192, 1/128, 1/96, 1/64, 1/48, 1/32, 1/24, 1/16,
   *       1/12, 1/8, 1/6, 3/16, 1/4, 5/16, 1/3, 3/8, 7/16, 1/2, 9/16, 7/12, 5/8,
   *       2/3, 3/4, 5/6, 7/8, 1/1, 2/1, 3/1, 4/1.
   *
   *
   * key | value
   * --- | ---
   * default | 0.5
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  attackTimeNormalized: PrimitiveField<number, "mut">
  /**
   *  Controls how much the attack phase is bent. 0 is linear, more or less means more or less sloping.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  attackSlopeFactor: PrimitiveField<number, "mut">
  /**
   *  The value of the decay phase of the envelope. The amount detuned is this factor multiplied
   *  by the semitone value below.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  decayRangeFactor: PrimitiveField<number, "mut">
  /**
   *  The decay time of the pitch envelope, expressed as a normalized value.
   *  The meaning of the value depends on the is_synced flag:
   *  - if is_synced is false, the value maps to milliseconds (1.0 .. 10_000.0) with formula:
   *        millis = 1.0 + 9999.0 * value^2.3225053
   *  - if is_synced is true, then the value is quantized to one of 30 bar time durations.
   *    The bar time durations are:
   *       1/256, 1/192, 1/128, 1/96, 1/64, 1/48, 1/32, 1/24, 1/16,
   *       1/12, 1/8, 1/6, 3/16, 1/4, 5/16, 1/3, 3/8, 7/16, 1/2, 9/16, 7/12, 5/8,
   *       2/3, 3/4, 5/6, 7/8, 1/1, 2/1, 3/1, 4/1.
   *
   *
   * key | value
   * --- | ---
   * default | 0.5
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  decayTimeNormalized: PrimitiveField<number, "mut">
  /**
   *  Controls how much the decay phase is bent. 0 is linear, more or less means more or less sloping.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  decaySlopeFactor: PrimitiveField<number, "mut">
  /**
   *  Sustain phase of the envelope. The amount detuned is this factor multiplied
   *  by the semitone value below.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  sustainRangeFactor: PrimitiveField<number, "mut">
  /**
   *  The release time of the pitch envelope, expressed as a normalized value.
   *  The meaning of the value depends on the is_synced flag:
   *  - if is_synced is false, the value maps to milliseconds (1.0 .. 10_000.0) with formula:
   *        millis = 1.0 + 9999.0 * value^2.3225053
   *  - if is_synced is true, then the value is quantized to one of 30 bar time durations.
   *    The bar time durations are:
   *       1/256, 1/192, 1/128, 1/96, 1/64, 1/48, 1/32, 1/24, 1/16,
   *       1/12, 1/8, 1/6, 3/16, 1/4, 5/16, 1/3, 3/8, 7/16, 1/2, 9/16, 7/12, 5/8,
   *       2/3, 3/4, 5/6, 7/8, 1/1, 2/1, 3/1, 4/1.
   *
   *
   * key | value
   * --- | ---
   * default | 0.5
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  releaseTimeNormalized: PrimitiveField<number, "mut">
  /**
   *  Controls how much the release phase is bent. 0 is linear, more or less means more or less sloping.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  releaseSlopeFactor: PrimitiveField<number, "mut">
  /**
   *  The value the release phase ends at. The amount detuned is this factor multiplied
   *  by the semitone value below.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  releaseRangeFactor: PrimitiveField<number, "mut">
  /**
   *  The semitone value of the pitch envelope. This is the semitone value that is used to detune
   *  the notes played. The different envelope phases use this value to calculate the amount detuned.
   *
   *
   * key | value
   * --- | ---
   * default | 12
   * range | [1, 36]
   * is | {@link api.TargetType.AutomatableParameter}*/
  semitoneRange: PrimitiveField<number, "mut">
}
/** @internal */

export type HeisenbergPitchEnvelopeConstructor = {
  /**
   *  Wether the pitch envelope is in time sync or not. This affects the meaning of the time values below.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  isSynced?: boolean
  /**
   *  If enabled, the decay phase of the envelope will loop. Looping means playing
   *  the decay phase "back and forth".
   *  - 0: invalid
   *  - 1: Off
   *  - 2: Gate       loops the decay phase until the note is released; then it loops until
   *                the end of the currently playing decay phase, then enters the release phase and stops.
   *  - 3: Infinity   the decay phase will loop forever.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 3]*/
  loopDecayIndex?: number
  /**
   *  The value of the attack phase of the envelope. The amount detuned is this factor multiplied
   *  by the semitone value below.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [-1, 1]*/
  attackRangeFactor?: number
  /**
   *  The attack time of the pitch envelope, expressed as a normalized value.
   *  The meaning of the value depends on the is_synced flag:
   *  - if is_synced is false, the value maps to milliseconds (1.0 .. 10_000.0) with formula:
   *        millis = 1.0 + 9999.0 * value^2.3225053
   *  - if is_synced is true, then the value is quantized to one of 30 bar time durations.
   *    The bar time durations are:
   *       1/256, 1/192, 1/128, 1/96, 1/64, 1/48, 1/32, 1/24, 1/16,
   *       1/12, 1/8, 1/6, 3/16, 1/4, 5/16, 1/3, 3/8, 7/16, 1/2, 9/16, 7/12, 5/8,
   *       2/3, 3/4, 5/6, 7/8, 1/1, 2/1, 3/1, 4/1.
   *
   *
   * key | value
   * --- | ---
   * default | 0.5
   * range | [0, 1]*/
  attackTimeNormalized?: number
  /**
   *  Controls how much the attack phase is bent. 0 is linear, more or less means more or less sloping.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]*/
  attackSlopeFactor?: number
  /**
   *  The value of the decay phase of the envelope. The amount detuned is this factor multiplied
   *  by the semitone value below.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]*/
  decayRangeFactor?: number
  /**
   *  The decay time of the pitch envelope, expressed as a normalized value.
   *  The meaning of the value depends on the is_synced flag:
   *  - if is_synced is false, the value maps to milliseconds (1.0 .. 10_000.0) with formula:
   *        millis = 1.0 + 9999.0 * value^2.3225053
   *  - if is_synced is true, then the value is quantized to one of 30 bar time durations.
   *    The bar time durations are:
   *       1/256, 1/192, 1/128, 1/96, 1/64, 1/48, 1/32, 1/24, 1/16,
   *       1/12, 1/8, 1/6, 3/16, 1/4, 5/16, 1/3, 3/8, 7/16, 1/2, 9/16, 7/12, 5/8,
   *       2/3, 3/4, 5/6, 7/8, 1/1, 2/1, 3/1, 4/1.
   *
   *
   * key | value
   * --- | ---
   * default | 0.5
   * range | [0, 1]*/
  decayTimeNormalized?: number
  /**
   *  Controls how much the decay phase is bent. 0 is linear, more or less means more or less sloping.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]*/
  decaySlopeFactor?: number
  /**
   *  Sustain phase of the envelope. The amount detuned is this factor multiplied
   *  by the semitone value below.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]*/
  sustainRangeFactor?: number
  /**
   *  The release time of the pitch envelope, expressed as a normalized value.
   *  The meaning of the value depends on the is_synced flag:
   *  - if is_synced is false, the value maps to milliseconds (1.0 .. 10_000.0) with formula:
   *        millis = 1.0 + 9999.0 * value^2.3225053
   *  - if is_synced is true, then the value is quantized to one of 30 bar time durations.
   *    The bar time durations are:
   *       1/256, 1/192, 1/128, 1/96, 1/64, 1/48, 1/32, 1/24, 1/16,
   *       1/12, 1/8, 1/6, 3/16, 1/4, 5/16, 1/3, 3/8, 7/16, 1/2, 9/16, 7/12, 5/8,
   *       2/3, 3/4, 5/6, 7/8, 1/1, 2/1, 3/1, 4/1.
   *
   *
   * key | value
   * --- | ---
   * default | 0.5
   * range | [0, 1]*/
  releaseTimeNormalized?: number
  /**
   *  Controls how much the release phase is bent. 0 is linear, more or less means more or less sloping.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]*/
  releaseSlopeFactor?: number
  /**
   *  The value the release phase ends at. The amount detuned is this factor multiplied
   *  by the semitone value below.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]*/
  releaseRangeFactor?: number
  /**
   *  The semitone value of the pitch envelope. This is the semitone value that is used to detune
   *  the notes played. The different envelope phases use this value to calculate the amount detuned.
   *
   *
   * key | value
   * --- | ---
   * default | 12
   * range | [1, 36]*/
  semitoneRange?: number
}

/**
 *
 * key | value
 * --- | ---
 * type | object
 *
 *  The filter parameters of the Heisenberg. The filter is applied to the entire
 *  signal after all operators have been added together.
 *
 *
 * @category Device Fields*/
export type HeisenbergFilter = {
  /**
   *  Filter cutoff frequency in Hz.
   *
   *
   * key | value
   * --- | ---
   * default | 11025
   * range | [33, 22050]
   * is | {@link api.TargetType.AutomatableParameter}*/
  cutoffFrequencyHz: PrimitiveField<number, "mut">
  /**
   *  Filter resonance. as a value from 1/sqrt(2) to 60 (maxQ).
   *
   *
   * key | value
   * --- | ---
   * default | 0.7071067690849304
   * range | [0.7071067690849304, 60]
   * is | {@link api.TargetType.AutomatableParameter}*/
  resonance: PrimitiveField<number, "mut">
  /**
   *  Controls the filter "type" in a continuous way:
   *  - -1: LowPass
   *  - ~0: Shelf Filter
   *  -  1: HighPass
   *
   *
   * key | value
   * --- | ---
   * default | -1
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  filterType: PrimitiveField<number, "mut">
  /**
   *  Selects the filter order/filter gain:
   *  - 0: invalid
   *  - 1: 12dB
   *  - 2: 24dB
   *  - 3: 36dB
   *  - 4: 48dB
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 4]
   * is | {@link api.TargetType.AutomatableParameter}*/
  orderIndex: PrimitiveField<number, "mut">
  /**
   *  The extent to which the note's velocity influences the filter's cutoff frequency.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  velocityCutoffModulationDepth: PrimitiveField<number, "mut">
  /**
   *  The extent to which the main envelope influences the filter's cutoff frequency.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  envelopeMainCutoffModulationDepth: PrimitiveField<number, "mut">
  /**
   *  The extent to which envelope 1 influences the filter's cutoff frequency.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  envelope2CutoffModulationDepth: PrimitiveField<number, "mut">
  /**
   *  The extent to which envelope 2 influences the filter's cutoff frequency.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  envelope3CutoffModulationDepth: PrimitiveField<number, "mut">
  /**
   *  The extent to which LFO 1 influences the filter's cutoff frequency.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  lfo1CutoffModulationDepth: PrimitiveField<number, "mut">
  /**
   *  The extent to which LFO 2 influences the filter's cutoff frequency.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  lfo2CutoffModulationDepth: PrimitiveField<number, "mut">
  /**
   *  The extent to which the filter's cutoff frequency is influence by the playing note's
   *  pitch. If this is > 0, the higher the note, the higher the filter's cutoff frequency.
   *  If this is < 0, the higher the note, the lower the filter's cutoff frequency.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  keyboardTrackingAmount: PrimitiveField<number, "mut">
}
/** @internal */

export type HeisenbergFilterConstructor = {
  /**
   *  Filter cutoff frequency in Hz.
   *
   *
   * key | value
   * --- | ---
   * default | 11025
   * range | [33, 22050]*/
  cutoffFrequencyHz?: number
  /**
   *  Filter resonance. as a value from 1/sqrt(2) to 60 (maxQ).
   *
   *
   * key | value
   * --- | ---
   * default | 0.7071067690849304
   * range | [0.7071067690849304, 60]*/
  resonance?: number
  /**
   *  Controls the filter "type" in a continuous way:
   *  - -1: LowPass
   *  - ~0: Shelf Filter
   *  -  1: HighPass
   *
   *
   * key | value
   * --- | ---
   * default | -1
   * range | [-1, 1]*/
  filterType?: number
  /**
   *  Selects the filter order/filter gain:
   *  - 0: invalid
   *  - 1: 12dB
   *  - 2: 24dB
   *  - 3: 36dB
   *  - 4: 48dB
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 4]*/
  orderIndex?: number
  /**
   *  The extent to which the note's velocity influences the filter's cutoff frequency.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]*/
  velocityCutoffModulationDepth?: number
  /**
   *  The extent to which the main envelope influences the filter's cutoff frequency.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]*/
  envelopeMainCutoffModulationDepth?: number
  /**
   *  The extent to which envelope 1 influences the filter's cutoff frequency.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]*/
  envelope2CutoffModulationDepth?: number
  /**
   *  The extent to which envelope 2 influences the filter's cutoff frequency.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]*/
  envelope3CutoffModulationDepth?: number
  /**
   *  The extent to which LFO 1 influences the filter's cutoff frequency.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]*/
  lfo1CutoffModulationDepth?: number
  /**
   *  The extent to which LFO 2 influences the filter's cutoff frequency.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]*/
  lfo2CutoffModulationDepth?: number
  /**
   *  The extent to which the filter's cutoff frequency is influence by the playing note's
   *  pitch. If this is > 0, the higher the note, the higher the filter's cutoff frequency.
   *  If this is < 0, the higher the note, the lower the filter's cutoff frequency.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]*/
  keyboardTrackingAmount?: number
}

