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
 * key | `"genericVst3PluginBeta"`
 * is | {@link api.TargetType.NoteTrackPlayer}
 *
 *
 *  Data structure representing a generic VST3 plugin. This plugin only runs
 *  when connected to the booster.
 *
 *  All automatable parameters are added below as float values. However, they're
 *  set to `immutable`, because the plugin state is not actually synced through
 *  these parameters; they only exist to be able to connect automation tracks.
 *
 *  The plugin state is instead synced through the `state` field below,
 *  containing an opaque binary blob. Note that the engine on its own doesn't
 *  read the `state` field, it has to be passed in manually (this is
 *  automatically managed in the DAW)
 *
 *
 * @category Utility Entities*/
export type GenericVst3PluginBeta = {
  /**
   *  The user-assigned name of this device.
   */
  displayName: PrimitiveField<string, "mut">
  /**
   *  The path to the plugin to load
   */
  pluginPath: PrimitiveField<string, "mut">
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
   *  Notes Input
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.NotesInput}*/
  notesInput: NexusObject<Empty>
  /**
   *  The VST state, with opaque content only understandable by
   *  the plugin. Contains all parameters also part of this message, which is why
   *  those are marked as immutable.
   *
   *  If the state cannot be read by the Spitfire LABS plugin, this will keep
   *  working with existing values. The DAW will likely overwrite it soon with
   *  valid values.
   *
   *  If the state contains a sample pack that the user doesn't have installed,
   *  the user won't hear any sound (the plugin UI shows some error), otherwise
   *  it will continue working as expected.
   */
  state: PrimitiveField<boolean, "mut">
  /**
   *  Whether the device is active  or not. When is_active=false, audio signal bypasses the device
   *
   *
   * key | value
   * --- | ---
   * default | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  isActive: PrimitiveField<boolean, "mut">
}
/** @internal */

export type GenericVst3PluginBetaConstructor = {
  /**
   *  The user-assigned name of this device.
   */
  displayName?: string
  /**
   *  The path to the plugin to load
   */
  pluginPath?: string
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
   *  The VST state, with opaque content only understandable by
   *  the plugin. Contains all parameters also part of this message, which is why
   *  those are marked as immutable.
   *
   *  If the state cannot be read by the Spitfire LABS plugin, this will keep
   *  working with existing values. The DAW will likely overwrite it soon with
   *  valid values.
   *
   *  If the state contains a sample pack that the user doesn't have installed,
   *  the user won't hear any sound (the plugin UI shows some error), otherwise
   *  it will continue working as expected.
   */
  state?: boolean
  /**
   *  Whether the device is active  or not. When is_active=false, audio signal bypasses the device
   *
   *
   * key | value
   * --- | ---
   * default | true*/
  isActive?: boolean
}

