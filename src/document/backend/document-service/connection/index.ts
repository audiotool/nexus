import type { DocumentService } from "@gen/document/v1/document_service_connect"
import type { Transaction } from "@gen/document/v1/document_service_pb"
import { combinedValueNotifiersWithAnd } from "@utils/combine-notifiers"
import type { RetryingClient } from "@utils/grpc/retrying-client"
import type { ObservableValue } from "@utils/observable-notifier-value"
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
  documentService: RetryingClient<typeof DocumentService>,
  projectName: string,
  opts?: {
    backoffMs?: number
    pingIntervalMs?: number
  },
): DocumentServiceConnection => {
  const pingNotifier = createPingNotifier(documentService, projectName, {
    pingIntervalMs: opts?.pingIntervalMs,
  })

  const transactionReceiver = createTransactionReceiver(
    documentService,
    projectName,
    {
      backoffMs: opts?.backoffMs,
    },
  )
  const transactionSender = createTransactionSender(
    documentService,
    projectName,
  )

  // connectionOk turns to false if any of the three calls (send, receive, ping) fail in a recoverable way.
  const connectionOk = combinedValueNotifiersWithAnd(
    pingNotifier.connectionOk,
    transactionReceiver.connectionOk,
    transactionSender.connectionOk,
  )

  // whenever we have a failing ping call, we reconnect the receiver
  pingNotifier.pingCallResults.subscribe((ok) => {
    if (!ok) {
      transactionReceiver.reconnect()
    }
  })

  return {
    receiveNextTransaction: transactionReceiver.nextTransactionIterator,
    sendNextTransaction: transactionSender.sendNextTransaction,
    pingMs: pingNotifier.pingMs,
    connectionOk,
    terminate: async () => {
      pingNotifier.terminate()
      transactionReceiver.terminate()
      await transactionSender.terminate()
      connectionOk.terminate()
    },
  }
}
