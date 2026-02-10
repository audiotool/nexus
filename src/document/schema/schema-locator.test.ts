// some type checks

import { describe, it } from "vitest"

import type { _SchemaLocator } from "./schema-locator"

// describe/it so vitest doesn't throw a fit
describe("SchemaPath", () => {
  it("should type check", () => {
    // Schema path to entity
    "mixerAux" as const satisfies _SchemaLocator

    // Schema path to field
    "mixerAux:2" as const satisfies _SchemaLocator

    // Schema path to subfield
    "heisenberg:16:2" as const satisfies _SchemaLocator

    // ignore id fields
    // @ts-expect-error
    "heisenberg:1" as const satisfies _SchemaLocator

    // don't ignore non-id files with field index 1
    "heisenberg:16:1" as const satisfies _SchemaLocator

    // list
    "heisenberg:14" as const satisfies _SchemaLocator

    // list with index
    "rasselbockPattern:4:[]" as const satisfies _SchemaLocator

    // index in element in list
    "rasselbockPattern:4:[]:1" as const satisfies _SchemaLocator

    // primitive in list in list and stuff
    "rasselbockPattern:4:[]:1:[]:1" as const satisfies _SchemaLocator
  })
})
