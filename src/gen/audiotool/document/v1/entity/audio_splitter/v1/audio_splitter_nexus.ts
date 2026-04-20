// THIS FILE IS GENERATED - DO NOT EDIT
// Copyright 2026 Audiotool Inc.

import { PrimitiveField } from "@document/fields"
import { NexusObject } from "@document/object"
import { type Empty } from "@gen/document/v1/empty_nexus"

/**
 *
 * key | value
 * --- | ---
 * type | entity
 * key | `"audioSplitter"`
 * is |
 *
 *
 *  Represents an audio splitter device.
 *
 *  The audio splitter takes a single audio input, and "splits"
 *  the signal according to coordinates.
 *
 *
 * @category Device Entities*/
export type AudioSplitter = {
  /**
   *  The user-assigned name of this device.
   */
  displayName: PrimitiveField<string, "mut">
  /**
   *  X position on the desktop in the DAW.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | full*/
  positionX: PrimitiveField<number, "mut">
  /**
   *  Y position on the desktop in the DAW.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | full*/
  positionY: PrimitiveField<number, "mut">
  /**
   *  Selects the blending algorithm used to calculate the gains
   *  of the output signals based on the distance to the points
   *  A, B and C in the AudioSplitterCoordinates below.
   *
   *  - 0: invalid
   *  - 1: full-power
   *  - 2: equal-power
   *
   *  The difference between algorithms is best understood when considering
   *  the situation where the input signal is a simple sine wave of gain 1.
   *
   *  - full-power:
   *     Means each output will have the full gain of the input signal, i.e.
   *     a sine wave with peak 1. Moving to any point A, B, C will keep a sine wave
   *     with gain 1.
   *
   *  - equal-power:
   *     The gain of the SUM of the output signals will always match the whole incoming
   *     signal.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 2]
   * is | {@link api.TargetType.AutomatableParameter}*/
  blendModeIndex: PrimitiveField<number, "mut">
  /**
   *  Single Input
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioInput}*/
  audioInput: NexusObject<Empty>
  /**
   *  Output A
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioOutput}*/
  audioOutputA: NexusObject<Empty>
  /**
   *  Output B
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioOutput}*/
  audioOutputB: NexusObject<Empty>
  /**
   *  Output C
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioOutput}*/
  audioOutputC: NexusObject<Empty>
  /**
   *  Contains the coordinates determining how the signals as split between A, B and C.
   */
  splitCoords: NexusObject<AudioSplitterCoordinates>
}
/** @internal */

export type AudioSplitterConstructor = {
  /**
   *  The user-assigned name of this device.
   */
  displayName?: string
  /**
   *  X position on the desktop in the DAW.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | full*/
  positionX?: number
  /**
   *  Y position on the desktop in the DAW.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | full*/
  positionY?: number
  /**
   *  Selects the blending algorithm used to calculate the gains
   *  of the output signals based on the distance to the points
   *  A, B and C in the AudioSplitterCoordinates below.
   *
   *  - 0: invalid
   *  - 1: full-power
   *  - 2: equal-power
   *
   *  The difference between algorithms is best understood when considering
   *  the situation where the input signal is a simple sine wave of gain 1.
   *
   *  - full-power:
   *     Means each output will have the full gain of the input signal, i.e.
   *     a sine wave with peak 1. Moving to any point A, B, C will keep a sine wave
   *     with gain 1.
   *
   *  - equal-power:
   *     The gain of the SUM of the output signals will always match the whole incoming
   *     signal.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 2]*/
  blendModeIndex?: number
  /**
   *  Contains the coordinates determining how the signals as split between A, B and C.
   */
  splitCoords?: AudioSplitterCoordinatesConstructor
}

/**
 *
 * key | value
 * --- | ---
 * type | object
 *
 *  Datastructure holding how the values are split.
 *  The splitting works according to a triangle spanned by the following three corners:
 *  - A: coordinate (1, 0.5)
 *  - B: coordinate (0, 0)
 *  - C: coordinates (1, -0.5)
 *
 *  Given a `AudioSplitterCoordinates` point (x, y), the gain for outputs for A, B, and C depends on the distance
 *  from the Split point to their respective corners after the y value is clipped such that the
 *  point lies inside the triangle.
 *
 *  For example, point (1, 0) lies inside the triangle, so the distances are calculated from the
 *  point directly; point (0.5, 0.5) however lies outside triangle, so the y value is clipped to move the
 *  point to the edge of the triangle, in this case (0.5, 0.75), before the distances are calculated.
 *
 *  The default values are chosen such that the distance to all three corners is equal.
 *
 *  Note: The Barycentric coordinate system was considered, but not used to the following reasons:
 *  - non-unique coordinates for a given point
 *  - undefined coordinate (0, 0, 0)
 *  - the old documents work using the system above, hence is the behavior expected by users
 *
 *
 * @category Device Fields*/
export type AudioSplitterCoordinates = {
  /**
   *  The x-coordinates. See the message documentation for what this means.
   *
   *
   * key | value
   * --- | ---
   * default | 0.6666666865348816
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  x: PrimitiveField<number, "mut">
  /**
   *  The y-coordinates. See the message documentation for what this means.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-0.5, 0.5]
   * is | {@link api.TargetType.AutomatableParameter}*/
  y: PrimitiveField<number, "mut">
}
/** @internal */

export type AudioSplitterCoordinatesConstructor = {
  /**
   *  The x-coordinates. See the message documentation for what this means.
   *
   *
   * key | value
   * --- | ---
   * default | 0.6666666865348816
   * range | [0, 1]*/
  x?: number
  /**
   *  The y-coordinates. See the message documentation for what this means.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-0.5, 0.5]*/
  y?: number
}

