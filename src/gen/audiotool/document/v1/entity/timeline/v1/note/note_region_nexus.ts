// THIS FILE IS GENERATED - DO NOT EDIT
// Copyright 2025 Audiotool Inc.

import { PrimitiveField } from "@document/fields"
import { type NexusLocation } from "@document/location"
import { NexusObject } from "@document/object"
import {
  type Region,
  type RegionConstructor,
} from "@gen/document/v1/entity/region/v1/region_nexus"

/**
 *
 * key | value
 * --- | ---
 * type | entity
 * key | `"noteRegion"`
 * is |
 *
 *
 *  A region containing notes. Must be attached to a NoteTrack.
 *
 *
 * @category Timeline Entities*/
export type NoteRegion = {
  /**
   *  How this region maps to the underlying container.
   */
  region: NexusObject<Region>
  /**
   *  Points to the NoteCollection containing the notes of this region.
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
   *  Points to the NoteTrack this region belongs to.
   *
   *
   * key | value
   * --- | ---
   * default | no default, required
   * required | true
   * targets | {@link api.TargetType.NoteTrack}, meaning one of: <br />{@link entities.NoteTrack}
   * immutable | true*/
  track: PrimitiveField<NexusLocation, "immut">
}
/** @internal */

export type NoteRegionConstructor = {
  /**
   *  How this region maps to the underlying container.
   */
  region?: RegionConstructor
  /**
   *  Points to the NoteCollection containing the notes of this region.
   *
   *
   * key | value
   * --- | ---
   * default | no default, required
   * required | true
   * immutable | true*/
  collection: NexusLocation
  /**
   *  Points to the NoteTrack this region belongs to.
   *
   *
   * key | value
   * --- | ---
   * default | no default, required
   * required | true
   * immutable | true*/
  track: NexusLocation
}

