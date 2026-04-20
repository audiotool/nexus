// THIS FILE IS GENERATED - DO NOT EDIT
// Copyright 2026 Audiotool Inc.

import { PrimitiveField } from "@document/fields"

/**
 *
 * key | value
 * --- | ---
 * type | object
 *
 *  Parameters of faders of channel, aux and group strips, controlling panning, gain, and solo/mute state.
 *  This is not an entity but a submessage used by these strips.
 *
 *
 * @category Mixer Fields*/
export type MixerStripFaderParameters = {
  /**
   *  Panning of the strip. -1 is fully left, 0 is centered (unchanged), 1 is fully right.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  panning: PrimitiveField<number, "mut">
  /**
   *  Gain right before the signal leaves the strip, i.e. after inserts,
   *  eq, aux sends, etc., Equivalent to a dB range of [-inf, 6.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1.9952620267868042]
   * is | {@link api.TargetType.AutomatableParameter}*/
  postGain: PrimitiveField<number, "mut">
  /**
   *  If is_muted=true, the strip is muted.
   *
   *  If a channel, group or aux strip has "is_muted" set to true any signal is cut off in the strip before it's sent to any inserts, effects,
   *  or aux strips. If a channel or group that has "is_muted" set to true is part of a group in some way,
   *  all descendants of the channel in the group hierarchy also behave as though they had is_muted=true.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  isMuted: PrimitiveField<boolean, "mut">
  /**
   *  If is_soloed=true, the strip is soloed. The behavior depends on the type of strip:
   *
   *  - Channel and group strips:
   *    If a channel or group strip has is_soloed true, all other channel and group strips behave as though
   *    they have is_muted=true, with the exception of ancestors and descendants of the soloed strip in the group hierarchy, which behave as
   *    though they have is_soloed=true as well. No effect on aux strips themselves.
   *
   *  - Aux strips:
   *    If an aux strip has is_soloed set to true, all other aux strips behave as though they had is_muted=true. Further, channel
   *    and group strips whose output is routed directly to the master behave as though their fader gain are set to 0. This
   *    way, none of them are audible, but aux sends of both channels and groups still get passed through.
   *
   *    The solo and mute behavior of channel and group strips override the solo/mute behavior of the
   *    aux strips - if a channel is muted, it doesn't send to any aux anymore; if a channel is soloed,
   *    it becomes audible.
   *
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  isSoloed: PrimitiveField<boolean, "mut">
}
/** @internal */

export type MixerStripFaderParametersConstructor = {
  /**
   *  Panning of the strip. -1 is fully left, 0 is centered (unchanged), 1 is fully right.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]*/
  panning?: number
  /**
   *  Gain right before the signal leaves the strip, i.e. after inserts,
   *  eq, aux sends, etc., Equivalent to a dB range of [-inf, 6.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1.9952620267868042]*/
  postGain?: number
  /**
   *  If is_muted=true, the strip is muted.
   *
   *  If a channel, group or aux strip has "is_muted" set to true any signal is cut off in the strip before it's sent to any inserts, effects,
   *  or aux strips. If a channel or group that has "is_muted" set to true is part of a group in some way,
   *  all descendants of the channel in the group hierarchy also behave as though they had is_muted=true.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  isMuted?: boolean
  /**
   *  If is_soloed=true, the strip is soloed. The behavior depends on the type of strip:
   *
   *  - Channel and group strips:
   *    If a channel or group strip has is_soloed true, all other channel and group strips behave as though
   *    they have is_muted=true, with the exception of ancestors and descendants of the soloed strip in the group hierarchy, which behave as
   *    though they have is_soloed=true as well. No effect on aux strips themselves.
   *
   *  - Aux strips:
   *    If an aux strip has is_soloed set to true, all other aux strips behave as though they had is_muted=true. Further, channel
   *    and group strips whose output is routed directly to the master behave as though their fader gain are set to 0. This
   *    way, none of them are audible, but aux sends of both channels and groups still get passed through.
   *
   *    The solo and mute behavior of channel and group strips override the solo/mute behavior of the
   *    aux strips - if a channel is muted, it doesn't send to any aux anymore; if a channel is soloed,
   *    it becomes audible.
   *
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  isSoloed?: boolean
}

