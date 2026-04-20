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
 * key | `"gakki"`
 * is | {@link api.TargetType.NoteTrackPlayer}
 *
 *
 *  data structure for the Gakki soundfont player device
 *
 *
 * @category Device Entities*/
export type Gakki = {
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
   *  ID of the soundfont used by this Gakki device.
   */
  soundfontId: PrimitiveField<string, "mut">
  /**
   *  Gain factor that is applied to the output of the soundfont player. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 0.6000000238418579
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  gain: PrimitiveField<number, "mut">
  /**
   *  Notes Input
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.NotesInput}*/
  notesInput: NexusObject<Empty>
  /**
   *  Audio Output
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioOutput}*/
  audioOutput: NexusObject<Empty>
}
/** @internal */

export type GakkiConstructor = {
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
   *  ID of the soundfont used by this Gakki device.
   */
  soundfontId?: string
  /**
   *  Gain factor that is applied to the output of the soundfont player. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 0.6000000238418579
   * range | [0, 1]*/
  gain?: number
}

