// THIS FILE IS GENERATED - DO NOT EDIT
// Copyright 2025 Audiotool Inc.

import { PrimitiveField } from "@document/fields"

/**
 *
 * key | value
 * --- | ---
 * type | entity
 * key | `"tempoAutomationTrack"`
 * is | {@link api.TargetType.AutomationCollection}
 *
 *
 *  The track automation the project's tempo. Can exist at most once per project.
 *
 *  TempoAutomation tracks don't have regions, but are pointed to by automation
 *  events directly, which is why they're marked as an AutomationCollection.
 *
 *
 * @category Timeline Entities*/
export type TempoAutomationTrack = {
  /**
   *  If the track is disabled, no automation is applied on project tempo.
   *
   *
   * key | value
   * --- | ---
   * default | true*/
  isEnabled: PrimitiveField<boolean, "mut">
}
/** @internal */

export type TempoAutomationTrackConstructor = {
  /**
   *  If the track is disabled, no automation is applied on project tempo.
   *
   *
   * key | value
   * --- | ---
   * default | true*/
  isEnabled?: boolean
}

