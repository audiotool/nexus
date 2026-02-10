// THIS FILE IS GENERATED - DO NOT EDIT
// Copyright 2025 Audiotool Inc.

import { PrimitiveField } from "@document/fields"
import { type NexusLocation } from "@document/location"

/**
 *
 * key | value
 * --- | ---
 * type | entity
 * key | `"mixerSideChainCable"`
 * is |
 *
 *
 *  This cable can be used to connect a channel or group strip side_chain_output to a mixer compressor's side_chain_input.
 *
 *
 * @category Mixer Entities*/
export type MixerSideChainCable = {
  /**
   *  Points to the location from which the sidechain signal is taken.
   *
   *
   * key | value
   * --- | ---
   * default | no default, required
   * required | true
   * targets | {@link api.TargetType.MixerSideChainOutput}, meaning one of: <br />{@link entities.MixerChannel.sideChainOutput}, <br />{@link entities.MixerGroup.sideChainOutput}
   * immutable | true*/
  from: PrimitiveField<NexusLocation, "immut">
  /**
   *  Points to the location to which the sidechain signal is sent.
   *
   *
   * key | value
   * --- | ---
   * default | no default, required
   * required | true
   * targets | {@link api.TargetType.MixerSideChainInput}, meaning one of: <br />{@link entities.MixerCompressor.sideChainInput}
   * immutable | true*/
  to: PrimitiveField<NexusLocation, "immut">
}
/** @internal */

export type MixerSideChainCableConstructor = {
  /**
   *  Points to the location from which the sidechain signal is taken.
   *
   *
   * key | value
   * --- | ---
   * default | no default, required
   * required | true
   * immutable | true*/
  from: NexusLocation
  /**
   *  Points to the location to which the sidechain signal is sent.
   *
   *
   * key | value
   * --- | ---
   * default | no default, required
   * required | true
   * immutable | true*/
  to: NexusLocation
}

