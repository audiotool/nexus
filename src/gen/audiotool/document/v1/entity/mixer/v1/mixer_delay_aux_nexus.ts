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
 * key | `"mixerDelayAux"`
 * is | {@link api.TargetType.MixerAuxReceive}
 *
 *
 *  This is a special kind of aux strip that works like a regular aux strip
 *  but doesn't have inserts. Instead, it has a hard-coded delay effect.
 *  There can be at most one of these in the document.
 *
 *  The delay effect has a feedback parameter controlling the amount of the original
 *  signal that's played back after a delay.
 *
 *  The duration of the delay is the multiplication of the step duration with
 *  the step count.
 *
 *
 * @category Mixer Entities*/
export type MixerDelayAux = {
  /**
   *  Display parameters of this strip.
   */
  displayParameters: NexusObject<MixerStripDisplayParameters>
  /**
   *  Pre gain. This is the gain before the trim filter. Equivalent to a dB range
   *  of [-inf, 18.0].
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
   *  Feedback of the delay effect.
   *
   *
   * key | value
   * --- | ---
   * default | 0.30000001192092896
   * range | [0, 0.800000011920929]
   * is | {@link api.TargetType.AutomatableParameter}*/
  feedbackFactor: PrimitiveField<number, "mut">
  /**
   *  Step count of the delay effect. Multiplied with the step length to get the total delay time.
   *
   *
   * key | value
   * --- | ---
   * default | 3
   * range | [1, 7]
   * is | {@link api.TargetType.AutomatableParameter}*/
  stepCount: PrimitiveField<number, "mut">
  /**
   *  Selects the length of each delay step as bar time in the delay effect.
   *  - 0: invalid
   *  - 1: 1/16 bars
   *  - 2: 1/8T bars
   *  - 3: 1/8  bars
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 3]
   * is | {@link api.TargetType.AutomatableParameter}*/
  stepLengthIndex: PrimitiveField<number, "mut">
  /**
   *  Fader parameters of this strip.
   */
  faderParameters: NexusObject<MixerStripFaderParameters>
}
/** @internal */

export type MixerDelayAuxConstructor = {
  /**
   *  Display parameters of this strip.
   */
  displayParameters?: MixerStripDisplayParametersConstructor
  /**
   *  Pre gain. This is the gain before the trim filter. Equivalent to a dB range
   *  of [-inf, 18.0].
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
   *  Feedback of the delay effect.
   *
   *
   * key | value
   * --- | ---
   * default | 0.30000001192092896
   * range | [0, 0.800000011920929]*/
  feedbackFactor?: number
  /**
   *  Step count of the delay effect. Multiplied with the step length to get the total delay time.
   *
   *
   * key | value
   * --- | ---
   * default | 3
   * range | [1, 7]*/
  stepCount?: number
  /**
   *  Selects the length of each delay step as bar time in the delay effect.
   *  - 0: invalid
   *  - 1: 1/16 bars
   *  - 2: 1/8T bars
   *  - 3: 1/8  bars
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 3]*/
  stepLengthIndex?: number
  /**
   *  Fader parameters of this strip.
   */
  faderParameters?: MixerStripFaderParametersConstructor
}

