// THIS FILE IS GENERATED - DO NOT EDIT
// Copyright 2026 Audiotool Inc.

import { PrimitiveField } from "@document/fields"

/**
 *
 * key | value
 * --- | ---
 * type | object
 *
 *  Regions arrange content on the timeline, such as audio, midi melodies, automation events,
 *  and others. They're not an entity themselves but a submessage of the different region entities.
 *
 *  A region can be considered a "view" of a collection of notes, automation points, or an audio
 *  sample. Collections position "events" (notes, automation points, an audio samples) in collection-local
 *  time, on a timeline that's neither looped nor capped in any way.
 *
 *  The parameters of the region below then add information on:
 *  - how the collection is positioned on the global timeline
 *  - when the region starts and ends, which discards events from the collection that are outside of the region
 *  - which time interval of the collection should be looped, and how the loop is positioned relative to the region start
 *
 *  For a simple looped region, set parameters as follows:
 *  - position_ticks/duration_ticks: the start/end the region should have on the timeline
 *  - loop_offset_ticks: set to 0 to make the collection start at the region start
 *  - loop_duration_ticks: same as duration_ticks if region is not be looped, less if it should be looped
 *  - collection_offset_ticks: set to 0
 *
 *  For more complex setups, here's an extremely intuitive diagram of the relationship between the different parameters:
 *  ```
 *  ticks           0   1   2   3   4   5   6   7   8   9   10
 *                  |   |   |   |   |   |   |   |   |   |   |
 *  position_ticks  | ----- |
 *  duration_ticks          | ------------------------- |
 *  loop_offset_ticks       | - |
 *  loop_duration_ticks         | ----------------- |
 *  collection_offset_ticks     | < | (negative)
 *  ```
 *  In the diagram above, this would result in the following collection start ticks:
 *
 *  ```
 *  collection start                | -- >               | -- >
 *  ```
 *  Because the collection start tick can be determined by:
 *  - position_ticks
 *  - plus loop_offset_ticks
 *  - minus collection_offset_ticks
 *
 *  The raison d'être of the collection_offset_ticks is that multiple regions can point to the same
 *  collection, and there needs to be a way to position the collection relative to the region start without
 *  re-positioning the events inside the collection.
 *
 *
 * @category Timeline Fields*/
export type Region = {
  /**
   *  The position of the region on the timeline, see above.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | full*/
  positionTicks: PrimitiveField<number, "mut">
  /**
   *  The duration of the region on the timeline, see above.
   *
   *
   * key | value
   * --- | ---
   * default | 15360
   * range | full*/
  durationTicks: PrimitiveField<number, "mut">
  /**
   *  The offset of the collection time relative to the loop start, see above.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | full*/
  collectionOffsetTicks: PrimitiveField<number, "mut">
  /**
   *  The offset of the loop start in the region relative to region start, see above.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | full*/
  loopOffsetTicks: PrimitiveField<number, "mut">
  /**
   *  The duration of the loop in the region, see above.
   *
   *
   * key | value
   * --- | ---
   * default | 15360
   * range | full*/
  loopDurationTicks: PrimitiveField<number, "mut">
  /**
   *  If is_enabled=false, the audio engine won't produce audio as a result of this region.
   *
   *
   * key | value
   * --- | ---
   * default | true*/
  isEnabled: PrimitiveField<boolean, "mut">
  /**
   *  The color index of the region. The meaning of this value is determined by the UI.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 41]*/
  colorIndex: PrimitiveField<number, "mut">
  /**
   *  A user-assigned name for the region.
   */
  displayName: PrimitiveField<string, "mut">
}
/** @internal */

export type RegionConstructor = {
  /**
   *  The position of the region on the timeline, see above.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | full*/
  positionTicks?: number
  /**
   *  The duration of the region on the timeline, see above.
   *
   *
   * key | value
   * --- | ---
   * default | 15360
   * range | full*/
  durationTicks?: number
  /**
   *  The offset of the collection time relative to the loop start, see above.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | full*/
  collectionOffsetTicks?: number
  /**
   *  The offset of the loop start in the region relative to region start, see above.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | full*/
  loopOffsetTicks?: number
  /**
   *  The duration of the loop in the region, see above.
   *
   *
   * key | value
   * --- | ---
   * default | 15360
   * range | full*/
  loopDurationTicks?: number
  /**
   *  If is_enabled=false, the audio engine won't produce audio as a result of this region.
   *
   *
   * key | value
   * --- | ---
   * default | true*/
  isEnabled?: boolean
  /**
   *  The color index of the region. The meaning of this value is determined by the UI.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 41]*/
  colorIndex?: number
  /**
   *  A user-assigned name for the region.
   */
  displayName?: string
}

