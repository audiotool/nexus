// THIS FILE IS GENERATED - DO NOT EDIT
// Copyright 2025 Audiotool Inc.

import { PrimitiveField } from "@document/fields"
import { type NexusLocation } from "@document/location"

/**
 *
 * key | value
 * --- | ---
 * type | entity
 * key | `"desktopNoteCable"`
 * is |
 *
 *
 *  A cable connecting a note output to a note input on the desktop.
 *
 *
 * @category Utility Entities*/
export type DesktopNoteCable = {
  /**
   *  Pointer to a note output from which notes are transported.
   *
   *
   * key | value
   * --- | ---
   * default | no default, required
   * required | true
   * targets | {@link api.TargetType.NotesOutput}, meaning one of: <br />{@link entities.MatrixArpeggiator.notesOutput}, <br />{@link entities.NoteSplitterChannel.notesOutput}, <br />{@link entities.Tonematrix.noteOutput}*/
  fromSocket: PrimitiveField<NexusLocation, "mut">
  /**
   *  Pointer to a note input to which notes are transported.
   *
   *
   * key | value
   * --- | ---
   * default | no default, required
   * required | true
   * targets | {@link api.TargetType.NotesInput}, meaning one of: <br />{@link entities.Beatbox8.notesInput}, <br />{@link entities.Beatbox9.notesInput}, <br />{@link entities.Gakki.notesInput}, <br />{@link entities.Heisenberg.notesInput}, <br />{@link entities.Machiniste.notesInput}, <br />{@link entities.MatrixArpeggiator.notesInput}, <br />{@link entities.NoteSplitter.notesInput}, <br />{@link entities.Pulverisateur.notesInput}, <br />{@link entities.Space.notesInput}, <br />{@link entities.SpitfireLabsVst3Plugin.notesInput}*/
  toSocket: PrimitiveField<NexusLocation, "mut">
  /**
   *  Index of the color. The meaning of the color index is implementation-specific.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 41]*/
  colorIndex: PrimitiveField<number, "mut">
}
/** @internal */

export type DesktopNoteCableConstructor = {
  /**
   *  Pointer to a note output from which notes are transported.
   *
   *
   * key | value
   * --- | ---
   * default | no default, required
   * required | true*/
  fromSocket: NexusLocation
  /**
   *  Pointer to a note input to which notes are transported.
   *
   *
   * key | value
   * --- | ---
   * default | no default, required
   * required | true*/
  toSocket: NexusLocation
  /**
   *  Index of the color. The meaning of the color index is implementation-specific.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 41]*/
  colorIndex?: number
}

