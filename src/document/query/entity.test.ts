import { NexusDocument } from "@document/document"
import type { NexusEntity, NexusEntityUnion } from "@document/entity"
import type { EntityQuery } from "@document/query/entity"
import type { EntityTypes } from "@gen/document/v1/utils/types"
import { beforeEach, describe, expect, expectTypeOf, it } from "vitest"
import type { TransactionBuilder } from "../transaction-builder"
import { onlyTransactionBuilder } from "../transaction-builder/builder-test-utils"

interface QueryTestContext {
  t: TransactionBuilder
  entityQuery: EntityQuery<keyof EntityTypes>
  bassline1: NexusEntity<"bassline">
  bassline1Track: NexusEntity<"noteTrack">
  bassline2: NexusEntity<"bassline">
  quasar1: NexusEntity<"quasar">
  quasar2: NexusEntity<"quasar">
  tinyGain: NexusEntity<"tinyGain">
  automationTrack1: NexusEntity<"automationTrack">
  automationTrack2: NexusEntity<"automationTrack">
  allEntities: NexusEntity[]
}

describe("EntityQuery", () => {
  beforeEach<QueryTestContext>((context) => {
    context.t = onlyTransactionBuilder()
    context.bassline1 = context.t.create("bassline", {})
    context.bassline1Track = context.t.create("noteTrack", {
      player: context.bassline1.location,
    })
    context.bassline2 = context.t.create("bassline", {})
    context.quasar1 = context.t.create("quasar", {})
    context.quasar2 = context.t.create("quasar", {})
    context.tinyGain = context.t.create("tinyGain", {})

    context.automationTrack1 = context.t.create("automationTrack", {
      automatedParameter: context.bassline1.fields.gain.location,
      orderAmongTracks: 0,
    })
    context.automationTrack2 = context.t.create("automationTrack", {
      automatedParameter: context.bassline1.fields.filterResonance.location,
      orderAmongTracks: 1,
    })

    context.allEntities = [
      context.bassline1,
      context.bassline1Track,
      context.bassline2,
      context.quasar1,
      context.quasar2,
      context.tinyGain,
      context.automationTrack1,
      context.automationTrack2,
    ]

    context.t.send()

    context.entityQuery = context.t.entities
  })

  describe("get", () => {
    it<QueryTestContext>("should return all entities", (context) => {
      const entities = context.entityQuery.get()
      expect(entities).toContainExactly(context.allEntities)
    })
    it("should return [] if there are no entities", async () => {
      const nexus = new NexusDocument()
      await nexus.takeTransactions()
      expect(nexus.queryEntitiesWithoutLock.get()).toStrictEqual([])
    })
  })

  describe("getOne", () => {
    it<QueryTestContext>("should return a single entity if one exists in the query", (context) => {
      const entities = context.entityQuery.getOne()
      expect(entities).toBeDefined()
    })
    it<QueryTestContext>("should return [] if there are no entities", async () => {
      const nexus = new NexusDocument()
      await nexus.takeTransactions()
      expect(nexus.queryEntitiesWithoutLock.getOne()).toBeUndefined()
    })
  })

  describe("getEntity", () => {
    it<QueryTestContext>("should return one entity with the specified id", (context) => {
      const entity = context.entityQuery.getEntity(context.bassline1.id)
      expect(entity).toStrictEqual(context.bassline1)
    })
    it<QueryTestContext>("should return undefined if entity with id does not exist", (context) => {
      const entity = context.entityQuery.getEntity(crypto.randomUUID())
      expect(entity).toBeUndefined()
    })
    it<QueryTestContext>("should return undefined if entity with id is filtered out", (context) => {
      const entity = context.entityQuery
        .ofTypes("quasar")
        .getEntity(context.bassline1.id)
      expect(entity).toBeUndefined()
    })
  })

  describe("mustGetEntity", () => {
    it<QueryTestContext>("should return one entity with the specified id", (context) => {
      const entity = context.entityQuery.mustGetEntity(context.bassline1.id)
      expect(entity).toStrictEqual(context.bassline1)
    })
    it<QueryTestContext>("should throw if entity with id does not exist", (context) => {
      expect(() => {
        context.entityQuery.mustGetEntity(crypto.randomUUID())
      }).toThrow()
    })
  })

  describe("getEntityAs", () => {
    it<QueryTestContext>("should return one entity with the specified id if the type is correct", (context) => {
      const entity = context.entityQuery.getEntityAs(
        context.bassline1.id,
        "bassline",
      )
      expect(entity).toStrictEqual(context.bassline1)
    })
    it<QueryTestContext>("should return undefined if entity with id does not exist", (context) => {
      const entity = context.entityQuery.getEntityAs(
        crypto.randomUUID(),
        "bassline",
      )
      expect(entity).toBeUndefined()
    })
    it<QueryTestContext>("should return undefined if entity type doesn't match", (context) => {
      const entity = context.entityQuery.getEntityAs(
        context.bassline1.id,
        "quasar",
      )
      expect(entity).toBeUndefined()
    })
    it<QueryTestContext>("should return one entity with the specified id if the type is matching any of the types provided", (context) => {
      const entity = context.entityQuery.getEntityAs(
        context.bassline1.id,
        "quasar",
        "bassline",
      )
      expect(entity).toStrictEqual(context.bassline1)
    })
    it<QueryTestContext>("should return undefined if entity with id is filtered out", (context) => {
      const entity = context.entityQuery.pointedToBy
        .entities(context.quasar1.id)
        .getEntityAs(context.bassline1.id, "bassline")
      expect(entity).toBeUndefined()
    })

    // note: not testing the case where the requested entity type has already been filtered out,
    // because that will result in a type error before even compiling.
  })

  describe("mustGetEntityAs", () => {
    it<QueryTestContext>("should return one entity with the specified id if the type is correct", (context) => {
      const entity = context.entityQuery.mustGetEntityAs(
        context.bassline1.id,
        "bassline",
      )
      expect(entity).toStrictEqual(context.bassline1)
    })

    it<QueryTestContext>("should throw if entity with id does not exist", (context) => {
      expect(() => {
        context.entityQuery.mustGetEntityAs(crypto.randomUUID(), "bassline")
      }).toThrow()
    })

    it<QueryTestContext>("should throw if entity type doesn't match", (context) => {
      expect(() => {
        context.entityQuery.mustGetEntityAs(context.bassline1.id, "quasar")
      }).toThrow()
    })
  })

  describe("withIds", () => {
    it<QueryTestContext>("should keep entities with the specified ids", (context) => {
      const entities = context.entityQuery
        .withIds(...[context.bassline1.id, context.quasar2.id])
        .get()
      expect(entities).toContainExactly([context.bassline1, context.quasar2])
    })
    it<QueryTestContext>("even if one of the IDs doesn't match an entity", (context) => {
      const entities = context.entityQuery
        .withIds(
          ...[context.bassline1.id, context.quasar2.id, crypto.randomUUID()],
        )
        .get()
      expect(entities).toContainExactly([context.bassline1, context.quasar2])
    })
    it<QueryTestContext>("should keep nothing if no IDs match the entities", (context) => {
      const entities = context.entityQuery
        .withIds(...[crypto.randomUUID(), crypto.randomUUID()])
        .get()
      expect(entities).toStrictEqual([])
    })
    it<QueryTestContext>("should return empty array if no IDs are specified", (context) => {
      const entities = context.entityQuery.withIds().get()
      expect(entities).toStrictEqual([])
    })
  })

  describe("ofTypes", () => {
    it<QueryTestContext>("should only keep entities of single specified type", (context) => {
      const entities = context.entityQuery.ofTypes("quasar").get()
      expect(entities).toContainExactly([context.quasar1, context.quasar2])
      expectTypeOf(entities).toEqualTypeOf<NexusEntity<"quasar">[]>()
    })
    it<QueryTestContext>("should only keep entities of all specified types", (context) => {
      const entities = context.entityQuery.ofTypes("quasar", "bassline").get()
      expect(entities).toContainExactly([
        context.bassline1,
        context.bassline2,
        context.quasar1,
        context.quasar2,
      ])
      expectTypeOf(entities).toEqualTypeOf<
        (NexusEntity<"quasar"> | NexusEntity<"bassline">)[]
      >()
    })
    it<QueryTestContext>("should keep nothing if there are no entities of specified type", (context) => {
      const entities = context.entityQuery.ofTypes("kobolt").get()
      expect(entities).toStrictEqual([])
    })

    it<QueryTestContext>("should return empty array if no entity type specified", (context) => {
      const entities = context.entityQuery.ofTypes().get()
      expect(entities).toStrictEqual([])
    })
  })

  describe("notOfTypes", () => {
    it<QueryTestContext>("should not return entities of single specified type", (context) => {
      const entities = context.entityQuery
        .notOfTypes("quasar", "automationTrack")
        .get()
      expect(entities).toContainExactly([
        context.bassline1Track,
        context.bassline1,
        context.bassline2,
        context.tinyGain,
      ])
      expectTypeOf(entities).toEqualTypeOf<
        NexusEntityUnion<
          Exclude<keyof EntityTypes, "quasar" | "automationTrack">
        >[]
      >()
    })

    it<QueryTestContext>("should return everything if there are no matching specified entities", (context) => {
      const entities = context.entityQuery.notOfTypes("kobolt").get()
      expect(entities).toStrictEqual(context.allEntities)
    })

    it<QueryTestContext>("should return everything if no entity type specified", (context) => {
      const entities = context.entityQuery.notOfTypes().get()
      expect(entities).toStrictEqual(context.allEntities)
      expectTypeOf(entities).toEqualTypeOf<NexusEntityUnion[]>()
    })
  })

  describe("ofTargetTypes", () => {
    it<QueryTestContext>("should only return entities of target type", (context) => {
      const entities = context.entityQuery
        .ofTargetTypes("NoteTrackPlayer")
        .get()
      expect(entities).toContainExactly([context.bassline1, context.bassline2])
    })
    it<QueryTestContext>("should return empty array if no target type specified", (context) => {
      const entities = context.entityQuery.ofTargetTypes().get()
      expect(entities).toStrictEqual([])
    })
  })

  describe("has", () => {
    it<QueryTestContext>("should return true if query set holds entity with specified id", (context) => {
      expect(context.entityQuery.has(context.bassline1.id)).toStrictEqual(true)
    })
    it<QueryTestContext>("should return false if query set does not hold entity with specified id", (context) => {
      expect(context.entityQuery.has(crypto.randomUUID())).toStrictEqual(false)
    })
    it<QueryTestContext>("should still return true after filter step applied if entity is still included", (context) => {
      const query = context.entityQuery.ofTypes("bassline")
      expect(query.has(context.bassline1.id)).toStrictEqual(true)
    })
    it<QueryTestContext>("should return false if filter step removes entity", (context) => {
      const query = context.entityQuery.ofTypes("bassline")
      expect(query.has(context.quasar1.id)).toStrictEqual(false)
    })
  })

  describe("pointingTo", () => {
    describe("locations", () => {
      it<QueryTestContext>("should only keep entities pointing to the specified nexus location", (context) => {
        const entities = context.entityQuery.pointingTo
          .locations(context.bassline1.location)
          .get()
        expect(entities).toContainExactly([context.bassline1Track])
      })
      it<QueryTestContext>("should return empty array when no locations specified", (context) => {
        const entities = context.entityQuery.pointingTo.locations().get()
        expect(entities).toStrictEqual([])
      })
    })
    describe("entities", () => {
      it<QueryTestContext>("should only keep entities pointing to the specified entities", (context) => {
        const entities = context.entityQuery.pointingTo
          .entities(context.bassline1.id)
          .get()
        expect(entities).toContainExactly([
          context.bassline1Track,
          context.automationTrack1,
          context.automationTrack2,
        ])
      })
      it<QueryTestContext>("should return empty array when no entities specified ", (context) => {
        const entities = context.entityQuery.pointingTo.entities().get()
        expect(entities).toStrictEqual([])
      })
    })
    describe("entityOfType", () => {
      it<QueryTestContext>("should only keep entities pointing to the specified types", (context) => {
        const entities = context.entityQuery.pointingTo
          .entityOfType("bassline")
          .get()
        expect(entities).toContainExactly([
          context.bassline1Track,
          context.automationTrack1,
          context.automationTrack2,
        ])
      })
      it<QueryTestContext>("should return empty array when no entities specified ", (context) => {
        const entities = context.entityQuery.pointingTo.entityOfType().get()
        expect(entities).toStrictEqual([])
      })
    })
  })

  describe("pointedToBy", () => {
    describe("locations", () => {
      it<QueryTestContext>("should only keep entities referenced by the specified pointer", (context) => {
        const entities = context.entityQuery.pointedToBy
          .locations(context.bassline1Track.fields.player.location)
          .get()
        expect(entities).toStrictEqual([context.bassline1])
      })
      it<QueryTestContext>("should return empty array when no locations specified", (context) => {
        const entities = context.entityQuery.pointedToBy.locations().get()
        expect(entities).toStrictEqual([])
      })
    })
    describe("entities", () => {
      it<QueryTestContext>("should only keep entities referenced by the specified entities", (context) => {
        const entities = context.entityQuery.pointedToBy
          .entities(context.bassline1Track.id)
          .get()
        expect(entities).toStrictEqual([context.bassline1])
      })
      it<QueryTestContext>("should return empty array when no entities specified", (context) => {
        const entities = context.entityQuery.pointedToBy.entities().get()
        expect(entities).toStrictEqual([])
      })
    })
    describe("entityOfType", () => {
      it<QueryTestContext>("should only keep entities referenced by the specified entity types", (context) => {
        const entities = context.entityQuery.pointedToBy
          .entityOfType("noteTrack")
          .get()
        expect(entities).toStrictEqual([context.bassline1])
      })
      it<QueryTestContext>("should return empty array when no entities types specified", (context) => {
        const entities = context.entityQuery.pointedToBy.entityOfType().get()
        expect(entities).toStrictEqual([])
      })
    })
  })

  // Tested in more detail in fields.test.ts
  describe("primitiveFields", () => {
    it<QueryTestContext>("should only keep primitive fields of filtered entities", (context) => {
      const fields = context.entityQuery
        .withIds(context.bassline1.id)
        .fields()
        .primitiveFields()
        .ofTargetTypes("AutomatableParameter")
        .get()
      expect(fields).toContainExactly([
        context.bassline1.fields.gain,
        context.bassline1.fields.tuneSemitones,
        context.bassline1.fields.cutoffFrequencyHz,
        context.bassline1.fields.filterResonance,
        context.bassline1.fields.filterEnvelopeModulationDepth,
        context.bassline1.fields.filterDecay,
        context.bassline1.fields.accent,
        context.bassline1.fields.waveformIndex,
        context.bassline1.fields.isActive,
      ])
    })
  })

  describe("should be consistent", () => {
    it<QueryTestContext>("across multiple get() calls", (context) => {
      const query = context.entityQuery.ofTypes("quasar", "bassline")
      query.get()
      const entities2 = query.get()
      expect(entities2).toContainExactly([
        context.bassline1,
        context.bassline2,
        context.quasar1,
        context.quasar2,
      ])
    })

    it<QueryTestContext>("and multiple filter steps", (context) => {
      const query = context.entityQuery.ofTypes("quasar", "bassline")
      query.withIds(context.bassline1.id).get()
      const entities2 = query.ofTypes("quasar").get()
      expect(entities2).toContainExactly([context.quasar1, context.quasar2])
    })
  })

  describe("should not modify source Nexus document", () => {
    it<QueryTestContext>("after multiple filter steps", (context) => {
      const query = context.entityQuery.ofTypes("quasar", "bassline")
      query.withIds(context.bassline1.id).get()
      query.ofTypes("quasar").get()
      expect(context.t.entities.get()).toContainExactly(context.allEntities)
    })

    it<QueryTestContext>("after ofTargetTypes", (context) => {
      const beforeEntities = context.t.entities.get()
      context.entityQuery.ofTargetTypes("NoteTrackPlayer").get()
      const afterEntities = context.t.entities.get()
      expect(beforeEntities).toContainExactly(afterEntities)
    })
  })
})

describe.skip("Benchmarking", () => {
  describe("filtering by uuid", () => {
    it("few entites, many UUIDS", async () => {
      const nexus = new NexusDocument()
      await nexus.takeTransactions()

      const uuids: string[] = []
      // create 100,000 uuids
      for (let i = 0; i < 100000; i++) {
        uuids.push(crypto.randomUUID())
      }

      const transaction = await nexus.createTransaction()

      // create 10 entities and add uuids to list
      for (let i = 0; i < 10; i++) {
        const entity = transaction.create("quasar", {})
        uuids.push(entity.id)
      }
      transaction.send()

      const start = performance.now()
      nexus.queryEntitiesWithoutLock.withIds(...uuids).get()
      const elapsed = performance.now() - start

      console.debug(
        `Time taken: ${Math.round(elapsed * 1000) / 1000} milliseconds`,
      )
    })

    it("few UUIDS, many entities", async () => {
      const nexus = new NexusDocument()
      await nexus.takeTransactions()

      const transaction = await nexus.createTransaction()

      let count = 0
      const uuids: string[] = []

      // create 1,000,000 entities
      for (let i = 0; i < 10; i++) {
        const entity = transaction.create("quasar", {})

        // only add 10 uuids
        if (count < 10) {
          uuids.push(entity.id)
        }
        count++
      }
      transaction.send()

      const start = performance.now()
      nexus.queryEntitiesWithoutLock.withIds(...uuids).get()
      const elapsed = performance.now() - start

      console.debug(
        `Time taken: ${Math.round(elapsed * 1000) / 1000} milliseconds`,
      )
    })
  })

  describe("filtering by type", () => {
    it("few types, many entities", async () => {
      const nexus = new NexusDocument()
      await nexus.takeTransactions()

      const transaction = await nexus.createTransaction()

      // create 1,000,000 entities
      for (let i = 0; i < 10; i++) {
        if (i % 2 === 0) {
          transaction.create("quasar", {})
        } else if (i % 3 === 0) {
          transaction.create("stompboxCompressor", {})
        } else {
          transaction.create("stompboxDelay", {})
        }
      }
      transaction.send()

      const start = performance.now()
      nexus.queryEntitiesWithoutLock
        .ofTypes("quasar", "stompboxCompressor")
        .get()
      const elapsed = performance.now() - start

      console.debug(
        `Time taken: ${Math.round(elapsed * 1000) / 1000} milliseconds`,
      )
    })
  })
})
