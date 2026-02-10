// THIS FILE IS GENERATED - DO NOT EDIT
// Copyright 2025 Audiotool Inc.

/**
 *
 * key | value
 * --- | ---
 * type | entity
 * key | `"automationCollection"`
 * is | {@link api.TargetType.AutomationCollection}
 *
 *
 *  A collection of automation events. This entity is referenced by entities that need automation events
 *  (e.g. an AutomationRegion), and by automation events themselves.
 *
 *  The reason automation events don't point to e.g. AutomationTracks directly is
 *  to support "linked regions" - multiple automation regions that contain the same automation events.
 *
 *
 * @category Timeline Entities*/
export type AutomationCollection = {}
/** @internal */

export type AutomationCollectionConstructor = {}

