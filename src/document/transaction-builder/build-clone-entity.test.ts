import { packedEntity } from "@document/entity-utils"
import { Modification } from "@gen/document/v1/document_service_pb"
import { describe, expect, it } from "vitest"
import { NexusDocument } from "../document"
import { buildModificationForEntityClone } from "./build-clone-entity"

describe("test modification builder for entity clones", () => {
  it("should clone the entity correctly", async () => {
    const nexus = new NexusDocument()
    await nexus.takeTransactions()

    const tinyGain = (await nexus.createTransaction()).create("tinyGain", {})

    const { modification, entityId } = buildModificationForEntityClone(tinyGain)

    expect(entityId).not.toEqual(tinyGain.id)
    expect(modification).toMatchObject(
      new Modification({
        modification: {
          case: "create",
          value: {
            entity: packedEntity("tinyGain", {
              audioInput: {},
              audioOutput: {},
              gain: 1,
              id: entityId,
              isActive: true,
              isMuted: false,
            }),
          },
        },
      }),
    )
  })

  it("should clone the entity correctly overwriting args", async () => {
    const nexus = new NexusDocument()
    await nexus.takeTransactions()
    const output = (await nexus.createTransaction()).create("tinyGain", {})

    const { modification, entityId } = buildModificationForEntityClone(output, {
      gain: 0.6,
      isActive: false,
      isMuted: true,
    })

    expect(entityId).not.toEqual(output.id)
    expect(modification).toMatchObject(
      new Modification({
        modification: {
          case: "create",
          value: {
            entity: packedEntity("tinyGain", {
              audioInput: {},
              audioOutput: {},
              gain: 0.6,
              id: entityId,
              isActive: false,
              isMuted: true,
            }),
          },
        },
      }),
    )
  })
})
