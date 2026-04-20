// THIS FILE IS GENERATED - DO NOT EDIT
// Copyright 2026 Audiotool Inc.

import { PrimitiveField } from "@document/fields"
import { NexusObject } from "@document/object"
import { type Empty } from "@gen/document/v1/empty_nexus"
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
 * key | `"mixerAux"`
 * is | {@link api.TargetType.MixerAuxReceive}
 *
 *
 *  An aux strip for the mixer with custom inserts.
 *
 *  The purpose of an aux strip is to apply effects to multiple channel and group strips at once.
 *  Channel and group strips can send their signal to an aux strip if they're connected via a MixerAuxRoute message.
 *  The effect applied by the aux strip is defined by the effect devices connected between the insert output and input fields using
 *  regular desktop cables.
 *  The output of the aux strip is implicitly sent to the main out strip and cannot
 *  be rerouted.
 *
 *  Note that signal passes the different "modules" in the same order
 *  as the fields in this message, which means:
 *  1. pre gain
 *  2. trim filter
 *  3. inserts
 *  5. fader parameters
 *
 *  Unlike for the group- and master inserts, if the insert_output or insert_input are not connected,
 *  the aux strip doesn't forward any sound.
 *
 *
 * @category Mixer Entities*/
export type MixerAux = {
  /**
   *  Parameters controlling the visual appearance of this strip in the DAW.
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
   *  A location to which a regular desktop cable can be connected to start the insert signal chain
   *  on the desktop. This cable socket is shown on the stagebox.
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioOutput}*/
  insertOutput: NexusObject<Empty>
  /**
   *  A location to which a regular desktop cable can be connected to end the insert signal chain
   *  on the desktop. This cable socket is shown on the stagebox.
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioInput}*/
  insertInput: NexusObject<Empty>
  /**
   *  Fader parameters of this strip.
   */
  faderParameters: NexusObject<MixerStripFaderParameters>
}
/** @internal */

export type MixerAuxConstructor = {
  /**
   *  Parameters controlling the visual appearance of this strip in the DAW.
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
   *  Fader parameters of this strip.
   */
  faderParameters?: MixerStripFaderParametersConstructor
}

