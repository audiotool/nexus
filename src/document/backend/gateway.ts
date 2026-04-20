import { Modification, Transaction } from "@gen/document/v1/document_service_pb"
import { ObservableValue } from "@utils/observable-notifier-value"
import type { NexusDocument } from "../document"

/** A read only variant of a transaction that is returned by {@link NexusGateway["synchronize"]}.
 *
 * It's important that the gateway doesn't have to clone every transaction for performance reasons,
 * but the returned transactions must also never be modified by the caller. This type
 * allows us to enforce this.
 */
export type ReadonlyTransaction = {
  readonly id: string
  readonly commitIndex: bigint
  readonly modifications: readonly Modification[]
}

/**
 * This is the interface the {@link NexusDocument} uses to sync itself with
 * a state from some "backend". This could be a server, local storage,
 * or another client.
 */
export interface NexusGateway {
  /** Send a new transaction to the backend. The user should call {@link send} asap after applying
   * a transaction locally to give the backend time to consolidate with potential other client's transactions.
   *
   * If {@link blocked} is true, the local document shouldn't be modified further. {@link send} will continue
   * to work but the transactions might be lost on reload.
   */
  send(t: Transaction): void

  /** Fetch new transactions that should be immediately applied to the document to sync with upstream.
   *
   * The returned transactions MUST NOT be modified by the caller.
   *
   * This function must only be called after all local transactions created since the last call
   * to {@link synchronize} have been sent with {@link send}.
   *
   * All returned transactions must be applied to the local document state before any new local
   * transactions are created.
   *
   * This function should be called regularly to keep the document in sync with the backend and avoid
   * surprises for the user.
   *
   * This function must indicate that the current document state was loaded by returning at least
   * one transaction. If the document state is empty, that transaction can be empty. The studio
   * will show the loading spinner until the first transaction is received.
   *
   * After the first transaction, the gateway can return "done" to indicate that no further transactions
   * will be returned, which the caller can use as a signal to stop polling. This is useful in situations
   * where it's known that no synchronization transactions will ever be returned, such as when running in offline mode.
   */
  synchronize(): ReadonlyTransaction[] | "done"

  /** This becomes true when the gateway is blocked in some way from syncing with upstream state.
   * The document should be locked in this case to prevent data loss.
   */
  blocked: ObservableValue<boolean>

  /** Terminate the gateway. This will have the following effect:
   * * `send` will throw
   * * `synchronize` will return an empty array
   *
   * The promise will resolve once the last sent transaction has been confirmed as received by the backend.
   */
  terminate(): Promise<void>
}
