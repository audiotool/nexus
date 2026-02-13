import { describe, expect, it, vi } from "vitest"
import { neverThrowingFetch } from "./never-throwing-fetch"

describe("neverThrowingFetch", () => {
  it("should call fetch function", async () => {
    vi.spyOn(globalThis, "fetch")
    const options: RequestInit = { credentials: "include" }
    await neverThrowingFetch("https://example.com", options)
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://example.com",
      options,
    )
  })

  it("should return response", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation(() =>
      Promise.resolve(new Response()),
    )
    const response = await neverThrowingFetch("https://example.com")
    expect(response).toBeInstanceOf(Response)
  })

  it("should return an error on fetch failure", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation(() =>
      Promise.reject(new Error("Fetch failed")),
    )
    const response = await neverThrowingFetch("https://example.com")
    expect(response).toBeInstanceOf(Error)
  })

  it("should return an error with the original error as cause", async () => {
    const error = new Error("Fetch failed")
    vi.spyOn(globalThis, "fetch").mockImplementation(() =>
      Promise.reject(error),
    )
    const response = await neverThrowingFetch("https://example.com")
    expect((response as Error).cause).toBe(error)
  })
})
