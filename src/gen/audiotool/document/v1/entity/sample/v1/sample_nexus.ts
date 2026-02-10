// THIS FILE IS GENERATED - DO NOT EDIT
// Copyright 2025 Audiotool Inc.

import { PrimitiveField } from "@document/fields"

/**
 *
 * key | value
 * --- | ---
 * type | entity
 * key | `"sample"`
 * is | {@link api.TargetType.Sample}
 *
 *
 *  The sample entity represents a single audio file. It contains a sample backend
 *  "name" with which the Audiotool API can be queried to get a download URL for the sample.
 *
 *
 * @category Utility Entities*/
export type Sample = {
  /**
   *  The sample backend name, usually samples/{uuid}.
   *
   *
   * key | value
   * --- | ---
   * immutable | true*/
  sampleName: PrimitiveField<string, "immut">
  /**
   *  The approximate number of seconds passed since the Unix epoch for the hermes server at the time the upload
   *  of this sample was started. The hermes server can be queried for its current time.
   *  This can be used to estimate whether a sample might still become available or is missing forever
   *  if the API returns 404 for a sample. If the sample is already available, this can be set to 0.
   *
   *
   * key | value
   * --- | ---
   * immutable | true*/
  uploadStartTime: PrimitiveField<bigint, "immut">
}
/** @internal */

export type SampleConstructor = {
  /**
   *  The sample backend name, usually samples/{uuid}.
   *
   *
   * key | value
   * --- | ---
   * immutable | true*/
  sampleName?: string
  /**
   *  The approximate number of seconds passed since the Unix epoch for the hermes server at the time the upload
   *  of this sample was started. The hermes server can be queried for its current time.
   *  This can be used to estimate whether a sample might still become available or is missing forever
   *  if the API returns 404 for a sample. If the sample is already available, this can be set to 0.
   *
   *
   * key | value
   * --- | ---
   * immutable | true*/
  uploadStartTime?: bigint
}

