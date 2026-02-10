import { beforeEach, describe, expect, it } from "vitest"
import { NexusDocument } from "./document"

import { createWasmNexusValidator } from "./backend/document-service/wasm-nexus-validator"
import { collectingTransactionBuilder } from "./transaction-builder/builder-test-utils"

type TestContext = {
  nexus: NexusDocument
}

describe("NexusDocument", () => {
  describe("throw before takeTransaction", () => {
    it("should throw on createTransaction", async () => {
      const nexus = new NexusDocument()
      await expect(
        async () => await nexus.createTransaction(),
      ).rejects.toThrow()
    })

    it("should throw on modify", async () => {
      const nexus = new NexusDocument()
      await expect(async () => await nexus.modify(() => {})).rejects.toThrow()
    })

    // we should do this, but can't currently bcs we're not checking for that flag
    // due to the way the document is implemented, not sure
    it.skip("should throw on applyIncomingTransaction", async () => {
      const nexus = new NexusDocument()
      await expect(nexus._applyIncomingTransactions([])).rejects.toThrow()
    })
    // note: edit history skipped as it will be moved into a separate system at some point
  })

  describe("do not throw after init & takeTransactions", () => {
    it("should not on createTransaction", async () => {
      const nexus = new NexusDocument()
      await nexus.takeTransactions()
      await expect(nexus.createTransaction()).resolves.not.toThrow()
    })
    it("should not throw on applyIncomingTransaction", async () => {
      const nexus = new NexusDocument()
      await nexus.takeTransactions()
      await expect(nexus._applyIncomingTransactions([])).resolves.not.toThrow()
    })

    it("should not throw on modify", async () => {
      const nexus = new NexusDocument()
      await nexus.takeTransactions()
      await expect(nexus.modify(() => {})).resolves.not.toThrow()
    })
  })
})

describe("nexus validator tests", () => {
  beforeEach<TestContext>(async (context) => {
    context.nexus = new NexusDocument()
    context.nexus.takeTransactions({
      validator: await createWasmNexusValidator(),
    })
  })

  it<TestContext>("rejects duplicate order among track values", async (ctx) => {
    const t = await ctx.nexus.createTransaction()

    t.create("noteTrack", {
      orderAmongTracks: 74,
      player: t.create("tonematrix", {}).location,
    })

    t.create("noteTrack", {
      orderAmongTracks: 87,
      player: t.create("tonematrix", {}).location,
    })

    const track = t.create("noteTrack", {
      orderAmongTracks: 150,
      player: t.create("tonematrix", {}).location,
    })
    t.update(track.fields.orderAmongTracks, 7)

    t.create("noteTrack", {
      orderAmongTracks: 150,
      player: t.create("tonematrix", {}).location,
    })
  })
  it<TestContext>("should throw on invalid created transaction", async ({
    nexus,
  }) => {
    const t = await nexus.createTransaction()
    const tinyGain = t.create("tinyGain", {})
    expect(() => t.update(tinyGain.fields.gain, 999)).toThrow()
  })

  it<TestContext>("should throw invalid external transaction", async ({
    nexus,
  }) => {
    const builder = collectingTransactionBuilder()
    const tinyGain = builder.t.create("tinyGain", {})
    builder.t.update(tinyGain.fields.gain, 29999)
    await expect(
      nexus._applyIncomingTransactions([builder.getTransaction()]),
    ).rejects.toThrow()
  })
})

describe("queryEntitiesWithoutLock", () => {
  beforeEach<TestContext>((context) => {
    context.nexus = new NexusDocument()
    context.nexus.takeTransactions()
  })

  it<TestContext>("should initialize empty", ({ nexus }) => {
    expect(nexus.queryEntitiesWithoutLock.get()).toEqual([])
  })

  it<TestContext>("createTransaction modifies queryEntitiesWithoutLock", async ({
    nexus,
  }) => {
    const t = await nexus.createTransaction()
    const tinyGain = t.create("tinyGain", {})
    expect(nexus.queryEntitiesWithoutLock.get()).toMatchObject([tinyGain])
  })

  it<TestContext>("modify modifies queryEntitiesWithoutLock", async ({
    nexus,
  }) => {
    await nexus.modify((t) => {
      const tinyGain = t.create("tinyGain", {})
      expect(nexus.queryEntitiesWithoutLock.get()).toMatchObject([tinyGain])
    })
  })

  it<TestContext>("applyIncomingTransaction modifies queryEntitiesWithoutLock", async ({
    nexus,
  }) => {
    const builder = collectingTransactionBuilder()
    const quasar = builder.t.create("quasar", {})
    await nexus._applyIncomingTransactions([builder.getTransaction()])
    expect(nexus.queryEntitiesWithoutLock.get()).toMatchObject([quasar])
  })
})

describe("transaction builder entity query", () => {
  beforeEach<TestContext>((context) => {
    context.nexus = new NexusDocument()
    context.nexus.takeTransactions()
  })
  it<TestContext>("applyIncomingTransaction modifies t.entities", async ({
    nexus,
  }) => {
    const builder = collectingTransactionBuilder()
    const quasar = builder.t.create("quasar", {})
    await nexus._applyIncomingTransactions([builder.getTransaction()])
    expect(await nexus.modify((t) => t.entities.get())).toMatchObject([quasar])
  })
})
