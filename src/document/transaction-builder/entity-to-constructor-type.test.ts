import { DesktopAudioCable } from "@gen/document/v1/entity/desktop_audio_cable/v1/desktop_audio_cable_pb"
import { describe, expect, it } from "vitest"
import { NexusDocument } from "../document"
import { createEntity } from "../document-state/create-entity"
import { NexusLocation } from "../location"
import { entityToConstructorType } from "./entity-to-constructor-type"

describe("Convert default entities to constructor types", () => {
  it("should correctly convert nested entity", async () => {
    const nexus = new NexusDocument()
    await nexus.takeTransactions()

    const t = await nexus.createTransaction()

    const tonematrix_0 = t.create("tonematrix", {})
    const converted = entityToConstructorType(tonematrix_0)

    expect(converted).toMatchObject({
      patternIndex: 0,
      microTuning: {
        entityId: "",
        fieldIndex: [],
      },
    })
  })

  it("should correctly convert nexus locations", async () => {
    const fromSocketLoc = NexusLocation.fromSchemaPath(
      crypto.randomUUID(),
      "/tonematrix/audioOutput",
    )
    const toSocketLoc = NexusLocation.fromSchemaPath(
      crypto.randomUUID(),
      "/tinyGain/audioInput",
    )

    const nexus = new NexusDocument()
    await nexus.takeTransactions()

    const connection = createEntity(
      () => "tinyGain",
      new DesktopAudioCable({
        fromSocket: {
          entityId: fromSocketLoc.entityId,
          fieldIndex: fromSocketLoc.fieldIndex as number[],
        },
        toSocket: {
          entityId: toSocketLoc.entityId,
          fieldIndex: toSocketLoc.fieldIndex as number[],
        },
        colorIndex: 9,
      }),
    )

    const connectionCons = entityToConstructorType(connection)

    expect(connectionCons).toMatchObject({
      toSocket: {
        entityId: toSocketLoc.entityId,
        fieldIndex: toSocketLoc.fieldIndex,
      },
      fromSocket: {
        entityId: fromSocketLoc.entityId,
        fieldIndex: fromSocketLoc.fieldIndex,
      },
      colorIndex: 9,
    })
  })
})
