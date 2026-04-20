// THIS FILE IS GENERATED - DO NOT EDIT
// Copyright 2026 Audiotool Inc.

import { PrimitiveField } from "@document/fields"
import { type NexusLocation } from "@document/location"

/**
 *
 * key | value
 * --- | ---
 * type | entity
 * key | `"note"`
 * is |
 *
 *
 *  A note on the timeline
 *
 *
 * @category Timeline Entities*/
export type Note = {
  /**
   *  The collection to which this note belongs
   *
   *
   * key | value
   * --- | ---
   * default | no default, required
   * required | true
   * targets | {@link api.TargetType.NoteCollection}, meaning one of: <br />{@link entities.NoteCollection}
   * immutable | true*/
  collection: PrimitiveField<NexusLocation, "immut">
  /**
   *  The position of the note in ticks.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | full*/
  positionTicks: PrimitiveField<number, "mut">
  /**
   *  The duration of the note in ticks.
   *
   *
   * key | value
   * --- | ---
   * default | 960
   * range | full*/
  durationTicks: PrimitiveField<number, "mut">
  /**
   *  Pitch according to MIDI standard. 60 = C4 (middle C). The actual frequency of the note depends
   *  on the base frequency in the config entity and potentially configs of audio producing devices.
   *
   *
   * key | value
   * --- | ---
   * default | 60
   * range | [0, 127]*/
  pitch: PrimitiveField<number, "mut">
  /**
   *  Velocity between 0 and 1; the meaning of this value is up to whatever is using the note.
   *
   *
   * key | value
   * --- | ---
   * default | 0.699999988079071
   * range | [0, 1]*/
  velocity: PrimitiveField<number, "mut">
  /**
   *  If does_slide is true,  there's only one note playing at a given time,
   *  and if two notes overlap, the pitch slides from one pitch to the other
   *  for the duration of the overlap.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  doesSlide: PrimitiveField<boolean, "mut">
}
/** @internal */

export type NoteConstructor = {
  /**
   *  The collection to which this note belongs
   *
   *
   * key | value
   * --- | ---
   * default | no default, required
   * required | true
   * immutable | true*/
  collection: NexusLocation
  /**
   *  The position of the note in ticks.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | full*/
  positionTicks?: number
  /**
   *  The duration of the note in ticks.
   *
   *
   * key | value
   * --- | ---
   * default | 960
   * range | full*/
  durationTicks?: number
  /**
   *  Pitch according to MIDI standard. 60 = C4 (middle C). The actual frequency of the note depends
   *  on the base frequency in the config entity and potentially configs of audio producing devices.
   *
   *
   * key | value
   * --- | ---
   * default | 60
   * range | [0, 127]*/
  pitch?: number
  /**
   *  Velocity between 0 and 1; the meaning of this value is up to whatever is using the note.
   *
   *
   * key | value
   * --- | ---
   * default | 0.699999988079071
   * range | [0, 1]*/
  velocity?: number
  /**
   *  If does_slide is true,  there's only one note playing at a given time,
   *  and if two notes overlap, the pitch slides from one pitch to the other
   *  for the duration of the overlap.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  doesSlide?: boolean
}

