// THIS FILE IS GENERATED - DO NOT EDIT
// Copyright 2026 Audiotool Inc.

import { PrimitiveField } from "@document/fields"
import { type NexusLocation } from "@document/location"

/**
 *
 * key | value
 * --- | ---
 * type | entity
 * key | `"automationEvent"`
 * is |
 *
 *
 *  A point created when clicking on an automation region
 *
 *
 * @category Timeline Entities*/
export type AutomationEvent = {
  /**
   *  The collection to which this event belongs
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
   *  The position of this event in ticks in the collection.
   *
   *  There can be at most two automation events with the same position_ticks value
   *  pointing to the same automation collection. Exactly one of them must have is_second set to true.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | full*/
  positionTicks: PrimitiveField<number, "mut">
  /**
   *  The value of the automation event.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  value: PrimitiveField<number, "mut">
  /**
   *  If interpolation is set to "sloped", then this value controls how much the value
   *  is sloped in on or the other direction:
   *  - -1 sloped "up"
   *  - 0 linear, a straight line to the next event
   *  - 1 sloped "down"
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]*/
  slope: PrimitiveField<number, "mut">
  /**
   *  Interpolation mode
   *  - 0: invalid
   *  - 1: stepped   value stays constant until next event
   *  - 2: sloped    value travels to next event depending on slope parameter
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 2]*/
  interpolation: PrimitiveField<number, "mut">
  /**
   *  If two automation events lie on the same tick, exactly one of them must have is_second set to true.
   *  This orders the automation events on the same tick. If no other automation event lies on the same tick,
   *  is_second doesn't matter.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  isSecond: PrimitiveField<boolean, "mut">
}
/** @internal */

export type AutomationEventConstructor = {
  /**
   *  The collection to which this event belongs
   *
   *
   * key | value
   * --- | ---
   * default | no default, required
   * required | true
   * immutable | true*/
  collection: NexusLocation
  /**
   *  The position of this event in ticks in the collection.
   *
   *  There can be at most two automation events with the same position_ticks value
   *  pointing to the same automation collection. Exactly one of them must have is_second set to true.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | full*/
  positionTicks?: number
  /**
   *  The value of the automation event.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  value?: number
  /**
   *  If interpolation is set to "sloped", then this value controls how much the value
   *  is sloped in on or the other direction:
   *  - -1 sloped "up"
   *  - 0 linear, a straight line to the next event
   *  - 1 sloped "down"
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]*/
  slope?: number
  /**
   *  Interpolation mode
   *  - 0: invalid
   *  - 1: stepped   value stays constant until next event
   *  - 2: sloped    value travels to next event depending on slope parameter
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 2]*/
  interpolation?: number
  /**
   *  If two automation events lie on the same tick, exactly one of them must have is_second set to true.
   *  This orders the automation events on the same tick. If no other automation event lies on the same tick,
   *  is_second doesn't matter.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  isSecond?: boolean
}

