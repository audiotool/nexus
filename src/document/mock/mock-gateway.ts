import { Transaction } from "@gen/document/v1/document_service_pb"
import { ValueNotifier } from "@utils/observable-notifier-value"

import type { NexusGateway } from "../backend/gateway"

/** A dummy gateway that doesn't do anything with sent
 * transactions and always returns an empty list for consolidation.
 */
export const mockNexusGateway = (): NexusGateway => {
  let terminated = false
  let initialTransactionReturned = false
  return {
    synchronize: () => {
      if (!initialTransactionReturned) {
        initialTransactionReturned = true
        return [new Transaction()]
      }
      return "done"
    },
    send: () => {
      if (terminated) {
        throw new Error("Gateway terminated")
      }
    },
    blocked: new ValueNotifier(false),
    terminate: async () => {
      terminated = true
    },
  }
}
