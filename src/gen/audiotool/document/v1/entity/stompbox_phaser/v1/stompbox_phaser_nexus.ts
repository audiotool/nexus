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
 * key | `"stompboxPhaser"`
 * is |
 *
 *
 *  data structure for the stompbox phaser
 *
 *
 * @category Device Entities*/
export type StompboxPhaser = {
  /**
   *  The user-assigned name of this device.
   *
   *
   * key | value
   * --- | ---
   * default | `"Phaser"`*/
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
   *  Allow for a frequency range to be set for the effect. Only frequencies between the min and max will be affected.
   *
   *
   * key | value
   * --- | ---
   * default | 30
   * range | [30, 300]
   * is | {@link api.TargetType.AutomatableParameter}*/
  minFrequencyHz: PrimitiveField<number, "mut">
  /**
   *  Allow for a frequency range to be set for the effect. Only frequencies between the min and max will be affected.
   *
   *
   * key | value
   * --- | ---
   * default | 378.48438
   * range | [300, 8000]
   * is | {@link api.TargetType.AutomatableParameter}*/
  maxFrequencyHz: PrimitiveField<number, "mut">
  /**
   *  Defines how much of the processed signal is feed back into the effect.
   *
   *
   * key | value
   * --- | ---
   * default | 0.7291667
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  feedbackFactor: PrimitiveField<number, "mut">
  /**
   *  Allows adjustment of the speed of the phasing effect.
   *
   *
   * key | value
   * --- | ---
   * default | 0.36185876
   * range | [0.03999999910593033, 5]
   * is | {@link api.TargetType.AutomatableParameter}*/
  lfoFrequencyHz: PrimitiveField<number, "mut">
  /**
   *  Controls the mix between the incoming and the effect signal. 0 ("dry") means 0% effect
   *  applied, 1 ("wet") means 100% effect applied; values between mixes the two linearly.
   *
   *  Note: 100% here means maximum audible effect, unlike some physical phasers.
   *
   *
   * key | value
   * --- | ---
   * default | 0.26950002
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  mix: PrimitiveField<number, "mut">
  /**
   *  Whether the stompbox is active or not. When is_active=false, audio signal bypasses the device.
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

export type StompboxPhaserConstructor = {
  /**
   *  The user-assigned name of this device.
   *
   *
   * key | value
   * --- | ---
   * default | `"Phaser"`*/
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
   *  Allow for a frequency range to be set for the effect. Only frequencies between the min and max will be affected.
   *
   *
   * key | value
   * --- | ---
   * default | 30
   * range | [30, 300]*/
  minFrequencyHz?: number
  /**
   *  Allow for a frequency range to be set for the effect. Only frequencies between the min and max will be affected.
   *
   *
   * key | value
   * --- | ---
   * default | 378.48438
   * range | [300, 8000]*/
  maxFrequencyHz?: number
  /**
   *  Defines how much of the processed signal is feed back into the effect.
   *
   *
   * key | value
   * --- | ---
   * default | 0.7291667
   * range | [0, 1]*/
  feedbackFactor?: number
  /**
   *  Allows adjustment of the speed of the phasing effect.
   *
   *
   * key | value
   * --- | ---
   * default | 0.36185876
   * range | [0.03999999910593033, 5]*/
  lfoFrequencyHz?: number
  /**
   *  Controls the mix between the incoming and the effect signal. 0 ("dry") means 0% effect
   *  applied, 1 ("wet") means 100% effect applied; values between mixes the two linearly.
   *
   *  Note: 100% here means maximum audible effect, unlike some physical phasers.
   *
   *
   * key | value
   * --- | ---
   * default | 0.26950002
   * range | [0, 1]*/
  mix?: number
  /**
   *  Whether the stompbox is active or not. When is_active=false, audio signal bypasses the device.
   *
   *
   * key | value
   * --- | ---
   * default | true*/
  isActive?: boolean
}

