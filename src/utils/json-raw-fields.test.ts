import { describe, expect, it } from "vitest"
import { readRawJsonObjectFields } from "./json-raw-fields"

const readFields = (json: string) => {
  const decoder = new TextDecoder()
  return Object.fromEntries(
    [...readRawJsonObjectFields(new TextEncoder().encode(json))].map(
      ([key, value]) => [key, decoder.decode(value)],
    ),
  )
}

describe("readRawJsonObjectFields", () => {
  it("returns the raw text of each top-level value", () => {
    expect(readFields('{"a":1,"b":"two","c":null}')).toEqual({
      a: "1",
      b: '"two"',
      c: "null",
    })
  })

  it("keeps whitespace inside a value", () => {
    expect(readFields('{"a": [ 1, 2 ] }')).toEqual({ a: "[ 1, 2 ]" })
  })

  it("keeps nested objects and arrays whole", () => {
    expect(readFields('{"a":{"b":[1,{"c":"}"}]},"d":2}')).toEqual({
      a: '{"b":[1,{"c":"}"}]}',
      d: "2",
    })
  })

  it("keeps escapes inside strings", () => {
    expect(readFields('{"a":"x\\"y\\\\","b":1}')).toEqual({
      a: '"x\\"y\\\\"',
      b: "1",
    })
  })

  it("decodes escapes in keys", () => {
    expect(readFields('{"\\u0061":1}')).toEqual({ a: "1" })
  })

  it("handles non-ASCII text", () => {
    expect(readFields('{"ä":"ü€"}')).toEqual({ ä: '"ü€"' })
  })

  describe("when a key repeats", () => {
    it("keeps the last value", () => {
      expect(readFields('{"a":1,"a":2}')).toEqual({ a: "2" })
    })
  })

  describe("when the object is empty", () => {
    it("returns no fields", () => {
      expect(readFields(" { } ")).toEqual({})
    })
  })

  describe("when the bytes are not valid JSON", () => {
    it("returns no fields", () => {
      expect(readFields('{"a":')).toEqual({})
    })
  })

  describe("when the JSON is not an object", () => {
    it("returns no fields for an array", () => {
      expect(readFields("[1,2]")).toEqual({})
    })

    it("returns no fields for a string", () => {
      expect(readFields('"a"')).toEqual({})
    })
  })
})
