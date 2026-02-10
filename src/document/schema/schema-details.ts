import type { ScalarType } from "@bufbuild/protobuf"
import type { EntityTypeKey } from "@document/entity-utils"
import type { TargetType } from "@gen/document/v1/opt/opt_pb"

export type SchemaDetails =
  | EntityDetails
  | ObjectDetails
  | PrimitiveFieldDetails
  | ArrayDetails

/** If the path points to an entity, this is returned. */
export type EntityDetails = {
  type: "entity"
  /** target types of this entity. */
  targetTypes: TargetTypeValue[]
  /** entity type key of this entity. */
  typeKey: EntityTypeKey
}

/** If the path points to an object, this is returned. */
export type ObjectDetails = {
  type: "object"
  /** target types of this object. */
  targetTypes: TargetTypeValue[]
  /** the field name */
  fieldName: string
}

/** If the path points to an array, this is returned. */
export type ArrayDetails = {
  type: "array"
  targetTypes: TargetTypeValue[]
  length: number
  fieldName: string
}

/** If the path points to a primitive field, this is returned. */
export type PrimitiveFieldDetails = {
  type: "primitive"
  /** target types of this primitive. */
  targetTypes: TargetTypeValue[]
  /** whether the primitive is immutable. */
  immutable: boolean
  /** the field name */
  fieldName: string
  /** more infos on the exact primitive located there. */
  primitive:
    | NexusLocationPrimitive
    | NumberPrimitive
    | StringPrimitive
    | BooleanPrimitive
    | BytesPrimitive
}

/** If the primitive field contains a nexus location, this is returned. */
export type NexusLocationPrimitive = {
  type: "nexus-location"
  targets: TargetTypeValue
  required: boolean
}

/** If the primitive field contains a number, this is returned. */
export type NumberPrimitive = {
  type: "number"
  scalarType:
    | ScalarType.FIXED32
    | ScalarType.FIXED64
    | ScalarType.FLOAT
    | ScalarType.DOUBLE
    | ScalarType.INT32
    | ScalarType.INT64
    | ScalarType.SFIXED32
    | ScalarType.SFIXED64
    | ScalarType.UINT32
    | ScalarType.UINT64
    | ScalarType.SINT32
    | ScalarType.SINT64

  /** Default value for the field as indicated by the protos. Might be removed. */
  default: number

  /**
   * The range of values for this field. If protos are unset, is the range of the
   * number type.
   */
  range: {
    min: number
    max: number
  }
}

/** If the primitive field contains a string, this is returned. */
export type StringPrimitive = {
  type: "string"
  scalarType: ScalarType.STRING
  maxByteLength: number
}

/** If the primitive field contains a boolean, this is returned. */
export type BooleanPrimitive = {
  type: "boolean"
  scalarType: ScalarType.BOOL
  default: boolean
}

/** If the primitive field contains a bytes array (Uint8Array), this is returned. */
export type BytesPrimitive = {
  type: "bytes"
  scalarType: ScalarType.BYTES
}

/** The type of targets used across the codebase. */
export type TargetTypeValue = keyof typeof TargetType
