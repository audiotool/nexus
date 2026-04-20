// THIS FILE IS GENERATED - DO NOT EDIT
// Copyright 2026 Audiotool Inc.

import { ArrayField, PrimitiveField } from "@document/fields"
import { type NexusLocation } from "@document/location"
import { NexusObject } from "@document/object"
import { type Empty } from "@gen/document/v1/empty_nexus"

/**
 *
 * key | value
 * --- | ---
 * type | entity
 * key | `"rasselbock"`
 * is | {@link api.TargetType.PatternTrackPlayer}
 *
 *
 *  The Rasselbock is a multi-purpose effects device that has patterns
 *  that can turn different modules on or off over time.
 *
 *  The patterns can toggle a variety of effects, plus a few "channels"
 *  that can be toggled  audio to a different output if enabled.
 *
 *
 * @category Device Entities*/
export type Rasselbock = {
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
   *  Empty fields which RasselbockPatterns can point to. At most one pattern
   *  can point to a specific element in this list.
   *
   *
   * key | value
   * --- | ---
   * element is | {@link api.TargetType.RasselbockPatternSlot}*/
  patternSlots: ArrayField<NexusObject<Empty>, 32>
  /**
   *  The index of the currently selected pattern. Determines which pattern the Rasselbock
   *  currently plays back, unless a pattern track is connected to it.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 31]*/
  patternIndex: PrimitiveField<number, "mut">
  /**
   *  Each rasselbock channel's configuration. Channels configure the re-routing
   *  of audio to a different output.
   */
  channelConfigs: ArrayField<NexusObject<RasselbockChannel>, 5>
  /**
   *  The shuffle effect's configuration.
   */
  shuffleConfig: NexusObject<RasselbockShuffle>
  /**
   *  The speed effect's configuration.
   */
  speedConfig: NexusObject<RasselbockSpeed>
  /**
   *  The stop effect's configuration.
   */
  stopConfig: NexusObject<RasselbockStop>
  /**
   *  The gate effect's configuration.
   */
  gateConfig: NexusObject<RasselbockGate>
  /**
   *  The stutter effect's configuration.
   */
  stutterConfig: NexusObject<RasselbockStutter>
  /**
   *  The scratch effect's configuration.
   */
  scratchConfig: NexusObject<RasselbockScratch>
  /**
   *  The reverse effect's configuration.
   */
  reverseConfig: NexusObject<RasselbockReverse>
  /**
   *  Single Input.
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioInput}*/
  audioInput: NexusObject<Empty>
  /**
   *  The master output that doesn't go through any channels
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioOutput}*/
  masterOutput: NexusObject<Empty>
  /**
   *  Whether the device is active or not. When is_active=false,
   *  audio signals bypass the effects and go directly to the main output.
   *  The secondary channels are quiet.
   *
   *
   * key | value
   * --- | ---
   * default | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  isActive: PrimitiveField<boolean, "mut">
}
/** @internal */

export type RasselbockConstructor = {
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
   *  The index of the currently selected pattern. Determines which pattern the Rasselbock
   *  currently plays back, unless a pattern track is connected to it.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 31]*/
  patternIndex?: number
  /**
   *  Each rasselbock channel's configuration. Channels configure the re-routing
   *  of audio to a different output.
   */
  channelConfigs?: RasselbockChannelConstructor[] & { length: 5 }
  /**
   *  The shuffle effect's configuration.
   */
  shuffleConfig?: RasselbockShuffleConstructor
  /**
   *  The speed effect's configuration.
   */
  speedConfig?: RasselbockSpeedConstructor
  /**
   *  The stop effect's configuration.
   */
  stopConfig?: RasselbockStopConstructor
  /**
   *  The gate effect's configuration.
   */
  gateConfig?: RasselbockGateConstructor
  /**
   *  The stutter effect's configuration.
   */
  stutterConfig?: RasselbockStutterConstructor
  /**
   *  The scratch effect's configuration.
   */
  scratchConfig?: RasselbockScratchConstructor
  /**
   *  The reverse effect's configuration.
   */
  reverseConfig?: RasselbockReverseConstructor
  /**
   *  Whether the device is active or not. When is_active=false,
   *  audio signals bypass the effects and go directly to the main output.
   *  The secondary channels are quiet.
   *
   *
   * key | value
   * --- | ---
   * default | true*/
  isActive?: boolean
}

/**
 *
 * key | value
 * --- | ---
 * type | entity
 * key | `"rasselbockPattern"`
 * is |
 *
 *
 *  A Rasselbock pattern, which turns effects and channels on or off
 *  for every pattern step.
 *
 *
 * @category Device Entities*/
export type RasselbockPattern = {
  /**
   *  The pattern slot in the Rasselbock that this pattern belongs to.
   *
   *
   * key | value
   * --- | ---
   * default | no default, required
   * required | true
   * targets | {@link api.TargetType.RasselbockPatternSlot}, meaning one of: <br />{@link entities.Rasselbock.patternSlots}
   * immutable | true*/
  slot: PrimitiveField<NexusLocation, "immut">
  /**
   *  Length of the pattern in steps. One step is always 1/64th of a semibreve long.
   *
   *
   * key | value
   * --- | ---
   * default | 16
   * range | [1, 64]*/
  length: PrimitiveField<number, "mut">
  /**
   *  Store of the channel pattern splitting the audio to secondary audio outputs.
   */
  channelPatterns: ArrayField<NexusObject<RasselbockRowPattern>, 5>
  /**
   *  This list defines the order in which the effects are applied in this pattern.
   *  The i-th element defines the "magnitude" of that effect. The audio engine orders
   *  the list in magnitudes, and takes the original indices as orders.
   *
   *  - Example:         [0.5, 0.2, 10]
   *  - Sorted to:       [0.2, 0.5, 10]
   *  - => Effect order: [  1,   0,  2]
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | full*/
  effectOrder: ArrayField<PrimitiveField<number, "mut">, 7>
  /**
   *  Storage of the step pattern of each effect row. The order of effects is independent of effect_order
   *  as follows:
   *  * 0: Shuffle
   *  * 1: Speed
   *  * 2: Stop
   *  * 3: Gate
   *  * 4: Stutter
   *  * 5: Scratch
   *  * 6: Reverse
   */
  effectPatterns: ArrayField<NexusObject<RasselbockRowPattern>, 7>
  /**
   *  Every pattern can have a groove applied individually.
   *
   *
   * key | value
   * --- | ---
   * default | empty location
   * required | false
   * targets | {@link api.TargetType.Groove}, meaning one of: <br />{@link entities.Groove}*/
  groove: PrimitiveField<NexusLocation, "mut">
}
/** @internal */

export type RasselbockPatternConstructor = {
  /**
   *  The pattern slot in the Rasselbock that this pattern belongs to.
   *
   *
   * key | value
   * --- | ---
   * default | no default, required
   * required | true
   * immutable | true*/
  slot: NexusLocation
  /**
   *  Length of the pattern in steps. One step is always 1/64th of a semibreve long.
   *
   *
   * key | value
   * --- | ---
   * default | 16
   * range | [1, 64]*/
  length?: number
  /**
   *  Store of the channel pattern splitting the audio to secondary audio outputs.
   */
  channelPatterns?: RasselbockRowPatternConstructor[] & { length: 5 }
  /**
   *  This list defines the order in which the effects are applied in this pattern.
   *  The i-th element defines the "magnitude" of that effect. The audio engine orders
   *  the list in magnitudes, and takes the original indices as orders.
   *
   *  - Example:         [0.5, 0.2, 10]
   *  - Sorted to:       [0.2, 0.5, 10]
   *  - => Effect order: [  1,   0,  2]
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | full*/
  effectOrder?: number[] & { length: 7 }
  /**
   *  Storage of the step pattern of each effect row. The order of effects is independent of effect_order
   *  as follows:
   *  * 0: Shuffle
   *  * 1: Speed
   *  * 2: Stop
   *  * 3: Gate
   *  * 4: Stutter
   *  * 5: Scratch
   *  * 6: Reverse
   */
  effectPatterns?: RasselbockRowPatternConstructor[] & { length: 7 }
  /**
   *  Every pattern can have a groove applied individually.
   *
   *
   * key | value
   * --- | ---
   * default | empty location
   * required | false*/
  groove?: NexusLocation
}

/**
 *
 * key | value
 * --- | ---
 * type | object
 *
 *  Holds the state of a pattern for a single channel or effect.
 *
 *
 * @category Device Fields*/
export type RasselbockRowPattern = {
  /**
   *  A pattern is made up of 256 steps, each representing 1/64th of a semibreve.
   */
  steps: ArrayField<NexusObject<RasselbockStep>, 256>
}
/** @internal */

export type RasselbockRowPatternConstructor = {
  /**
   *  A pattern is made up of 256 steps, each representing 1/64th of a semibreve.
   */
  steps?: RasselbockStepConstructor[] & { length: 256 }
}

/**
 *
 * key | value
 * --- | ---
 * type | object
 *
 *  Holds the state for an individual pattern step. Visually/acoustically,
 *  a step can have more than 1 1/64th of a duration. Steps like these
 *  are represented as multiple consecutive steps that each have is_on=true
 *  and is_end=false. Multiple consecutive steps with is_on=true and is_end=true
 *  result in individual consecutive 1/64th-long steps.
 *
 *
 * @category Device Fields*/
export type RasselbockStep = {
  /**
   *  whether the step is on.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  isOn: PrimitiveField<boolean, "mut">
  /**
   *  whether the step is an end of a region (multiple steps connected)
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  isEnd: PrimitiveField<boolean, "mut">
}
/** @internal */

export type RasselbockStepConstructor = {
  /**
   *  whether the step is on.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  isOn?: boolean
  /**
   *  whether the step is an end of a region (multiple steps connected)
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  isEnd?: boolean
}

/**
 *
 * key | value
 * --- | ---
 * type | object
 *
 *  Holds the modulation and output socket of an individual channel.
 *
 *  A channel is a row that corresponds to a secondary output socket.
 *  Patterns on that row turn the output socket on or off; if on,
 *  the output socket receives the audio of the rasselbock after
 *  all effects have been applied. If no effect is active for the current step,
 *  the plain input signal is sent to the output.
 *
 *
 * @category Device Fields*/
export type RasselbockChannel = {
  /**
   *  Output gain of this channel. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  gain: PrimitiveField<number, "mut">
  /**
   *  Panning of the channel. -1 is fully left, 0 is centered (unchanged), 1 is fully right.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  panning: PrimitiveField<number, "mut">
  /**
   *  Controls the mix between the incoming and the effect signal. 0 ("dry") means 0% effect
   *  applied, 1 ("wet") means 100% effect applied; values between mixes the two linearly.
   *
   *  The exact mixing is determined by the
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  mix: PrimitiveField<number, "mut">
  /**
   *  How the dry signal is mixed with the effect signal according to the mix parameter:
   *  0: invalid
   *  1: linear       the output is slightly quieter if mix factor is 0.5
   *  2: equal-power  the output is equal when the mix factor is 0.5
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 2]
   * is | {@link api.TargetType.AutomatableParameter}*/
  mixMode: PrimitiveField<number, "mut">
  /**
   *  If d=true, the audio output of this channel is muted.
   *
   *
   * key | value
   * --- | ---
   * default | false
   * is | {@link api.TargetType.AutomatableParameter}*/
  isMuted: PrimitiveField<boolean, "mut">
  /**
   *  is_soloed=true mutes all channels except those that have is_soloed=true.
   *
   *
   * key | value
   * --- | ---
   * default | false
   * is | {@link api.TargetType.AutomatableParameter}*/
  isSoloed: PrimitiveField<boolean, "mut">
  /**
   *  Individual channel output
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioOutput}*/
  audioOutput: NexusObject<Empty>
}
/** @internal */

export type RasselbockChannelConstructor = {
  /**
   *  Output gain of this channel. Equivalent to a dB range of [-inf, 0.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]*/
  gain?: number
  /**
   *  Panning of the channel. -1 is fully left, 0 is centered (unchanged), 1 is fully right.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]*/
  panning?: number
  /**
   *  Controls the mix between the incoming and the effect signal. 0 ("dry") means 0% effect
   *  applied, 1 ("wet") means 100% effect applied; values between mixes the two linearly.
   *
   *  The exact mixing is determined by the
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]*/
  mix?: number
  /**
   *  How the dry signal is mixed with the effect signal according to the mix parameter:
   *  0: invalid
   *  1: linear       the output is slightly quieter if mix factor is 0.5
   *  2: equal-power  the output is equal when the mix factor is 0.5
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 2]*/
  mixMode?: number
  /**
   *  If d=true, the audio output of this channel is muted.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  isMuted?: boolean
  /**
   *  is_soloed=true mutes all channels except those that have is_soloed=true.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  isSoloed?: boolean
}

/**
 *
 * key | value
 * --- | ---
 * type | object
 *
 *  Holds the configuration for the rasselbock shuffle effect.
 *
 *  The shuffle effect writes all incoming signal on a delay line, and plays
 *  the delay line back in segments (sized by interval_index) at random positions quantized by the
 *  interval_index parameter.
 *
 *  The delay line is cleared and built up from scratch every time a step starts, and the random segment
 *  is only picked from the already written to part of the delay line. This means the first
 *  interval heard when a step starts will always be the incoming signal, and the longer the step lasts,
 *  the more random the audio will become.
 *
 *
 * @category Device Fields*/
export type RasselbockShuffle = {
  /**
   *  The size of the interval picked randomly from the delay line.
   *  - 0:  invalid
   *  - 1:  1/64 bars
   *  - 2:  1/32 bars
   *  - 3:  1/16 bars
   *  - 4:  1/8  bars
   *
   *
   * key | value
   * --- | ---
   * default | 3
   * range | [1, 4]
   * is | {@link api.TargetType.AutomatableParameter}*/
  intervalIndex: PrimitiveField<number, "mut">
  /**
   *  The seed for the random number generator. Determines the order in which the intervals are picked.
   *
   *
   * key | value
   * --- | ---
   * default | 16777215
   * range | [65535, 16777215]
   * is | {@link api.TargetType.AutomatableParameter}*/
  seed: PrimitiveField<number, "mut">
  /**
   *  If is_muted=true, this effect is bypassed.
   *
   *
   * key | value
   * --- | ---
   * default | false
   * is | {@link api.TargetType.AutomatableParameter}*/
  isMuted: PrimitiveField<boolean, "mut">
  /**
   *  If is_soloed=true, effects that don't have is_soloed=true are bypassed.
   *
   *
   * key | value
   * --- | ---
   * default | false
   * is | {@link api.TargetType.AutomatableParameter}*/
  isSoloed: PrimitiveField<boolean, "mut">
}
/** @internal */

export type RasselbockShuffleConstructor = {
  /**
   *  The size of the interval picked randomly from the delay line.
   *  - 0:  invalid
   *  - 1:  1/64 bars
   *  - 2:  1/32 bars
   *  - 3:  1/16 bars
   *  - 4:  1/8  bars
   *
   *
   * key | value
   * --- | ---
   * default | 3
   * range | [1, 4]*/
  intervalIndex?: number
  /**
   *  The seed for the random number generator. Determines the order in which the intervals are picked.
   *
   *
   * key | value
   * --- | ---
   * default | 16777215
   * range | [65535, 16777215]*/
  seed?: number
  /**
   *  If is_muted=true, this effect is bypassed.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  isMuted?: boolean
  /**
   *  If is_soloed=true, effects that don't have is_soloed=true are bypassed.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  isSoloed?: boolean
}

/**
 *
 * key | value
 * --- | ---
 * type | object
 *
 *  The configuration for the rasselbock speed effect.
 *  The speed effect writes the incoming signal to a delay line, and plays it back at a slower speed.
 *  When a step starts, the delay line is cleared and started fresh.
 *
 *
 * @category Device Fields*/
export type RasselbockSpeed = {
  /**
   *  The speed of the played back audio. 1/2 means half the speed compared to the incoming signal.
   *  - 0:  invalid
   *  - 1:  1/16
   *  - 2:  1/8
   *  - 3:  1/6
   *  - 4:  1/4
   *  - 5:  1/3
   *  - 6:  1/2
   *  - 7:  2/3
   *  - 8:  3/4
   *
   *
   * key | value
   * --- | ---
   * default | 6
   * range | [1, 8]
   * is | {@link api.TargetType.AutomatableParameter}*/
  speedRatioIndex: PrimitiveField<number, "mut">
  /**
   *  If is_muted=true, this effect is bypassed.
   *
   *
   * key | value
   * --- | ---
   * default | false
   * is | {@link api.TargetType.AutomatableParameter}*/
  isMuted: PrimitiveField<boolean, "mut">
  /**
   *  If is_soloed=true, effects that don't have is_soloed=true are bypassed.
   *
   *
   * key | value
   * --- | ---
   * default | false
   * is | {@link api.TargetType.AutomatableParameter}*/
  isSoloed: PrimitiveField<boolean, "mut">
}
/** @internal */

export type RasselbockSpeedConstructor = {
  /**
   *  The speed of the played back audio. 1/2 means half the speed compared to the incoming signal.
   *  - 0:  invalid
   *  - 1:  1/16
   *  - 2:  1/8
   *  - 3:  1/6
   *  - 4:  1/4
   *  - 5:  1/3
   *  - 6:  1/2
   *  - 7:  2/3
   *  - 8:  3/4
   *
   *
   * key | value
   * --- | ---
   * default | 6
   * range | [1, 8]*/
  speedRatioIndex?: number
  /**
   *  If is_muted=true, this effect is bypassed.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  isMuted?: boolean
  /**
   *  If is_soloed=true, effects that don't have is_soloed=true are bypassed.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  isSoloed?: boolean
}

/**
 *
 * key | value
 * --- | ---
 * type | object
 *
 *  The configuration for the rasselbock stop effect.
 *  The stop effect emulates the effect of a stop button on a turntable.
 *
 *  The stop effect writes the incoming signal to a delay line, which is then played back
 *  at the normal speed when the step starts, and gradually slows down as the step progresses.
 *  When a step starts, the delay line is cleared, the new incoming signal is written to it,
 *  and the speed is reset to the normal speed, to slow down again.
 *
 *
 * @category Device Fields*/
export type RasselbockStop = {
  /**
   *  How long it takes for the audio to come to a stop.
   *  - 0:  invalid
   *  - 1:  1/64 bars
   *  - 2:  1/32 bars
   *  - 3:  1/16 bars
   *  - 4:  1/8  bars
   *  - 5:  1/4  bars
   *  - 6:  1/2  bars
   *  - 7:  1/1  bars
   *
   *
   * key | value
   * --- | ---
   * default | 5
   * range | [1, 7]
   * is | {@link api.TargetType.AutomatableParameter}*/
  durationIndex: PrimitiveField<number, "mut">
  /**
   *  If does_spinback=true, the audio will ramp back to the normal speed after the stop, gradually
   *  such that the original speed is reached at the end of the step.
   *
   *
   * key | value
   * --- | ---
   * default | false
   * is | {@link api.TargetType.AutomatableParameter}*/
  doesSpinback: PrimitiveField<boolean, "mut">
  /**
   *  If is_muted=true, this effect is bypassed.
   *
   *
   * key | value
   * --- | ---
   * default | false
   * is | {@link api.TargetType.AutomatableParameter}*/
  isMuted: PrimitiveField<boolean, "mut">
  /**
   *  If is_soloed=true, effects that don't have is_soloed=true are bypassed.
   *
   *
   * key | value
   * --- | ---
   * default | false
   * is | {@link api.TargetType.AutomatableParameter}*/
  isSoloed: PrimitiveField<boolean, "mut">
}
/** @internal */

export type RasselbockStopConstructor = {
  /**
   *  How long it takes for the audio to come to a stop.
   *  - 0:  invalid
   *  - 1:  1/64 bars
   *  - 2:  1/32 bars
   *  - 3:  1/16 bars
   *  - 4:  1/8  bars
   *  - 5:  1/4  bars
   *  - 6:  1/2  bars
   *  - 7:  1/1  bars
   *
   *
   * key | value
   * --- | ---
   * default | 5
   * range | [1, 7]*/
  durationIndex?: number
  /**
   *  If does_spinback=true, the audio will ramp back to the normal speed after the stop, gradually
   *  such that the original speed is reached at the end of the step.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  doesSpinback?: boolean
  /**
   *  If is_muted=true, this effect is bypassed.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  isMuted?: boolean
  /**
   *  If is_soloed=true, effects that don't have is_soloed=true are bypassed.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  isSoloed?: boolean
}

/**
 *
 * key | value
 * --- | ---
 * type | object
 *
 *  The configuration for the rasselbock gate effect.
 *  The gate effect "gates" the audio (meaning, turns it on and off) in intervals
 *  defined by the interval_duration_index parameter.
 *
 *
 * @category Device Fields*/
export type RasselbockGate = {
  /**
   *  The duration of the interval during which the audio is turned on and off.
   *  0:  invalid
   *  1:  1/64 bars
   *  2:  1/32 bars
   *  3:  1/16 bars
   *  4:  1/8  bars
   *  5:  1/4  bars
   *  6:  1/2  bars
   *  7:  1/1  bars
   *
   *
   * key | value
   * --- | ---
   * default | 5
   * range | [1, 8]
   * is | {@link api.TargetType.AutomatableParameter}*/
  intervalDurationIndex: PrimitiveField<number, "mut">
  /**
   *  The percentage within the interval during which the audio is turned on.
   *
   *
   * key | value
   * --- | ---
   * default | 0.5
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  durationFactor: PrimitiveField<number, "mut">
  /**
   *  If is_muted=true, this effect is bypassed.
   *
   *
   * key | value
   * --- | ---
   * default | false
   * is | {@link api.TargetType.AutomatableParameter}*/
  isMuted: PrimitiveField<boolean, "mut">
  /**
   *  If is_soloed=true, effects that don't have is_soloed=true are bypassed.
   *
   *
   * key | value
   * --- | ---
   * default | false
   * is | {@link api.TargetType.AutomatableParameter}*/
  isSoloed: PrimitiveField<boolean, "mut">
}
/** @internal */

export type RasselbockGateConstructor = {
  /**
   *  The duration of the interval during which the audio is turned on and off.
   *  0:  invalid
   *  1:  1/64 bars
   *  2:  1/32 bars
   *  3:  1/16 bars
   *  4:  1/8  bars
   *  5:  1/4  bars
   *  6:  1/2  bars
   *  7:  1/1  bars
   *
   *
   * key | value
   * --- | ---
   * default | 5
   * range | [1, 8]*/
  intervalDurationIndex?: number
  /**
   *  The percentage within the interval during which the audio is turned on.
   *
   *
   * key | value
   * --- | ---
   * default | 0.5
   * range | [0, 1]*/
  durationFactor?: number
  /**
   *  If is_muted=true, this effect is bypassed.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  isMuted?: boolean
  /**
   *  If is_soloed=true, effects that don't have is_soloed=true are bypassed.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  isSoloed?: boolean
}

/**
 *
 * key | value
 * --- | ---
 * type | object
 *
 *  The configuration for the rasselbock stutter effect.
 *  The stutter effect passed the signal through for a given interval duration while writing
 *  it to a delay line. After that interval has passed, it plays back that delay line
 *  again and again, optionally while changing the pitch every repetition interval.
 *
 *
 * @category Device Fields*/
export type RasselbockStutter = {
  /**
   *  The duration of the interval during which the signal is passed through.
   *  - 0:  invalid
   *  - 1:  1/256 bars
   *  - 2:  1/128 bars
   *  - 3:  1/64 bars
   *  - 4:  1/32 bars
   *  - 5:  1/16 bars
   *  - 6:  1/8  bars
   *  - 7:  1/4  bars
   *  - 8:  1/2  bars
   *
   *
   * key | value
   * --- | ---
   * default | 5
   * range | [1, 8]
   * is | {@link api.TargetType.AutomatableParameter}*/
  intervalDurationIndex: PrimitiveField<number, "mut">
  /**
   *  Out of the interval duration, how long the audio is audible for every interval.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  scaleFactor: PrimitiveField<number, "mut">
  /**
   *  The pitch change in semitones per repetition interval. -12/+12 semitones is equivalent to +/- 1 octave.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-12, 12]
   * is | {@link api.TargetType.AutomatableParameter}*/
  pitchSemitones: PrimitiveField<number, "mut">
  /**
   *  If is_muted=true, this effect is bypassed.
   *
   *
   * key | value
   * --- | ---
   * default | false
   * is | {@link api.TargetType.AutomatableParameter}*/
  isMuted: PrimitiveField<boolean, "mut">
  /**
   *  If is_soloed=true, effects that don't have is_soloed=true are bypassed.
   *
   *
   * key | value
   * --- | ---
   * default | false
   * is | {@link api.TargetType.AutomatableParameter}*/
  isSoloed: PrimitiveField<boolean, "mut">
}
/** @internal */

export type RasselbockStutterConstructor = {
  /**
   *  The duration of the interval during which the signal is passed through.
   *  - 0:  invalid
   *  - 1:  1/256 bars
   *  - 2:  1/128 bars
   *  - 3:  1/64 bars
   *  - 4:  1/32 bars
   *  - 5:  1/16 bars
   *  - 6:  1/8  bars
   *  - 7:  1/4  bars
   *  - 8:  1/2  bars
   *
   *
   * key | value
   * --- | ---
   * default | 5
   * range | [1, 8]*/
  intervalDurationIndex?: number
  /**
   *  Out of the interval duration, how long the audio is audible for every interval.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]*/
  scaleFactor?: number
  /**
   *  The pitch change in semitones per repetition interval. -12/+12 semitones is equivalent to +/- 1 octave.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-12, 12]*/
  pitchSemitones?: number
  /**
   *  If is_muted=true, this effect is bypassed.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  isMuted?: boolean
  /**
   *  If is_soloed=true, effects that don't have is_soloed=true are bypassed.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  isSoloed?: boolean
}

/**
 *
 * key | value
 * --- | ---
 * type | object
 *
 *  The configuration for the rasselbock scratch effect.
 *  The scratch effect writes the incoming signal to a delay line which it plays back
 *  with a speed modulated by an LFO.
 *
 *
 * @category Device Fields*/
export type RasselbockScratch = {
  /**
   *  The rate of the oscillator controlling the playback speed, and the length of the
   *  sample that's written to the delay line. The effect will repeat the audio
   *  after this duration has passed.
   *  - 0:  invalid
   *  - 1:  1/64 bars
   *  - 2:  1/32 bars
   *  - 3:  1/16 bars
   *  - 4:  1/8  bars
   *  - 5:  1/6  bars
   *  - 6:  1/4  bars
   *  - 7:   1/3  bars
   *  - 8:  1/2  bars
   *  - 9:   2/3  bars
   *  - 10: 3/4  bars
   *  - 11: 1/1  bars
   *
   *
   * key | value
   * --- | ---
   * default | 4
   * range | [1, 11]
   * is | {@link api.TargetType.AutomatableParameter}*/
  rateBars: PrimitiveField<number, "mut">
  /**
   *  Multiplied with the LFO and the modulation offset to get the final speed.
   *  Influences the difference between the highest and lowest speed of the sample.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 2]
   * is | {@link api.TargetType.AutomatableParameter}*/
  modulationDepth: PrimitiveField<number, "mut">
  /**
   *  The "base" speed from which the modulation changes.
   *  Multiplied with the LFO and the modulation depth to get the final speed.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  modulationOffset: PrimitiveField<number, "mut">
  /**
   *  The shape of the modulation curve, is repeated in intervals of the rate_bars parameter.
   *  - 0:  invalid
   *  - 1:  Sinus
   *  - 2:  Triangle
   *  - 3:  Sawtooth Down
   *  - 4:  Sawtooth Up
   *
   *  Note that the wave is phase offset to make sure the sample always plays slower before it plays faster,
   *  so the delay line always has audio to play back.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 4]
   * is | {@link api.TargetType.AutomatableParameter}*/
  modulationShapeIndex: PrimitiveField<number, "mut">
  /**
   *  If is_muted=true, this effect is bypassed.
   *
   *
   * key | value
   * --- | ---
   * default | false
   * is | {@link api.TargetType.AutomatableParameter}*/
  isMuted: PrimitiveField<boolean, "mut">
  /**
   *  If is_soloed=true, effects that don't have is_soloed=true are bypassed.
   *
   *
   * key | value
   * --- | ---
   * default | false
   * is | {@link api.TargetType.AutomatableParameter}*/
  isSoloed: PrimitiveField<boolean, "mut">
}
/** @internal */

export type RasselbockScratchConstructor = {
  /**
   *  The rate of the oscillator controlling the playback speed, and the length of the
   *  sample that's written to the delay line. The effect will repeat the audio
   *  after this duration has passed.
   *  - 0:  invalid
   *  - 1:  1/64 bars
   *  - 2:  1/32 bars
   *  - 3:  1/16 bars
   *  - 4:  1/8  bars
   *  - 5:  1/6  bars
   *  - 6:  1/4  bars
   *  - 7:   1/3  bars
   *  - 8:  1/2  bars
   *  - 9:   2/3  bars
   *  - 10: 3/4  bars
   *  - 11: 1/1  bars
   *
   *
   * key | value
   * --- | ---
   * default | 4
   * range | [1, 11]*/
  rateBars?: number
  /**
   *  Multiplied with the LFO and the modulation offset to get the final speed.
   *  Influences the difference between the highest and lowest speed of the sample.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 2]*/
  modulationDepth?: number
  /**
   *  The "base" speed from which the modulation changes.
   *  Multiplied with the LFO and the modulation depth to get the final speed.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]*/
  modulationOffset?: number
  /**
   *  The shape of the modulation curve, is repeated in intervals of the rate_bars parameter.
   *  - 0:  invalid
   *  - 1:  Sinus
   *  - 2:  Triangle
   *  - 3:  Sawtooth Down
   *  - 4:  Sawtooth Up
   *
   *  Note that the wave is phase offset to make sure the sample always plays slower before it plays faster,
   *  so the delay line always has audio to play back.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [1, 4]*/
  modulationShapeIndex?: number
  /**
   *  If is_muted=true, this effect is bypassed.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  isMuted?: boolean
  /**
   *  If is_soloed=true, effects that don't have is_soloed=true are bypassed.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  isSoloed?: boolean
}

/**
 *
 * key | value
 * --- | ---
 * type | object
 *
 *  Configuration for the rasselbock reverse effect.
 *  The reverse effect writes the incoming signal to the delay line during the first half of every step,
 *  then plays it back in reverse during the second half.
 *
 *
 * @category Device Fields*/
export type RasselbockReverse = {
  /**
   *  If is_muted=true, this effect is bypassed.
   *
   *
   * key | value
   * --- | ---
   * default | false
   * is | {@link api.TargetType.AutomatableParameter}*/
  isMuted: PrimitiveField<boolean, "mut">
  /**
   *  If is_soloed=true, effects that don't have is_soloed=true are bypassed.
   *
   *
   * key | value
   * --- | ---
   * default | false
   * is | {@link api.TargetType.AutomatableParameter}*/
  isSoloed: PrimitiveField<boolean, "mut">
}
/** @internal */

export type RasselbockReverseConstructor = {
  /**
   *  If is_muted=true, this effect is bypassed.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  isMuted?: boolean
  /**
   *  If is_soloed=true, effects that don't have is_soloed=true are bypassed.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  isSoloed?: boolean
}

