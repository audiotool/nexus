// THIS FILE IS GENERATED - DO NOT EDIT
// Copyright 2025 Audiotool Inc.

import { PrimitiveField } from "@document/fields"
import { type NexusLocation } from "@document/location"

/**
 *
 * key | value
 * --- | ---
 * type | entity
 * key | `"mixerAuxRoute"`
 * is |
 *
 *
 *  Connects a group or channel strip to an aux strip. There can be at most one aux route
 *  connecting a given pair of entities. Even though the DAW shows connections
 *  of all channels to all aux strips, the document structure doesn't need them all -
 *  missing routes are shown as having gain of 0 in the DAW.
 *
 *
 * @category Mixer Entities*/
export type MixerAuxRoute = {
  /**
   *  A gain applied to this route. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  gain: PrimitiveField<number, "mut">
  /**
   *  Points to the mixer channel/group that sends the signal to the aux strip.
   *
   *
   * key | value
   * --- | ---
   * default | no default, required
   * required | true
   * targets | {@link api.TargetType.MixerAuxSend}, meaning one of: <br />{@link entities.MixerChannel.auxSend}, <br />{@link entities.MixerGroup.auxSend}
   * immutable | true*/
  auxSend: PrimitiveField<NexusLocation, "immut">
  /**
   *  Points to the aux strip that receives the signal from the mixer channel/group.
   *
   *
   * key | value
   * --- | ---
   * default | no default, required
   * required | true
   * targets | {@link api.TargetType.MixerAuxReceive}, meaning one of: <br />{@link entities.MixerAux}, <br />{@link entities.MixerDelayAux}, <br />{@link entities.MixerReverbAux}
   * immutable | true*/
  auxReceive: PrimitiveField<NexusLocation, "immut">
}
/** @internal */

export type MixerAuxRouteConstructor = {
  /**
   *  A gain applied to this route. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]*/
  gain?: number
  /**
   *  Points to the mixer channel/group that sends the signal to the aux strip.
   *
   *
   * key | value
   * --- | ---
   * default | no default, required
   * required | true
   * immutable | true*/
  auxSend: NexusLocation
  /**
   *  Points to the aux strip that receives the signal from the mixer channel/group.
   *
   *
   * key | value
   * --- | ---
   * default | no default, required
   * required | true
   * immutable | true*/
  auxReceive: NexusLocation
}

