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
 * key | `"audioMerger"`
 * is |
 *
 *
 *  Represents an audio merger device.
 *
 *  The merger device takes audio from three inputs, A, B, C,
 *  and mixes them according to coordinates on a triangle
 *  spanned by points A, B, C.
 *
 *
 * @category Device Entities*/
export type AudioMerger = {
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
   *  of the input signals based on the distance to the points
   *  A, B and C in the AudioMergerCoordinates below.
   *
   *  - 0: invalid
   *  - 1: full-power
   *  - 2: equal-power
   *
   *  The difference between algorithms is best understood when considering
   *  the situation where all 3 input signals receive an identical sine wave
   *  peak value 1.
   *
   *  - full-power:
   *     Means the output will become louder when the knob is in the
   *     center - you will basically add all 3 signals, resulting in a sine wave
   *     with peak 3. If the knob is at e.g. point A, the signal will get gain 1.
   *
   *  - equal-power:
   *     The output gain of the signal will be near-constant when moving the knob.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 2]
   * is | {@link api.TargetType.AutomatableParameter}*/
  blendModeIndex: PrimitiveField<number, "mut">
  /**
   *  Location for the audio input A.
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioInput}*/
  audioInputA: NexusObject<Empty>
  /**
   *  Location for the audio input B.
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioInput}*/
  audioInputB: NexusObject<Empty>
  /**
   *  Location for the audio input C.
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioInput}*/
  audioInputC: NexusObject<Empty>
  /**
   *  Location for the audio input, contains a mix of A, B and C according to the
   *  merge coords.
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioOutput}*/
  audioOutput: NexusObject<Empty>
  /**
   *  Contains the coordinates determining the mix between A, B and C.
   */
  mergeCoords: NexusObject<AudioMergerCoordinates>
}
/** @internal */

export type AudioMergerConstructor = {
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
   *  of the input signals based on the distance to the points
   *  A, B and C in the AudioMergerCoordinates below.
   *
   *  - 0: invalid
   *  - 1: full-power
   *  - 2: equal-power
   *
   *  The difference between algorithms is best understood when considering
   *  the situation where all 3 input signals receive an identical sine wave
   *  peak value 1.
   *
   *  - full-power:
   *     Means the output will become louder when the knob is in the
   *     center - you will basically add all 3 signals, resulting in a sine wave
   *     with peak 3. If the knob is at e.g. point A, the signal will get gain 1.
   *
   *  - equal-power:
   *     The output gain of the signal will be near-constant when moving the knob.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 2]*/
  blendModeIndex?: number
  /**
   *  Contains the coordinates determining the mix between A, B and C.
   */
  mergeCoords?: AudioMergerCoordinatesConstructor
}

/**
 *
 * key | value
 * --- | ---
 * type | object
 *
 *  The coordinates by which signals A, B and C in the audio merger are mixed.
 *
 *  The coordinates are on the cartesian plane bounded by [0, 1]
 *  in both dimensions. On this plane, a triangle is formed between
 *  points:
 *  - A: (0, 0.5)
 *  - B: (1, 0)
 *  - C: (0, -0.5)
 *
 *  For a given coordinate (x, y), the point is first clamped vertically
 *  to be within the y-range of the triangle (for the given x value). Then,
 *  the distance to points A, B, C is calculated.
 *
 *  How these distances are used to mix the signals together depends
 *  on the blend_algorithm fields of the merger.
 *
 *
 * @category Device Fields*/
export type AudioMergerCoordinates = {
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

export type AudioMergerCoordinatesConstructor = {
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

