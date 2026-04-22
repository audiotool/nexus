import type { Update } from "@gen/document/v1/document_service_pb"
import { assert } from "console"
import { describe, expect, it } from "vitest"
import { NexusLocation } from "../document/location"
import {
  i32max,
  i32min,
  i64maxN,
  i64minN,
  protoDownCast,
  u32max,
  u64maxN,
} from "./proto-down-cast"

describe.concurrent("protoPrecision", () => {
  describe("identities", () => {
    it("string", () => {
      expect(protoDownCast("string", "test")).toBe("test")
    })
    it("bool", () => {
      expect(protoDownCast("bool", true)).toBe(true)
    })
    it("pointer", () => {
      const location = new NexusLocation("foo", "desktopAudioCable", [1, 2, 3])
      expect(protoDownCast("pointer", location)).toBe(location)
    })
  })

  describe("float", () => {
    it("identity", () => {
      expect(protoDownCast("float", 2.25)).toBe(2.25)
    })
    it("truncate", () => {
      const v = 1.23456789
      assert(Math.fround(v) !== v, "Math.fround should truncate the value")
      expect(protoDownCast("float", v)).toBe(Math.fround(v))
    })
  })

  describe("int32", () => int32Its("int32"))
  describe("sint32", () => int32Its("sint32"))
  describe("sfixed32", () => int32Its("sfixed32"))

  describe("uint32", () => uInt32Its("uint32"))
  describe("fixed32", () => uInt32Its("fixed32"))

  describe("int64", () => int64TestCases("int64"))
  describe("sint64", () => int64TestCases("sint64"))
  describe("sfixed64", () => int64TestCases("sfixed64"))

  describe("uint64", () => uInt64TestCases("uint64"))
  describe("fixed64", () => uInt64TestCases("fixed64"))
})

const int32Its = (variant: NonNullable<Update["value"]["case"]>) => {
  it("identity", () => {
    expect(protoDownCast(variant, 123456)).toBe(123456)
  })

  it("fractions", () => {
    expect(protoDownCast(variant, 123.7)).toBe(123)
    expect(protoDownCast(variant, -123.7)).toBe(-123)
    expect(protoDownCast(variant, 123.2)).toBe(123)
  })

  it("too high", () => {
    expect(protoDownCast(variant, 123123123123123)).toBe(i32max)
  })

  it("too low", () => {
    expect(protoDownCast(variant, -99999999999999)).toBe(i32min)
  })
}

const uInt32Its = (variant: NonNullable<Update["value"]["case"]>) => {
  it("identity", () => {
    expect(protoDownCast(variant, 123456)).toBe(123456)
  })

  it("fractions", () => {
    expect(protoDownCast(variant, 123.7)).toBe(123)
    expect(protoDownCast(variant, 123.2)).toBe(123)
  })

  it("too high", () => {
    expect(protoDownCast(variant, u32max + 2)).toBe(u32max)
  })

  it("too low", () => {
    expect(protoDownCast(variant, -1000)).toBe(0)
  })
}

const int64TestCases = (variant: NonNullable<Update["value"]["case"]>) => {
  it("identity", () => {
    expect(protoDownCast(variant, 123n)).toBe(123n)
  })

  it("negative", () => {
    expect(protoDownCast(variant, -123n)).toBe(-123n)
  })

  it("too high", () => {
    expect(protoDownCast(variant, 1234567890123456722890n)).toBe(i64maxN)
  })

  it("too low", () => {
    expect(protoDownCast(variant, -1234567890123456782290n)).toBe(i64minN)
  })
}

const uInt64TestCases = (variant: NonNullable<Update["value"]["case"]>) => {
  it("identity", () => {
    expect(protoDownCast(variant, 123n)).toBe(123n)
  })

  it("too high", () => {
    expect(protoDownCast(variant, 123456789012345678901234n)).toBe(u64maxN)
  })
  it("too low", () => {
    expect(protoDownCast(variant, -2n)).toBe(0n)
  })
}
