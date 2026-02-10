import { ScalarType } from "@bufbuild/protobuf"
import type { SchemaPath } from "@gen/document/v1/utils/path"
import { describe, expect, it } from "vitest"
import { NexusLocation } from "../location"
import {
  schemaLocationToSchemaLocator,
  schemaPathToSchemaLocation,
} from "./converters"
import type { AllSchemaLocationDetails } from "./get-schema-location-details"
import { getAllSchemaLocationDetails } from "./get-schema-location-details"

describe("schema converters", () => {
  describe("schemaLocationToSchemaPath", () => {
    it("entity path to a schema path", () => {
      // /desktopAudioCable
      const location = new NexusLocation("", "desktopAudioCable", [])
      const path = schemaLocationToSchemaLocator(location)
      expect(path).toBe("desktopAudioCable")
    })

    it("field path to a schema path", () => {
      // desktopAudioCable/fromSocket
      const location = new NexusLocation("", "desktopAudioCable", [2])
      const path = schemaLocationToSchemaLocator(location)
      expect(path).toBe("desktopAudioCable:2")
    })

    it("should convert a field in a field path to a schema path", () => {
      // /heisenberg/filter/cutoff_factor
      const location = new NexusLocation("", "heisenberg", [16, 1])
      const path = schemaLocationToSchemaLocator(location)
      expect(path).toBe("heisenberg:16:1")
    })

    it("array field to the correct schema path", () => {
      // heisenberg/operators
      const location = new NexusLocation("", "heisenberg", [12])
      const path = schemaLocationToSchemaLocator(location)
      expect(path).toBe("heisenberg:12")
    })

    it("array field element to the correct schema path", () => {
      // heisenberg/operators[7]
      const location = new NexusLocation("", "helmholtz", [10, 7])
      const path = schemaLocationToSchemaLocator(location)
      expect(path).toBe("helmholtz:10:[]")
    })

    it("array field element to the correct schema path", () => {
      // heisenberg/operators[7]/panning
      const location = new NexusLocation("", "helmholtz", [10, 2, 3])
      const path = schemaLocationToSchemaLocator(location)
      expect(path).toBe("helmholtz:10:[]:3")
    })
  })

  describe("nexusPathToSchemaLocation", () => {
    it("should convert a simple path to a schema location", () => {
      const location = schemaPathToSchemaLocation(
        "/desktopAudioCable" as SchemaPath,
      )
      expect(location).toMatchObject({
        entityType: "desktopAudioCable",
        fieldIndex: [],
      })
    })

    it("should convert a field path to a schema location", () => {
      // /desktopAudioCable/fromSocket
      const location = schemaPathToSchemaLocation(
        "/desktopAudioCable/fromSocket" as SchemaPath,
      )
      expect(location).toMatchObject({
        entityType: "desktopAudioCable",
        fieldIndex: [2],
      })
    })

    it("should convert a nested field path to a schema location", () => {
      // /heisenberg/filter/cutoff_factor
      const location = schemaPathToSchemaLocation(
        "/heisenberg/filter/cutoffFrequencyHz" as SchemaPath,
      )
      expect(location).toMatchObject({
        entityType: "heisenberg",
        fieldIndex: [25, 1],
      })
    })

    it("should convert an array field path to a schema location", () => {
      // /heisenberg/operators
      const location = schemaPathToSchemaLocation(
        "/heisenberg/operatorA" as SchemaPath,
      )
      expect(location).toMatchObject({
        entityType: "heisenberg",
        fieldIndex: [15],
      })
    })

    it("should convert an array element path to a schema location", () => {
      // /heisenberg/operators/[7]
      const location = schemaPathToSchemaLocation(
        "/helmholtz/filters/[7]" as SchemaPath,
      )
      expect(location).toMatchObject({
        entityType: "helmholtz",
        fieldIndex: [10, 7],
      })
    })

    it("should convert a field of an array element path to a schema location", () => {
      // /heisenberg/operators/[7]/panning
      const location = schemaPathToSchemaLocation(
        "/helmholtz/filters/[7]/panning" as SchemaPath,
      )
      expect(location).toMatchObject({
        entityType: "helmholtz",
        fieldIndex: [10, 7, 3],
      })
    })
  })

  describe("schemaLocationSegmentDetails", () => {
    it("should return the correct segments for a simple field", () => {
      const seg = getAllSchemaLocationDetails({
        entityType: "desktopAudioCable",
        fieldIndex: [2],
      })
      expect(seg).toMatchObject<AllSchemaLocationDetails>([
        {
          type: "entity",
          targetTypes: ["Listenable"],
          typeKey: "desktopAudioCable",
        },
        {
          type: "primitive",
          fieldName: "fromSocket",
          targetTypes: [],
          immutable: false,
          primitive: {
            type: "nexus-location",
            required: true,
            targets: "AudioOutput",
          },
        },
      ])
    })
    it("should return the correct segments for a field in an array", () => {
      const seg = getAllSchemaLocationDetails({
        entityType: "helmholtz",
        fieldIndex: [10, 0, 1],
      })
      expect(seg).toMatchObject<AllSchemaLocationDetails>([
        {
          type: "entity",
          targetTypes: [],
          typeKey: "helmholtz",
        },
        {
          type: "array",
          fieldName: "filters",
          targetTypes: [],
          length: 5,
        },
        {
          type: "object",
          index: 0,
          fieldName: "[]",
          targetTypes: [],
        },
        {
          type: "primitive",
          fieldName: "isActive",
          targetTypes: ["AutomatableParameter"],
          immutable: false,
          primitive: {
            type: "boolean",
            default: false,
            scalarType: ScalarType.BOOL,
          },
        },
      ])
    })
  })
})
