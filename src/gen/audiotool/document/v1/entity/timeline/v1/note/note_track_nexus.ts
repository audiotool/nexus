// THIS FILE IS GENERATED - DO NOT EDIT
// Copyright 2026 Audiotool Inc.

import { PrimitiveField } from "@document/fields"
import { type NexusLocation } from "@document/location"

/**
 *
 * key | value
 * --- | ---
 * type | entity
 * key | `"noteTrack"`
 * is | {@link api.TargetType.NoteTrack}
 *
 *
 *  A note track containing note regions. A note track must always be attached
 *  to a note playing device and can't exist without one.
 *
 *
 * @category Timeline Entities*/
export type NoteTrack = {
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
   *  If the track is disabled, no notes are played back.
   *
   *
   * key | value
   * --- | ---
   * default | true*/
  isEnabled: PrimitiveField<boolean, "mut">
  /**
   *  Optionally apply a Groove to the notes.
   *
   *
   * key | value
   * --- | ---
   * default | empty location
   * required | false
   * targets | {@link api.TargetType.Groove}, meaning one of: <br />{@link entities.Groove}*/
  groove: PrimitiveField<NexusLocation, "mut">
  /**
   *  The entity that receives the notes of this note track.
   *
   *
   * key | value
   * --- | ---
   * default | no default, required
   * required | true
   * targets | {@link api.TargetType.NoteTrackPlayer}, meaning one of: <br />{@link entities.Bassline}, <br />{@link entities.Beatbox8}, <br />{@link entities.Beatbox9}, <br />{@link entities.Gakki}, <br />{@link entities.GenericVst3PluginBeta}, <br />{@link entities.Heisenberg}, <br />{@link entities.Machiniste}, <br />{@link entities.MatrixArpeggiator}, <br />{@link entities.NoteSplitter}, <br />{@link entities.Pulverisateur}, <br />{@link entities.Space}, <br />{@link entities.SpitfireLabsVst3Plugin}, <br />{@link entities.Tonematrix}
   * immutable | true*/
  player: PrimitiveField<NexusLocation, "immut">
}
/** @internal */

export type NoteTrackConstructor = {
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
   *  If the track is disabled, no notes are played back.
   *
   *
   * key | value
   * --- | ---
   * default | true*/
  isEnabled?: boolean
  /**
   *  Optionally apply a Groove to the notes.
   *
   *
   * key | value
   * --- | ---
   * default | empty location
   * required | false*/
  groove?: NexusLocation
  /**
   *  The entity that receives the notes of this note track.
   *
   *
   * key | value
   * --- | ---
   * default | no default, required
   * required | true
   * immutable | true*/
  player: NexusLocation
}

