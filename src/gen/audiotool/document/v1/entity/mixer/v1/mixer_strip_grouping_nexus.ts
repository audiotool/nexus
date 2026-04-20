// THIS FILE IS GENERATED - DO NOT EDIT
// Copyright 2026 Audiotool Inc.

import { PrimitiveField } from "@document/fields"
import { type NexusLocation } from "@document/location"

/**
 *
 * key | value
 * --- | ---
 * type | entity
 * key | `"mixerStripGrouping"`
 * is |
 *
 *
 *  Groups a channel or group strip under another group strip. The audio of grouped strips passed
 *  through the group strip instead of going directly to the main out. Strips that aren't grouped
 *  are implicitly connected to the main out.
 *
 *  The graph created with nodes connected by strip groupings must be a tree.
 *
 *
 * @category Mixer Entities*/
export type MixerStripGrouping = {
  /**
   *  The child strip that is grouped by the group strip. Can be either a channel or group strip.
   *
   *
   * key | value
   * --- | ---
   * default | no default, required
   * required | true
   * targets | {@link api.TargetType.MixerStripGroupChild}, meaning one of: <br />{@link entities.MixerChannel}, <br />{@link entities.MixerGroup}
   * immutable | true*/
  childStrip: PrimitiveField<NexusLocation, "immut">
  /**
   *  The group strip under which the child strip is grouped. Can only be a group strip.
   *
   *
   * key | value
   * --- | ---
   * default | no default, required
   * required | true
   * targets | {@link api.TargetType.MixerStripGroup}, meaning one of: <br />{@link entities.MixerGroup}
   * immutable | true*/
  groupStrip: PrimitiveField<NexusLocation, "immut">
}
/** @internal */

export type MixerStripGroupingConstructor = {
  /**
   *  The child strip that is grouped by the group strip. Can be either a channel or group strip.
   *
   *
   * key | value
   * --- | ---
   * default | no default, required
   * required | true
   * immutable | true*/
  childStrip: NexusLocation
  /**
   *  The group strip under which the child strip is grouped. Can only be a group strip.
   *
   *
   * key | value
   * --- | ---
   * default | no default, required
   * required | true
   * immutable | true*/
  groupStrip: NexusLocation
}

