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
   *
   *
   * key | value
   * --- | ---
   * default | `"Stereo Detune"`*/
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
   *  The backend name of the preset applied to this device, if any. Usually presets/{uuid}.
   *  This is used for record-keeping only and has no effect on the sound of the device.
   *
   *
   * key | value
   * --- | ---
   * default | `""`*/
  presetName: PrimitiveField<string, "mut">
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
   *  Controls the mix between the incoming and the effect signal. -1.0 ("dry") means 0% effect
   *  applied, 0.0 ("wet") means 100% effect applied; values between mixes the two linearly.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 0]
   * is | {@link api.TargetType.AutomatableParameter}*/
  mix: PrimitiveField<number, "mut">
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
   *
   *
   * key | value
   * --- | ---
   * default | `"Stereo Detune"`*/
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
   *  The backend name of the preset applied to this device, if any. Usually presets/{uuid}.
   *  This is used for record-keeping only and has no effect on the sound of the device.
   *
   *
   * key | value
   * --- | ---
   * default | `""`*/
  presetName?: string
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
  /**
   *  Controls the mix between the incoming and the effect signal. -1.0 ("dry") means 0% effect
   *  applied, 0.0 ("wet") means 100% effect applied; values between mixes the two linearly.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 0]*/
  mix?: number
}

