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
 * key | `"centroid"`
 * is | {@link api.TargetType.Centroid}
 *
 *
 *  data structure representing the centroid mixer
 *
 *
 * @category Device Entities*/
export type Centroid = {
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
   *  Master gain after the summing. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  postGain: PrimitiveField<number, "mut">
  /**
   *  Master panning. Pans the signal to left/right. -1 is fully left, 0 is centered (unchanged), 1 is fully right.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  panning: PrimitiveField<number, "mut">
  /**
   *  First centroid aux.
   */
  aux1: NexusObject<CentroidAux>
  /**
   *  Second centroid aux.
   */
  aux2: NexusObject<CentroidAux>
  /**
   *  Sum Output.
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioOutput}*/
  audioOutput: NexusObject<Empty>
}
/** @internal */

export type CentroidConstructor = {
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
   *  Master gain after the summing. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]*/
  postGain?: number
  /**
   *  Master panning. Pans the signal to left/right. -1 is fully left, 0 is centered (unchanged), 1 is fully right.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]*/
  panning?: number
  /**
   *  First centroid aux.
   */
  aux1?: CentroidAuxConstructor
  /**
   *  Second centroid aux.
   */
  aux2?: CentroidAuxConstructor
}

/**
 *
 * key | value
 * --- | ---
 * type | object
 *
 *  data structure representing the aux of the centroid mixer
 *
 *
 * @category Device Fields*/
export type CentroidAux = {
  /**
   *  Gain applied before the is sent to the aux output. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  sendGain: PrimitiveField<number, "mut">
  /**
   *  Aux input.
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioInput}*/
  audioInput: NexusObject<Empty>
  /**
   *  Aux output.
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioOutput}*/
  audioOutput: NexusObject<Empty>
}
/** @internal */

export type CentroidAuxConstructor = {
  /**
   *  Gain applied before the is sent to the aux output. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]*/
  sendGain?: number
}

/**
 *
 * key | value
 * --- | ---
 * type | entity
 * key | `"centroidChannel"`
 * is |
 *
 *
 *  data structure representing the centroid channel strip
 *
 *
 * @category Device Entities*/
export type CentroidChannel = {
  /**
   *  Centroid reference that owns this channel.
   *
   *
   * key | value
   * --- | ---
   * default | no default, required
   * required | true
   * targets | {@link api.TargetType.Centroid}, meaning one of: <br />{@link entities.Centroid}
   * immutable | true*/
  centroid: PrimitiveField<NexusLocation, "immut">
  /**
   *  Sorts this channel visually among all channels. Must be unique among
   *  all channels of a given centroid.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | full*/
  orderAmongChannels: PrimitiveField<number, "mut">
  /**
   *  The user-assigned name of this channel.
   */
  displayName: PrimitiveField<string, "mut">
  /**
   *  The channel's audio input.
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioInput}*/
  audioInput: NexusObject<Empty>
  /**
   *  Pre gain. This is the gain before the EQ. Equivalent to a dB range of [-inf, 18.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 7.943282127380371]
   * is | {@link api.TargetType.AutomatableParameter}*/
  preGain: PrimitiveField<number, "mut">
  /**
   *  High gain in decibels. This is the gain of the high band.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-24, 24]
   * is | {@link api.TargetType.AutomatableParameter}*/
  eqHighGainDb: PrimitiveField<number, "mut">
  /**
   *  The center frequency of the mid eq band of the channel.
   *
   *
   * key | value
   * --- | ---
   * default | 1000
   * range | [240, 4200]
   * is | {@link api.TargetType.AutomatableParameter}*/
  eqMidFrequency: PrimitiveField<number, "mut">
  /**
   *  Mid gain in decibels. This is the gain of the mid band.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-24, 24]
   * is | {@link api.TargetType.AutomatableParameter}*/
  eqMidGainDb: PrimitiveField<number, "mut">
  /**
   *  Low gain in decibels. This is the gain of the low band.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-24, 24]
   * is | {@link api.TargetType.AutomatableParameter}*/
  eqLowGainDb: PrimitiveField<number, "mut">
  /**
   *  Aux 1 send level. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  aux1SendGain: PrimitiveField<number, "mut">
  /**
   *  Aux 2 send level. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  aux2SendGain: PrimitiveField<number, "mut">
  /**
   *  Use the "aux pre mode". If enabled, the signal is sent to the aux before
   *  the post_gain is applied, otherwise it is sent after.
   *
   *
   * key | value
   * --- | ---
   * default | false
   * is | {@link api.TargetType.AutomatableParameter}*/
  useAuxPreMode: PrimitiveField<boolean, "mut">
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
   *  Post gain applied after all other processing. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  postGain: PrimitiveField<number, "mut">
  /**
   *  Mute this channel. If is_muted=true, the channel is muted, including its aux sends.
   *
   *
   * key | value
   * --- | ---
   * default | false
   * is | {@link api.TargetType.AutomatableParameter}*/
  isMuted: PrimitiveField<boolean, "mut">
  /**
   *  Solo this channel. If is_soloed=true, all channels that don't have is_soloed=true are muted.
   *
   *
   * key | value
   * --- | ---
   * default | false
   * is | {@link api.TargetType.AutomatableParameter}*/
  isSoloed: PrimitiveField<boolean, "mut">
}
/** @internal */

export type CentroidChannelConstructor = {
  /**
   *  Centroid reference that owns this channel.
   *
   *
   * key | value
   * --- | ---
   * default | no default, required
   * required | true
   * immutable | true*/
  centroid: NexusLocation
  /**
   *  Sorts this channel visually among all channels. Must be unique among
   *  all channels of a given centroid.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | full*/
  orderAmongChannels?: number
  /**
   *  The user-assigned name of this channel.
   */
  displayName?: string
  /**
   *  Pre gain. This is the gain before the EQ. Equivalent to a dB range of [-inf, 18.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 7.943282127380371]*/
  preGain?: number
  /**
   *  High gain in decibels. This is the gain of the high band.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-24, 24]*/
  eqHighGainDb?: number
  /**
   *  The center frequency of the mid eq band of the channel.
   *
   *
   * key | value
   * --- | ---
   * default | 1000
   * range | [240, 4200]*/
  eqMidFrequency?: number
  /**
   *  Mid gain in decibels. This is the gain of the mid band.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-24, 24]*/
  eqMidGainDb?: number
  /**
   *  Low gain in decibels. This is the gain of the low band.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-24, 24]*/
  eqLowGainDb?: number
  /**
   *  Aux 1 send level. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  aux1SendGain?: number
  /**
   *  Aux 2 send level. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  aux2SendGain?: number
  /**
   *  Use the "aux pre mode". If enabled, the signal is sent to the aux before
   *  the post_gain is applied, otherwise it is sent after.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  useAuxPreMode?: boolean
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
   *  Post gain applied after all other processing. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]*/
  postGain?: number
  /**
   *  Mute this channel. If is_muted=true, the channel is muted, including its aux sends.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  isMuted?: boolean
  /**
   *  Solo this channel. If is_soloed=true, all channels that don't have is_soloed=true are muted.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  isSoloed?: boolean
}

