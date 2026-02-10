// THIS FILE IS GENERATED - DO NOT EDIT
// Copyright 2025 Audiotool Inc.

import { PrimitiveField } from "@document/fields"
import { type NexusLocation } from "@document/location"
import { NexusObject } from "@document/object"
import { type Empty } from "@gen/document/v1/empty_nexus"

/**
 *
 * key | value
 * --- | ---
 * type | entity
 * key | `"waveshaper"`
 * is | {@link api.TargetType.Waveshaper}
 *
 *
 *  The waveshaper is a distortion effect that allows to remap the amplitude of
 *  the incoming signal according to a curve defined by a series of anchors.
 *
 *  The mix factor can be modulated by an envelope that's triggered by the peak
 *  of the main incoming signal or a side-chain signal.
 *
 *  The curve of the waveshaper is defined by a series of anchors that mark points
 *  on the plane spanned by (0, 0) and (1, 1). To draw the curve, sort
 *  all anchors by x-coordinate and then connect them with lines such that
 *  line between p1 and p2 are sloped with the slope parameter of anchor p2.
 *
 *  There are two implicit anchors:
 *  - one at (0, 0) where the curve starts
 *  - one at (1, y) where the curve ends, sloped with "final_slope" field.
 *    where y is the "final_y" field.
 *
 *  This is to make sure the curve always starts at (0, 0) and ends at (1, 1),
 *  and that the curve can be sloped even if no anchor is present.
 *
 *
 * @category Device Entities*/
export type Waveshaper = {
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
   *  Allow adjustment of the volume of the signal before it is processed
   *  Equivalent to a dB range of [-inf, 9.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 2.818382978439331]
   * is | {@link api.TargetType.AutomatableParameter}*/
  preGain: PrimitiveField<number, "mut">
  /**
   *  Controls the mix between the incoming and the effect signal. 0 ("dry") means 0% effect
   *  applied, 1 ("wet") means 100% effect applied; values between mixes the two linearly.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  mix: PrimitiveField<number, "mut">
  /**
   *  The amount that the envelope influences the mix factor. 0 means no influence, 1 means full influence.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]
   * is | {@link api.TargetType.AutomatableParameter}*/
  autoDrive: PrimitiveField<number, "mut">
  /**
   *  The attack time of the envelope influencing the mix factor.
   *
   *
   * key | value
   * --- | ---
   * default | 5
   * range | [1, 1000]
   * is | {@link api.TargetType.AutomatableParameter}*/
  attackMs: PrimitiveField<number, "mut">
  /**
   *  The release time of the envelope influencing the mix factor.
   *
   *
   * key | value
   * --- | ---
   * default | 50
   * range | [1, 1000]
   * is | {@link api.TargetType.AutomatableParameter}*/
  releaseMs: PrimitiveField<number, "mut">
  /**
   *  The gain threshold above which the envelope is triggered/released. Equivalent to a dB range of [-inf, 9.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 2.818382978439331]
   * is | {@link api.TargetType.AutomatableParameter}*/
  thresholdGain: PrimitiveField<number, "mut">
  /**
   *  Whether to invert the auto envelope. If invert_envelope=true, then the envelope
   *  is by default "on" (mix is reduced), and can be turned off when triggered.
   *
   *
   * key | value
   * --- | ---
   * default | false
   * is | {@link api.TargetType.AutomatableParameter}*/
  invertEnvelope: PrimitiveField<boolean, "mut">
  /**
   *  The slope of the implicit anchor at (1, final_y), see message documentation for more details.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]*/
  finalSlope: PrimitiveField<number, "mut">
  /**
   *  The y-coordinate of the implicit anchor at (1, final_y), see message documentation for more details.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]*/
  finalY: PrimitiveField<number, "mut">
  /**
   *  Single Input
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioInput}*/
  audioInput: NexusObject<Empty>
  /**
   *  Side Chain Input
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioInput}*/
  sideChainInput: NexusObject<Empty>
  /**
   *  Single Output
   *
   *
   * key | value
   * --- | ---
   * is | {@link api.TargetType.AudioOutput}*/
  audioOutput: NexusObject<Empty>
  /**
   *  Whether the device is active or not. When is_active=false, audio signal bypasses the device
   *
   *
   * key | value
   * --- | ---
   * default | true
   * is | {@link api.TargetType.AutomatableParameter}*/
  isActive: PrimitiveField<boolean, "mut">
}
/** @internal */

export type WaveshaperConstructor = {
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
   *  Allow adjustment of the volume of the signal before it is processed
   *  Equivalent to a dB range of [-inf, 9.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 2.818382978439331]*/
  preGain?: number
  /**
   *  Controls the mix between the incoming and the effect signal. 0 ("dry") means 0% effect
   *  applied, 1 ("wet") means 100% effect applied; values between mixes the two linearly.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]*/
  mix?: number
  /**
   *  The amount that the envelope influences the mix factor. 0 means no influence, 1 means full influence.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  autoDrive?: number
  /**
   *  The attack time of the envelope influencing the mix factor.
   *
   *
   * key | value
   * --- | ---
   * default | 5
   * range | [1, 1000]*/
  attackMs?: number
  /**
   *  The release time of the envelope influencing the mix factor.
   *
   *
   * key | value
   * --- | ---
   * default | 50
   * range | [1, 1000]*/
  releaseMs?: number
  /**
   *  The gain threshold above which the envelope is triggered/released. Equivalent to a dB range of [-inf, 9.0].
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 2.818382978439331]*/
  thresholdGain?: number
  /**
   *  Whether to invert the auto envelope. If invert_envelope=true, then the envelope
   *  is by default "on" (mix is reduced), and can be turned off when triggered.
   *
   *
   * key | value
   * --- | ---
   * default | false*/
  invertEnvelope?: boolean
  /**
   *  The slope of the implicit anchor at (1, final_y), see message documentation for more details.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]*/
  finalSlope?: number
  /**
   *  The y-coordinate of the implicit anchor at (1, final_y), see message documentation for more details.
   *
   *
   * key | value
   * --- | ---
   * default | 1
   * range | [0, 1]*/
  finalY?: number
  /**
   *  Whether the device is active or not. When is_active=false, audio signal bypasses the device
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
 * key | `"waveshaperAnchor"`
 * is |
 *
 *
 *  An anchor on the waveshaper curve, influencing how the amplitude is remapped.
 *
 *
 * @category Device Entities*/
export type WaveshaperAnchor = {
  /**
   *  The x-coordinate of the anchor.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  x: PrimitiveField<number, "mut">
  /**
   *  The y-coordinate of the anchor.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  y: PrimitiveField<number, "mut">
  /**
   *  The amount the curve right before this anchor is sloped.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]*/
  slope: PrimitiveField<number, "mut">
  /**
   *  The waveshaper that uses this anchor.
   *
   *
   * key | value
   * --- | ---
   * default | no default, required
   * required | true
   * targets | {@link api.TargetType.Waveshaper}, meaning one of: <br />{@link entities.Waveshaper}
   * immutable | true*/
  waveshaper: PrimitiveField<NexusLocation, "immut">
}
/** @internal */

export type WaveshaperAnchorConstructor = {
  /**
   *  The x-coordinate of the anchor.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  x?: number
  /**
   *  The y-coordinate of the anchor.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 1]*/
  y?: number
  /**
   *  The amount the curve right before this anchor is sloped.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [-1, 1]*/
  slope?: number
  /**
   *  The waveshaper that uses this anchor.
   *
   *
   * key | value
   * --- | ---
   * default | no default, required
   * required | true
   * immutable | true*/
  waveshaper: NexusLocation
}

