// THIS FILE IS GENERATED - DO NOT EDIT
// Copyright 2026 Audiotool Inc.

import { PrimitiveField } from "@document/fields"
import { type NexusLocation } from "@document/location"
import { NexusObject } from "@document/object"
import { type Empty } from "@gen/document/v1/empty_nexus"

/**
 *
 * key | value
 * --- | ---
 * type | entity
 * key | `"pulverisateur"`
 * is | {@link api.TargetType.NoteTrackPlayer}
 *
 *
 *  The Pulverisateur is a subtractive synth with 3 regular oscillators,
 *  a noise generator, a keyboard-tracking envelope filter, an ADSR envelope,
 *  and an LFO. It also features an audio input that can act as another source of
 *  audio like the oscillators.
 *
 *
 * @category Device Entities*/
export type Pulverisateur = {
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
   *  Notes input
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.NotesInput}*/
  notesInput: NexusObject<Empty>
  /**
   *  Audio input
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioInput}*/
  audioInput: NexusObject<Empty>
  /**
   *  Audio output
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioOutput}*/
  audioOutput: NexusObject<Empty>
  /**
   *  The main output gain of the device. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 0.7079460024833679
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  gain: PrimitiveField<number, "mut">
  /**
   *  Oscillator A
   */
  oscillatorA: NexusObject<PulverisateurOscillatorA>
  /**
   *  Oscillator B
   */
  oscillatorB: NexusObject<PulverisateurOscillatorB>
  /**
   *  Oscillator C
   */
  oscillatorC: NexusObject<PulverisateurOscillatorC>
  /**
   *  Noise Oscillator
   */
  noise: NexusObject<PulverisateurNoise>
  /**
   *  Audio Input Section
   */
  audio: NexusObject<PulverisateurAudio>
  /**
   *  Filter
   */
  filter: NexusObject<PulverisateurFilter>
  /**
   *  LFO
   */
  lfo: NexusObject<PulverisateurLfo>
  /**
   *  Filter Envelope
   */
  filterEnvelope: NexusObject<PulverisateurFilterEnvelope>
  /**
   *  Amplitude Envelope
   */
  amplitudeEnvelope: NexusObject<PulverisateurAmplitudeEnvelope>
  /**
   *  The amount of time pitch change for a new note takes
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 10000]
   * is | {@link api.TargetType.AutomatableParameter}*/
  glideTimeMs: PrimitiveField<number, "mut">
  /**
   *  Tuning of the pitch of all notes of the synth by a number of semitones.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-12, 12]
   * is | {@link api.TargetType.AutomatableParameter}*/
  tuneSemitones: PrimitiveField<number, "mut">
  /**
   *  Selects the play mode of the synthesizer.
   *  - 0: invalid
   *  - 1: Mono         At most once note is played at once with slight overlap during release. An incoming note
   *                  cuts already playing notes.
   *  - 2: Polyphonic   Multiple notes/chords can be played simultaneously.
   *
   *
   * key | value
   * --- | ---
   * default | 2
   * range | [1, 2]
   * is | {@link api.TargetType.AutomatableParameter}*/
  playModeIndex: PrimitiveField<number, "mut">
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
   *  Whether the pulverisateur is active or not. When is_active=false no audio is produced by the pulverisateur, including audio passed
   *  through the audio input.
   *
   *
   * key | value
   * --- | ---
   * default | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  isActive: PrimitiveField<boolean, "mut">
}
/** @internal */

export type PulverisateurConstructor = {
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
   *  The main output gain of the device. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 0.7079460024833679
   * range | [0, 1]*/
  gain?: number
  /**
   *  Oscillator A
   */
  oscillatorA?: PulverisateurOscillatorAConstructor
  /**
   *  Oscillator B
   */
  oscillatorB?: PulverisateurOscillatorBConstructor
  /**
   *  Oscillator C
   */
  oscillatorC?: PulverisateurOscillatorCConstructor
  /**
   *  Noise Oscillator
   */
  noise?: PulverisateurNoiseConstructor
  /**
   *  Audio Input Section
   */
  audio?: PulverisateurAudioConstructor
  /**
   *  Filter
   */
  filter?: PulverisateurFilterConstructor
  /**
   *  LFO
   */
  lfo?: PulverisateurLfoConstructor
  /**
   *  Filter Envelope
   */
  filterEnvelope?: PulverisateurFilterEnvelopeConstructor
  /**
   *  Amplitude Envelope
   */
  amplitudeEnvelope?: PulverisateurAmplitudeEnvelopeConstructor
  /**
   *  The amount of time pitch change for a new note takes
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 10000]*/
  glideTimeMs?: number
  /**
   *  Tuning of the pitch of all notes of the synth by a number of semitones.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-12, 12]*/
  tuneSemitones?: number
  /**
   *  Selects the play mode of the synthesizer.
   *  - 0: invalid
   *  - 1: Mono         At most once note is played at once with slight overlap during release. An incoming note
   *                  cuts already playing notes.
   *  - 2: Polyphonic   Multiple notes/chords can be played simultaneously.
   *
   *
   * key | value
   * --- | ---
   * default | 2
   * range | [1, 2]*/
  playModeIndex?: number
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
   *  Whether the pulverisateur is active or not. When is_active=false no audio is produced by the pulverisateur, including audio passed
   *  through the audio input.
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
 *  The Pulverisateur's first oscillator.
 *
 *
 * @category Device Fields*/
export type PulverisateurOscillatorA = {
  /**
   *  Channel object containing common controls
   */
  channel: NexusObject<PulverisateurChannel>
  /**
   *  Oscillator object containing common controls
   */
  oscillator: NexusObject<PulverisateurOscillator>
}
/** @internal */

export type PulverisateurOscillatorAConstructor = {
  /**
   *  Channel object containing common controls
   */
  channel?: PulverisateurChannelConstructor
  /**
   *  Oscillator object containing common controls
   */
  oscillator?: PulverisateurOscillatorConstructor
}

/**
 *
 * key | value
 * --- | ---
 * type | object
 *
 *  The Pulverisateur's second oscillator. Same as the first one, but can be synced to the first one's phase.
 *
 *
 * @category Device Fields*/
export type PulverisateurOscillatorB = {
  /**
   *  Channel object containing common controls
   */
  channel: NexusObject<PulverisateurChannel>
  /**
   *  Oscillator object containing common controls
   */
  oscillator: NexusObject<PulverisateurOscillator>
  /**
   *  If this is true, then whenever oscillator A's phase restarts, oscillator B's phase is restarted as well.
   *
   *
   * key | value
   * --- | ---
   * default | false
   * is | {@link api.TargetType.AutomatableParameter}*/
  hardSyncToOscillatorA: PrimitiveField<boolean, "mut">
}
/** @internal */

export type PulverisateurOscillatorBConstructor = {
  /**
   *  Channel object containing common controls
   */
  channel?: PulverisateurChannelConstructor
  /**
   *  Oscillator object containing common controls
   */
  oscillator?: PulverisateurOscillatorConstructor
  /**
   *  If this is true, then whenever oscillator A's phase restarts, oscillator B's phase is restarted as well.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  hardSyncToOscillatorA?: boolean
}

/**
 *
 * key | value
 * --- | ---
 * type | object
 *
 *  The Pulverisateur's third oscillator. Same as the first one, but can be tracked by the keyboard.
 *
 *
 * @category Device Fields*/
export type PulverisateurOscillatorC = {
  /**
   *  Channel object containing common controls
   */
  channel: NexusObject<PulverisateurChannel>
  /**
   *  Oscillator object containing common controls
   */
  oscillator: NexusObject<PulverisateurOscillator>
  /**
   *  Whether this oscillator's pitch is tracked by the keyboard.
   *  If does_track_keyboard is off, then the oscillator plays as if every incoming note was a C4/midi 60.
   *  If it's on, it behaves the same as oscillator A & B.
   *
   *
   * key | value
   * --- | ---
   * default | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  doesTrackKeyboard: PrimitiveField<boolean, "mut">
}
/** @internal */

export type PulverisateurOscillatorCConstructor = {
  /**
   *  Channel object containing common controls
   */
  channel?: PulverisateurChannelConstructor
  /**
   *  Oscillator object containing common controls
   */
  oscillator?: PulverisateurOscillatorConstructor
  /**
   *  Whether this oscillator's pitch is tracked by the keyboard.
   *  If does_track_keyboard is off, then the oscillator plays as if every incoming note was a C4/midi 60.
   *  If it's on, it behaves the same as oscillator A & B.
   *
   *
   * key | value
   * --- | ---
   * default | true*/
  doesTrackKeyboard?: boolean
}

/**
 *
 * key | value
 * --- | ---
 * type | object
 *
 *  The Pulverisateur's noise generator.
 *
 *
 * @category Device Fields*/
export type PulverisateurNoise = {
  /**
   *  Channel object containing common controls
   */
  channel: NexusObject<PulverisateurChannel>
  /**
   *  Color of noise. Meaning of values:
   *  - 0:    brown noise
   *  - 0.2:  pink noise
   *  - 0.5:  white noise
   *  - 0.8:  blue noise
   *  - 1:    purple noise
   *
   *  Values between any two of these linearly mix the two colors.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  color: PrimitiveField<number, "mut">
}
/** @internal */

export type PulverisateurNoiseConstructor = {
  /**
   *  Channel object containing common controls
   */
  channel?: PulverisateurChannelConstructor
  /**
   *  Color of noise. Meaning of values:
   *  - 0:    brown noise
   *  - 0.2:  pink noise
   *  - 0.5:  white noise
   *  - 0.8:  blue noise
   *  - 1:    purple noise
   *
   *  Values between any two of these linearly mix the two colors.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]*/
  color?: number
}

/**
 *
 * key | value
 * --- | ---
 * type | object
 *
 *  Data structure for Pulverisateur's audio input channel.
 *  Audio connected to this input passes through the Pulverisateur as though it were one of the oscillators.
 *
 *
 * @category Device Fields*/
export type PulverisateurAudio = {
  /**
   *  Channel object containing common controls
   */
  channel: NexusObject<PulverisateurChannel>
  /**
   *  The drive parameter applies some distortion to the incoming signal similar to the waveshaper device.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  drive: PrimitiveField<number, "mut">
}
/** @internal */

export type PulverisateurAudioConstructor = {
  /**
   *  Channel object containing common controls
   */
  channel?: PulverisateurChannelConstructor
  /**
   *  The drive parameter applies some distortion to the incoming signal similar to the waveshaper device.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  drive?: number
}

/**
 *
 * key | value
 * --- | ---
 * type | object
 *
 *  The Pulverisateur's filter. The filter can be set to track the keyboard.
 *
 *
 * @category Device Fields*/
export type PulverisateurFilter = {
  /**
   *  Filter mode.
   *  - 0: invalid
   *  - 1: "LP/LP"  Two low pass filters in series
   *  - 2: "LP/HP"  A low and a high pass filter, run in parallel and added together, creating something like a notch filter.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 2]
   * is | {@link api.TargetType.AutomatableParameter}*/
  modeIndex: PrimitiveField<number, "mut">
  /**
   *  Controls the cutoff frequencies of the filters. The
   *
   *
   * key | value
   * --- | ---
   * default | 15500
   * range | [18, 15500]
   * is | {@link api.TargetType.AutomatableParameter}*/
  cutoffFrequencyHz: PrimitiveField<number, "mut">
  /**
   *  Controls the resonance of the filters.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  resonance: PrimitiveField<number, "mut">
  /**
   *  Controls the spacing between the two filters. Only has an effect in the HP/LP mode,
   *  ignored in LP/LP mode.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  filterSpacing: PrimitiveField<number, "mut">
  /**
   *  How much filter cutoff frequency tracks notes's pitch.
   *  -1 means the higher the note, the lower is the cutoff frequency
   *  1 means the higher the note, the higher is the cutoff frequency
   *  0 means the cutoff frequency is not affected by the note's pitch.
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

export type PulverisateurFilterConstructor = {
  /**
   *  Filter mode.
   *  - 0: invalid
   *  - 1: "LP/LP"  Two low pass filters in series
   *  - 2: "LP/HP"  A low and a high pass filter, run in parallel and added together, creating something like a notch filter.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 2]*/
  modeIndex?: number
  /**
   *  Controls the cutoff frequencies of the filters. The
   *
   *
   * key | value
   * --- | ---
   * default | 15500
   * range | [18, 15500]*/
  cutoffFrequencyHz?: number
  /**
   *  Controls the resonance of the filters.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  resonance?: number
  /**
   *  Controls the spacing between the two filters. Only has an effect in the HP/LP mode,
   *  ignored in LP/LP mode.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]*/
  filterSpacing?: number
  /**
   *  How much filter cutoff frequency tracks notes's pitch.
   *  -1 means the higher the note, the lower is the cutoff frequency
   *  1 means the higher the note, the higher is the cutoff frequency
   *  0 means the cutoff frequency is not affected by the note's pitch.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]*/
  keyboardTrackingAmount?: number
}

/**
 *
 * key | value
 * --- | ---
 * type | object
 *
 *  The Pulverisateur's LFO.
 *
 *
 * @category Device Fields*/
export type PulverisateurLfo = {
  /**
   *  The LFO's waveform shape:
   *  0:     random          Randomly switches between amplitudes in certain intervals.
   *  0.25:  sine            ∿∿∿
   *  0.5:   triangle        /\/\/\
   *  0.75:  sawtooth up     /|/|/|
   *  1:     square          |⎺|⎽|⎺|
   *  Values between any two of these linearly interpolate the two waveforms.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  waveform: PrimitiveField<number, "mut">
  /**
   *  Whether the LFO's frequency
   *
   *
   * key | value
   * --- | ---
   * default | false
   * is | {@link api.TargetType.AutomatableParameter}*/
  rateIsSynced: PrimitiveField<boolean, "mut">
  /**
   *  The LFO's rate/frequency in normalized form. The exact rate depends
   *  on the value of rate_is_synced:
   *  - if false, the value maps exponentially to Hz (0.01 .. 344.0) with formula:
   *        hz = 0.01 * 34400^value
   *  - if true, the value is quantized to the durations  8/1, 6/1, 4/1, 2/1, 1/1, 1/2, 1/4, 1/6, 1/8,
   *    1/12, 1/16, 1/24, 1/32, 1/48, 1/64, 1/96, 1/128.
   *
   *
   * key | value
   * --- | ---
   * default | 0.25
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  rateNormalized: PrimitiveField<number, "mut">
  /**
   *  The "trigger" parameter in the UI. If restart_on_note=true, the LFO's phase is reest on each note;
   *  if =false, the LFO's phase starts on global time 0 and continues indefinitely (resulting in
   *  the LFO's phase offset being consistent on play/pause/loop).
   *
   *
   * key | value
   * --- | ---
   * default | false
   * is | {@link api.TargetType.AutomatableParameter}*/
  restartOnNote: PrimitiveField<boolean, "mut">
  /**
   *  Whether lfo is applied to Oscillator A pitch.
   *
   *
   * key | value
   * --- | ---
   * default | false
   * is | {@link api.TargetType.AutomatableParameter}*/
  targetsOscillatorAPitch: PrimitiveField<boolean, "mut">
  /**
   *  Whether lfo is applied to Oscillator B pitch.
   *
   *
   * key | value
   * --- | ---
   * default | false
   * is | {@link api.TargetType.AutomatableParameter}*/
  targetsOscillatorBPitch: PrimitiveField<boolean, "mut">
  /**
   *  Whether lfo is applied to Oscillator C pitch.
   *
   *
   * key | value
   * --- | ---
   * default | false
   * is | {@link api.TargetType.AutomatableParameter}*/
  targetsOscillatorCPitch: PrimitiveField<boolean, "mut">
  /**
   *  Whether lfo is applied to filter cutoff.
   *
   *
   * key | value
   * --- | ---
   * default | false
   * is | {@link api.TargetType.AutomatableParameter}*/
  targetsFilterCutoff: PrimitiveField<boolean, "mut">
  /**
   *  Whether lfo is applied to pulse width. The pulse width controls the width of the first half
   *  of the waves of every oscillator.
   *
   *  Example:
   *  Square wave for pulse width 0.5:  |⎺⎺⎺|⎽⎽⎽|
   *  Square wave for pulse width 0.75: |⎺⎺⎺⎺⎺|⎽|
   *
   *  This adds harmonic frequencies to the waveform.
   *
   *
   * key | value
   * --- | ---
   * default | false
   * is | {@link api.TargetType.AutomatableParameter}*/
  targetsPulseWidth: PrimitiveField<boolean, "mut">
  /**
   *  The modulation depth of the LFO. If this is 1, the LFO affects pitch/filter/pulse with
   *  in its entire with.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  modulationDepth: PrimitiveField<number, "mut">
}
/** @internal */

export type PulverisateurLfoConstructor = {
  /**
   *  The LFO's waveform shape:
   *  0:     random          Randomly switches between amplitudes in certain intervals.
   *  0.25:  sine            ∿∿∿
   *  0.5:   triangle        /\/\/\
   *  0.75:  sawtooth up     /|/|/|
   *  1:     square          |⎺|⎽|⎺|
   *  Values between any two of these linearly interpolate the two waveforms.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  waveform?: number
  /**
   *  Whether the LFO's frequency
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  rateIsSynced?: boolean
  /**
   *  The LFO's rate/frequency in normalized form. The exact rate depends
   *  on the value of rate_is_synced:
   *  - if false, the value maps exponentially to Hz (0.01 .. 344.0) with formula:
   *        hz = 0.01 * 34400^value
   *  - if true, the value is quantized to the durations  8/1, 6/1, 4/1, 2/1, 1/1, 1/2, 1/4, 1/6, 1/8,
   *    1/12, 1/16, 1/24, 1/32, 1/48, 1/64, 1/96, 1/128.
   *
   *
   * key | value
   * --- | ---
   * default | 0.25
   * range | [0, 1]*/
  rateNormalized?: number
  /**
   *  The "trigger" parameter in the UI. If restart_on_note=true, the LFO's phase is reest on each note;
   *  if =false, the LFO's phase starts on global time 0 and continues indefinitely (resulting in
   *  the LFO's phase offset being consistent on play/pause/loop).
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  restartOnNote?: boolean
  /**
   *  Whether lfo is applied to Oscillator A pitch.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  targetsOscillatorAPitch?: boolean
  /**
   *  Whether lfo is applied to Oscillator B pitch.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  targetsOscillatorBPitch?: boolean
  /**
   *  Whether lfo is applied to Oscillator C pitch.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  targetsOscillatorCPitch?: boolean
  /**
   *  Whether lfo is applied to filter cutoff.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  targetsFilterCutoff?: boolean
  /**
   *  Whether lfo is applied to pulse width. The pulse width controls the width of the first half
   *  of the waves of every oscillator.
   *
   *  Example:
   *  Square wave for pulse width 0.5:  |⎺⎺⎺|⎽⎽⎽|
   *  Square wave for pulse width 0.75: |⎺⎺⎺⎺⎺|⎽|
   *
   *  This adds harmonic frequencies to the waveform.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  targetsPulseWidth?: boolean
  /**
   *  The modulation depth of the LFO. If this is 1, the LFO affects pitch/filter/pulse with
   *  in its entire with.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]*/
  modulationDepth?: number
}

/**
 *
 * key | value
 * --- | ---
 * type | object
 *
 *  The Pulverisateur filter envelope.
 *
 *
 * @category Device Fields*/
export type PulverisateurFilterEnvelope = {
  /**
   *  Duration of the attack phase of the envelope.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 5000]
   * is | {@link api.TargetType.AutomatableParameter}*/
  attackMs: PrimitiveField<number, "mut">
  /**
   *  Duration of the decay phase of the envelope.
   *
   *
   * key | value
   * --- | ---
   * default | 500
   * range | [1, 5000]
   * is | {@link api.TargetType.AutomatableParameter}*/
  decayMs: PrimitiveField<number, "mut">
  /**
   *  Whether the decay phase is looped. If decay_is_looped=true, the decay phase
   *  will repeat indefinitely, going forward and backward.
   *
   *
   * key | value
   * --- | ---
   * default | false
   * is | {@link api.TargetType.AutomatableParameter}*/
  decayIsLooped: PrimitiveField<boolean, "mut">
  /**
   *  Sustain factor of the envelope.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  sustainFactor: PrimitiveField<number, "mut">
  /**
   *  The duration of the release phase of this envelope
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 20000]
   * is | {@link api.TargetType.AutomatableParameter}*/
  releaseMs: PrimitiveField<number, "mut">
  /**
   *  The amount of modulation applied to the filter by this envelope.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  modulationDepth: PrimitiveField<number, "mut">
}
/** @internal */

export type PulverisateurFilterEnvelopeConstructor = {
  /**
   *  Duration of the attack phase of the envelope.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 5000]*/
  attackMs?: number
  /**
   *  Duration of the decay phase of the envelope.
   *
   *
   * key | value
   * --- | ---
   * default | 500
   * range | [1, 5000]*/
  decayMs?: number
  /**
   *  Whether the decay phase is looped. If decay_is_looped=true, the decay phase
   *  will repeat indefinitely, going forward and backward.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  decayIsLooped?: boolean
  /**
   *  Sustain factor of the envelope.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  sustainFactor?: number
  /**
   *  The duration of the release phase of this envelope
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 20000]*/
  releaseMs?: number
  /**
   *  The amount of modulation applied to the filter by this envelope.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]*/
  modulationDepth?: number
}

/**
 *
 * key | value
 * --- | ---
 * type | object
 *
 *  The Pulverisateur's amplitude envelope.
 *
 *
 * @category Device Fields*/
export type PulverisateurAmplitudeEnvelope = {
  /**
   *  Duration of the attack phase of the envelope.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 5000]
   * is | {@link api.TargetType.AutomatableParameter}*/
  attackMs: PrimitiveField<number, "mut">
  /**
   *  Duration of the decay phase of the envelope.
   *
   *
   * key | value
   * --- | ---
   * default | 500
   * range | [1, 5000]
   * is | {@link api.TargetType.AutomatableParameter}*/
  decayMs: PrimitiveField<number, "mut">
  /**
   *  Whether the decay phase is looped. If loop_decay=true, the decay phase
   *  will repeat indefinitely, going forward and backward.
   *
   *
   * key | value
   * --- | ---
   * default | false
   * is | {@link api.TargetType.AutomatableParameter}*/
  decayIsLooped: PrimitiveField<boolean, "mut">
  /**
   *  The sustain factor of the envelope.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  sustainFactor: PrimitiveField<number, "mut">
  /**
   *  The duration of the release phase of this envelope.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 20000]
   * is | {@link api.TargetType.AutomatableParameter}*/
  releaseMs: PrimitiveField<number, "mut">
}
/** @internal */

export type PulverisateurAmplitudeEnvelopeConstructor = {
  /**
   *  Duration of the attack phase of the envelope.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 5000]*/
  attackMs?: number
  /**
   *  Duration of the decay phase of the envelope.
   *
   *
   * key | value
   * --- | ---
   * default | 500
   * range | [1, 5000]*/
  decayMs?: number
  /**
   *  Whether the decay phase is looped. If loop_decay=true, the decay phase
   *  will repeat indefinitely, going forward and backward.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  decayIsLooped?: boolean
  /**
   *  The sustain factor of the envelope.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  sustainFactor?: number
  /**
   *  The duration of the release phase of this envelope.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 20000]*/
  releaseMs?: number
}

/**
 *
 * key | value
 * --- | ---
 * type | object
 *
 *  This object contains fields shared between the Oscillators, noise and audio channels, such as
 *  whether they're turned on, panning, and gain.
 *
 *
 * @category Device Fields*/
export type PulverisateurChannel = {
  /**
   *  If is_active=false, the channel does not produce any sound.
   *
   *
   * key | value
   * --- | ---
   * default | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  isActive: PrimitiveField<boolean, "mut">
  /**
   *  Panning of the oscillator
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  panning: PrimitiveField<number, "mut">
  /**
   *  This channel's output gain. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  gain: PrimitiveField<number, "mut">
}
/** @internal */

export type PulverisateurChannelConstructor = {
  /**
   *  If is_active=false, the channel does not produce any sound.
   *
   *
   * key | value
   * --- | ---
   * default | true*/
  isActive?: boolean
  /**
   *  Panning of the oscillator
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]*/
  panning?: number
  /**
   *  This channel's output gain. Equivalent to a dB range of [-inf, 0.0].
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
 *  This object contains fields shared between the 3 main oscillators
 *
 *
 * @category Device Fields*/
export type PulverisateurOscillator = {
  /**
   *  Tuning moves the oscillator frequency relative to the
   *  incoming note's pitch.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-7, 7]
   * is | {@link api.TargetType.AutomatableParameter}*/
  tuneSemitones: PrimitiveField<number, "mut">
  /**
   *  Adds or subtracts octaves to the oscillator frequency.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-3, 3]
   * is | {@link api.TargetType.AutomatableParameter}*/
  tuneOctaves: PrimitiveField<number, "mut">
  /**
   *  This parameter selects the waveform shape. There are 4 values that map
   *  to a specific waveform; values between any two of them linearly interpolate
   *  between the two waveforms.
   *
   *  0:      sine           ∿∿∿
   *  0.3333: triangle       /\/\/\
   *  0.6666: sawtooth down  |\|\|\
   *  1:      square         |⎺|⎽|⎺|
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  waveform: PrimitiveField<number, "mut">
}
/** @internal */

export type PulverisateurOscillatorConstructor = {
  /**
   *  Tuning moves the oscillator frequency relative to the
   *  incoming note's pitch.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-7, 7]*/
  tuneSemitones?: number
  /**
   *  Adds or subtracts octaves to the oscillator frequency.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-3, 3]*/
  tuneOctaves?: number
  /**
   *  This parameter selects the waveform shape. There are 4 values that map
   *  to a specific waveform; values between any two of them linearly interpolate
   *  between the two waveforms.
   *
   *  0:      sine           ∿∿∿
   *  0.3333: triangle       /\/\/\
   *  0.6666: sawtooth down  |\|\|\
   *  1:      square         |⎺|⎽|⎺|
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  waveform?: number
}

