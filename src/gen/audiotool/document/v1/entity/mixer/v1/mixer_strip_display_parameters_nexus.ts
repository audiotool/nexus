// THIS FILE IS GENERATED - DO NOT EDIT
// Copyright 2025 Audiotool Inc.

import { PrimitiveField } from "@document/fields"

/**
 *
 * key | value
 * --- | ---
 * type | object
 *
 *  Parameters most strips need that control the visual appearance of the strip in the DAW.
 *
 *
 * @category Mixer Fields*/
export type MixerStripDisplayParameters = {
  /**
   *  This parameter orders the strips visually in the DAW. Orders must be globally unique amongst all strips.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | full*/
  orderAmongStrips: PrimitiveField<number, "mut">
  /**
   *  Strip display name. If left empty, the DAW will use other relevant information to show a name.
   */
  displayName: PrimitiveField<string, "mut">
  /**
   *  Color of the strip.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 41]*/
  colorIndex: PrimitiveField<number, "mut">
}
/** @internal */

export type MixerStripDisplayParametersConstructor = {
  /**
   *  This parameter orders the strips visually in the DAW. Orders must be globally unique amongst all strips.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | full*/
  orderAmongStrips?: number
  /**
   *  Strip display name. If left empty, the DAW will use other relevant information to show a name.
   */
  displayName?: string
  /**
   *  Color of the strip.
   *
   *
   * key | value
   * --- | ---
   * default | 0
   * range | [0, 41]*/
  colorIndex?: number
}

