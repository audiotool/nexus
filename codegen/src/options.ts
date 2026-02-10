/*
    This file lists options that can be attached to fields and entityes.

    We have these messages defined in `opt.proto`, but because they
    extend `FieldOptions` and `MessageOptions` respectively, we can't
    use them directly in the generated code.
*/

import type { PlainMessage } from "@bufbuild/protobuf"
import type {
  Bool,
  Float,
  Int32,
  ListOptions,
  TargetType,
  UInt32,
} from "../../src/gen/audiotool/document/v1/opt/opt_pb"

type PointerOptions = {
  required: boolean
  target: keyof typeof TargetType
}

/** All options that can be attached to a nexus field */
export type NexusFieldOptions = {
  int32?: PlainMessage<Int32>
  uint32?: PlainMessage<UInt32>
  float?: PlainMessage<Float>
  bool?: PlainMessage<Bool>
  pointer?: PointerOptions
  target?: {
    // Redefined here because message lists target type as `TargetType[]`, but
    // serializing to json results in `(keyof typeof TargetType)[]`
    is: (keyof typeof TargetType)[]
  }
  immutable?: boolean
  list?: Omit<PlainMessage<ListOptions>, "elementIs"> & {
    // Redefined here because message lists target type as `TargetType[]`, but
    // serializing to json results in `(keyof typeof TargetType)[]`
    elementIs?: (keyof typeof TargetType)[]
  }
  string?: {
    maxByteLength: number
  }
}

/** All options that can be attached to a nexus entity */
export type NexusEntityOptions = {
  /** called "entity" in opt.proto, renamed to allow `NexusOptions` */
  target?: {
    /** Redefined here bcs  message list target types are `TargetType[]`, but serializing to json results in `(keyof typeof TargetType)[]` */
    is: (keyof typeof TargetType)[]
  }
}

/** All optiosn that can be attached to both an entity and a field */
export type NexusOptions = NexusFieldOptions | NexusEntityOptions
