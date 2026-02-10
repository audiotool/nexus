import type { ConstructorTypes } from "@gen/document/v1/utils/types"
import { describe, expect, it } from "vitest"
import { NexusLocation } from "../location"
import { mapConstructorLocations } from "./map-constructor-locations"

describe("test mapConstructorLocations", () => {
  it("should call fn once per location", () => {
    const [id1, id2] = [crypto.randomUUID(), crypto.randomUUID()]
    const cons: ConstructorTypes["desktopAudioCable"] = {
      fromSocket: NexusLocation.fromSchemaPath(id1, "/tonematrix/audioOutput"),
      toSocket: NexusLocation.fromSchemaPath(id2, "/tinyGain/audioInput"),
    }

    const found = new Set<string>()
    mapConstructorLocations(cons, (loc) => {
      found.add(loc.entityId)
      return loc
    })

    expect(found.size).toBe(2)
    expect(found.has(id1)).toBeTruthy()
    expect(found.has(id2)).toBeTruthy()
  })

  it("should properly clone the object", () => {
    const [id1, id2] = [crypto.randomUUID(), crypto.randomUUID()]
    const cons: ConstructorTypes["desktopAudioCable"] = {
      fromSocket: NexusLocation.fromSchemaPath(id1, "/tonematrix/audioOutput"),
      toSocket: NexusLocation.fromSchemaPath(id2, "/tinyGain/audioInput"),
      colorIndex: 10,
    }
    const mapped = mapConstructorLocations(cons, (loc) => loc)
    expect(mapped).toMatchObject(cons)
  })

  it("should properly clone with mapped locations", () => {
    const [loc1, loc2] = [
      NexusLocation.fromSchemaPath(
        crypto.randomUUID(),
        "/tonematrix/audioOutput",
      ),
      NexusLocation.fromSchemaPath(crypto.randomUUID(), "/tinyGain/audioInput"),
    ]
    const cons: ConstructorTypes["desktopAudioCable"] = {
      fromSocket: loc1,
      toSocket: loc2,
      colorIndex: 10,
    }

    const [loc3, loc4] = [
      NexusLocation.fromSchemaPath(crypto.randomUUID(), "/quasar/audioInput"),
      NexusLocation.fromSchemaPath(
        crypto.randomUUID(),
        "/bassline/audioOutput",
      ),
    ]
    const mapped = mapConstructorLocations(cons, (loc) => {
      if (loc.entityId === loc1.entityId) {
        return loc3
      } else if (loc.entityId === loc2.entityId) {
        return loc4
      } else {
        throw new Error("unreachable")
      }
    })
    expect(mapped).toMatchObject({
      ...cons,
      fromSocket: loc3,
      toSocket: loc4,
    })
  })
})
