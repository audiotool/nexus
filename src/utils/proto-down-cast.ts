import type { Update } from "@gen/document/v1/document_service_pb"
import type { PrimitiveType } from "../document/fields"

// note: scalar types are derived from the rust types on this https://protobuf.dev/programming-guides/proto3/#scalar
// it's kinda annoying that they don't say: `sfixed32` is a signed 32 bit integer. Isn't that crucial info!?

type ProtoType = NonNullable<Update["value"]["case"]>

/** This funciton takes a value of type P and downcasts it to the precision of the protobuf type.
 *
 * For example, a `float` in protobuf is represented as `number` in JS, which is a 64-bit double-precision
 * floating point number. This function will reduce its precision to 32-bit single-precision.
 *
 * These functions will not check if the provided value is of the correct type, and might or
 * might not throw if not.
 */
export const protoDownCast = <P extends PrimitiveType>(
  protobufType: ProtoType,
  value: P,
): P => {
  return protoPrecision[protobufType](value)
}

/**
 * These functions take values from JS and potentially reduce their precision to match the precision
 * they receive when serialized to protobuf messages.
 */
const protoPrecision: Record<
  NonNullable<Update["value"]["case"]>,
  <P extends PrimitiveType>(v: P) => P
> = {
  // non-numbers:

  // already boolean
  bool: (v) => v,

  // already string
  string: (v) => v,

  // already pointer (NexusLocation)
  pointer: (v) => v,

  // unused & nothing to truncate
  bytes: (v) => v,

  // floats

  // single-precision float
  float: <P>(v: P) => Math.fround(v as number) as P,

  // double precision float
  double: (v) => v,

  // 32 bit integers

  // 32 bit signed integer
  int32: <P>(v: P) => toInt32(v as number) as P,

  // 32 bit unsigned integer
  uint32: <P>(v: P) => toUint32(v as number) as P,

  // alternative signed 32 bit integer
  sint32: <P>(v: P) => toInt32(v as number) as P,

  // alternative unsigned 32 bit integer
  fixed32: <P>(v: P) => toUint32(v as number) as P,
  // 64 bit signed integer, bigint

  // alternative signed 32 bit integer
  sfixed32: <P>(v: P) => toInt32(v as number) as P,

  // 64 bit integers

  // 64 bit signed integer, bigint
  int64: <P>(v: P) => toInt64(v as bigint) as P,

  // 64 bit unsigned integer, bigint
  uint64: <P>(v: P) => toUint64(v as bigint) as P,

  // alternative signed 64 bit integer
  sint64: <P>(v: P) => toInt64(v as bigint) as P,

  // alternative unsigned 64 bit integer
  fixed64: <P>(v: P) => toUint64(v as bigint) as P,

  // alternative signed 64 bit integer
  sfixed64: <P>(v: P) => toInt64(v as bigint) as P,
}

// exported for tests
export const i32max = 2147483647
export const i32min = -2147483648
export const u32max = 4294967295
export const u64maxN = 18446744073709551615n
export const u64minN = 0n
export const i64minN = -9223372036854775808n
export const i64maxN = 9223372036854775807n

const toUint64 = (v: bigint): bigint =>
  v < u64minN ? u64minN : v > u64maxN ? u64maxN : v

const toInt64 = (v: bigint): bigint =>
  v > i64maxN ? i64maxN : v < i64minN ? i64minN : v

const toUint32 = (v: number): number =>
  Math.max(0, Math.min(u32max, Math.trunc(v)))

const toInt32 = (v: number): number =>
  Math.max(i32min, Math.min(i32max, Math.trunc(v)))
