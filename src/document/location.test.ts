import { Pointer } from "@gen/document/v1/pointer_pb"
import { hashSymbol } from "@utils/hash-map"
import { describe, expect, it, vi } from "vitest"
import { NexusLocation } from "./location"

describe("NexusLocation", () => {
  describe("isEmpty", () => {
    it("should mark an empty location as empty", () => {
      const location = new NexusLocation()
      expect(location.isEmpty()).toBe(true)
    })

    it("should not mark a non-empty location as empty", () => {
      const location = new NexusLocation("entityId", "tinyGain", [1, 2])
      expect(location.isEmpty()).toBe(false)
    })
  })

  describe("equals", () => {
    it("should compare two equal locations as equal", () => {
      const location1 = new NexusLocation("entityId", "tinyGain", [1, 2])
      const location2 = new NexusLocation("entityId", "tinyGain", [1, 2])
      expect(location1.equals(location2)).toBe(true)
    })

    it("should compare two locations with different field indices as not equal", () => {
      const location1 = new NexusLocation("entityId", "tinyGain", [1, 2])
      const location2 = new NexusLocation("entityId", "tinyGain", [2, 3])
      expect(location1.equals(location2)).toBe(false)
    })

    it("should compare two locations with different entityIds as not equal", () => {
      const location1 = new NexusLocation("entityId1", "tinyGain", [1, 2])
      const location2 = new NexusLocation("entityId2", "tinyGain", [1, 2])
      expect(location1.equals(location2)).toBe(false)
    })

    it("should compare two locations with equal ids but subarray indices as non-equal", () => {
      const location1 = new NexusLocation("entityId", "tinyGain", [1, 2])
      const location2 = new NexusLocation("entityId", "tinyGain", [1, 2, 3])
      expect(location1.equals(location2)).toBe(false)
    })

    it("should ignore entity type when comparing locations", () => {
      // this is because entity type should never differ if the id is the same
      const location1 = new NexusLocation("entityId", "tinyGain", [1, 2])
      const location2 = new NexusLocation("entityId", "rasselbock", [1, 2])
      expect(location1.equals(location2)).toBe(true)
    })
  })

  describe("equalsPointer", () => {
    it("should compare an equal location and a pointer as equal", () => {
      const location = new NexusLocation("entityId", "tinyGain", [1, 2])
      const pointer = new Pointer({ entityId: "entityId", fieldIndex: [1, 2] })
      expect(location.equalsPointer(pointer)).toBe(true)
    })

    it("should compare two locations with different field indices as not equal", () => {
      const location = new NexusLocation("entityId", "tinyGain", [1, 2])
      const pointer = new Pointer({ entityId: "entityId", fieldIndex: [2, 3] })
      expect(location.equalsPointer(pointer)).toBe(false)
    })

    it("should compare two locations with different entityIds as not equal", () => {
      const location = new NexusLocation("entityId1", "tinyGain", [1, 2])
      const pointer = new Pointer({ entityId: "entityId2", fieldIndex: [1, 2] })
      expect(location.equalsPointer(pointer)).toBe(false)
    })

    it("should compare two locations with equal ids but subarray indices as non-equal", () => {
      const location = new NexusLocation("entityId", "tinyGain", [1, 2])
      const pointer = new Pointer({
        entityId: "entityId",
        fieldIndex: [1, 2, 3],
      })
      expect(location.equalsPointer(pointer)).toBe(false)
    })
  })

  describe("withAppendedFieldNumber", () => {
    it("should append a field number to the field index", () => {
      const location = new NexusLocation("entityId", "tinyGain", [1, 2])
      const newLocation = location.withAppendedFieldNumber(3)
      expect(newLocation.fieldIndex).toEqual([1, 2, 3])
    })
  })

  describe("withFieldIndex", () => {
    it("should replace the field index with a new one", () => {
      const location = new NexusLocation("entityId", "tinyGain", [1, 2])
      const newLocation = location.withFieldIndex([3, 4])
      expect(newLocation.fieldIndex).toEqual([3, 4])
    })
  })

  describe("toPointerMessage", () => {
    it("should convert the location to a Pointer message", () => {
      const location = new NexusLocation("entityId", "tinyGain", [1, 2])
      const pointer = location.toPointerMessage()
      expect(pointer).toMatchObject(
        new Pointer({
          entityId: "entityId",
          fieldIndex: [1, 2],
        }),
      )
    })
  })

  describe("hashSymbol", () => {
    it("should return a consistent hash string for the same location", () => {
      const location1 = new NexusLocation("entityId", "tinyGain", [1, 2])
      const location2 = new NexusLocation("entityId", "tinyGain", [1, 2])
      expect(location1[hashSymbol]).toBe(location2[hashSymbol])
    })

    it("should return different hash strings for different entity ids", () => {
      const location1 = new NexusLocation("entityId1", "tinyGain", [1, 2])
      const location2 = new NexusLocation("entityId2", "tinyGain", [1, 2])
      expect(location1[hashSymbol]).not.toBe(location2[hashSymbol])
    })

    it("should return different hash strings for different field indices", () => {
      const location1 = new NexusLocation("entityId", "tinyGain", [1, 2])
      const location2 = new NexusLocation("entityId", "tinyGain", [2, 3])
      expect(location1[hashSymbol]).not.toBe(location2[hashSymbol])
    })

    it("should return the same hash string for locations with different entity types but same id and field index", () => {
      // this is because entity type should never differ if the id is the same
      const location1 = new NexusLocation("entityId", "tinyGain", [1, 2])
      const location2 = new NexusLocation("entityId", "rasselbock", [1, 2])
      expect(location1[hashSymbol]).toBe(location2[hashSymbol])
    })
  })

  describe("toString", () => {
    it("should return a string representation for an empty location", () => {
      expect(new NexusLocation().toString()).toBe("[empty location]")
    })
    it("should return a string representation for a non-empty location", () => {
      const location = new NexusLocation("entityId", "heisenberg", [23, 2])
      expect(location.toString()).toBe(
        "[location: entityId/heisenberg/lfo1/doesRestart]",
      )
    })
  })

  describe("withId", () => {
    it("should clone the location with a new id", () => {
      const location = new NexusLocation("entityId", "tinyGain", [1, 2])
      const clonedLocation = location.withId("newEntityId")
      expect(clonedLocation).toMatchObject(
        new NexusLocation("newEntityId", "tinyGain", [1, 2]),
      )
    })
  })

  describe("fromPointerMessage", () => {
    it("should create a NexusLocation from a Pointer message", () => {
      const pointer = new Pointer({
        entityId: "entityId",
        fieldIndex: [1, 2],
      })
      const location = NexusLocation.fromPointerMessage(
        () => "tinyGain",
        pointer,
      )
      expect(location).toMatchObject(
        new NexusLocation("entityId", "tinyGain", [1, 2]),
      )
    })

    it("should not resolve type if pointer is empty", () => {
      const pointer = new Pointer({
        entityId: "",
        fieldIndex: [],
      })
      const resolve = vi.fn()
      NexusLocation.fromPointerMessage(resolve, pointer)
      expect(resolve).not.toHaveBeenCalled()
    })

    it("should throw if entity type couldn't be resolved", () => {
      const pointer = new Pointer({
        entityId: "bla-bla",
        fieldIndex: [],
      })
      expect(() =>
        NexusLocation.fromPointerMessage(() => undefined, pointer),
      ).toThrow()
    })
  })

  describe("fromSchemaPath", () => {
    it("should create a NexusLocation from a schema path", () => {
      const location = NexusLocation.fromSchemaPath(
        "entityId",
        "/heisenberg/lfo1/doesRestart",
      )
      expect(location).toMatchObject(
        new NexusLocation("entityId", "heisenberg", [23, 2]),
      )
    })
  })
})
