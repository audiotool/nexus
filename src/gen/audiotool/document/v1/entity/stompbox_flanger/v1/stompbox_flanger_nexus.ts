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
 * key | `"stompboxFlanger"`
 * is |
 *
 *
 *  A flanger effect in the form of a stompbox.
 *
 *
 * @category Device Entities*/
export type StompboxFlanger = {
  /**
   *  The user-assigned name of this device.
   *
   *
   * key | value
   * --- | ---
   * default | `"Flanger"`*/
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
   *  Allows control of the Flanger's short delay.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 10]
   * is | {@link api.TargetType.AutomatableParameter}*/
  delayTimeMs: PrimitiveField<number, "mut">
  /**
   *  Allows control over how much of the processed signal is feed back into the effect.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  feedbackFactor: PrimitiveField<number, "mut">
  /**
   *  The frequency of the LFO modulation.
   *
   *
   * key | value
   * --- | ---
   * default | 0.13232197
   * range | [0.03999999910593033, 5]
   * is | {@link api.TargetType.AutomatableParameter}*/
  lfoFrequencyHz: PrimitiveField<number, "mut">
  /**
   *  The amount the LFO influences the delay_time_ms parameter.
   *
   *
   * key | value
   * --- | ---
   * default | 0.74039996
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  lfoModulationDepth: PrimitiveField<number, "mut">
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

export type StompboxFlangerConstructor = {
  /**
   *  The user-assigned name of this device.
   *
   *
   * key | value
   * --- | ---
   * default | `"Flanger"`*/
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
   *  Allows control of the Flanger's short delay.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 10]*/
  delayTimeMs?: number
  /**
   *  Allows control over how much of the processed signal is feed back into the effect.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  feedbackFactor?: number
  /**
   *  The frequency of the LFO modulation.
   *
   *
   * key | value
   * --- | ---
   * default | 0.13232197
   * range | [0.03999999910593033, 5]*/
  lfoFrequencyHz?: number
  /**
   *  The amount the LFO influences the delay_time_ms parameter.
   *
   *
   * key | value
   * --- | ---
   * default | 0.74039996
   * range | [0, 1]*/
  lfoModulationDepth?: number
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
  /**
   *  Whether the stompbox is active or not. When is_active=false, audio signal bypasses the device
   *
   *
   * key | value
   * --- | ---
   * default | true*/
  isActive?: boolean
}

