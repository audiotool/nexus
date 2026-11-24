import { Code, ConnectError } from "@connectrpc/connect"
import type { DocumentService } from "@gen/document/v1/document_service_connect"
import { Transaction } from "@gen/document/v1/document_service_pb"
import type { RehomableRetryingClient } from "@utils/grpc/rehomable-retrying-client"
import { calculateExponentialBackoff } from "@utils/grpc/retrying-client"
import { sleep } from "@utils/lang"
import {
  ObservableValue,
  ValueNotifier,
} from "@utils/observable-notifier-value"

/** Initial backoff time in milliseconds, the time waited before the first retry.*/
const DEFAULT_INITIAL_BACKOFF_MS = 1_000

/** Maximum backoff time in milliseconds, the time waited after multiple retries. Each retry doubles the backoff time. */
const DEFAULT_MAXIMUM_BACKOFF_MS = 2_000

export type TransactionReceiver = {
  /** Get the next transaction sent from the backend. On disconnect, just blocks until
   * reconnection. Throws only if unrecoverable. The very first transaction will "load" the current document
   * state, which might be empty if the document is new.
   */
  nextTransactionIterator: AsyncIterable<Transaction, void, void>
  /**
   * Stops internal logic, terminates the iterator. No effect on connectionOk.
   */
  terminate(): void

  /** Trigger a recovery of the connection. This should be called if an issue is detected in the logic
   * outside of the iterator (e.g. if the ping call fails), because the connection used internally
   * in this object cannot reliably detect disconnects.
   */
  reconnect(): void

  /** Turns to false while we're trying to reconnect. */
  connectionOk: ObservableValue<boolean>
}

export const createTransactionReceiver = (
  documentService: Pick<
    RehomableRetryingClient<typeof DocumentService>,
    "attach" | "rehome" | "resetRehomeBackoff"
  >,
  projectName: string,
  opts?: {
    /** Initial backoff time in milliseconds. Defaults to 1000ms. */
    initialBackoffMs?: number
    /** Maximum backoff time in milliseconds. Defaults to 2000ms. */
    maximumBackoffMs?: number
  },
): TransactionReceiver => {
  // The implementation complexity from this function stems from the fact that receiving transactions
  // is performed via a server -> client streaming gRPC method. This involves creating an async iterator
  // every time something goes wrong when receiving a transaction.
  // Further complexity is introduced because the gRPC library we're using doesn't reliably throw
  // errors when the connection is lost, instead it just blocks forever. We thus have to manually
  // cancel the connection if we detect a problem via _another_ call, which is what the reconnect
  // method is for.

  const connectionOk = new ValueNotifier(true)

  // this one is counted up from 0, and stores the last seen commitIndex from the backend,
  // so if we reconnect, we can try to continue from where we left off. If we ask for
  // a transaction with commit index 0, we always receive the transaction loading the entire
  // document, with a commit index of the last transaction of the document.
  //
  // If we can't continue where we left of, we throw an error that's propagated to the top
  // and shown as regular error screen, which will ask the user to reload the page. Once
  // reloaded, we start again with index 0, thus loading the whole document.
  let commitIndex = 0n

  // If this one is aborted, we terminate the receiver logic entirely.
  const masterAbortController = new AbortController()

  // this function creates a new response iterator with which we can ask for the next
  // response from the backend. This one doesn't reliably stop if something goes
  // wrong in the backend (in particular, if the backend dies without closing the stream).
  //
  // In these cases, we have to cancel the current response iterator and create a new one.
  // The function below will cancel the last one automatically and create a new one
  // that tries to connect to the backend with the last seen commit index.

  // Note that the logic below makes sure that if receiveAbortController is aborted,
  // the connection is recreated after a timeout.

  let receiveAbortController = new AbortController()

  let firstTransactionReceived = false
  const recreateResponseIterator = () => {
    receiveAbortController.abort() // cleanup last connection
    receiveAbortController = new AbortController()
    return documentService
      .attach(
        { projectName, commitIndex },
        {
          signal: AbortSignal.any([
            receiveAbortController.signal,
            masterAbortController.signal,
          ]),
        },
      )
      [Symbol.asyncIterator]()
  }
  let asyncIterator = recreateResponseIterator()

  const initialBackoffMs = opts?.initialBackoffMs ?? DEFAULT_INITIAL_BACKOFF_MS
  const maximumBackoffMs = opts?.maximumBackoffMs ?? DEFAULT_MAXIMUM_BACKOFF_MS
  let attemptNumber = 0

  // This is the master async iterator that's returned to the caller. We use an async iterator
  // so we can:
  // * use yield to return the next transaction
  // * use return to terminate the iterator
  const receiveNext = async function* () {
    // loop forever - until we return or throw
    while (true) {
      try {
        // get the next response from the backend
        const { value, done } = await asyncIterator.next()
        if (done ?? false) {
          // Not 100% but I think this only happens if the document service chooses to close
          // the connection e.g. due to being shut down. This is a case we don't really expect
          // to happen.
          throw new Error("document service attach stream closed")
        }
        connectionOk.setValue(true)
        attemptNumber = 0
        documentService.resetRehomeBackoff()
        switch (value.message.case) {
          case "noop": {
            if (!firstTransactionReceived) {
              // continue from here when reconnecting, instead of loading the whole document again
              commitIndex = value.message.value.serverCommitIndex
              firstTransactionReceived = true
              yield new Transaction({ id: crypto.randomUUID() })
              continue
            }
            continue
          }
          case "transaction": {
            commitIndex = value.message.value.commitIndex
            firstTransactionReceived = true
            yield value.message.value
            continue
          }
          default: {
            throw new Error(
              `received attach response with unknown message case: ${value.message.case}`,
            )
          }
        }
      } catch (e) {
        if (masterAbortController.signal.aborted) {
          // we're done, don't even care about the error
          return
        }
        if (!(e instanceof ConnectError)) {
          // unknown error, propagate
          throw e
        }
        // The backend we're talking to no longer owns the project (e.g. because of an idle
        // timeout), which surfaces as FailedPrecondition. If the backend doesn't exist anymore,
        // the gateway answers without CORS headers, which surfaces as Unknown. Being offline also
        // surfaces as Unknown: the re-home then waits until the project service is reachable,
        // and keeps the current backend if it's still assigned.
        // In all cases we ask for the currently assigned backend, then attach again with the same
        // commit index. If the new backend can't serve that commit index, it returns OutOfRange.
        const shouldRehome =
          e.code === Code.FailedPrecondition || e.code === Code.Unknown
        if (shouldRehome) {
          connectionOk.setValue(false)
          const rehomeErr = await documentService.rehome()
          if (rehomeErr !== undefined) {
            throw new Error("failed to re-home document service", {
              cause: rehomeErr,
            })
          }
          // go back to fast retries, since we just re-homed
          attemptNumber = 0
          if (masterAbortController.signal.aborted) {
            return
          }
        }

        if (
          shouldRehome ||
          e.code === Code.Canceled || // thrown if abort controller is aborted
          e.code === Code.Aborted ||
          e.code === Code.Unavailable
        ) {
          connectionOk.setValue(false)
          const backoffDelay = calculateExponentialBackoff(
            attemptNumber,
            initialBackoffMs,
            maximumBackoffMs,
          )
          await sleep(
            backoffDelay,
            // `terminate` ends the backoff early, and so does `reconnect`, e.g. after a re-home
            AbortSignal.any([
              masterAbortController.signal,
              receiveAbortController.signal,
            ]),
          )
          if (masterAbortController.signal.aborted) {
            // if the master abort controller is aborted, we've been terminated
            return
          }

          attemptNumber++
          // else, create a fresh async iterator
          asyncIterator = recreateResponseIterator()
          continue
        }

        if (e.code === Code.OutOfRange) {
          // This error is thrown if the commit index is "too low" and the backend doesn't have
          // it cached anymore. This should only happen during collab sessions (or when being offline
          // for multiple hours). In this case we have to reload the tab.
          throw new Error(
            "local document state too far in the past, must reload tab",
            { cause: e },
          )
        }
        throw e
      }
    }
  }

  return {
    nextTransactionIterator: receiveNext(),
    terminate: () => masterAbortController.abort(),
    reconnect: () => receiveAbortController.abort(),
    connectionOk,
  }
}
