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
 * key | `"patternRegion"`
 * is |
 *
 *
 *  a region on a pattern track
 *
 *
 * @category Timeline Entities*/
export type PatternRegion = {
  /**
   *  How this region maps to the underlying container.
   */
  region: NexusObject<Region>
  /**
   *  The index of the pattern in the pattern device that the track points to.
   *
   *  32 is the maximum number of patterns supported by any current pattern device;
   *  if more pattern devices are added, this value must be increased.
   *
   *  If a region exists with an index higher than the pattern device supports, the region is mute.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 32]*/
  patternIndex: PrimitiveField<number, "mut">
  /**
   *  The track this region belongs to.
   *
   *
   * key | value
   * --- | ---
   * default | no default, required
   * required | true
   * targets | {@link api.TargetType.PatternTrack}, meaning one of: <br />{@link entities.PatternTrack}
   * immutable | true*/
  track: PrimitiveField<NexusLocation, "immut">
  /**
   *  Defines whether the pattern is started at this point in
   *  time, or whether it uses 0 as its starting point
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  restart: PrimitiveField<boolean, "mut">
}
/** @internal */

export type PatternRegionConstructor = {
  /**
   *  How this region maps to the underlying container.
   */
  region?: RegionConstructor
  /**
   *  The index of the pattern in the pattern device that the track points to.
   *
   *  32 is the maximum number of patterns supported by any current pattern device;
   *  if more pattern devices are added, this value must be increased.
   *
   *  If a region exists with an index higher than the pattern device supports, the region is mute.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 32]*/
  patternIndex?: number
  /**
   *  The track this region belongs to.
   *
   *
   * key | value
   * --- | ---
   * default | no default, required
   * required | true
   * immutable | true*/
  track: NexusLocation
  /**
   *  Defines whether the pattern is started at this point in
   *  time, or whether it uses 0 as its starting point
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  restart?: boolean
}

