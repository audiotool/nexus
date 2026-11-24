import { Code, ConnectError } from "@connectrpc/connect"
import type { DocumentService } from "@gen/document/v1/document_service_connect"
import type { Transaction } from "@gen/document/v1/document_service_pb"
import type { RehomableRetryingClient } from "@utils/grpc/rehomable-retrying-client"
import {
  ValueNotifier,
  type ObservableValue,
} from "@utils/observable-notifier-value"

export type TransactionSender = {
  sendNextTransaction: (t: Transaction) => Promise<string | undefined>

  /** Turns to false if sending is temporarily interrupted. */
  connectionOk: ObservableValue<boolean>

  /** Abort the in-flight send and send the same batch again. Call this when a problem is
   * detected outside of the sender (e.g. a failing ping), because a send to a server that
   * silently stopped answering never settles on its own.
   */
  reconnect: () => void

  /** Terminate this sender. This will cause all sendNextTransaction calls
   * to throw. The promise will resolve once the last transaction has been
   * confirmed as received by the backend, and the sendNextTransaction
   * methods of all pending transactions have been resolved.
   */
  terminate: () => Promise<void>
}

export const createTransactionSender = (
  documentService: Pick<
    RehomableRetryingClient<typeof DocumentService>,
    "applyTransactions" | "rehome" | "resetRehomeBackoff"
  >,
  projectName: string,
): TransactionSender => {
  // The implementation complexity in this function stems from the fact that we'd like to
  // send a stream of transactions to the backend and receive a stream of responses -
  // however the gRPC library we're using doesn't support client -> server streaming.
  // Instead we have the gRPC method applyTransactions which sends transactions in batches,
  // and receives responses in batches. To avoid reordering of transactions, we have to await
  // the last applyTransactions call before sending the next batch. This is abstracted away in this
  // implementation so from the outside, it looks like we're sending transactions one by one.

  const connectionOk = new ValueNotifier(true)

  // collects the next batch of transactions to send. Emptied every  time we send a batch.
  const nextBatch: [Transaction, resolve: (error?: string) => void][] = []

  // Used to block when no new transactions are available, until we have new ones.
  const nextTransactionArrived = promiseBarrier()

  // if this is defined, we want to terminate. When termination is complete, resolve.
  let terminalResolve: PromiseWithResolvers<void> | undefined = undefined

  let sendAbortController = new AbortController()

  const sendLoop = async () => {
    while (true) {
      const data = nextBatch.splice(0)
      // no data to send...
      if (data.length === 0) {
        // if we're terminating, resolve the promise
        if (terminalResolve !== undefined) {
          terminalResolve.resolve()
          return
        }
        // otherwise, wait for the next batch
        await nextTransactionArrived.wait
        continue
      }
      // send the data. Only `reconnect` aborts the signal, termination doesn't: we want to
      // send everything.
      sendAbortController = new AbortController()
      const response = await documentService.applyTransactions(
        {
          projectName,
          transactions: data.map(([t]) => t),
        },
        {
          callIsOk: connectionOk,
          signal: sendAbortController.signal,
        },
      )
      if (response instanceof Error) {
        if (sendAbortController.signal.aborted) {
          // Put the batch back in front so ordering is preserved and retry.
          nextBatch.unshift(...data)
          continue
        }
        if (
          !(response.cause instanceof ConnectError) ||
          response.cause.code !== Code.FailedPrecondition
        ) {
          throw new Error(`error sending transaction: ${response.message}`, {
            cause: response,
          })
        }
        // The current backend no longer owns the project, e.g. after it was unassigned
        // because of an idle timeout. Re-home to a freshly-assigned backend and retry the
        // same batch. This re-home is deduped with the one of the receiver.
        const rehomeErr = await documentService.rehome()
        if (rehomeErr !== undefined) {
          throw new Error(
            `error sending transaction after re-home: ${rehomeErr.message}`,
            { cause: rehomeErr },
          )
        }
        // Put the batch back in front so ordering is preserved and retry.
        // Repeated re-homes are backed off inside `rehome()`.
        nextBatch.unshift(...data)
        continue
      }
      documentService.resetRehomeBackoff()
      data.forEach(([t, resolve]) => {
        resolve(response.errors[t.id] ?? undefined)
      })
    }
  }
  sendLoop()

  return {
    sendNextTransaction: async (
      t: Transaction,
    ): Promise<string | undefined> => {
      if (terminalResolve !== undefined) {
        throw new Error("tried sending transaction after termination")
      }

      const { promise, resolve } = Promise.withResolvers<string | undefined>()
      nextBatch.push([t, resolve])

      // in case the loop is waiting, release it
      nextTransactionArrived.signal()
      return promise
    },
    terminate: async (): Promise<void> => {
      if (terminalResolve !== undefined) {
        await terminalResolve.promise
        return
      }
      terminalResolve = Promise.withResolvers<void>()
      // in case the loop is waiting, release it

      nextTransactionArrived.signal()
      connectionOk.terminate()
      // wait for the last transaction to be sent.
      await terminalResolve.promise

      if (nextBatch.length > 0) {
        // something went wrong, but we're terminating, so don't throw, just log an error.
        console.error(
          "invariant violation: nextBatch not empty after termination; have:",
          nextBatch.length,
          "transactions left",
        )
      }
    },
    connectionOk,
    reconnect: () => sendAbortController.abort(),
  }
}

/**
 * A synchronization primitive that allows one (or multiple) threads to
 * call `await {@link wait}` to be blocked until `{@link signal}` is called.
 *
 * If `{@link signal}` is called, all waiting threads are released, but future
 * threads calling `{@link wait}` will be blocked again, until in turn
 * `{@link signal}` is called, and so on.
 */
const promiseBarrier = (): {
  readonly wait: Promise<void>
  readonly signal: () => void
} => {
  let { promise, resolve } = Promise.withResolvers<void>()
  return {
    get wait() {
      return promise
    },
    signal: () => {
      resolve()
      ;({ promise, resolve } = Promise.withResolvers<void>())
    },
  }
}
