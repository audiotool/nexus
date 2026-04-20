// THIS FILE IS GENERATED - DO NOT EDIT
// Copyright 2026 Audiotool Inc.

import { PrimitiveField } from "@document/fields"
import { NexusObject } from "@document/object"
import { type Empty } from "@gen/document/v1/empty_nexus"
import {
  type MixerCompressor,
  type MixerCompressorConstructor,
} from "@gen/document/v1/entity/mixer/v1/mixer_compressor_nexus"
import {
  type MixerEq,
  type MixerEqConstructor,
} from "@gen/document/v1/entity/mixer/v1/mixer_eq_nexus"
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
 * key | `"mixerChannel"`
 * is | {@link api.TargetType.MixerStripGroupChild}
 *
 *
 *  The main "channel" strip in the mixer to which devices on the desktop can connect to.
 *  This strip is visible on the stagebox, with a socket representing the audio_input field.
 *
 *  The output of a channel strip is implicitly connected to the
 *  main out strip unless a mixer cable connects it to a group strip.
 *
 *  The different effect modules are applied in the following order:
 *  1. pre gain
 *  2. trim filter
 *  3. compressor
 *  4. eq
 *  5. aux sends
 *  6. sidechain output
 *  7. fader parameters
 *
 *
 * @category Mixer Entities*/
export type MixerChannel = {
  /**
   *  The input to this channel. Visible on the stagebox.
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioInput}*/
  audioInput: NexusObject<Empty>
  /**
   *  Display parameters of this strip.
   */
  displayParameters: NexusObject<MixerStripDisplayParameters>
  /**
   *  Pre gain. This is the gain before the EQ. Equivalent to a dB range of [-inf, 18.0].
   *
   *
   * key | value
   * --- | ---
   * default | 0.39810699224472046
   * range | [0, 7.943282127380371]
   * is | {@link api.TargetType.AutomatableParameter}*/
  preGain: PrimitiveField<number, "mut">
  /**
   *  Whether the input signal is phase reversed.
   *
   *
   * key | value
   * --- | ---
   * default | false
   * is | {@link api.TargetType.AutomatableParameter}*/
  doesPhaseReverse: PrimitiveField<boolean, "mut">
  /**
   *  Trim filter applied to the input signal.
   */
  trimFilter: NexusObject<MixerTrimFilter>
  /**
   *  Strip compressor.
   */
  compressor: NexusObject<MixerCompressor>
  /**
   *  4-band strip eq.
   */
  eq: NexusObject<MixerEq>
  /**
   *  Whether the aux sends are active or not. If false, no signal is sent to the aux strips.
   *
   *
   * key | value
   * --- | ---
   * default | true*/
  auxSendsAreActive: PrimitiveField<boolean, "mut">
  /**
   *  Sends to the aux strip.
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.MixerAuxSend}*/
  auxSend: NexusObject<Empty>
  /**
   *  Sidechain output (pre-gain).
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.MixerSideChainOutput}*/
  sideChainOutput: NexusObject<Empty>
  /**
   *  Fader parameters of this strip.
   */
  faderParameters: NexusObject<MixerStripFaderParameters>
}
/** @internal */

export type MixerChannelConstructor = {
  /**
   *  Display parameters of this strip.
   */
  displayParameters?: MixerStripDisplayParametersConstructor
  /**
   *  Pre gain. This is the gain before the EQ. Equivalent to a dB range of [-inf, 18.0].
   *
   *
   * key | value
   * --- | ---
   * default | 0.39810699224472046
   * range | [0, 7.943282127380371]*/
  preGain?: number
  /**
   *  Whether the input signal is phase reversed.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  doesPhaseReverse?: boolean
  /**
   *  Trim filter applied to the input signal.
   */
  trimFilter?: MixerTrimFilterConstructor
  /**
   *  Strip compressor.
   */
  compressor?: MixerCompressorConstructor
  /**
   *  4-band strip eq.
   */
  eq?: MixerEqConstructor
  /**
   *  Whether the aux sends are active or not. If false, no signal is sent to the aux strips.
   *
   *
   * key | value
   * --- | ---
   * default | true*/
  auxSendsAreActive?: boolean
  /**
   *  Fader parameters of this strip.
   */
  faderParameters?: MixerStripFaderParametersConstructor
}

