import type { SchemaPath } from "@gen/document/v1/utils/path"
import { describe, expect, it } from "vitest"
import {
  schemaLocationToSchemaPath,
  schemaPathToSchemaLocation,
} from "./converters"

// ---  first some type checks

//  entity itself
"/mixerAuxRoute" as const satisfies SchemaPath

// field in entity
"/mixerAuxRoute/gain" as const satisfies SchemaPath

// field in submessage
"/heisenberg/pitchEnvelope/loopDecayIndex" as const satisfies SchemaPath

// id fields shouldn't work
// @ts-expect-error
"/heisenberg/id" as const satisfies SchemaPath

// field in list element
"/heisenberg/operatorA/gain" as const satisfies SchemaPath

// --  then some unit tests
// ...existing code...

// --  then some unit tests

describe("SchemaPath -> SchemaLocation", () => {
  it("should convert simple entity path", () => {
    expect(schemaPathToSchemaLocation("/config")).toEqual({
      entityType: "config",
      fieldIndex: [],
    })
  })

  it("should convert simple field path", () => {
    expect(schemaPathToSchemaLocation("/config/tempoBpm")).toEqual({
      entityType: "config",
      fieldIndex: [2],
    })
  })

  it("should convert submessage path", () => {
    expect(schemaPathToSchemaLocation("/audioRegion/region")).toEqual({
      entityType: "audioRegion",
      fieldIndex: [2],
    })
  })

  it("should convert nested submessage field path", () => {
    expect(
      schemaPathToSchemaLocation("/audioRegion/region/colorIndex"),
    ).toEqual({
      entityType: "audioRegion",
      fieldIndex: [2, 7],
    })
  })

  it("should convert array field path", () => {
    expect(schemaPathToSchemaLocation("/bassline/patternSlots")).toEqual({
      entityType: "bassline",
      fieldIndex: [14],
    })
  })

  it("should convert array element path", () => {
    expect(schemaPathToSchemaLocation("/bassline/patternSlots/[1]")).toEqual({
      entityType: "bassline",
      fieldIndex: [14, 1],
    })
  })

  it("should convert nested array element field path", () => {
    expect(
      schemaPathToSchemaLocation("/basslinePattern/steps/[1]/key"),
    ).toEqual({
      entityType: "basslinePattern",
      fieldIndex: [5, 1, 1],
    })
  })
})

describe("SchemaLocation -> SchemaPath", () => {
  it("should convert simple entity location", () => {
    expect(
      schemaLocationToSchemaPath({
        entityType: "config",
        fieldIndex: [],
      }),
    ).toEqual("/config")
  })

  it("should convert simple field location", () => {
    expect(
      schemaLocationToSchemaPath({
        entityType: "config",
        fieldIndex: [2],
      }),
    ).toEqual("/config/tempoBpm")
  })

  it("should convert submessage location", () => {
    expect(
      schemaLocationToSchemaPath({
        entityType: "audioRegion",
        fieldIndex: [2],
      }),
    ).toEqual("/audioRegion/region")
  })

  it("should convert nested submessage field location", () => {
    expect(
      schemaLocationToSchemaPath({
        entityType: "audioRegion",
        fieldIndex: [2, 7],
      }),
    ).toEqual("/audioRegion/region/colorIndex")
  })

  it("should convert array field location", () => {
    expect(
      schemaLocationToSchemaPath({
        entityType: "bassline",
        fieldIndex: [14],
      }),
    ).toEqual("/bassline/patternSlots")
  })

  it("should convert array element location", () => {
    expect(
      schemaLocationToSchemaPath({
        entityType: "bassline",
        fieldIndex: [14, 1],
      }),
    ).toEqual("/bassline/patternSlots/[1]")
  })

  it("should convert nested array element field location", () => {
    expect(
      schemaLocationToSchemaPath({
        entityType: "basslinePattern",
        fieldIndex: [5, 1, 1],
      }),
    ).toEqual("/basslinePattern/steps/[1]/key")
  })

  it("should throw when path doesn't exist", () => {
    expect(() =>
      schemaLocationToSchemaPath({
        entityType: "audioDevice",
        fieldIndex: [2, 1000, 3],
      }),
    ).toThrowError(
      "can't find field '1000' at index 1 of path [2, 1000, 3] for entity type 'audioDevice'",
    )
  })
})
