import type { NexusLocation } from "@document/location"
import type { Update } from "@gen/document/v1/document_service_pb"

// for jsdoc comment
import { protoPrecision } from "@utils/proto-precision"
import type { NexusDocument } from "./document"

/** The interface shared by all fields in the document. */
export interface NexusField {
  location: NexusLocation
}

/** A field that contains an array of other fields. */
export class ArrayField<
  F extends NexusField = NexusField,
  L extends number = number,
> implements NexusField
{
  location: NexusLocation
  /** The array of fields contained in this array field. */
  array: readonly F[] & { readonly length: L }

  /** @internal */
  constructor(location: NexusLocation, array: F[] & { length: L }) {
    this.location = location
    this.array = array
  }
}

/** The type a primitive field can contain. */
export type PrimitiveType = number | bigint | string | boolean | NexusLocation

/**
 * A field that contains a primitive value of type `P`.
 *
 * @template P - The type of the field, oneof {@link PrimitiveType}.
 * @template M - Whether the field can be mutated, either `"mut"` or `"immut"`.
 */
export class PrimitiveField<
  P extends PrimitiveType = PrimitiveType,
  M extends "mut" | "immut" = "mut" | "immut",
> implements NexusField
{
  /** The location of this field within the Nexus document. */
  location: NexusLocation

  /** The value of the field; private with a getter to prevent accidenal overwrites. */
  #value: P

  /** Whether the field is mutable. Updating immutable fields results in a transaction error.
   *
   * If the type fo the field is known at compile time, updating the field using the {@link TransactionBuilder}
   * or listing to updates of the field using the {@link NexusEventManager} will result in type errors.
   */
  readonly mutable: M extends "mut" ? true : false

  /** @internal The type of the field in the protobuf message. Used internally.  */
  _protoType: NonNullable<Update["value"]["case"]>

  /** @internal */
  constructor(
    location: NexusLocation,
    value: P,
    protoType: NonNullable<Update["value"]["case"]>,
    mutable: M extends "mut" ? true : false,
  ) {
    this.location = location
    this.#value = value
    this._protoType = protoType
    this.mutable = mutable
  }

  /** Get the value of the field. To set, use transactions in the document. */
  get value(): P {
    return this.#value
  }

  /**
   * @internal
   *
   * Set the value of this field. Used by {@link NexusDocument}, don't use directly! */
  _setValue(value: P) {
    this.#value = protoPrecision[this._protoType](value)
  }
}
