import type {
  ConstructorTypes,
  entityUrlToTypeKey,
} from "@gen/document/v1/utils/types"
import { describe, it } from "vitest"
import type {
  EntityConstructorType,
  EntityTypeKey,
  EntityTypeUrl,
  EntityTypeUrlToKey,
} from "./entity-utils"
// In order for `satisfies` to work in ts, we need a concrete value that's type checked.
// We use this value below to do that, cast it to unknown first to easily pretend it's any type
// we wish.
const TYPE_CHECK = null as unknown

describe("entity utils type tests", () => {
  it("some type tests", () => {
    TYPE_CHECK as ConstructorTypes satisfies Record<
      EntityTypeKey,
      EntityConstructorType
    >

    TYPE_CHECK as typeof entityUrlToTypeKey satisfies Record<
      EntityTypeUrl,
      EntityTypeKey
    >

    TYPE_CHECK as EntityTypeUrlToKey satisfies EntityTypeKey
  })
})
