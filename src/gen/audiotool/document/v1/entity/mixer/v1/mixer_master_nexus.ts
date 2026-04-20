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
 * key | `"mixerMaster"`
 * is |
 *
 *
 *  The master strip of the DAW. Audio that passes through this strip is audible, audio that doesn't
 *  pass through this strip is not audible (unless cuing is enabled).
 *
 *  The master can be placed on the desktop. In the DAW, it's represented as the "stagebox", which contains all audio sockets
 *  from the mixer so they can be connected to devices on the desktop. The position of the stagebox in the DAW
 *  is determined by the position_x and position_y fields.
 *
 *
 * @category Mixer Entities*/
export type MixerMaster = {
  /**
   *  X position of the stagebox in the DAW. The Stagebox represents the entire mixer on the desktop.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | full*/
  positionX: PrimitiveField<number, "mut">
  /**
   *  Y position of the stagebox in the DAW. The Stagebox represents the entire mixer on the desktop.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | full*/
  positionY: PrimitiveField<number, "mut">
  /**
   *  If this is true, the audio will bypass inserts. This is true automatically if both insert_output and insert_input are not connected.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  doBypassInserts: PrimitiveField<boolean, "mut">
  /**
   *  Insert leaving the strip. Represented on stage box.
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioOutput}*/
  insertOutput: NexusObject<Empty>
  /**
   *  Insert returning to the strip. Represented on stage box.
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioInput}*/
  insertInput: NexusObject<Empty>
  /**
   *  Panning of the entire project. -1 is fully left, 0 is centered (unchanged), 1 is fully right.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  panning: PrimitiveField<number, "mut">
  /**
   *  Gain right before the signal leaves the mixer, before the limiter is applied. Equivalent to a dB range of [-inf, 6.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1.9952620267868042]
   * is | {@link api.TargetType.AutomatableParameter}*/
  postGain: PrimitiveField<number, "mut">
  /**
   *  Whether the limited is enabled or not. The limiter reduces the volume of the output signal
   *  to 0dB by reducing the incoming signal if it exceeds this threshold in a smooth manner, otherwise
   *  it leaves the signal untouched.
   *
   *  Enabling the limiter incurs a global latency penalty of 20ms for the entire project
   *  because the limiter has to "look ahead" the signal to have smooth volume reduction.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  limiterEnabled: PrimitiveField<boolean, "mut">
  /**
   *  Mutes everything. Why? Why not.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  isMuted: PrimitiveField<boolean, "mut">
}
/** @internal */

export type MixerMasterConstructor = {
  /**
   *  X position of the stagebox in the DAW. The Stagebox represents the entire mixer on the desktop.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | full*/
  positionX?: number
  /**
   *  Y position of the stagebox in the DAW. The Stagebox represents the entire mixer on the desktop.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | full*/
  positionY?: number
  /**
   *  If this is true, the audio will bypass inserts. This is true automatically if both insert_output and insert_input are not connected.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  doBypassInserts?: boolean
  /**
   *  Panning of the entire project. -1 is fully left, 0 is centered (unchanged), 1 is fully right.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]*/
  panning?: number
  /**
   *  Gain right before the signal leaves the mixer, before the limiter is applied. Equivalent to a dB range of [-inf, 6.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1.9952620267868042]*/
  postGain?: number
  /**
   *  Whether the limited is enabled or not. The limiter reduces the volume of the output signal
   *  to 0dB by reducing the incoming signal if it exceeds this threshold in a smooth manner, otherwise
   *  it leaves the signal untouched.
   *
   *  Enabling the limiter incurs a global latency penalty of 20ms for the entire project
   *  because the limiter has to "look ahead" the signal to have smooth volume reduction.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  limiterEnabled?: boolean
  /**
   *  Mutes everything. Why? Why not.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  isMuted?: boolean
}

