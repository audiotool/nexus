import { Code, ConnectError } from "@connectrpc/connect"
import type { DocumentService } from "@gen/document/v1/document_service_connect"
import { Transaction } from "@gen/document/v1/document_service_pb"
import type { RetryingClient } from "@utils/grpc/retrying-client"
import { sleep } from "@utils/lang"
import {
  ObservableValue,
  ValueNotifier,
} from "@utils/observable-notifier-value"

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
  documentService: Pick<RetryingClient<typeof DocumentService>, "attach">,
  projectName: string,
  opts?: {
    backoffMs?: number
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

  const backoffMs = opts?.backoffMs ?? 1000

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
        switch (value.message.case) {
          case "noop": {
            if (!firstTransactionReceived) {
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
        switch (e.code) {
          case Code.Canceled: // thrown if abort controller is aborted
          case Code.Aborted:
          case Code.Unavailable:
          case Code.Unknown: {
            connectionOk.setValue(false)
            // wait with random backoff to avoid simultaneous reconnections
            await sleep(
              backoffMs + Math.random() * backoffMs * 0.1,

              // pass in master abort controller for early termination
              masterAbortController.signal,
            )
            if (masterAbortController.signal.aborted) {
              // if the master abort controller is aborted, we've been terminated
              return
            }

            // else, create a fresh async iterator
            asyncIterator = recreateResponseIterator()
            continue
          }
          // else throw
          default: {
            if (e.code === Code.OutOfRange) {
              // This error is thrown if the commit index is "too low" and the backend doesn't have
              // it cached anymore. This should only happen during collab sessions (or when being offline
              // for multiple hours). In this case we have to reload the tab.
              throw new Error(
                "local document state too far in the past, must reload tab",
              )
            }
            throw e
          }
        }
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
