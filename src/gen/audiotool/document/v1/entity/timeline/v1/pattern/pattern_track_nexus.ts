// THIS FILE IS GENERATED - DO NOT EDIT
// Copyright 2025 Audiotool Inc.

import { PrimitiveField } from "@document/fields"
import { type NexusLocation } from "@document/location"

/**
 *
 * key | value
 * --- | ---
 * type | entity
 * key | `"patternTrack"`
 * is | {@link api.TargetType.PatternTrack}
 *
 *
 *  a pattern track that allows automating pattern changes for devices that
 *  support them
 *
 *
 * @category Timeline Entities*/
export type PatternTrack = {
  /**
   *  Sorts this track visually among all tracks. Must be unique among
   *  all AutomationTracks, NoteTracks, PatternTracks, and AudioTracks.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | full*/
  orderAmongTracks: PrimitiveField<number, "mut">
  /**
   *  If the track is disabled, no pattern is played back.
   *
   *
   * key | value
   * --- | ---
   * default | true*/
  isEnabled: PrimitiveField<boolean, "mut">
  /**
   *  The entity that receives the pattern information from this track.
   *
   *
   * key | value
   * --- | ---
   * default | no default, required
   * required | true
   * targets | {@link api.TargetType.PatternTrackPlayer}, meaning one of: <br />{@link entities.Bassline}, <br />{@link entities.Beatbox8}, <br />{@link entities.Beatbox9}, <br />{@link entities.Machiniste}, <br />{@link entities.MatrixArpeggiator}, <br />{@link entities.Rasselbock}, <br />{@link entities.Tonematrix}
   * immutable | true*/
  player: PrimitiveField<NexusLocation, "immut">
}
/** @internal */

export type PatternTrackConstructor = {
  /**
   *  Sorts this track visually among all tracks. Must be unique among
   *  all AutomationTracks, NoteTracks, PatternTracks, and AudioTracks.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | full*/
  orderAmongTracks?: number
  /**
   *  If the track is disabled, no pattern is played back.
   *
   *
   * key | value
   * --- | ---
   * default | true*/
  isEnabled?: boolean
  /**
   *  The entity that receives the pattern information from this track.
   *
   *
   * key | value
   * --- | ---
   * default | no default, required
   * required | true
   * immutable | true*/
  player: NexusLocation
}

