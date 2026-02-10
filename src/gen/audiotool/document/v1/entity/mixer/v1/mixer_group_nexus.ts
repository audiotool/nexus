// THIS FILE IS GENERATED - DO NOT EDIT
// Copyright 2025 Audiotool Inc.

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
 * key | `"mixerGroup"`
 * is | {@link api.TargetType.MixerStripGroup}, {@link api.TargetType.MixerStripGroupChild}
 *
 *
 *  A mixer strip that groups other group- or channel strips.
 *
 *  It doesn't have a socket on the stagebox; it only makes sound if it contains children strips that
 *  produce sound (or if, against convention, something producing sound is added as inserts).
 *
 *  The output of a mixer group is implicitly connected to the main out strip unless a mixer cable makes it a child
 *  of another group strip.
 *
 *  To connect a channel or group strip to a group strip, use a MixerStripGrouping message.
 *
 *  The mixer group is represented on the stagebox grouping its children, and has
 *  the insert_output and insert_input fields represented as sockets.
 *
 *  If neither the insert output or the insert input are connected, the signal bypasses the inserts automatically.
 *
 *
 * @category Mixer Entities*/
export type MixerGroup = {
  /**
   *  Display parameters of this strip.
   */
  displayParameters: NexusObject<MixerStripDisplayParameters>
  /**
   *  Trim filter applied to the input signal.
   */
  trimFilter: NexusObject<MixerTrimFilter>
  /**
   *  Compressor for the input.
   */
  compressor: NexusObject<MixerCompressor>
  /**
   *  4-band strip eq.
   */
  eq: NexusObject<MixerEq>
  /**
   *  The audio signal leaving this strip for inserts. Visible on the stagebox.
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioOutput}*/
  insertOutput: NexusObject<Empty>
  /**
   *  The audio signal returning to this strip after inserts. Visible on the
   *  stagebox.
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioInput}*/
  insertInput: NexusObject<Empty>
  /**
   *  whether aux sends are active or not
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

export type MixerGroupConstructor = {
  /**
   *  Display parameters of this strip.
   */
  displayParameters?: MixerStripDisplayParametersConstructor
  /**
   *  Trim filter applied to the input signal.
   */
  trimFilter?: MixerTrimFilterConstructor
  /**
   *  Compressor for the input.
   */
  compressor?: MixerCompressorConstructor
  /**
   *  4-band strip eq.
   */
  eq?: MixerEqConstructor
  /**
   *  whether aux sends are active or not
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

