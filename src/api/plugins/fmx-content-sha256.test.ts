import { describe, expect, it } from "vitest"
import { computeFmxContentSha256 } from "./fmx-content-sha256"

const encode = (text: string) => new Uint8Array(new TextEncoder().encode(text))

const sha256Hex = async (text: string) =>
  Array.from(
    new Uint8Array(await crypto.subtle.digest("SHA-256", encode(text))),
    (byte) => byte.toString(16).padStart(2, "0"),
  ).join("")

// The vectors mirror prisma's pkg/svc/plugin/v1/hash_test.go.
describe("computeFmxContentSha256", () => {
  it("hashes wasm:{wasm}html:{html}metadata:{metadata} of the raw field text", async () => {
    expect(
      await computeFmxContentSha256(
        encode(`{"wasm":"AA==","html":"<p>","metadata":{"params":[]}}`),
      ),
    ).toBe(await sha256Hex(`wasm:"AA=="html:"<p>"metadata:{"params":[]}`))
  })

  it("ignores other fields and key order", async () => {
    const first = await computeFmxContentSha256(
      encode(
        `{"name":"A","type":"vst_effect","wasm":"AA==","html":"<p>","metadata":{"params":[]},"version":"1"}`,
      ),
    )
    const second = await computeFmxContentSha256(
      encode(
        `{"version":"9","metadata":{"params":[]},"html":"<p>","wasm":"AA==","name":"B"}`,
      ),
    )
    expect(first).toBe(second)
  })

  it("changes with a hashed field", async () => {
    expect(
      await computeFmxContentSha256(
        encode(`{"wasm":"AA==","html":"<p>","metadata":{"params":[]}}`),
      ),
    ).not.toBe(
      await computeFmxContentSha256(
        encode(`{"wasm":"BB==","html":"<p>","metadata":{"params":[]}}`),
      ),
    )
  })

  it("hashes a non-object as three missing fields", async () => {
    const empty = await sha256Hex("wasm:html:metadata:")
    expect(await computeFmxContentSha256(encode("[]"))).toBe(empty)
    expect(await computeFmxContentSha256(encode("not json"))).toBe(empty)
  })

  it("keeps the raw text of values, without the whitespace around them", async () => {
    expect(
      await computeFmxContentSha256(
        encode(
          `{ "wasm" : "A\\"}," ,\n"skipped": [1, {"a": "}"}], "html": "<\\u0070>",\t"metadata" : { "params" : [ 1 ] } }`,
        ),
      ),
    ).toBe(
      await sha256Hex(
        `wasm:"A\\"},"html:"<\\u0070>"metadata:{ "params" : [ 1 ] }`,
      ),
    )
  })

  it("keeps the last value of a repeated key", async () => {
    expect(
      await computeFmxContentSha256(encode(`{"wasm":"A","wasm":"B"}`)),
    ).toBe(await sha256Hex(`wasm:"B"html:metadata:`))
  })
})
