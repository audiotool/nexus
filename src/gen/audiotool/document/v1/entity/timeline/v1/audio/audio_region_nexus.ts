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
 * key | `"audioRegion"`
 * is |
 *
 *
 *  An Region of audio on the timeline. Must be attached to an AudioTrack.
 *
 *  Note that multiple regions can point to the same sample and/or the same
 *  automation collection. In the current audio tool version, it's possible to create
 *  "virtual regions" that point to both the same sample and same automation collection,
 *  and to create two regions with different collections but the same sample.
 *
 *  It is also possible to create two regions that point to
 *  different samples but the same automation collection, even though the UI
 *  doesn't allow for such an operation.
 *
 *
 * @category Timeline Entities*/
export type AudioRegion = {
  /**
   *  This region maps to the audio content of the track.
   */
  region: NexusObject<Region>
  /**
   *  The track this region belongs to.
   *
   *
   * key | value
   * --- | ---
   * default | no default, required
   * required | true
   * targets | {@link api.TargetType.AudioTrack}, meaning one of: <br />{@link entities.AudioTrack}
   * immutable | true*/
  track: PrimitiveField<NexusLocation, "immut">
  /**
   *  Automation events that define the playback speed of the sample in this region.
   *
   *
   * key | value
   * --- | ---
   * default | no default, required
   * required | true
   * targets | {@link api.TargetType.AutomationCollection}, meaning one of: <br />{@link entities.AutomationCollection}, <br />{@link entities.TempoAutomationTrack}
   * immutable | true*/
  playbackAutomationCollection: PrimitiveField<NexusLocation, "immut">
  /**
   *  The sample that is played back in this region.
   *
   *
   * key | value
   * --- | ---
   * default | no default, required
   * required | true
   * targets | {@link api.TargetType.Sample}, meaning one of: <br />{@link entities.Sample}
   * immutable | true*/
  sample: PrimitiveField<NexusLocation, "immut">
  /**
   *  Gain applied to the sample in the region. Equivalent to a dB range of [-inf, 30.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 31.622777938842773]*/
  gain: PrimitiveField<number, "mut">
  /**
   *  The duration of the fade-in envelope in ticks. The sum of this and fade out
   *  duration cannot be higher than the region's total duration.
   *
   *
   * key | value
   * --- | ---
   * default | 10
   * range | full*/
  fadeInDurationTicks: PrimitiveField<number, "mut">
  /**
   *  The slope of the fade-in envelope. 0 is linear, more or less curves the slope.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]*/
  fadeInSlope: PrimitiveField<number, "mut">
  /**
   *  The duration of the fade-out envelope in ticks. The sum of this and fade in
   *  duration cannot be higher than the region's total duration.
   *
   *
   * key | value
   * --- | ---
   * default | 10
   * range | full*/
  fadeOutDurationTicks: PrimitiveField<number, "mut">
  /**
   *  The slope of the fade-out envelope. 0 is linear, more or less curves the slope.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]*/
  fadeOutSlope: PrimitiveField<number, "mut">
  /**
   *  The time stretching algorithm, determines the pitch of the sample if it's stretched
   *  or compressed over time:
   *  - 0: invalid
   *  - 1: pitch shift    no processing - faster/slower playback result in lower/higher pitch
   *  - 2: time stretch   processing - faster/slower keeps the original pitch, with some artifacts.
   *
   *
   * key | value
   * --- | ---
   * default | 2
   * range | [1, 2]*/
  timestretchMode: PrimitiveField<number, "mut">
  /**
   *  in timestretch mode, pitch shift the signal by a certain
   *  amount of semitones
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-24, 24]*/
  pitchShiftSemitones: PrimitiveField<number, "mut">
}
/** @internal */

export type AudioRegionConstructor = {
  /**
   *  This region maps to the audio content of the track.
   */
  region?: RegionConstructor
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
   *  Automation events that define the playback speed of the sample in this region.
   *
   *
   * key | value
   * --- | ---
   * default | no default, required
   * required | true
   * immutable | true*/
  playbackAutomationCollection: NexusLocation
  /**
   *  The sample that is played back in this region.
   *
   *
   * key | value
   * --- | ---
   * default | no default, required
   * required | true
   * immutable | true*/
  sample: NexusLocation
  /**
   *  Gain applied to the sample in the region. Equivalent to a dB range of [-inf, 30.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 31.622777938842773]*/
  gain?: number
  /**
   *  The duration of the fade-in envelope in ticks. The sum of this and fade out
   *  duration cannot be higher than the region's total duration.
   *
   *
   * key | value
   * --- | ---
   * default | 10
   * range | full*/
  fadeInDurationTicks?: number
  /**
   *  The slope of the fade-in envelope. 0 is linear, more or less curves the slope.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]*/
  fadeInSlope?: number
  /**
   *  The duration of the fade-out envelope in ticks. The sum of this and fade in
   *  duration cannot be higher than the region's total duration.
   *
   *
   * key | value
   * --- | ---
   * default | 10
   * range | full*/
  fadeOutDurationTicks?: number
  /**
   *  The slope of the fade-out envelope. 0 is linear, more or less curves the slope.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]*/
  fadeOutSlope?: number
  /**
   *  The time stretching algorithm, determines the pitch of the sample if it's stretched
   *  or compressed over time:
   *  - 0: invalid
   *  - 1: pitch shift    no processing - faster/slower playback result in lower/higher pitch
   *  - 2: time stretch   processing - faster/slower keeps the original pitch, with some artifacts.
   *
   *
   * key | value
   * --- | ---
   * default | 2
   * range | [1, 2]*/
  timestretchMode?: number
  /**
   *  in timestretch mode, pitch shift the signal by a certain
   *  amount of semitones
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-24, 24]*/
  pitchShiftSemitones?: number
}

