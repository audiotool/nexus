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
 * key | `"fmxDevice"`
 * is | {@link api.TargetType.NoteTrackPlayer}
 *
 *
 *  A device that hosts a `.fmx` plugin. The DAW shows it as "NXS Plugin".
 *
 *  The plugin itself is not stored in the document; `plugin_asset_name`
 *  references it. The plugin contains a WebAssembly DSP module that the engine
 *  runs, and an HTML interface that the DAW shows on the device.
 *
 *  The device always has 1024 automatable parameters, 2 audio inputs (main and
 *  side chain), 1 notes input, and 1 audio output. What the DAW shows to the
 *  user is derived from the plugin metadata at runtime. For example, if a
 *  plugin declares 3 parameters, only the 3 slots with matching ids are shown
 *  to the user and used by the audio engine.
 *
 *
 * @category Device Entities*/
export type FmxDevice = {
  /**
   *  The user-assigned name of this device.
   *
   *
   * key | value
   * --- | ---
   * default | `"NXS"`*/
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
   *  Main audio input, passed to every plugin.
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioInput}*/
  audioInput: NexusObject<Empty>
  /**
   *  Side-chain input, passed to every plugin.
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioInput}*/
  sideChainInput: NexusObject<Empty>
  /**
   *  Notes input, passed to plugins that export the note functions.
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.NotesInput}*/
  notesInput: NexusObject<Empty>
  /**
   *  Audio output.
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioOutput}*/
  audioOutput: NexusObject<Empty>
  /**
   *  Whether the device is active or not. When is_active=false, the plugin is
   *  not run: the main audio input bypasses an effect, and an instrument is
   *  silent.
   *
   *
   * key | value
   * --- | ---
   * default | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  isActive: PrimitiveField<boolean, "mut">
  /**
   *  The plugin file hosted by this device. One of:
   *  - `pluginAssets/{uuid}`: the backend plugin asset (resource type
   *    `plugin.api.audiotool.com/PluginAsset`).
   *  - `localPluginAssets/{uuid}`: a development device whose file, if any, was
   *    loaded locally and not uploaded. The client that creates the device
   *    picks a fresh, opaque uuid, and may attach the bytes of one file to it
   *    later. A value therefore never identifies more than one file. Such a
   *    device only works on the client that loaded the file.
   *  The field is immutable: loading a different file into a device that
   *  already has one, or uploading, replaces the device.
   *
   *
   * key | value
   * --- | ---
   * default | `"localPluginAssets/00000000-0000-4000-8000-000000000000"`
   * immutable | true*/
  pluginAssetName: PrimitiveField<string, "immut">
  /**
   *  The plugin parameters, normalized to [0, 1] with the curve declared in the
   *  plugin metadata. Slot i holds the parameter whose `metadata.params[].id`
   *  is i. Slots without a matching parameter id are unused.
   *
   *
   * key | value
   * --- | ---
   * default | 0 (every element)
   * range | [0, 1]
   * element is | {@link api.TargetType.AutomatableParameter}*/
  parameters: ArrayField<PrimitiveField<number, "mut">, 1024>
  /**
   *  Opaque plugin custom state (e.g. the JSON passed to vstSetCustomState),
   *  stored untouched. Empty if the plugin has no custom state. Not automatable.
   *
   *
   * key | value
   * --- | ---
   * default | empty*/
  pluginState: PrimitiveField<Uint8Array, "mut">
}
/** @internal */

export type FmxDeviceConstructor = {
  /**
   *  The user-assigned name of this device.
   *
   *
   * key | value
   * --- | ---
   * default | `"NXS"`*/
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
   *  Whether the device is active or not. When is_active=false, the plugin is
   *  not run: the main audio input bypasses an effect, and an instrument is
   *  silent.
   *
   *
   * key | value
   * --- | ---
   * default | true*/
  isActive?: boolean
  /**
   *  The plugin file hosted by this device. One of:
   *  - `pluginAssets/{uuid}`: the backend plugin asset (resource type
   *    `plugin.api.audiotool.com/PluginAsset`).
   *  - `localPluginAssets/{uuid}`: a development device whose file, if any, was
   *    loaded locally and not uploaded. The client that creates the device
   *    picks a fresh, opaque uuid, and may attach the bytes of one file to it
   *    later. A value therefore never identifies more than one file. Such a
   *    device only works on the client that loaded the file.
   *  The field is immutable: loading a different file into a device that
   *  already has one, or uploading, replaces the device.
   *
   *
   * key | value
   * --- | ---
   * default | `"localPluginAssets/00000000-0000-4000-8000-000000000000"`
   * immutable | true*/
  pluginAssetName?: string
  /**
   *  The plugin parameters, normalized to [0, 1] with the curve declared in the
   *  plugin metadata. Slot i holds the parameter whose `metadata.params[].id`
   *  is i. Slots without a matching parameter id are unused.
   *
   *
   * key | value
   * --- | ---
   * default | 0 (every element)
   * range | [0, 1]*/
  parameters?: number[] & { length: 1024 }
  /**
   *  Opaque plugin custom state (e.g. the JSON passed to vstSetCustomState),
   *  stored untouched. Empty if the plugin has no custom state. Not automatable.
   *
   *
   * key | value
   * --- | ---
   * default | empty*/
  pluginState?: Uint8Array
}

