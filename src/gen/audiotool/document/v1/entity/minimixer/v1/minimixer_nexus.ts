// THIS FILE IS GENERATED - DO NOT EDIT
// Copyright 2025 Audiotool Inc.

import { PrimitiveField } from "@document/fields"
import { NexusObject } from "@document/object"
import { type Empty } from "@gen/document/v1/empty_nexus"

/**
 *
 * key | value
 * --- | ---
 * type | entity
 * key | `"minimixer"`
 * is |
 *
 *
 *  data structure for the minimixer
 *
 *
 * @category Device Entities*/
export type Minimixer = {
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
   *  The main gain of the minimixer. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  gain: PrimitiveField<number, "mut">
  /**
   *  The aux level allows for the sum of aux sends to be leveled before
   *  being sent to some effect. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  auxSendGain: PrimitiveField<number, "mut">
  /**
   *  Whether or not the aux effect will be applied before or after the main gain.
   *
   *  If this is true, the aux are sent to the effect before the main gain is applied
   *  to them; if false, the are sent after. In both cases, the aux return remains
   *  unaffected by the main gain. This means, if this is true, the main gain is
   *  not applied to the aux at all.
   *
   *
   * key | value
   * --- | ---
   * default | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  auxIsPreGain: PrimitiveField<boolean, "mut">
  /**
   *  The first channel of the minimixer.
   */
  channel1: NexusObject<MinimixerChannel>
  /**
   *  The second channel of the minimixer.
   */
  channel2: NexusObject<MinimixerChannel>
  /**
   *  The third channel of the minimixer.
   */
  channel3: NexusObject<MinimixerChannel>
  /**
   *  The fourth channel of the minimixer.
   */
  channel4: NexusObject<MinimixerChannel>
  /**
   *  the main audio output of the minimixer
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioOutput}*/
  mainOutput: NexusObject<Empty>
  /**
   *  the aux send output of the minimixer
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioOutput}*/
  auxSendOutput: NexusObject<Empty>
  /**
   *  the aux return output of the minimixer
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioInput}*/
  auxReturnInput: NexusObject<Empty>
}
/** @internal */

export type MinimixerConstructor = {
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
   *  The main gain of the minimixer. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]*/
  gain?: number
  /**
   *  The aux level allows for the sum of aux sends to be leveled before
   *  being sent to some effect. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]*/
  auxSendGain?: number
  /**
   *  Whether or not the aux effect will be applied before or after the main gain.
   *
   *  If this is true, the aux are sent to the effect before the main gain is applied
   *  to them; if false, the are sent after. In both cases, the aux return remains
   *  unaffected by the main gain. This means, if this is true, the main gain is
   *  not applied to the aux at all.
   *
   *
   * key | value
   * --- | ---
   * default | true*/
  auxIsPreGain?: boolean
  /**
   *  The first channel of the minimixer.
   */
  channel1?: MinimixerChannelConstructor
  /**
   *  The second channel of the minimixer.
   */
  channel2?: MinimixerChannelConstructor
  /**
   *  The third channel of the minimixer.
   */
  channel3?: MinimixerChannelConstructor
  /**
   *  The fourth channel of the minimixer.
   */
  channel4?: MinimixerChannelConstructor
}

/**
 *
 * key | value
 * --- | ---
 * type | object
 *
 *  data structure for a channel in the minimixer
 *
 *
 * @category Device Entities*/
export type MinimixerChannel = {
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
   *  How much of the channel's audio will be routed out off to the main aux effects.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  auxSendGain: PrimitiveField<number, "mut">
  /**
   *  Whether or not the aux effect will be applied before or after the gain parameter of this channel.
   *
   *  This parameter works the same as the aux_is_pre_gain parameter of the Minimixer.
   *
   *
   * key | value
   * --- | ---
   * default | false
   * is | {@link api.TargetType.AutomatableParameter}*/
  auxIsPreGain: PrimitiveField<boolean, "mut">
  /**
   *  Mutes this channel. If is_muted=true, the channel is muted, including its aux sends.
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
  /**
   *  the pointer an input can connect to
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioInput}*/
  audioInput: NexusObject<Empty>
}
/** @internal */

export type MinimixerChannelConstructor = {
  /**
   *  This channel's output gain. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]*/
  gain?: number
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
   *  How much of the channel's audio will be routed out off to the main aux effects.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  auxSendGain?: number
  /**
   *  Whether or not the aux effect will be applied before or after the gain parameter of this channel.
   *
   *  This parameter works the same as the aux_is_pre_gain parameter of the Minimixer.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  auxIsPreGain?: boolean
  /**
   *  Mutes this channel. If is_muted=true, the channel is muted, including its aux sends.
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

