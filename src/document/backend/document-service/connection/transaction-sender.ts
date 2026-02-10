import type { DocumentService } from "@gen/document/v1/document_service_connect"
import type { Transaction } from "@gen/document/v1/document_service_pb"
import type { RetryingClient } from "@utils/grpc/retrying-client"
import {
  ValueNotifier,
  type ObservableValue,
} from "@utils/observable-notifier-value"

export type TransactionSender = {
  sendNextTransaction: (t: Transaction) => Promise<string | undefined>

  /** Turns to false if sending is temporarily interrupted. */
  connectionOk: ObservableValue<boolean>

  /** Terminate this sender. This will cause all sendNextTransaction calls
   * to throw. The promise will resolve once the last transaction has been
   * confirmed as received by the backend, and the sendNextTransaction
   * methods of all pending transactions have been resolved.
   */
  terminate: () => Promise<void>
}

export const createTransactionSender = (
  documentService: Pick<
    RetryingClient<typeof DocumentService>,
    "applyTransactions"
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
      // send the data
      const response = await documentService.applyTransactions(
        {
          projectName,
          transactions: data.map(([t]) => t),
        },
        {
          callIsOk: connectionOk,
        },
        // no signal passed: we want to send everything
      )
      if (response instanceof Error) {
        // throw an error - the application overall should crash and start from scratch.
        // TODO: make this recoverable.
        throw new Error("error sending transaction", { cause: response })
      }
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
