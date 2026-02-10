import type { AudiotoolAPI } from "@api/audiotool-api"
import { getWasmDocumentState } from "@document/backend/create-wasm-document-state"
import { createCollabGateway } from "@document/backend/document-service/gateway"
import { createWasmNexusValidator } from "@document/backend/document-service/wasm-nexus-validator"
import { NexusGateway } from "@document/backend/gateway"
import { NexusValidator } from "@document/backend/validator"
import { NexusDocument } from "@document/document"
import { NexusEventManager } from "@document/event-manager"
import { mockNexusGateway } from "@document/mock/mock-gateway"
import { mockNexusValidator } from "@document/mock/mock-validator"
import { EntityQuery } from "@document/query/entity"
import {
  SafeTransactionBuilder,
  TransactionBuilder,
} from "@document/transaction-builder"
import { DocumentService } from "@gen/document/v1/document_service_connect"
import { createAuthorizedKeepaliveTransport } from "@utils/grpc/keepalive-transport"
import { createRetryingPromiseClient } from "@utils/grpc/retrying-client"
import { throw_ } from "@utils/lang"
import { ValueNotifier } from "@utils/observable-notifier-value"

/**
 * An Audiotool project document that synchronizes in real-time with the backend.
 *
 * This is the main interface for interacting with Audiotool projects. It provides
 * methods for creating transactions, querying entities, and reacting to changes.
 *
 * @example
 * ```typescript
 * // authorize
 * const status = await getLoginStatus({...})
 * if (!status.loggedIn){
 *    ...
 * }
 *
 * // create client
 * const client = await createAudiotoolClient({authorization: status});
 *
 * // create a document
 * const document = await client.createSyncedDocument({
 *   mode: "online",
 *   project: "https://beta.audiotool.com/studio?project=abc123"
 * });
 *
 * // Listen for entity creation - executes iff there's already a tonematrix in the project
 * document.events.onCreate("tonematrix", (tm) => {
 *   console.log("New tonematrix created");
 * });
 *
 * // Start syncing
 * await document.start();
 *
 * // Create entities in a transaction
 * const delay = await document.modify((t) => {
 *   return t.create("stompboxDelay", {
 *     delayTime: 0.5,
 *     feedback: 0.3
 *   });
 * });
 *
 * // Stop syncing
 * await document.stop()
 * ```
 *
 * @see {@link createAudiotoolClient} for creating client instances
 */
export type SyncedDocument = {
  /**
   * Start the synchronization process with the backend.
   *
   * Before this method is called:
   * * the document isn't in sync yet
   * * the document cannot be modified yet
   *
   * Which gives you time to setup all `onCreate` event listeners.
   *
   * While the returned promise resolves, the local state is synced up with the remote state,
   * and all entities currently in the document trigger `onCreate` callbacks. After the method resolves,
   * the document is in sync, and can be modified.
   *
   * @example
   * ```typescript
   * // Set up all event handlers first
   * nexus.events.onCreate("tonematrix", tm => {
   *   nexus.events.onUpdate(tm.fields.isActive, (a) => console.debug("tonematrix is" a ? "active" : "inactive"));
   * });
   *
   * // Then start syncing
   * await nexus.start();
   * ```
   *
   * @throws {Error} When connection to backend fails or authentication is invalid
   */
  start: () => Promise<void>

  /** Acquire the transaction lock and receive a transaction builder to modify the document.
   *
   * While a transaction builder exists, no other can be created - subsequent calls will have to `await`.
   * Once the transaction is complete, call `.send()` on the builder to release the lock and let
   * the next transaction begin.
   *
   */
  createTransaction: () => Promise<TransactionBuilder>

  /**
   * Execute a transaction with automatic cleanup.
   *
   * This is the most common way to modify the document. It handles transaction
   * creation, execution, and cleanup automatically.
   *
   * @example
   * ```typescript
   * // Create a tonematrix and place it on the desktop
   * const tonematrix = await nexus.modify((t) => {
   *   const tm = t.create("tonematrix", {});
   *   const placement = t.create("desktopPlacement", {
   *     entity: tm.location,
   *     x: 100,
   *     y: 200
   *   });
   *   return tm;
   * });
   *
   * // Update multiple fields in one transaction
   * await nexus.modify((t) => {
   *   t.update(delay.fields.delayTime, 0.75);
   *   t.update(delay.fields.feedback, 0.6);
   *   t.update(delay.fields.mixFactor, 0.4);
   * });
   * ```
   *
   * @param fn - Function that receives a transaction builder and performs modifications
   * @returns Promise resolving to the return value of the transaction function
   * @throws {Error} When transaction validation fails or connection is lost
   *
   * @see {@link createTransaction} for manual transaction management
   * @see {@link TransactionBuilder} for available transaction operations
   */
  modify<T>(fn: (m: SafeTransactionBuilder) => Promise<T> | T): Promise<T>

  /** Query the current state of the document. Careful: Acquiring the transaction lock is an async process,
   * and has to be awaited; during that wait time, the document can change. It's thus recommended to use
   * {@link TransactionBuilder.entities} to query the document when building transactions, otherwise transaction errors can occur.
   */
  queryEntities: EntityQuery

  /** Subscribe to changes in the document. */
  events: NexusEventManager

  /** Whether the document is connected to the backend and should be modified. If this becomes
   * false, the user became offline or the backend server is down. Will usually recover on its own.
   *
   * While this is false, no syncing is happening, and all changes made since this became false will be lost on
   * reload; it's recommended to block the user from making changes until this becomes true again.
   */
  connected: ValueNotifier<boolean>

  /**
   * Stop syncing to the backend, so the document can be thrown away.
   *
   * Concretely, if {@link modify} and {@link createTransaction} are called after this is called, they will throw an error.
   *
   * The promise will resolve once already pending {@link modify} and {@link createTransaction} calls have finished,
   * and the modifications they create have been synced with the backend.
   *
   * After this is called, only {@link queryEntities} can be used. No event will ever be triggered again.
   *
   * This method **must** be called before the document can be thrown away. Not doing so will result in the syncing process continuing,
   * and the document never being garbage collected. It will also prevent native runtimes from exiting the process.
   *
   **/
  stop: () => Promise<void>
}

/** Create a SyncedDocument wrapper from a NexusDocument. */
export const createSyncedDocument = (
  document: NexusDocument,
  connected: ValueNotifier<boolean>,
  validator: NexusValidator,
  gateway: NexusGateway,
): SyncedDocument => {
  return {
    connected,
    createTransaction: () => document.createTransaction(),
    modify: <T>(fn: (m: SafeTransactionBuilder) => Promise<T> | T) =>
      document.modify(fn),
    queryEntities: document.queryEntitiesWithoutLock,
    events: document.events,
    start: async () => document.takeTransactions({ validator, gateway }),
    stop: async () => document.terminate(),
  }
}

/** An offline version of a {@link SyncedDocument} - starts out completely empty,
 * and all changes are discarded on reload/shutdown.
 *
 * Doesn't have start/stop methods since no syncing is happening.
 *
 * Can be safely thrown away after usage.
 */
export type OfflineDocument = Omit<SyncedDocument, "start" | "stop">

/**
 * Create a nexus document that is not synced to the backend; all changes are discarded on reload/shutdown.
 *
 * The returned document is ready to be modified immediately and can be thrown away without calling start/stop.
 *
 * To create a document that is synced with a state from the backend/DAW, use {@link AudiotoolClient.createSyncedDocument}.
 * */
export const createOfflineDocument = async (opts?: {
  /** Whether validation is enabled. Turning that off results in fewer transaction errors, but can lead to invalid states. */
  validated?: boolean
}): Promise<OfflineDocument> => {
  const validator =
    (opts?.validated ?? true)
      ? await createWasmNexusValidator()
      : mockNexusValidator()
  const gateway = mockNexusGateway()

  const document = new NexusDocument()
  const connected = new ValueNotifier(true)

  const nexus = createSyncedDocument(document, connected, validator, gateway)
  await nexus.start()
  return nexus
}

/** Create a SyncedDocument wrapper that's connected to the backend. */
export const createOnlineDocument = async (
  api: AudiotoolAPI,
  projectName: string,
  getToken: () => Promise<string>,
): Promise<SyncedDocument> => {
  // start compiling validator
  let validatorPromise: Promise<NexusValidator> = createWasmNexusValidator()

  // get session from project service
  const session = await api.projectService.openSession({
    projectName,
  })

  if (session instanceof Error) {
    throw new Error(`Couldn't open session`, { cause: session })
  }

  // create document service using url contained in session
  const documentService = createRetryingPromiseClient(
    DocumentService,
    createAuthorizedKeepaliveTransport({
      baseUrl:
        session.session?.documentServiceUrl ??
        throw_("backend returned no document service url"),
      useBinaryFormat: true,
      getToken,
    }),
  )

  // await validator to make sure wasm is loaded before gateway is initialized
  const validator = await validatorPromise
  const gateway = createCollabGateway(
    documentService,
    await getWasmDocumentState(),
    projectName,
  )

  const document = new NexusDocument()
  const connected = new ValueNotifier(false)

  // make gateway.blocked update connected
  gateway.blocked.subscribe((v) => connected.setValue(!v))
  return createSyncedDocument(document, connected, validator, gateway)
}
