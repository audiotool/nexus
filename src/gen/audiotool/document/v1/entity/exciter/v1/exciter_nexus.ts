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
 * key | `"exciter"`
 * is |
 *
 *
 *  The exciter device. Enriches the signal by adding a harmonic content to the signal.
 *
 *  It does so by adding distortion to the higher frequencies above a certain threshold.
 *
 *
 * @category Device Entities*/
export type Exciter = {
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
   *  The backend name of the preset applied to this device, if any. Usually presets/{uuid}.
   *  This is used for record-keeping only and has no effect on the sound of the device.
   */
  presetName: PrimitiveField<string, "mut">
  /**
   *  Audio Input
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioInput}*/
  audioInput: NexusObject<Empty>
  /**
   *  Audio Output
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioOutput}*/
  audioOutput: NexusObject<Empty>
  /**
   *  The "tone" frequency is the frequency above which the exciter will add distortion to the signal.
   *
   *
   * key | value
   * --- | ---
   * default | 3500
   * range | [20, 13000]
   * is | {@link api.TargetType.AutomatableParameter}*/
  toneFrequencyHz: PrimitiveField<number, "mut">
  /**
   *  The "power" factor controls how much distortion is added to the signal above the tone frequency.
   *
   *
   * key | value
   * --- | ---
   * default | 0.5
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  powerFactor: PrimitiveField<number, "mut">
  /**
   *  Controls the mix between the incoming and the distorted signal. 0 ("dry") means 0% distortion
   *  applied, 1 ("wet") means 100% distortion applied; values between mixes the two linearly.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  mix: PrimitiveField<number, "mut">
  /**
   *  Whether the device is active or not. When is_active=false, audio signal bypasses the device.
   *
   *
   * key | value
   * --- | ---
   * default | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  isActive: PrimitiveField<boolean, "mut">
}
/** @internal */

export type ExciterConstructor = {
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
   *  The backend name of the preset applied to this device, if any. Usually presets/{uuid}.
   *  This is used for record-keeping only and has no effect on the sound of the device.
   */
  presetName?: string
  /**
   *  The "tone" frequency is the frequency above which the exciter will add distortion to the signal.
   *
   *
   * key | value
   * --- | ---
   * default | 3500
   * range | [20, 13000]*/
  toneFrequencyHz?: number
  /**
   *  The "power" factor controls how much distortion is added to the signal above the tone frequency.
   *
   *
   * key | value
   * --- | ---
   * default | 0.5
   * range | [0, 1]*/
  powerFactor?: number
  /**
   *  Controls the mix between the incoming and the distorted signal. 0 ("dry") means 0% distortion
   *  applied, 1 ("wet") means 100% distortion applied; values between mixes the two linearly.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]*/
  mix?: number
  /**
   *  Whether the device is active or not. When is_active=false, audio signal bypasses the device.
   *
   *
   * key | value
   * --- | ---
   * default | true*/
  isActive?: boolean
}

