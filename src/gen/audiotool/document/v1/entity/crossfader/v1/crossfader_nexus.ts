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
 * key | `"crossfader"`
 * is |
 *
 *
 *  The crossfader is a tiny mixer with 2 input channels.
 *
 *
 * @category Device Entities*/
export type Crossfader = {
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
   *  The "master gain" crossfader. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  postGain: PrimitiveField<number, "mut">
  /**
   *  Determines how the crossfade blends between channel A & channel B.
   *  -1 is fully channel A, 0 is balanced, 1 is fully channel B.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  crossfade: PrimitiveField<number, "mut">
  /**
   *  Pans the signal to left/right. -1 is fully left, 0 is centered (unchanged), 1 is fully right.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  panning: PrimitiveField<number, "mut">
  /**
   *  The algorithm used to blend the two input channels.
   *  0: invalid
   *  1: Quadratic
   *  2: Center
   *  3: Linear
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 3]
   * is | {@link api.TargetType.AutomatableParameter}*/
  blendModeIndex: PrimitiveField<number, "mut">
  /**
   *  The first input channel (channel "A") of the crossfader.
   */
  channelA: NexusObject<CrossfaderChannel>
  /**
   *  The second input channel (channel "B") of the crossfader.
   */
  channelB: NexusObject<CrossfaderChannel>
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

export type CrossfaderConstructor = {
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
   *  The "master gain" crossfader. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]*/
  postGain?: number
  /**
   *  Determines how the crossfade blends between channel A & channel B.
   *  -1 is fully channel A, 0 is balanced, 1 is fully channel B.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]*/
  crossfade?: number
  /**
   *  Pans the signal to left/right. -1 is fully left, 0 is centered (unchanged), 1 is fully right.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]*/
  panning?: number
  /**
   *  The algorithm used to blend the two input channels.
   *  0: invalid
   *  1: Quadratic
   *  2: Center
   *  3: Linear
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 3]*/
  blendModeIndex?: number
  /**
   *  The first input channel (channel "A") of the crossfader.
   */
  channelA?: CrossfaderChannelConstructor
  /**
   *  The second input channel (channel "B") of the crossfader.
   */
  channelB?: CrossfaderChannelConstructor
}

/**
 *
 * key | value
 * --- | ---
 * type | object
 *
 *  data structure for a crossfader channel
 *
 *
 * @category Device Fields*/
export type CrossfaderChannel = {
  /**
   *  Pre-Gain of this input channel. Equivalent to a dB range of [-inf, 3.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1.4125380516052246]
   * is | {@link api.TargetType.AutomatableParameter}*/
  preGain: PrimitiveField<number, "mut">
  /**
   *  The cutoff frequency of the low EQ band of the channel.
   *
   *
   * key | value
   * --- | ---
   * default | 260
   * range | [20, 260]
   * is | {@link api.TargetType.AutomatableParameter}*/
  eqLowFrequencyHz: PrimitiveField<number, "mut">
  /**
   *  The gain of the low EQ band of the channel.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-24, 12]
   * is | {@link api.TargetType.AutomatableParameter}*/
  eqLowGainDb: PrimitiveField<number, "mut">
  /**
   *  Kill switch for low gain. If low_kill_enabled=true, the low gain is set to -24 dB.
   *
   *
   * key | value
   * --- | ---
   * default | false
   * is | {@link api.TargetType.AutomatableParameter}*/
  lowKillEnabled: PrimitiveField<boolean, "mut">
  /**
   *  The center frequency of the mid EQ band of the channel.
   *
   *
   * key | value
   * --- | ---
   * default | 1500
   * range | [260, 4200]
   * is | {@link api.TargetType.AutomatableParameter}*/
  eqMidFrequencyHz: PrimitiveField<number, "mut">
  /**
   *  The gain of the mid EQ band of the channel.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-24, 12]
   * is | {@link api.TargetType.AutomatableParameter}*/
  eqMidGainDb: PrimitiveField<number, "mut">
  /**
   *  Kill switch for mid gain. If mid_kill_enabled=true, the mid gain is set to -24 dB.
   *
   *
   * key | value
   * --- | ---
   * default | false
   * is | {@link api.TargetType.AutomatableParameter}*/
  midKillEnabled: PrimitiveField<boolean, "mut">
  /**
   *  The cutoff frequency of the high EQ band of the channel.
   *
   *
   * key | value
   * --- | ---
   * default | 4200
   * range | [4200, 14000]
   * is | {@link api.TargetType.AutomatableParameter}*/
  eqHighFrequencyHz: PrimitiveField<number, "mut">
  /**
   *  The gain of the high EQ band of the channel.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-24, 12]
   * is | {@link api.TargetType.AutomatableParameter}*/
  eqHighGainDb: PrimitiveField<number, "mut">
  /**
   *  Kill switch for high gain. If high_kill_enabled=true, the high gain is set to -24 dB.
   *
   *
   * key | value
   * --- | ---
   * default | false
   * is | {@link api.TargetType.AutomatableParameter}*/
  highKillEnabled: PrimitiveField<boolean, "mut">
  /**
   *  Signal Input
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioInput}*/
  audioInput: NexusObject<Empty>
}
/** @internal */

export type CrossfaderChannelConstructor = {
  /**
   *  Pre-Gain of this input channel. Equivalent to a dB range of [-inf, 3.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1.4125380516052246]*/
  preGain?: number
  /**
   *  The cutoff frequency of the low EQ band of the channel.
   *
   *
   * key | value
   * --- | ---
   * default | 260
   * range | [20, 260]*/
  eqLowFrequencyHz?: number
  /**
   *  The gain of the low EQ band of the channel.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-24, 12]*/
  eqLowGainDb?: number
  /**
   *  Kill switch for low gain. If low_kill_enabled=true, the low gain is set to -24 dB.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  lowKillEnabled?: boolean
  /**
   *  The center frequency of the mid EQ band of the channel.
   *
   *
   * key | value
   * --- | ---
   * default | 1500
   * range | [260, 4200]*/
  eqMidFrequencyHz?: number
  /**
   *  The gain of the mid EQ band of the channel.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-24, 12]*/
  eqMidGainDb?: number
  /**
   *  Kill switch for mid gain. If mid_kill_enabled=true, the mid gain is set to -24 dB.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  midKillEnabled?: boolean
  /**
   *  The cutoff frequency of the high EQ band of the channel.
   *
   *
   * key | value
   * --- | ---
   * default | 4200
   * range | [4200, 14000]*/
  eqHighFrequencyHz?: number
  /**
   *  The gain of the high EQ band of the channel.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-24, 12]*/
  eqHighGainDb?: number
  /**
   *  Kill switch for high gain. If high_kill_enabled=true, the high gain is set to -24 dB.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  highKillEnabled?: boolean
}

