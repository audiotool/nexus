import { Modification } from "@gen/document/v1/document_service_pb"
import { describe, expect, it } from "vitest"
import { NexusDocument } from "../document"
import { buildModificationForFieldUpdate } from "./build-field-update"

describe("test buildModificationForFieldUpdate", () => {
  it("should create the correct modification", async () => {
    const nexus = new NexusDocument()
    await nexus.takeTransactions()

    const field = (await nexus.createTransaction()).create("tonematrix", {})
      .fields.patternIndex

    const modification = buildModificationForFieldUpdate(field, 22)
    expect(modification).toMatchObject(
      new Modification({
        modification: {
          case: "update",
          value: {
            field: field.location.toPointerMessage(),
            value: {
              case: "int32",
              value: 22,
            },
          },
        },
      }),
    )
  })
})
