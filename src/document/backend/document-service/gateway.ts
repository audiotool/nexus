import type { Transaction } from "@gen/document/v1/document_service_pb"
import { ValueNotifier } from "@utils/observable-notifier-value"
import type { NexusGateway, ReadonlyTransaction } from "../gateway"

import type { DocumentService } from "@gen/document/v1/document_service_connect"
import type { RetryingClient } from "@utils/grpc/retrying-client"
import type { WasmConsolidator } from "../create-wasm-document-state"
import { createDocumentServiceConnection } from "./connection"

/** Collab gateway returns a gateway that syncs with a document service.
 */
export const createCollabGateway = (
  documentService: RetryingClient<typeof DocumentService>,
  createConsolidator: () => WasmConsolidator,
  projectName: string,
  opts?: {
    logOutgoingTransactions?: boolean
    logIncomingTransactions?: boolean
    logConsolidatedTransactions?: boolean
    logRejectedTransactions?: boolean
  },
): NexusGateway => {
  const studioServiceConnection = createDocumentServiceConnection(
    documentService,
    projectName,
  )

  const consolidator = createConsolidator()

  const receivedTransactions: Transaction[] = []
  const sentTransactions: Transaction[] = []
  const rejectedTransactions: string[] = []

  // continuously fill #received with new incoming transactions
  const loop = async () => {
    // this loop terminates automatically if receiveNextTransaction is terminated.
    for await (const t of studioServiceConnection.receiveNextTransaction) {
      receivedTransactions.push(t)
      DEBUG_consolidatorStats.numReceivedCtr++
      if (opts?.logIncomingTransactions ?? false) {
        console.debug("CollabGateway: received transaction", t.id)
      }
    }
  }
  loop()

  const blocked = new ValueNotifier(true)
  studioServiceConnection.connectionOk.subscribe((ok) => {
    blocked.setValue(!ok)
  }, true)

  let terminated = false

  return {
    blocked,
    send: (t: Transaction) => {
      // no more transactions allowed after termination.
      if (terminated) {
        throw new Error(
          "tried sending a transaction after gateway was terminated",
        )
      }

      // assign uuid to transaction, used by consolidator later
      t = t.clone()
      t.id = crypto.randomUUID()
      sentTransactions.push(t)
      DEBUG_consolidatorStats.numQueuedCtr++

      if (opts?.logOutgoingTransactions ?? false) {
        console.debug("CollabGateway: sending local transaction", t)
      }

      studioServiceConnection.sendNextTransaction(t).then((value) => {
        DEBUG_consolidatorStats.numConfirmedCtr++

        if (value !== undefined) {
          rejectedTransactions.push(t.id)

          if (opts?.logRejectedTransactions ?? false) {
            console.debug(
              "CollabGateway: received rejected transaction",
              t,
              value,
            )
          }
          DEBUG_consolidatorStats.numRejectedCtr++
        }
      })
    },

    synchronize: (): ReadonlyTransaction[] => {
      // if document is in the process of shutting down, there's no need to synchronize anymore.
      if (terminated) {
        // return an empty array as per contract.
        return []
      }
      const receivedSome = receivedTransactions.length > 0
      const transactions = consolidator.consolidate(
        receivedTransactions,
        rejectedTransactions,
        sentTransactions,
      )

      // clear lists after consolidation
      receivedTransactions.length = 0
      rejectedTransactions.length = 0
      sentTransactions.length = 0

      // log consolidation result - but only if we received some from the server
      if ((opts?.logConsolidatedTransactions ?? false) && receivedSome) {
        console.debug("CollabGateway: consolidated transactions", transactions)
      }
      return transactions
    },

    terminate: async (): Promise<void> => {
      // accept no more send calls
      terminated = true
      // wait for the sending of the last transaction.
      await studioServiceConnection.terminate()

      // clear everything to reduce memory
      receivedTransactions.length = 0
      rejectedTransactions.length = 0
      sentTransactions.length = 0

      blocked.terminate()

      // clean up wasm consolidator (which in turn owns a wasm document state)
      consolidator.terminate()
    },
  }
}

/** Statistics for debugging - global singleton for easy of access.
 * Won't be correct if multiple gateways are created.
 */
export const DEBUG_consolidatorStats = {
  numReceivedCtr: 0,
  numConfirmedCtr: 0,
  numQueuedCtr: 0,
  numRejectedCtr: 0,
}
