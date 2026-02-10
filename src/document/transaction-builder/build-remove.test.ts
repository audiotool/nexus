import { Delete, Modification } from "@gen/document/v1/document_service_pb"
import { describe, expect, it } from "vitest"
import { buildModificationForRemove } from "./build-remove"

describe("test build remove modification", () => {
  it("should build the correct remove modification", () => {
    const id = crypto.randomUUID()
    const modif = buildModificationForRemove(id)
    expect(modif).toMatchObject(
      new Modification({
        modification: {
          case: "delete",
          value: new Delete({
            entityId: id,
          }),
        },
      }),
    )
  })
})
