import { ScalarType } from "@bufbuild/protobuf"
import { i32max, i32min, u32max } from "@utils/proto-precision"
import { assert, describe, expect, it } from "vitest"
import { _getSchemaLocatorDetails } from "./get-schema-details-from-locator"
import type { SchemaDetails } from "./schema-details"

// note: these tests test an "internal" function - the exposed version of this function is called
// getSchemaLocationDetails. However that function just converts the location to the locator; so
// it's more unit-testy to test the internal function directly.

describe("_getSchemaLocatorDetails", () => {
  describe("entity details", () => {
    it("should return the correct details for a simple path", () => {
      const details = _getSchemaLocatorDetails("heisenberg")
      expect(details).toMatchObject<SchemaDetails>({
        type: "entity",
        typeKey: "heisenberg",
        targetTypes: ["NoteTrackPlayer"],
      })
    })
  })

  describe("primitive details", () => {
    it("should return the correct details for a primitive float field", () => {
      const details = _getSchemaLocatorDetails("heisenberg:6")
      expect(details).toMatchObject<SchemaDetails>({
        type: "primitive",
        targetTypes: ["AutomatableParameter"],
        immutable: false,
        fieldName: "tuneSemitones",
        primitive: {
          type: "number",
          scalarType: ScalarType.FLOAT,
          default: 0,
          range: { min: -12, max: 12 },
        },
      })
    })

    it("should return the correct details for a primitive float field using fround", () => {
      const details = _getSchemaLocatorDetails("stompboxDelay:7")
      const expectedDefaultF64 = 0.4
      assert(
        expectedDefaultF64 !== Math.fround(expectedDefaultF64),
        "value in expect must not equal it's 32bit float part, otherwise this test tests nothing",
      )

      expect(details).toMatchObject<SchemaDetails>({
        type: "primitive",
        targetTypes: ["AutomatableParameter"],
        immutable: false,
        fieldName: "feedbackFactor",
        primitive: {
          type: "number",
          scalarType: ScalarType.FLOAT,
          default: Math.fround(expectedDefaultF64),
          range: { min: 0.0, max: 1 },
        },
      })
    })

    it("should return the correct details for a primitive string field", () => {
      expect(
        _getSchemaLocatorDetails("tinyGain:2"),
      ).toMatchObject<SchemaDetails>({
        type: "primitive",
        targetTypes: [],
        immutable: false,
        fieldName: "displayName",
        primitive: {
          type: "string",
          scalarType: ScalarType.STRING,
          maxByteLength: 500,
        },
      })
    })

    it("should return the correct details for a primitive i32 field", () => {
      expect(
        _getSchemaLocatorDetails("heisenberg:8"),
      ).toMatchObject<SchemaDetails>({
        type: "primitive",
        targetTypes: ["AutomatableParameter"],
        immutable: false,
        fieldName: "playModeIndex",
        primitive: {
          type: "number",
          scalarType: ScalarType.UINT32,
          default: 3,
          range: {
            min: 1,
            max: 3,
          },
        },
      })
    })

    it("should return the correct details for a primitive bool field", () => {
      expect(
        _getSchemaLocatorDetails("heisenberg:28"),
      ).toMatchObject<SchemaDetails>({
        type: "primitive",
        targetTypes: ["AutomatableParameter"],
        immutable: false,
        fieldName: "isActive",
        primitive: {
          type: "boolean",
          scalarType: ScalarType.BOOL,
          default: true,
        },
      })
    })

    it.skip("should return the correct details for a primitive bytes field", () => {
      // todo: don't have bytes yet
    })

    it("should return the correct details for a required primitive nexus-location field", () => {
      expect(
        _getSchemaLocatorDetails("desktopAudioCable:3"),
      ).toMatchObject<SchemaDetails>({
        type: "primitive",
        targetTypes: [],
        immutable: false,
        fieldName: "toSocket",
        primitive: {
          type: "nexus-location",
          required: true,
          targets: "AudioInput",
        },
      })
    })

    it("should return the correct details for a primitive field in an array", () => {
      expect(
        _getSchemaLocatorDetails("quantum:9:[]"),
      ).toMatchObject<SchemaDetails>({
        type: "primitive",
        targetTypes: [],
        immutable: false,
        fieldName: "[]",
        primitive: {
          type: "number",
          default: 20,
          range: {
            min: 20,
            max: 20_000,
          },
          scalarType: ScalarType.FLOAT,
        },
      })
    })

    it("should return the correct details for a required & immutable primitive nexus-location field", () => {
      expect(
        _getSchemaLocatorDetails("beatbox9Pattern:2"),
      ).toMatchObject<SchemaDetails>({
        type: "primitive",
        targetTypes: [],
        immutable: true,
        fieldName: "slot",
        primitive: {
          type: "nexus-location",
          required: true,
          targets: "Beatbox9PatternSlot",
        },
      })
    })

    describe("unconstrained fields", () => {
      it("should return the correct details for a i32 field without constraints", () => {
        expect(_getSchemaLocatorDetails("note:3")).toMatchObject<SchemaDetails>(
          {
            type: "primitive",
            targetTypes: [],
            immutable: false,
            fieldName: "positionTicks",
            primitive: {
              type: "number",
              scalarType: ScalarType.INT32,
              default: 0,
              range: {
                min: i32min,
                max: i32max,
              },
            },
          },
        )
      })

      it("should return the correct details for a float field without constraints", () => {
        expect(
          _getSchemaLocatorDetails("audioTrack:2"),
        ).toMatchObject<SchemaDetails>({
          type: "primitive",
          targetTypes: [],
          immutable: false,
          fieldName: "orderAmongTracks",
          primitive: {
            type: "number",
            scalarType: ScalarType.FLOAT,
            default: 0,
            range: {
              min: -Infinity,
              max: +Infinity,
            },
          },
        })
      })

      it("should return the correct details for a uint32 field without constraints", () => {
        // this also tests for primitive in an array
        expect(_getSchemaLocatorDetails("note:4")).toMatchObject<SchemaDetails>(
          {
            type: "primitive",
            targetTypes: [],
            immutable: false,
            fieldName: "durationTicks",
            primitive: {
              type: "number",
              scalarType: ScalarType.UINT32,
              default: 960,
              range: {
                min: 0,
                max: u32max,
              },
            },
          },
        )
      })
    })
  })

  describe("object details", () => {
    it("should return the correct details for an object", () => {
      const details = _getSchemaLocatorDetails("heisenberg:25")
      expect(details).toMatchObject<SchemaDetails>({
        type: "object",
        fieldName: "filter",
        targetTypes: [],
      })
    })

    it("should return the correct details for an empty field field", () => {
      expect(
        _getSchemaLocatorDetails("heisenberg:26"),
      ).toMatchObject<SchemaDetails>({
        type: "object",
        fieldName: "notesInput",
        targetTypes: ["NotesInput"],
      })
    })

    it("should return the correct details for a float field in an array", () => {
      // options have to be fetched slightly differently in this case
      expect(
        _getSchemaLocatorDetails("quantum:9:[]"),
      ).toMatchObject<SchemaDetails>({
        type: "primitive",
        targetTypes: [],
        immutable: false,
        fieldName: "[]", // is array element so no name
        primitive: {
          type: "number",
          scalarType: ScalarType.FLOAT,
          default: Math.fround(20),
          range: {
            min: Math.fround(20),
            max: Math.fround(20_000),
          },
        },
      })
    })
  })

  describe("array element details", () => {
    it("should return the correct details for an object in an array", () => {
      const details = _getSchemaLocatorDetails("kobolt:6:[]")
      expect(details).toMatchObject<SchemaDetails>({
        type: "object",
        fieldName: "[]", // is array element so no name
        targetTypes: [],
      })
    })

    it("should return the correct target types for an element in an array", () => {
      // object
      const details = _getSchemaLocatorDetails("bassline:14:[]")
      expect(details).toMatchObject<SchemaDetails>({
        type: "object",
        fieldName: "[]", // is array element so no name
        targetTypes: ["BasslinePatternSlot"],
      })
    })
  })

  describe("array details", () => {
    it("should return the correct details for an array", () => {
      const details = _getSchemaLocatorDetails("rasselbock:5")
      expect(details).toMatchObject<SchemaDetails>({
        type: "array",
        fieldName: "patternSlots",
        targetTypes: [],
        length: 32,
      })
    })
  })
})
