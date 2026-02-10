import { describe, expect, it } from "vitest"
import { buildModificationForNewEntity } from "./build-new-entity"

describe("buildNewEntity", () => {
  it("should create a new tiny gain", () => {
    expect(() => buildModificationForNewEntity("tinyGain", {})).not.toThrow()
  })

  it("should create a new heisenberg", () => {
    expect(() => buildModificationForNewEntity("heisenberg", {})).not.toThrow()
  })
})
