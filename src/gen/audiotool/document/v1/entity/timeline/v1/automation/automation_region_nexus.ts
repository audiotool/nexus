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
 * key | `"automationRegion"`
 * is |
 *
 *
 *  A region on an automation track
 *
 *
 * @category Timeline Entities*/
export type AutomationRegion = {
  /**
   *  How this region maps to the underlying container.
   */
  region: NexusObject<Region>
  /**
   *  The automation event collection containing the automation event underlying this region.
   *
   *
   * key | value
   * --- | ---
   * default | no default, required
   * required | true
   * targets | {@link api.TargetType.AutomationCollection}, meaning one of: <br />{@link entities.AutomationCollection}, <br />{@link entities.TempoAutomationTrack}
   * immutable | true*/
  collection: PrimitiveField<NexusLocation, "immut">
  /**
   *  The track this region belongs to.
   *
   *
   * key | value
   * --- | ---
   * default | no default, required
   * required | true
   * targets | {@link api.TargetType.AutomationTrack}, meaning one of: <br />{@link entities.AutomationTrack}
   * immutable | true*/
  track: PrimitiveField<NexusLocation, "immut">
}
/** @internal */

export type AutomationRegionConstructor = {
  /**
   *  How this region maps to the underlying container.
   */
  region?: RegionConstructor
  /**
   *  The automation event collection containing the automation event underlying this region.
   *
   *
   * key | value
   * --- | ---
   * default | no default, required
   * required | true
   * immutable | true*/
  collection: NexusLocation
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
}

