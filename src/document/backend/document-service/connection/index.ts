import type { DocumentService } from "@gen/document/v1/document_service_connect"
import type { Transaction } from "@gen/document/v1/document_service_pb"
import { combinedValueNotifiersWithAnd } from "@utils/combine-notifiers"
import type { RehomableRetryingClient } from "@utils/grpc/rehomable-retrying-client"
import {
  ValueNotifier,
  type ObservableValue,
} from "@utils/observable-notifier-value"
import { Terminator } from "@utils/terminable"
import { createPingNotifier } from "./ping-notifier"
import { createTransactionReceiver } from "./transaction-receiver"
import { createTransactionSender } from "./transaction-sender"

/** This object represents a connection to the document service. It's built from a document service client.
 *
 * While it isn't terminated, it will continuously ping the backend to check if the connection is still alive,
 * and update the ping value.
 *
 * The parameter {@link connectionOk} turns to false if something goes wrong in a recoverable way.
 * If something goes wrong in an unrecoverable way, the service connection will throw an error in a detached promise.
 *
 */
export type DocumentServiceConnection = {
  /** The stream of incoming transactions. The document is "loaded" when the first transaction is received.*/
  receiveNextTransaction: AsyncIterable<Transaction, void, void>

  /** Send the next transaction to the backend, returns a string if the backend rejects it. */
  sendNextTransaction: (t: Transaction) => Promise<string | undefined>

  /** The current ping to the backend. */
  pingMs: ObservableValue<number>

  /**
   * Turns to false if any of the three calls (send, receive, ping) fail in a recoverable way.
   */
  connectionOk: ObservableValue<boolean>

  /** Terminate the connection. Has the following effect:
   * * `receiveNextTransaction` is terminated
   * * `sendNextTransaction` will throw an error
   *
   * Resolves once the last transaction has been sent.
   */
  terminate: () => Promise<void>
}

export const createDocumentServiceConnection = (
  documentService: RehomableRetryingClient<typeof DocumentService>,
  projectName: string,
  opts?: {
    initialBackoffMs?: number
    maximumBackoffMs?: number
    pingIntervalMs?: number
  },
): DocumentServiceConnection => {
  const terminator = new Terminator()
  const pingNotifier = createPingNotifier(documentService, projectName, {
    pingIntervalMs: opts?.pingIntervalMs,
  })

  const transactionReceiver = createTransactionReceiver(
    documentService,
    projectName,
    {
      initialBackoffMs: opts?.initialBackoffMs,
      maximumBackoffMs: opts?.maximumBackoffMs,
    },
  )
  const transactionSender = createTransactionSender(
    documentService,
    projectName,
  )

  // We're not connected in a useful way while re-homing.
  const notRehoming = new ValueNotifier(!documentService.rehoming.getValue())
  terminator.own(
    documentService.rehoming.subscribe((rehoming) => {
      notRehoming.setValue(!rehoming)
      if (rehoming) {
        return
      }
      // A re-home just completed. Calls that are in flight stay on the previous backend,
      // including their retries. The receiver could keep reading from a stale backend and
      // miss every transaction applied to the new one, and pings and sends could retry
      // forever against a backend that's gone. So restart all of them on the new backend.
      transactionReceiver.reconnect()
      transactionSender.reconnect()
      pingNotifier.reconnect()
    }),
  )

  // connectionOk turns to false if any of the three calls (send, receive, ping) fail in a recoverable way,
  // or while re-homing.
  const connectionOk = combinedValueNotifiersWithAnd(
    pingNotifier.connectionOk,
    transactionReceiver.connectionOk,
    transactionSender.connectionOk,
    notRehoming,
  )

  // whenever we have a failing ping call, we reconnect the receiver and the sender
  terminator.own(
    pingNotifier.pingCallResults.subscribe((ok) => {
      if (!ok) {
        transactionReceiver.reconnect()
        transactionSender.reconnect()
      }
    }),
  )

  terminator.own(pingNotifier, transactionReceiver, notRehoming, connectionOk)

  return {
    receiveNextTransaction: transactionReceiver.nextTransactionIterator,
    sendNextTransaction: transactionSender.sendNextTransaction,
    pingMs: pingNotifier.pingMs,
    connectionOk,
    terminate: async () => {
      terminator.terminate()
      await transactionSender.terminate()
    },
  }
}
