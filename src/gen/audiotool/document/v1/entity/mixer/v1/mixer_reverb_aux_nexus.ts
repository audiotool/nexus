// THIS FILE IS GENERATED - DO NOT EDIT
// Copyright 2025 Audiotool Inc.

import { PrimitiveField } from "@document/fields"
import { NexusObject } from "@document/object"
import {
  type MixerStripDisplayParameters,
  type MixerStripDisplayParametersConstructor,
} from "@gen/document/v1/entity/mixer/v1/mixer_strip_display_parameters_nexus"
import {
  type MixerStripFaderParameters,
  type MixerStripFaderParametersConstructor,
} from "@gen/document/v1/entity/mixer/v1/mixer_strip_fader_parameters_nexus"
import {
  type MixerTrimFilter,
  type MixerTrimFilterConstructor,
} from "@gen/document/v1/entity/mixer/v1/mixer_trim_filter_nexus"

/**
 *
 * key | value
 * --- | ---
 * type | entity
 * key | `"mixerReverbAux"`
 * is | {@link api.TargetType.MixerAuxReceive}
 *
 *
 *  This is a special kind of aux strip that doesn't offer custom inserts but instead
 *  has a hard-coded reverb effect. There can be at most one of these in the document.
 *
 *
 * @category Mixer Entities*/
export type MixerReverbAux = {
  /**
   *  Display parameters of this strip.
   */
  displayParameters: NexusObject<MixerStripDisplayParameters>
  /**
   *  Pre gain. This is the gain before the trim filter. Equivalent to a dB range of [-inf, 18.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 7.943282127380371]
   * is | {@link api.TargetType.AutomatableParameter}*/
  preGain: PrimitiveField<number, "mut">
  /**
   *  Trim filter applied to the input signal.
   */
  trimFilter: NexusObject<MixerTrimFilter>
  /**
   *  Determines the size of the virtual enclosed space of the reverb effect.
   *
   *
   * key | value
   * --- | ---
   * default | 0.800000011920929
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  roomSizeFactor: PrimitiveField<number, "mut">
  /**
   *  Determines the length of time it takes for the echo to come back.
   *  (The length of the gap between the echos).
   *
   *
   * key | value
   * --- | ---
   * default | 160
   * range | [8, 500]
   * is | {@link api.TargetType.AutomatableParameter}*/
  preDelayTimeMs: PrimitiveField<number, "mut">
  /**
   *  Control over the level of the devices low-pass filter.
   *  0 means no filtering, 1 means high frequencies are heavily filtered out.
   *
   *
   * key | value
   * --- | ---
   * default | 0.10000000149011612
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  dampFactor: PrimitiveField<number, "mut">
  /**
   *  Fader parameters of this strip.
   */
  faderParameters: NexusObject<MixerStripFaderParameters>
}
/** @internal */

export type MixerReverbAuxConstructor = {
  /**
   *  Display parameters of this strip.
   */
  displayParameters?: MixerStripDisplayParametersConstructor
  /**
   *  Pre gain. This is the gain before the trim filter. Equivalent to a dB range of [-inf, 18.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 7.943282127380371]*/
  preGain?: number
  /**
   *  Trim filter applied to the input signal.
   */
  trimFilter?: MixerTrimFilterConstructor
  /**
   *  Determines the size of the virtual enclosed space of the reverb effect.
   *
   *
   * key | value
   * --- | ---
   * default | 0.800000011920929
   * range | [0, 1]*/
  roomSizeFactor?: number
  /**
   *  Determines the length of time it takes for the echo to come back.
   *  (The length of the gap between the echos).
   *
   *
   * key | value
   * --- | ---
   * default | 160
   * range | [8, 500]*/
  preDelayTimeMs?: number
  /**
   *  Control over the level of the devices low-pass filter.
   *  0 means no filtering, 1 means high frequencies are heavily filtered out.
   *
   *
   * key | value
   * --- | ---
   * default | 0.10000000149011612
   * range | [0, 1]*/
  dampFactor?: number
  /**
   *  Fader parameters of this strip.
   */
  faderParameters?: MixerStripFaderParametersConstructor
}

