import { Transaction } from "@gen/document/v1/document_service_pb"
import { beforeEach, describe, expect, it } from "vitest"
import type { WasmDocumentState } from "../create-wasm-document-state"
import { NexusStateConsolidator } from "./consolidator"

/*

This file tests the consolidator. It does this by sending and receiving
"mock transactions", which is transactions that:
* have an integer string as id
* have commit index 0 or 1, where 1 indicates the 0 version but reversed

With this, we can simplify a transaction to the tuple ["f" | "r", number],
where "r" | "f" indicates "reverse"/"forward", and the number the transaction id.
*/

type TestContext = {
  /** Runs consolidator.synchronize, returns a list ["f" | r, number]
   * where ["f", i] indicates transaction number `i` forward, and "r" backward
   * returned by `consolidator.synchronize`. The document state does nothing
   * but return the "reverse" transaction using the reverse function below.
   */
  runSynchronize: (props: {
    received?: Transaction[]
    receivedRejected?: string[]
    created?: Transaction[]
  }) => ["f" | "r", number][]

  /** A list of example transactions, transactions[i] returns a transaction with id `i` */
  transactions: Transaction[]

  /** Makes the document state mark transactions with id `i` as invalid from now on,
   * either in forward or backwards direction
   */
  invalidateTransaction: (i: number, direction: "f" | "r") => void

  /** Does the reverse of the previous method */
  validateTransaction: (i: number, direction: "f" | "r") => void
}

/** Reversing a transaction means changing its commit index from 0 to 1 */
const reverse = (t: Transaction) => {
  t = t.clone()
  t.commitIndex = t.commitIndex === 0n ? 1n : 0n
  return t
}

describe("NexusStateConsolidator", () => {
  beforeEach<TestContext>((context) => {
    const invalid = new Set()
    context.invalidateTransaction = (i, direction) =>
      invalid.add(`${i}-${direction}`)
    context.validateTransaction = (i, direction) =>
      invalid.delete(`${i}-${direction}`)

    const mockState: WasmDocumentState = {
      applyTransaction: (t: Transaction): string | Transaction =>
        invalid.has(`${t.id}-${t.commitIndex == 0n ? "f" : "r"}`)
          ? "rejected"
          : reverse(t),
      terminate: () => {},
    }

    context.transactions = Array(20)
      .fill(0)
      .map((_, i) => new Transaction({ id: i.toString(), commitIndex: 0n }))

    const consolidator = new NexusStateConsolidator(mockState)
    context.runSynchronize = ({
      received,
      receivedRejected,
      created,
    }: {
      received?: Transaction[]
      receivedRejected?: string[]
      created?: Transaction[]
    }) =>
      consolidator
        .consolidate(
          received ?? [],
          new Set(receivedRejected ?? []),
          created ?? [],
        )
        .map((t) =>
          t.commitIndex === 0n ? ["f", parseInt(t.id)] : ["r", parseInt(t.id)],
        )
  })

  it<TestContext>("shouldn't do anything without received", (context) => {
    const ts = context.transactions
    expect(context.runSynchronize({ created: [ts[0], ts[1]] })).toHaveLength(0)
  })

  it<TestContext>("transactions are fast forwarded", (context) => {
    // if the received transactions match those that are created,
    // then `synchronize` should return an empty list, since nothing has to be
    // done to make the states match
    const ts = context.transactions

    expect(
      context.runSynchronize({
        created: [ts[0], ts[1]],
        received: [ts[0], ts[1]],
      }),
    ).toHaveLength(0)
  })

  it<TestContext>("should fast forward even if new transactions are at end", (context) => {
    // the fast forwarding should forward as many transactions as possible
    const ts = context.transactions
    expect(
      context.runSynchronize({
        created: [ts[0], ts[1]],
        received: [ts[0], ts[1], ts[2]],
      }),
    ).toMatchObject([["f", 2]])
  })

  it<TestContext>("reverse and re-apply if created isn't confirmed", (context) => {
    // If an incoming transaction is unknown (i.e. not created by the local client), the pending transaction should be reverted,
    // the incoming applied, and then the pending re-applied.
    const ts = context.transactions

    expect(
      context.runSynchronize({
        created: [ts[1]],
        received: [ts[2]],
      }),
    ).toMatchObject([
      ["r", 1],
      ["f", 2],
      ["f", 1],
    ])
  })

  it<TestContext>("reverse and re-apply with confirmation", (context) => {
    // the same thing as above, but this time the pending transaction
    // is also confirmed
    const ts = context.transactions

    expect(
      context.runSynchronize({
        created: [ts[1]],
        received: [ts[2], ts[1]],
      }),
    ).toMatchObject([
      ["r", 1],
      ["f", 2],
      ["f", 1],
    ])
  })

  it<TestContext>("reverse and re-apply after fast-forward", (context) => {
    // make sure the reversal mechanism works together with fast-forwarding
    const ts = context.transactions

    expect(
      context.runSynchronize({
        created: [ts[0], ts[1]],
        received: [ts[0], ts[2], ts[1]],
      }),
    ).toMatchObject([
      ["r", 1],
      ["f", 2],
      ["f", 1],
    ])
  })

  it<TestContext>("should fast forward on kept pending transaction", (context) => {
    const ts = context.transactions
    context.runSynchronize({
      created: [ts[0]],
    })
    expect(
      context.runSynchronize({
        received: [ts[0]],
      }),
    ).toMatchObject([])
  })

  it<TestContext>("should revert on kept pending transaction", (context) => {
    const ts = context.transactions
    context.runSynchronize({
      created: [ts[1]],
    })
    expect(
      context.runSynchronize({
        received: [ts[2]],
      }),
    ).toMatchObject([
      ["r", 1],
      ["f", 2],
      ["f", 1],
    ])
  })

  it<TestContext>("should not re-apply invalid transactions", (context) => {
    const ts = context.transactions
    context.runSynchronize({
      created: [ts[1]],
    })
    context.invalidateTransaction(1, "f")
    expect(
      context.runSynchronize({
        received: [ts[2]],
      }),
    ).toMatchObject([
      ["r", 1],
      ["f", 2],
    ])
  })

  it<TestContext>("should reverse transaction order if reverting transactions", (context) => {
    const ts = context.transactions
    context.runSynchronize({
      created: [ts[1], ts[2], ts[3]],
    })
    expect(
      context.runSynchronize({
        received: [ts[4]],
      }),
    ).toMatchObject([
      ["r", 3],
      ["r", 2],
      ["r", 1],

      ["f", 4],

      ["f", 1],
      ["f", 2],
      ["f", 3],
    ])
  })

  it<TestContext>("should only skip invalid transactions", (context) => {
    // If re-applying transactions, skip the invalid ones
    const ts = context.transactions
    context.runSynchronize({
      created: [ts[1], ts[2], ts[3]],
    })
    context.invalidateTransaction(2, "f")
    expect(
      context.runSynchronize({
        received: [ts[4]],
      }),
    ).toMatchObject([
      ["r", 3],
      ["r", 2],
      ["r", 1],

      ["f", 4],

      ["f", 1],
      ["f", 3],
    ])
  })

  it<TestContext>("should reverse rejected transactions", (context) => {
    // make sure the reversal mechanism works together with fast-forwarding
    const ts = context.transactions

    expect(
      context.runSynchronize({
        created: [ts[0]],
        received: [],
        receivedRejected: ["0"],
      }),
    ).toMatchObject([["r", 0]])
  })

  it<TestContext>("should reverse rejected transactions after fast forward", (context) => {
    // should not re-apply pending after fast-forwarding if the transaction is rejected
    const ts = context.transactions

    expect(
      context.runSynchronize({
        created: [ts[0], ts[1]],
        received: [ts[0]],
        receivedRejected: ["1"],
      }),
    ).toMatchObject([["r", 1]])
  })

  it<TestContext>("should skip rejected after reversal & re-application", (context) => {
    // This tests tests most features: fast-forwarding, rejection, reversal, and re-application
    const ts = context.transactions

    expect(
      context.runSynchronize({
        created: [ts[0], ts[1], ts[2], ts[4]],
        received: [ts[0], ts[3], ts[1]],
        receivedRejected: ["2"],
      }),
    ).toMatchObject([
      ["r", 4],
      ["r", 2],
      ["r", 1],

      ["f", 3],

      ["f", 1],
      ["f", 4],
    ])
  })

  it<TestContext>("only roll back rejected at end of created", (context) => {
    const ts = context.transactions

    context.runSynchronize({
      created: [ts[0], ts[1], ts[2]],
    })
    expect(
      context.runSynchronize({
        receivedRejected: ["2"],
      }),
    ).toMatchObject([["r", 2]])
  })

  it<TestContext>("only roll back until rejected", (context) => {
    // this happens if a transaction in the middle was rejected
    const ts = context.transactions

    expect(
      context.runSynchronize({
        created: [ts[0], ts[1], ts[2]],
        received: [],
        receivedRejected: ["1"],
      }),
    ).toMatchObject([
      ["r", 2],
      ["r", 1],
      ["f", 2],
    ])
  })

  it<TestContext>("only roll back until first rejected", (context) => {
    // make sure that rollback happens only until the first rejected
    // pending transactions, even if multiple rejections are there

    const ts = context.transactions
    context.runSynchronize({
      created: [ts[0], ts[1], ts[2], ts[3], ts[4]],
    })
    expect(
      context.runSynchronize({
        receivedRejected: ["1", "3"],
      }),
    ).toMatchObject([
      ["r", 4],
      ["r", 3],
      ["r", 2],
      ["r", 1],

      ["f", 2],

      ["f", 4],
    ])
  })

  it<TestContext>("only roll back until rejected after fast forwarding", (context) => {
    // this demonstrates that the rollback is only done until the first transaction
    // that was rejected, even if there are incoming transactions - if they can be forwarded
    const ts = context.transactions

    context.runSynchronize({
      created: [ts[0], ts[1], ts[2], ts[3]],
    })
    expect(
      context.runSynchronize({
        received: [ts[0]],
        receivedRejected: ["2"],
      }),
    ).toMatchObject([
      ["r", 3],
      ["r", 2],
      ["f", 3],
    ])
  })

  it<TestContext>("local invalid becomes remote valid", (context) => {
    // tests the edge case that local verification of a transaction is invalid,
    // but the server sends it as valid transaction anyway, due to the interleaving
    // of another transaction from another client that makes the transaction valid again.
    const ts = context.transactions

    // local history is:
    // 0 1 2
    context.runSynchronize({
      created: [ts[0], ts[1], ts[2]],
    })

    // invalidate 1
    context.invalidateTransaction(1, "f")

    // now is:
    // ~2 ~1 ~0 3 0 2
    context.runSynchronize({
      received: [ts[3]],
    })

    // validate 1
    context.validateTransaction(1, "f")

    // now send 1 again, and make sure it is returned
    expect(
      context.runSynchronize({
        received: [ts[0], ts[4], ts[1]],
      }),
    ).toMatchObject([
      ["r", 2],
      ["f", 4],
      ["f", 1],
      ["f", 2],
    ])
  })

  // -------------
  // The following few tests makes sure that the consolidator throws if a contract is violated
  // that would lead to an inconsistent state. These are error cases we assume to never happen.

  it<TestContext>("throws if initial created forward is invalid", (context) => {
    // Contract: We can apply forward versions of new created transactions
    const ts = context.transactions

    context.invalidateTransaction(0, "f")
    expect(() =>
      context.runSynchronize({
        created: [ts[0]],
      }),
    ).toThrow()
  })

  it<TestContext>("throws if initial received forward is invalid", (context) => {
    // Contract: We can apply forward versions of new received transactions
    const ts = context.transactions

    context.invalidateTransaction(0, "f")
    expect(() =>
      context.runSynchronize({
        received: [ts[0]],
      }),
    ).toThrow()
  })

  it<TestContext>("throws if pending reversal application due to converging received is invalid", (context) => {
    // We can apply created reversals of pending transactions
    const ts = context.transactions

    ;(context.runSynchronize({
      created: [ts[0]],
    }),
      context.invalidateTransaction(0, "r"))
    expect(() =>
      // results in application of ~0, 1 - we expect ~0 to throw
      context.runSynchronize({
        received: [ts[1]],
      }),
    ).toThrow()
  })

  it<TestContext>("throws if pending reversal application due to rejection is invalid", (context) => {
    // We can apply created reversals of pending transactions
    const ts = context.transactions

    ;(context.runSynchronize({
      created: [ts[0]],
    }),
      context.invalidateTransaction(0, "r"))
    expect(() =>
      // results in application of ~0, 1 - we expect ~0 to throw
      context.runSynchronize({
        receivedRejected: ["0"],
      }),
    ).toThrow()
  })
})
