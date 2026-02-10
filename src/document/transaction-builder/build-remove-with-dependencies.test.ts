import type { Delete, Modification } from "@gen/document/v1/document_service_pb"
import { HashMap } from "@utils/hash-map"
import { throw_ } from "@utils/lang"
import { beforeEach, describe, expect, it } from "vitest"
import { nexusDocumentState } from "../document-state/state"
import type { NexusEntity } from "../entity"
import { NexusLocation } from "../location"
import { EntityQuery } from "../query/entity"
import { buildModificationForRemoveWithDependencies } from "./build-remove-with-dependencies"

const extractUuids = (mods: Modification[]): string[] =>
  mods.map((mod) => (mod.modification.value as Delete).entityId ?? throw_())

describe("test buildModificationForRemoveWithDependencies", () => {
  /** Contains a list of 5 entities that are connected like this:
   *  ```text
   *   0 ─► 1 ─┐
   *   │       ├──► 3 ─► 4
   *   │       │
   *   └──► 2 ─┘    5 <- not referenced by any other entity
   * ```
   */
  type TestContext = {
    uuids: string[]
    query: EntityQuery
  }

  beforeEach<TestContext>((context) => {
    context.uuids = Array(6)
      .fill(0)
      .map(() => crypto.randomUUID())

    const entities = new Map()
    context.uuids.map((id) => entities.set(id, { id } as NexusEntity))
    const references: HashMap<NexusLocation, NexusLocation[]> = new HashMap()

    let idx = 0
    const toLocation = (id: string): NexusLocation =>
      new NexusLocation(id, "tinyGain", [idx++])

    const addFromTo = (fromIndex: number, toIndex: number) => {
      const from = toLocation(context.uuids[fromIndex])
      const to = toLocation(context.uuids[toIndex])
      const froms = references.get(to) ?? []
      froms.push(from)
      references.set(to, froms)
    }

    addFromTo(0, 1)
    addFromTo(0, 2)
    addFromTo(1, 3)
    addFromTo(2, 3)
    addFromTo(3, 4)

    context.query = new EntityQuery({
      documentState: nexusDocumentState({
        entities,
        references,
      }),
      documentLock: undefined,
    })
  })

  it<TestContext>("should remove a single entity correctly", (context) => {
    const creates = buildModificationForRemoveWithDependencies(
      context.uuids[5],
      context.query,
    )

    const actual = extractUuids(creates)
    expect(actual).toMatchObject([context.uuids[5]])
    expect(actual.length).toBe(1)
  })

  it<TestContext>("should remove a second entity correctly", (context) => {
    const creates = buildModificationForRemoveWithDependencies(
      context.uuids[1],
      context.query,
    )
    const actual = extractUuids(creates)
    expect(actual).toMatchObject([context.uuids[0], context.uuids[1]])
  })

  it<TestContext>("should remove three entities correctly", (context) => {
    const creates = buildModificationForRemoveWithDependencies(
      context.uuids[3],
      context.query,
    )
    const actual = extractUuids(creates)
    expect(actual[0]).toEqual(context.uuids[0])
    expect(actual[1]).oneOf([context.uuids[1], context.uuids[2]])
    expect(actual[2]).oneOf([context.uuids[1], context.uuids[2]])
    expect(actual[1]).not.toEqual(actual[2])
    expect(actual[3]).toEqual(context.uuids[3])
    expect(actual.length).toBe(4)
  })
})
