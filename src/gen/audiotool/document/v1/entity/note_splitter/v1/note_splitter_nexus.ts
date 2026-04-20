// THIS FILE IS GENERATED - DO NOT EDIT
// Copyright 2026 Audiotool Inc.

import { ArrayField, PrimitiveField } from "@document/fields"
import { NexusObject } from "@document/object"
import { type Empty } from "@gen/document/v1/empty_nexus"

/**
 *
 * key | value
 * --- | ---
 * type | entity
 * key | `"noteSplitter"`
 * is | {@link api.TargetType.NoteTrackPlayer}
 *
 *
 *  The NoteSplitter device.
 *
 *  Sends all incoming notes to all of it's channels which have a note output.
 *  Each note output can have different note velocity modulation.
 *
 *
 * @category Device Entities*/
export type NoteSplitter = {
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
   *  Notes Input
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.NotesInput}*/
  notesInput: NexusObject<Empty>
  /**
   *  Three channels into which notes are split.
   */
  channels: ArrayField<NexusObject<NoteSplitterChannel>, 3>
}
/** @internal */

export type NoteSplitterConstructor = {
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
   *  Three channels into which notes are split.
   */
  channels?: NoteSplitterChannelConstructor[] & { length: 3 }
}

/**
 *
 * key | value
 * --- | ---
 * type | object
 *
 *  data structure for the NoteSplitter's channels
 *
 *
 * @category Device Fields*/
export type NoteSplitterChannel = {
  /**
   *  Notes output for this channel.
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.NotesOutput}*/
  notesOutput: NexusObject<Empty>
  /**
   *  Modulates the velocity of the notes:
   *  - range [-1, 0]: "overwrites" the velocity from 0-100% (maps to 0..127 in MIDI).
   *  - range [0, 1]: final velocity blends from x% to 100% based on note velocity.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  velocityModulation: PrimitiveField<number, "mut">
  /**
   *  Whether the channel sends notes to its output. If is_muted=true, no notes are forwarded.
   *
   *
   * key | value
   * --- | ---
   * default | false
   * is | {@link api.TargetType.AutomatableParameter}*/
  isMuted: PrimitiveField<boolean, "mut">
}
/** @internal */

export type NoteSplitterChannelConstructor = {
  /**
   *  Modulates the velocity of the notes:
   *  - range [-1, 0]: "overwrites" the velocity from 0-100% (maps to 0..127 in MIDI).
   *  - range [0, 1]: final velocity blends from x% to 100% based on note velocity.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]*/
  velocityModulation?: number
  /**
   *  Whether the channel sends notes to its output. If is_muted=true, no notes are forwarded.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  isMuted?: boolean
}

