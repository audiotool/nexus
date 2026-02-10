import { Transaction } from "@gen/document/v1/document_service_pb"
import { WasmDocumentState } from "../create-wasm-document-state"
import type { ReadonlyTransaction } from "../gateway"

/**
 * This class can be used to "consolidate" two transaction histories in such a way that
 * they reach the same document state.
 *
 * It assumes two document states, a "local" one for which
 * transactions are "created", and a "remote" one for which transactions are "received". Calling
 * {@link consolidate} on newly created and received transaction will return a list of transactions
 * which, if applied to the local document, will make it match the "remote" document state -
 * plus created-but-not-yet-confirmed transactions.
 */
export class NexusStateConsolidator {
  /**
   * A copy of the document state, to validate that pending transactions can still be applied,
   * and drop them if not.
   */
  #state: WasmDocumentState

  /**
   * Transactions not yet confirmed or rejected by the remote.
   *
   * This is list contains `[forward, backward]` transactions, where `forward` are always the last transactions
   * applied to {@link #state}, while backwards contains their respective reverse, so the state
   * before all transactions in {@link #pending} can be restored.
   */
  #pending: [Transaction, Transaction][] = []

  constructor(state: WasmDocumentState) {
    this.#state = state
  }

  /**
   * Consolidate the local and remote transaction history.
   *
   * @param newReceived Newly received transaction from the remote
   * @param newReceivedRejected Newly received transaction rejections from the remote. **must be a subset of previously created transactions**
   * @param newCreated Newly created transactions on the local document
   * @returns Transactions needed to sync local & remote, plus transactions created but not yet received
   */
  consolidate(
    /** new transactions received from the document service since the last time `synchronize` was called */
    newReceived: Transaction[],
    /** new rejected transactions received from the document service. Must be a subset of `newOutgoing`. */
    newReceivedRejected: Set<string>,
    /** new locally created transactions */
    newCreated: Transaction[],
  ): ReadonlyTransaction[] {
    // push `newCreated` on top of pending
    newCreated.forEach((transaction) => {
      const reverse = this.#state.applyTransaction(transaction)
      if (!(reverse instanceof Transaction)) {
        throw new Error(`Error applying reverse transaction: ${reverse}`)
      }
      this.#pending.push([transaction, reverse])
    })

    // ---
    // fast-forwarding
    let nextReceived = newReceived[0]
    let nextPending = this.#pending[0]
    while (
      nextReceived !== undefined &&
      nextPending !== undefined &&
      nextReceived.id === nextPending[0].id
    ) {
      newReceived.shift()
      this.#pending.shift()
      nextReceived = newReceived[0]
      nextPending = this.#pending[0]
    }

    // If this is the case, we've fast-forwarded on all received transactions.
    //
    // This means, we don't have to undo _all_ pending transactions, only those that
    // were rejected.
    if (newReceived.length === 0) {
      // here, we don't have to do anything - we're already in sync
      if (newReceivedRejected.size === 0) {
        return []
      }

      // Get all pending transactions we need to revert (some of which will be re-applied later)
      // and remove them from `#pending`
      const firstRejectedIdx = this.#pending.findIndex(([forward]) =>
        newReceivedRejected.has(forward.id),
      )

      // This shouldn't happen. If it does, we got a rejection of a transaction that we can't
      // find anymore.
      if (firstRejectedIdx === -1) {
        throw new Error(
          "Invariant violation: expected to find rejected transaction in #pending, but didn't. This is a bug.",
        )
      }

      const toRevert = this.#pending.splice(firstRejectedIdx)

      // extract the reversal of the transactions, apply them to the local document state
      const revert = toRevert
        .map(([, backward]) => {
          if (
            !(this.#state.applyTransaction(backward) instanceof Transaction)
          ) {
            throw new Error("error applying reversal of transaction")
          }
          // Clone to prevent mutation by applyIncomingTransactions from affecting #pending
          return backward
        })
        .reverse()

      // new pending is `toRevert`, except for those that are rejected. Apply to document
      // state and fetch reversal to apply to #pending.
      const newPending = toRevert
        .filter(([forward]) => !newReceivedRejected.has(forward.id))
        .map(([forward]) => {
          const reverse = this.#state.applyTransaction(forward)
          if (!(reverse instanceof Transaction)) {
            return undefined
          }
          return [forward, reverse]
        })
        .filter((v) => v !== undefined) as [Transaction, Transaction][]

      // push to pending
      this.#pending.push(...newPending)

      // Clone forward transactions to prevent mutation by applyIncomingTransactions
      return [...revert, ...newPending.map(([fwd]) => fwd)]
    }

    // Otherwise, we have at least one new transaction that comes before all our pending transaction.
    // So we have undo all pending transaction, apply the new transaction, then re-apply all pending
    // transactions that aren't part of part of the received transactions or have
    // been rejected.

    const revertPending = this.#pending
      .map((entry) => entry[1].clone())
      .reverse()

    // apply reverted transactions to internal document state
    revertPending.forEach((t) => {
      const reverse = this.#state.applyTransaction(t)
      if (!(reverse instanceof Transaction)) {
        throw new Error(`Error applying reverse transaction: ${reverse}`)
      }
    })

    // apply received transactions to internal state
    newReceived.forEach((transaction) => {
      const reverse = this.#state.applyTransaction(transaction)
      if (!(reverse instanceof Transaction)) {
        throw new Error(`Error applying incoming transaction: ${reverse}`)
      }
    })

    // filter, then apply all pending transactions to local document state
    this.#pending = this.#pending
      // filter transactions that have been rejected or already in `newIncoming`
      .filter(([forward]) => {
        const isRejected = newReceivedRejected.has(forward.id)
        const isIncoming = newReceived.some(
          (incoming) => incoming.id === forward.id,
        )
        return !isRejected && !isIncoming
      })
      // try applying to current state; if it fails, simply drop - we expect them to be
      // dropped by document service as well. If not, they'll seem like a foreign transaction
      // and be applied as such.
      .map(([forward]) => {
        const reverse = this.#state.applyTransaction(forward)
        return reverse instanceof Transaction ? [forward, reverse] : undefined
      })
      .filter((v) => v !== undefined) as [Transaction, Transaction][]

    // Clone forward transactions to prevent mutation by applyIncomingTransactions
    return [
      ...revertPending,
      ...newReceived,
      ...this.#pending.map(([fwd]) => fwd),
    ]
  }
}
