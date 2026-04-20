// THIS FILE IS GENERATED - DO NOT EDIT
// Copyright 2026 Audiotool Inc.

import { PrimitiveField } from "@document/fields"
import { type NexusLocation } from "@document/location"

/**
 *
 * key | value
 * --- | ---
 * type | entity
 * key | `"audioTrack"`
 * is | {@link api.TargetType.AudioTrack}
 *
 *
 *  A track on the timeline that can contain audio regions. Must be attached to an AudioDevice.
 *
 *
 * @category Timeline Entities*/
export type AudioTrack = {
  /**
   *  Orders the track visually among all tracks (including audio, automation, pattern, and note tracks).
   *  If this value isn't unique, the frontend might update it to make it unique.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | full*/
  orderAmongTracks: PrimitiveField<number, "mut">
  /**
   *  Whether the audio track is enabled or not. When is_enabled=false, no audio is played back on the track.
   *
   *
   * key | value
   * --- | ---
   * default | true*/
  isEnabled: PrimitiveField<boolean, "mut">
  /**
   *  Optionally apply a Groove to the audio.
   *
   *
   * key | value
   * --- | ---
   * default | empty location
   * required | false
   * targets | {@link api.TargetType.Groove}, meaning one of: <br />{@link entities.Groove}*/
  groove: PrimitiveField<NexusLocation, "mut">
  /**
   *  The audio track player that receives the audio from this track and forwards it on the processing
   *  graph. Currently can only point to an AudioDevice.
   *
   *
   * key | value
   * --- | ---
   * default | no default, required
   * required | true
   * targets | {@link api.TargetType.AudioTrackPlayer}, meaning one of: <br />{@link entities.AudioDevice}
   * immutable | true*/
  player: PrimitiveField<NexusLocation, "immut">
}
/** @internal */

export type AudioTrackConstructor = {
  /**
   *  Orders the track visually among all tracks (including audio, automation, pattern, and note tracks).
   *  If this value isn't unique, the frontend might update it to make it unique.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | full*/
  orderAmongTracks?: number
  /**
   *  Whether the audio track is enabled or not. When is_enabled=false, no audio is played back on the track.
   *
   *
   * key | value
   * --- | ---
   * default | true*/
  isEnabled?: boolean
  /**
   *  Optionally apply a Groove to the audio.
   *
   *
   * key | value
   * --- | ---
   * default | empty location
   * required | false*/
  groove?: NexusLocation
  /**
   *  The audio track player that receives the audio from this track and forwards it on the processing
   *  graph. Currently can only point to an AudioDevice.
   *
   *
   * key | value
   * --- | ---
   * default | no default, required
   * required | true
   * immutable | true*/
  player: NexusLocation
}

