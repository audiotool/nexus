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
 * key | `"tinySampler"`
 * is | {@link api.TargetType.NoteTrackPlayer}, {@link api.TargetType.TinySampler}
 *
 *
 *  Data structure representing the TinySampler device.
 *  TinySampler is a sampler that allows interpolating
 *  between keys and velocity layers.
 *
 *
 * @category Device Entities*/
export type TinySampler = {
  /**
   *  The user-assigned name of this device.
   *
   *
   * key | value
   * --- | ---
   * default | `"Tiny Sampler"`*/
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
   *
   *
   * key | value
   * --- | ---
   * default | `""`*/
  presetName: PrimitiveField<string, "mut">
  /**
   *  The notes input of the device.
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.NotesInput}*/
  notesInput: NexusObject<Empty>
  /**
   *  The audio output of the device.
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioOutput}*/
  audioOutput: NexusObject<Empty>
  /**
   *  Gain factor for the output signal. Corresponds to a decibel range of [-inf, 9.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 2.818382978439331]
   * is | {@link api.TargetType.AutomatableParameter}*/
  gainFactor: PrimitiveField<number, "mut">
  /**
   *  Fixed note velocity. When 0.0, the incoming velocity is used;
   *  when > 0.0, this value replaces the incoming velocity.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  overrideVelocity: PrimitiveField<number, "mut">
  /**
   *  How much the velocity (after override_velocity is applied) affects a voice's gain.
   *  - 1.0: the full velocity range is applied as an additional gain factor.
   *  - 0.5: the gain factor is 0.5 + velocity * 0.5 (offset and scaled).
   *  - 0.0: the velocity has no effect.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  velocityImpactFactor: PrimitiveField<number, "mut">
  /**
   *  Whether the device is active or not. When is_active=false,
   *  the device doesn't produce any signal.
   *
   *
   * key | value
   * --- | ---
   * default | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  isActive: PrimitiveField<boolean, "mut">
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
}
/** @internal */

export type TinySamplerConstructor = {
  /**
   *  The user-assigned name of this device.
   *
   *
   * key | value
   * --- | ---
   * default | `"Tiny Sampler"`*/
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
   *
   *
   * key | value
   * --- | ---
   * default | `""`*/
  presetName?: string
  /**
   *  Gain factor for the output signal. Corresponds to a decibel range of [-inf, 9.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 2.818382978439331]*/
  gainFactor?: number
  /**
   *  Fixed note velocity. When 0.0, the incoming velocity is used;
   *  when > 0.0, this value replaces the incoming velocity.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  overrideVelocity?: number
  /**
   *  How much the velocity (after override_velocity is applied) affects a voice's gain.
   *  - 1.0: the full velocity range is applied as an additional gain factor.
   *  - 0.5: the gain factor is 0.5 + velocity * 0.5 (offset and scaled).
   *  - 0.0: the velocity has no effect.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]*/
  velocityImpactFactor?: number
  /**
   *  Whether the device is active or not. When is_active=false,
   *  the device doesn't produce any signal.
   *
   *
   * key | value
   * --- | ---
   * default | true*/
  isActive?: boolean
  /**
   *  Reference to the microtuning.
   *
   *
   * key | value
   * --- | ---
   * default | empty location
   * required | false*/
  microTuning?: NexusLocation
}

/**
 *
 * key | value
 * --- | ---
 * type | entity
 * key | `"tinySamplerSample"`
 * is | {@link api.TargetType.TinySamplerSample}
 *
 *
 *  A sample of a TinySampler, mapped to a single MIDI key. Its sound is
 *  made up of one or more TinySamplerSampleLayers.
 *
 *
 * @category Device Entities*/
export type TinySamplerSample = {
  /**
   *  The MIDI key this sample is mapped to. There can be at most one sample per key.
   *
   *
   * key | value
   * --- | ---
   * default | 60
   * range | [0, 127]*/
  midiKey: PrimitiveField<number, "mut">
  /**
   *  Gain factor applied to all layers of this sample. Corresponds to a decibel
   *  range of [-inf, 9.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 2.818382978439331]*/
  gain: PrimitiveField<number, "mut">
  /**
   *  The tiny sampler this sample belongs to.
   *
   *
   * key | value
   * --- | ---
   * default | no default, required
   * required | true
   * targets | {@link api.TargetType.TinySampler}, meaning one of: <br />{@link entities.TinySampler}
   * immutable | true*/
  tinySampler: PrimitiveField<NexusLocation, "immut">
}
/** @internal */

export type TinySamplerSampleConstructor = {
  /**
   *  The MIDI key this sample is mapped to. There can be at most one sample per key.
   *
   *
   * key | value
   * --- | ---
   * default | 60
   * range | [0, 127]*/
  midiKey?: number
  /**
   *  Gain factor applied to all layers of this sample. Corresponds to a decibel
   *  range of [-inf, 9.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 2.818382978439331]*/
  gain?: number
  /**
   *  The tiny sampler this sample belongs to.
   *
   *
   * key | value
   * --- | ---
   * default | no default, required
   * required | true
   * immutable | true*/
  tinySampler: NexusLocation
}

/**
 *
 * key | value
 * --- | ---
 * type | entity
 * key | `"tinySamplerSampleLayer"`
 * is |
 *
 *
 *  A layer of a TinySamplerSample. Each layer plays one audio sample with its
 *  own pitch, filter, envelope, loop, and velocity gain settings.
 *
 *
 * @category Device Entities*/
export type TinySamplerSampleLayer = {
  /**
   *  The tiny sampler sample this layer belongs to.
   *
   *
   * key | value
   * --- | ---
   * default | no default, required
   * required | true
   * targets | {@link api.TargetType.TinySamplerSample}, meaning one of: <br />{@link entities.TinySamplerSample}
   * immutable | true*/
  tinySamplerSample: PrimitiveField<NexusLocation, "immut">
  /**
   *  Audio sample to be played on this layer.
   *
   *
   * key | value
   * --- | ---
   * default | empty location
   * required | false
   * targets | {@link api.TargetType.Sample}, meaning one of: <br />{@link entities.Sample}*/
  sample: PrimitiveField<NexusLocation, "mut">
  /**
   *  Pitch correction in cents, used to tune the sample to its MIDI key.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1200, 1200]*/
  pitchCorrectionCents: PrimitiveField<number, "mut">
  /**
   *  Low-pass filter cutoff frequency in Hz. Modulated by filter_envelope.
   *
   *
   * key | value
   * --- | ---
   * default | 19500
   * range | [20, 19500]*/
  lowPassCutoffFrequencyHz: PrimitiveField<number, "mut">
  /**
   *  High-pass filter cutoff frequency in Hz. Modulated by filter_envelope.
   *
   *
   * key | value
   * --- | ---
   * default | 19
   * range | [19, 19500]*/
  highPassCutoffFrequencyHz: PrimitiveField<number, "mut">
  /**
   *  User-configurable envelope for the layer's level. Currently the DAW doesn't expose
   *  capabilities to automate its parameters, though they can be automated.
   */
  levelEnvelope: NexusObject<AdsrEnvelope>
  /**
   *  User-configurable envelope for the layer's filter cutoff. Currently the DAW doesn't expose
   *  capabilities to automate its parameters, though they can be automated.
   */
  filterEnvelope: NexusObject<AdsrEnvelope>
  /**
   *  How much the velocity scales the level envelope.
   *  - 0.0: the velocity doesn't influence the envelope.
   *  - 1.0: the full velocity is applied to the envelope as an additional factor.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  velocityLevelEnvelopeAmount: PrimitiveField<number, "mut">
  /**
   *  How much the velocity scales the filter envelope.
   *  - 0.0: the velocity doesn't influence the envelope.
   *  - 1.0: the full velocity is applied to the envelope as an additional factor.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  velocityFilterEnvelopeAmount: PrimitiveField<number, "mut">
  /**
   *  How much the velocity influences the level envelope decay. The decay
   *  gets longer with higher velocity. At 1.0, it ranges from
   *  half the set decay duration (velocity 0.0) to one and a half times
   *  the set decay duration (velocity 1.0). At 0.0, the velocity has no effect.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  velocityDecayModulation: PrimitiveField<number, "mut">
  /**
   *  Playback start point, relative to the sample length.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  startPct: PrimitiveField<number, "mut">
  /**
   *  Playback end point, relative to the sample length. A short, fixed
   *  fade-out is applied before it to avoid clicks. A sustain loop reaching
   *  into it is cut off where it starts, see sustain_loop_start_pct.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]*/
  endPct: PrimitiveField<number, "mut">
  /**
   *  Start of the sustain loop, relative to the sample length.
   *
   *  The sustain loop is only triggered if sustain_loop_is_active is true,
   *  the start is before the end, and the loop doesn't end before start_pct
   *  or start after the fade-out before end_pct. Where it reaches outside of
   *  them, it's cut off: it loops from start_pct if sustain_loop_start_pct is
   *  before it, and up to the fade-out if sustain_loop_end_pct is after it.
   *
   *
   * key | value
   * --- | ---
   * default | 0.7
   * range | [0, 1]*/
  sustainLoopStartPct: PrimitiveField<number, "mut">
  /**
   *  End of the sustain loop, relative to the sample length. Playback jumps
   *  back to sustain_loop_start_pct when it reaches this point.
   *
   *  The sustain loop is only triggered if sustain_loop_is_active is true,
   *  the start is before the end, and the loop doesn't end before start_pct
   *  or start after the fade-out before end_pct. Where it reaches outside of
   *  them, it's cut off: it loops from start_pct if sustain_loop_start_pct is
   *  before it, and up to the fade-out if sustain_loop_end_pct is after it.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]*/
  sustainLoopEndPct: PrimitiveField<number, "mut">
  /**
   *  Duration in milliseconds of the linear crossfade where the sustain loop
   *  wraps around. It's centered around the loop points, and at most as long
   *  as the loop, so the loop keeps its length. Where it would reach before
   *  start_pct or into the fade-out before end_pct, it's moved later or
   *  earlier. Without room for it in between, it fades in some of the audio
   *  before start_pct, and only shortens the loop where it would need audio
   *  before the sample start.
   *
   *
   * key | value
   * --- | ---
   * default | 5
   * range | [1, 150]*/
  loopOverlapMs: PrimitiveField<number, "mut">
  /**
   *  Whether the sustain loop is active.
   *
   *  The sustain loop is only triggered if sustain_loop_is_active is true,
   *  the start is before the end, and the loop doesn't end before start_pct
   *  or start after the fade-out before end_pct. Where it reaches outside of
   *  them, it's cut off: it loops from start_pct if sustain_loop_start_pct is
   *  before it, and up to the fade-out if sustain_loop_end_pct is after it.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  sustainLoopIsActive: PrimitiveField<boolean, "mut">
  /**
   *  The time stretching algorithm. It determines the pitch of the sample if it's stretched
   *  or compressed over time:
   *  - 0: invalid
   *  - 1: pitch shift    no processing - faster/slower playback results in lower/higher pitch
   *  - 2: time stretch   processing - faster/slower keeps the original pitch, with some artifacts.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 2]*/
  timestretchMode: PrimitiveField<number, "mut">
  /**
   *  Gain factor for this layer. Corresponds to a decibel range of [-inf, 9.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 2.818382978439331]*/
  gain: PrimitiveField<number, "mut">
  /**
   *  Velocity at which this layer's gain starts to rise from 0. Below it, the
   *  layer is silent.
   *
   *  The four velocity_gain_* fields map the note velocity to a gain factor
   *  for this layer. Each field is a velocity that places one corner of the
   *  curve. The gain at the corners is fixed at 0, 1, 1, 0, and changes
   *  linearly between them:
   *
   *  ```
   *  gain
   *    1 |            ____________
   *      |           /            \
   *    0 |__________/              \__________
   *      +----------+-+----------+-+----------> velocity
   *      0          a b          c d          1
   *
   *  a: velocity_gain_rise_start
   *  b: velocity_gain_rise_end
   *  c: velocity_gain_fall_start
   *  d: velocity_gain_fall_end
   *  ```
   *
   *  Velocities are normalized (0 to 1), on the same scale as Note.velocity.
   *  The validator ensures that a <= b <= c <= d. Overlapping the curves of
   *  neighboring layers creates a crossfade between them. The gain factor
   *  multiplies with all other gain settings.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  velocityGainRiseStart: PrimitiveField<number, "mut">
  /**
   *  Velocity at which this layer's gain reaches 1. See
   *  velocity_gain_rise_start.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  velocityGainRiseEnd: PrimitiveField<number, "mut">
  /**
   *  Velocity at which this layer's gain starts to fall from 1. See
   *  velocity_gain_rise_start.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]*/
  velocityGainFallStart: PrimitiveField<number, "mut">
  /**
   *  Velocity at which this layer's gain reaches 0 again. Above it, the layer
   *  is silent. See velocity_gain_rise_start.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]*/
  velocityGainFallEnd: PrimitiveField<number, "mut">
  /**
   *  The slot of this layer among the layers of its sample in the editor UI.
   *  It must be unique among the layers of the same sample.
   *  It has no effect on playback: which layers play at which velocity is
   *  determined by each layer's velocity_gain_* fields.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | full*/
  index: PrimitiveField<number, "mut">
}
/** @internal */

export type TinySamplerSampleLayerConstructor = {
  /**
   *  The tiny sampler sample this layer belongs to.
   *
   *
   * key | value
   * --- | ---
   * default | no default, required
   * required | true
   * immutable | true*/
  tinySamplerSample: NexusLocation
  /**
   *  Audio sample to be played on this layer.
   *
   *
   * key | value
   * --- | ---
   * default | empty location
   * required | false*/
  sample?: NexusLocation
  /**
   *  Pitch correction in cents, used to tune the sample to its MIDI key.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1200, 1200]*/
  pitchCorrectionCents?: number
  /**
   *  Low-pass filter cutoff frequency in Hz. Modulated by filter_envelope.
   *
   *
   * key | value
   * --- | ---
   * default | 19500
   * range | [20, 19500]*/
  lowPassCutoffFrequencyHz?: number
  /**
   *  High-pass filter cutoff frequency in Hz. Modulated by filter_envelope.
   *
   *
   * key | value
   * --- | ---
   * default | 19
   * range | [19, 19500]*/
  highPassCutoffFrequencyHz?: number
  /**
   *  User-configurable envelope for the layer's level. Currently the DAW doesn't expose
   *  capabilities to automate its parameters, though they can be automated.
   */
  levelEnvelope?: AdsrEnvelopeConstructor
  /**
   *  User-configurable envelope for the layer's filter cutoff. Currently the DAW doesn't expose
   *  capabilities to automate its parameters, though they can be automated.
   */
  filterEnvelope?: AdsrEnvelopeConstructor
  /**
   *  How much the velocity scales the level envelope.
   *  - 0.0: the velocity doesn't influence the envelope.
   *  - 1.0: the full velocity is applied to the envelope as an additional factor.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  velocityLevelEnvelopeAmount?: number
  /**
   *  How much the velocity scales the filter envelope.
   *  - 0.0: the velocity doesn't influence the envelope.
   *  - 1.0: the full velocity is applied to the envelope as an additional factor.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  velocityFilterEnvelopeAmount?: number
  /**
   *  How much the velocity influences the level envelope decay. The decay
   *  gets longer with higher velocity. At 1.0, it ranges from
   *  half the set decay duration (velocity 0.0) to one and a half times
   *  the set decay duration (velocity 1.0). At 0.0, the velocity has no effect.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  velocityDecayModulation?: number
  /**
   *  Playback start point, relative to the sample length.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  startPct?: number
  /**
   *  Playback end point, relative to the sample length. A short, fixed
   *  fade-out is applied before it to avoid clicks. A sustain loop reaching
   *  into it is cut off where it starts, see sustain_loop_start_pct.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]*/
  endPct?: number
  /**
   *  Start of the sustain loop, relative to the sample length.
   *
   *  The sustain loop is only triggered if sustain_loop_is_active is true,
   *  the start is before the end, and the loop doesn't end before start_pct
   *  or start after the fade-out before end_pct. Where it reaches outside of
   *  them, it's cut off: it loops from start_pct if sustain_loop_start_pct is
   *  before it, and up to the fade-out if sustain_loop_end_pct is after it.
   *
   *
   * key | value
   * --- | ---
   * default | 0.7
   * range | [0, 1]*/
  sustainLoopStartPct?: number
  /**
   *  End of the sustain loop, relative to the sample length. Playback jumps
   *  back to sustain_loop_start_pct when it reaches this point.
   *
   *  The sustain loop is only triggered if sustain_loop_is_active is true,
   *  the start is before the end, and the loop doesn't end before start_pct
   *  or start after the fade-out before end_pct. Where it reaches outside of
   *  them, it's cut off: it loops from start_pct if sustain_loop_start_pct is
   *  before it, and up to the fade-out if sustain_loop_end_pct is after it.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]*/
  sustainLoopEndPct?: number
  /**
   *  Duration in milliseconds of the linear crossfade where the sustain loop
   *  wraps around. It's centered around the loop points, and at most as long
   *  as the loop, so the loop keeps its length. Where it would reach before
   *  start_pct or into the fade-out before end_pct, it's moved later or
   *  earlier. Without room for it in between, it fades in some of the audio
   *  before start_pct, and only shortens the loop where it would need audio
   *  before the sample start.
   *
   *
   * key | value
   * --- | ---
   * default | 5
   * range | [1, 150]*/
  loopOverlapMs?: number
  /**
   *  Whether the sustain loop is active.
   *
   *  The sustain loop is only triggered if sustain_loop_is_active is true,
   *  the start is before the end, and the loop doesn't end before start_pct
   *  or start after the fade-out before end_pct. Where it reaches outside of
   *  them, it's cut off: it loops from start_pct if sustain_loop_start_pct is
   *  before it, and up to the fade-out if sustain_loop_end_pct is after it.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  sustainLoopIsActive?: boolean
  /**
   *  The time stretching algorithm. It determines the pitch of the sample if it's stretched
   *  or compressed over time:
   *  - 0: invalid
   *  - 1: pitch shift    no processing - faster/slower playback results in lower/higher pitch
   *  - 2: time stretch   processing - faster/slower keeps the original pitch, with some artifacts.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 2]*/
  timestretchMode?: number
  /**
   *  Gain factor for this layer. Corresponds to a decibel range of [-inf, 9.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 2.818382978439331]*/
  gain?: number
  /**
   *  Velocity at which this layer's gain starts to rise from 0. Below it, the
   *  layer is silent.
   *
   *  The four velocity_gain_* fields map the note velocity to a gain factor
   *  for this layer. Each field is a velocity that places one corner of the
   *  curve. The gain at the corners is fixed at 0, 1, 1, 0, and changes
   *  linearly between them:
   *
   *  ```
   *  gain
   *    1 |            ____________
   *      |           /            \
   *    0 |__________/              \__________
   *      +----------+-+----------+-+----------> velocity
   *      0          a b          c d          1
   *
   *  a: velocity_gain_rise_start
   *  b: velocity_gain_rise_end
   *  c: velocity_gain_fall_start
   *  d: velocity_gain_fall_end
   *  ```
   *
   *  Velocities are normalized (0 to 1), on the same scale as Note.velocity.
   *  The validator ensures that a <= b <= c <= d. Overlapping the curves of
   *  neighboring layers creates a crossfade between them. The gain factor
   *  multiplies with all other gain settings.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  velocityGainRiseStart?: number
  /**
   *  Velocity at which this layer's gain reaches 1. See
   *  velocity_gain_rise_start.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  velocityGainRiseEnd?: number
  /**
   *  Velocity at which this layer's gain starts to fall from 1. See
   *  velocity_gain_rise_start.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]*/
  velocityGainFallStart?: number
  /**
   *  Velocity at which this layer's gain reaches 0 again. Above it, the layer
   *  is silent. See velocity_gain_rise_start.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]*/
  velocityGainFallEnd?: number
  /**
   *  The slot of this layer among the layers of its sample in the editor UI.
   *  It must be unique among the layers of the same sample.
   *  It has no effect on playback: which layers play at which velocity is
   *  determined by each layer's velocity_gain_* fields.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | full*/
  index?: number
}

