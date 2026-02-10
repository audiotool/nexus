// THIS FILE IS GENERATED - DO NOT EDIT
// Copyright 2025 Audiotool Inc.

import { PrimitiveField } from "@document/fields"
import { NexusObject } from "@document/object"
import { type Empty } from "@gen/document/v1/empty_nexus"

/**
 *
 * key | value
 * --- | ---
 * type | entity
 * key | `"stompboxStereoDetune"`
 * is |
 *
 *
 *  A stereo detune effect in the form of a stompbox. Allows to widen the stereo
 *  image of a sound by slightly detuning the channels and adding a very short
 *  delay.
 *
 *
 * @category Device Entities*/
export type StompboxStereoDetune = {
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
   *  The amount of detune in semitones.
   *
   *
   * key | value
   * --- | ---
   * default | 0.25
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  detuneSemitones: PrimitiveField<number, "mut">
  /**
   *  The delay time of the detune effect.
   *
   *
   * key | value
   * --- | ---
   * default | 14
   * range | [2, 30]
   * is | {@link api.TargetType.AutomatableParameter}*/
  delayTimeMs: PrimitiveField<number, "mut">
  /**
   *  Whether the stompbox is active or not. When is_active=false, audio signal bypasses the device
   *
   *
   * key | value
   * --- | ---
   * default | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  isActive: PrimitiveField<boolean, "mut">
  /**
   *  Single Input.
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioInput}*/
  audioInput: NexusObject<Empty>
  /**
   *  Single Output.
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioOutput}*/
  audioOutput: NexusObject<Empty>
}
/** @internal */

export type StompboxStereoDetuneConstructor = {
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
   *  The amount of detune in semitones.
   *
   *
   * key | value
   * --- | ---
   * default | 0.25
   * range | [-1, 1]*/
  detuneSemitones?: number
  /**
   *  The delay time of the detune effect.
   *
   *
   * key | value
   * --- | ---
   * default | 14
   * range | [2, 30]*/
  delayTimeMs?: number
  /**
   *  Whether the stompbox is active or not. When is_active=false, audio signal bypasses the device
   *
   *
   * key | value
   * --- | ---
   * default | true*/
  isActive?: boolean
}

