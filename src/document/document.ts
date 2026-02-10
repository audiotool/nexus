import { AsyncLock, type Lock } from "@utils/async-lock"
import { assert, asyncInterval, sleep, throw_ } from "@utils/lang"
import { Notifier } from "@utils/observable-notifier"
import type { NexusGateway, ReadonlyTransaction } from "./backend/gateway"
import type { NexusValidator } from "./backend/validator"
import {
  nexusDocumentState,
  type NexusDocumentState,
} from "./document-state/state"

import { Modification, Transaction } from "@gen/document/v1/document_service_pb"
import { EntityTypeKey } from "./entity-utils"
import { NexusEventManager } from "./event-manager"
import { mockNexusGateway } from "./mock/mock-gateway"
import { mockNexusValidator } from "./mock/mock-validator"
import { EntityQuery } from "./query/entity"
import {
  transactionBuilder,
  type SafeTransactionBuilder,
  type TransactionBuilder,
} from "./transaction-builder/builder"

const skipEditHistoryActionId = Symbol()

export type TransactionOptions = {
  /**
   * With this field we can capture what a user might intuitively call a single "action", for example:
   * * moving a knob over the span of a few seconds, then letting go, is a single "action"
   * * clicking a button is an "action"
   * * drawing multiple notes without letting the mouse go is a single "action"
   *
   * By passing the same `actionId` symbol to multiple transactions, all of these transactions are marked
   * to be part of the same action. `actionId` symbols can freely be created using the `Symbol()` function.
   *
   * The undo/redo history uses this information to undo all transactions part of the same action in one go.
   *
   * If no `actionId` is provided, the transaction will be its own action. To make an action
   * skip the edit history, use the {@link skipEditHistoryActionId} symbol.
   *
   * ## Example
   * ```
   * const actionId = Symbol()
   *
   * await nexus.modify(t => {
   *    t.update(device.fields.value1, 0.5)
   *    t.update(device.fields.value2, 0.6)
   * }, { actionId })
   *
   * await await nexus.modify(t => {
   *    t.update(device.fields.value3, 0.7)
   * }, { actionId })
   *
   * // calling "undo" here would undo the change to fields `value1`, `value2` and `value3`.
   * ```
   */
  actionId?: symbol
}

/**
 * Manages all data related to an audiotool project, and contains mechanisms to sync that
 * data with other clients and the backend in a conflict-free manner.
 *
 * Also manages event callbacks for when the data structure changes; undo/redo history;
 * creation of new transactions on the document; and has some utilities to query data structure.
 */

export class NexusDocument {
  /** Public field to query the entities in the document.
   *
   * ## Careful
   *
   * This method of querying the nexus document doesn't require a transaction lock. Any time a transaction
   * lock is taken, all previous query results should be considered out of date.
   *
   * ### Example incorrect usage
   *
   * The `await nexus.modify` awaits other transactions to finish before the callback is executed.
   * These transactions could be removing the output entity, and so by the type `t.update` is called,
   * the update transaction would be invalid, resulting in an exception:
   *
   * ```
   * const output = nexus.queryEntitiesWithoutLock.ofTypes("output").getOne() ?? ..
   * await nexus.modify(t => {
   *     // updating a field of an entity that was potentially removed during the await
   *     t.update(output.fields.name, "hello")
   * })
   * ```
   *
   * ### Example Correct usage
   *
   * It's better to use the `entities` field in the {@link TransactionBuilder} that is of the same type.
   * In the example above, better write
   *
   * ```
   * await nexus.modify(t => {
   *     const output = t.entities.ofTypes("output").getOne() ?? ..
   *     t.update(output.fields.name, "hello")
   * })
   * ```
   */
  readonly queryEntitiesWithoutLock: EntityQuery<EntityTypeKey>

  /** Manages subscriptions to nexus events, such as entity update & creation */
  readonly events: NexusEventManager

  /**
   * This is a notifier that notifies of all modifications applied on the nexus
   * document, locally created or incoming from the backend.
   *
   * If the transaction is incoming `local` is `false`.
   */
  readonly onModification: Notifier<{
    modification: Modification
    local: boolean
    /** The action this modification belongs to. Can be undefined e.g. if the modification
     * originates from the backend.
     */
    actionId?: symbol
  }> = new Notifier()

  /** Keeps track of all entities currently in the document. */
  readonly #state: NexusDocumentState

  /**
   * Lock that protects transactions. Only one transaction can be created at a time.
   */
  readonly #transactionLock: AsyncLock = new AsyncLock()

  /** The connection to the backend */
  #gateway?: NexusGateway

  /** Validates any and all modifications */
  #validator?: NexusValidator

  /**
   * This flag is set to true if {@link takeTransactions} is called. Before that, no transactions
   * from the backend are processed, and no transactions are allowed to be created from the frontend.
   *
   * This is to make sure that all `onCreate` callbacks are attached before any entity is created.
   */
  #transactionsAllowed: boolean = false

  /**
   * This flag is set to true during {@link stop} to exit early if {@link stop} is called twice.
   */
  #documentStopping: boolean = false

  /**
   * This flag is set to true after {@link stop} is called and causes all further calls to {@link createTransaction} and {@link modify} to throw an error.
   */
  #documentStopped: boolean = false

  /**
   * This flag is set to true if {@link takeTransactions} is called. Before that, no transactions
   * from the backend are processed, and no transactions are allowed to be created from the frontend.
   * Attempting to call {@link createTransaction} before this is set to true will throw an error.
   *
   * This is to make sure that all `onCreate` callbacks are attached before any entity is created.
   */
  get transactionsAllowed(): boolean {
    return this.#transactionsAllowed
  }

  /**
   * The number of modifications applied to the document for incoming transactions before control
   * is yield to the scheduler.
   */
  readonly #incomingModificationsBatchSize: number

  /** The delay between two gateway.synchronize() calls to sync with backend. */
  readonly #synchronizeEveryMs: number

  #terminateSyncLoop: (() => Promise<void>) | undefined

  constructor(props?: {
    /** The delay between two gateway.synchronize() calls to sync with backend. */
    synchronizeEveryMs?: number

    /**
     * Modifications in incoming transactions are batched into batches of this size.
     * After each batch, control is yielded to the scheduler to keep a good framerate.
     */
    incomingModificationsBatchSize?: number
  }) {
    // default 16ms ~= 60 times a second
    this.#synchronizeEveryMs = props?.synchronizeEveryMs ?? 16

    // default 20 empirically determined to be decent; too low results in few modifications being applied,
    // too high results in frame drops
    this.#incomingModificationsBatchSize =
      props?.incomingModificationsBatchSize ?? 20

    this.#state = nexusDocumentState({
      callbacks: {
        onStartPointingTo: (from, to) => {
          this.events._dispatchPointingTo(to, from)
        },
        onStopPointingTo: (from, to) => {
          this.events._dispatchStopPointingTo(to, from)
        },
        onUpdate: (loc, value) => {
          this.events._dispatchUpdate(loc, value)
        },
        onCreate: (entity) => {
          this.events._dispatchCreate(entity)
        },
        onDelete: (entity) => {
          this.events._dispatchRemove(entity)
        },
      },
    })

    this.queryEntitiesWithoutLock = new EntityQuery({
      documentState: this.#state,
      documentLock: undefined,
    })
    this.events = new NexusEventManager(this.#state)
  }

  /**
   * Wait to acquire the document lock, then returns a {@link TransactionBuilder} that can be used to modify the nexus document
   * in a single transaction.
   *
   * To finish the transaction, call `send()`, which will release the lock, and send the modification to the backend. After this
   * method is called, no further methods can be called of the builder.
   *
   * The backend and other clients will only see changes after `send` is called, however locally, all changes are immediately applied.
   *
   * Note that every transaction by default is undoable, unless the flag in {@link TransactionOptions} is set to false.
   * @returns: {@link TransactionBuilder}
   */
  async createTransaction(
    opts?: TransactionOptions,
    /** @internal allows skipping of taking the transaction lock */
    _takeTransactionLock: boolean = true,
  ): Promise<TransactionBuilder> {
    assert(this.#transactionsAllowed, "Transactions not allowed yet")
    assert(this.#gateway !== undefined, "Gateway not initialized")
    assert(this.#validator !== undefined, "Validator not initialized")
    assert(!this.#documentStopped, "Document stopped")

    // take the lock, unless the lock is already held from the outside
    const lock = _takeTransactionLock
      ? await this.#transactionLock.acquire()
      : undefined

    // the modifications we collect during this transaction build
    const modifications: Modification[] = []

    const query = new EntityQuery({
      documentState: this.#state,
      documentLock: this.#transactionLock,
    })

    // if no actionId is provided, this whole transaction will be its own action
    const actionId = opts?.actionId ?? Symbol()

    return transactionBuilder({
      applyModification: (mod, throwIfInvalid) => {
        // when a modification is applied through the transaction builder, we immediately
        // apply the modification to the document, and store if to send as a transaction later.
        // Calling `applyModification` will update the `query` object.
        const error = this.#applyModification(mod, {
          local: true,
          throwIfInvalid,
          actionId,
        })
        if (error !== undefined) {
          return error
        }
        modifications.push(mod)
      },
      finish: () => {
        // when the transaction is finished, we send the modifications to the backend
        if (modifications.length === 0) {
          // release the lock if it was taken inside this method
          lock?.release()
          return []
        }
        this.#gateway?.send(new Transaction({ modifications }))
        // release the lock if it was taken inside this method
        lock?.release()
        return modifications
      },
      query,
    })
  }

  /**
   * A helper method for small transactions.
   *
   * Writing
   * ```ts
   * const foo = await nexus.modify(t => fn(t))
   * ```
   *
   * is shorthand for
   *
   * ```ts
   * const t = await this.createTransaction(opts)
   * const foo = await fn(t)
   * t.send()
   * ```
   *
   * Note that every transaction by default is undo-able, unless the flag in {@link TransactionOptions} is set to false.
   */
  async modify<T>(
    fn: (m: SafeTransactionBuilder) => Promise<T> | T,
    opts?: TransactionOptions,
  ) {
    const t = await this.createTransaction(opts)
    const result = await fn(t)
    t.send()
    return result
  }

  /**
   * This function connects the document with the backend and starts syncing its state.
   * The returned promise resolves once the document has synced up with the backend,
   * and allows creating local transaction using {@link createTransaction}.
   *
   * It should be called exactly once when all `onCreate` callbacks are registered.
   */
  async takeTransactions(props?: {
    validator?: NexusValidator
    gateway?: NexusGateway
    /** if a project template should be loaded on startup, pass a promise that resolves to the transaction */
    templateTransaction?: Promise<Transaction>
  }): Promise<void> {
    if (this.#transactionsAllowed) {
      throw new Error("called `takeTransactions()` twice")
    }

    // setup subsystems
    this.#validator = props?.validator ?? mockNexusValidator()
    this.#gateway = props?.gateway ?? mockNexusGateway()

    // lock document if gateway is blocked
    let lock: Lock | undefined = undefined
    this.#gateway.blocked.subscribe(async (blocked) => {
      if (blocked) {
        // only get lock if not already gotten, in case this ever triggers with `false`
        // multiple times.
        if (lock === undefined) {
          lock = await this.#transactionLock.acquire()
        }
      } else {
        lock?.release()
        lock = undefined
      }
    })

    // we're taking the transaction lock here and keep it until we've:
    // - applied the initial transaction from the backend
    // - applied the template transaction
    const initialLock = await this.#transactionLock.acquire()

    // allow creating transactions. This allows client code to run nexus.createTransaction() and nexus.modify(), however they will have to wait
    // for the initialLock to be released before they can execute. It's important that this flag is set to true before any modifications are applied
    // to the document, otherwise client code can't reliably create transactions as a reaction to events emitted by modifications.
    this.#transactionsAllowed = true

    // we use this promise to await the initial transaction. It will resolve to true if the initial transaction was empty, false otherwise.
    const {
      promise: initialStateHasModifications,
      resolve: initialStateHasModificationsResolve,
    } = Promise.withResolvers<boolean>()

    // wait for the initial transaction to be applied
    const pollForInitialTransaction = asyncInterval(async () => {
      const ts = (this.#gateway ?? throw_()).synchronize()

      if (ts === "done") {
        // this mustn't happen according to the contract of the gateway.
        throw new Error(
          "Gateway returned 'done' before returning the initial transaction.",
        )
      }

      // the "backend state" is loaded once we get at least 1 transaction from synchronize, even if it's empty.
      if (ts.length === 0) {
        return
      }

      const numModifications = ts.flatMap((t) => t.modifications).length // copy here bcs applyIncomingTransactions modifies the array
      await this._applyIncomingTransactions(ts, {
        _takeTransactionLock: false,
      })
      pollForInitialTransaction.terminate() // stop polling
      initialStateHasModificationsResolve(numModifications > 0) // resolve the promise we await below
    }, this.#synchronizeEveryMs)

    // wait for the initial transaction to be applied
    const hadModifications = await initialStateHasModifications

    // now apply the template transaction
    if (props?.templateTransaction !== undefined) {
      // if we receive state from the backend (i.e. the initial transaction was not empty), then we can't apply the template transaction: it will be rejected.
      // So here we just log an error if that's the case, and continue without the template transaction.
      if (hadModifications) {
        console.error(
          "Could not apply template transaction to document: Project state from backend is not empty.",
        )
      } else {
        // apply the template!
        const template = await props.templateTransaction
        const t = await this.createTransaction(undefined, false)
        template.modifications.forEach((m) => t._addModification(m))
        t.send()
      }
    }

    // now we can release the initial lock. We applied the template, and are in sync with the backend.
    initialLock.release()

    // now start the regular sync loop, which unlocks the transaction lock between each iteration.
    const syncLoop = asyncInterval(async (s) => {
      if (s.aborted) {
        return
      }
      const lock = await this.#transactionLock.acquire()
      const ts = (this.#gateway ?? throw_()).synchronize()
      // if gateway is done, we can stop the sync loop.
      if (ts === "done") {
        syncLoop.terminate()
        lock.release()
        return
      }
      await this._applyIncomingTransactions(ts, { _takeTransactionLock: false })
      lock.release()
    }, this.#synchronizeEveryMs)

    this.#terminateSyncLoop = () => syncLoop.terminate()
  }

  /** Apply a transaction that doesn't originate from this document. Yields to the browser
   * scheduler every few modifications applied to make sure we don't block the main thread
   * for too long for big transactions. Throws if the transaction lock isn't taken.
   *
   */
  async _applyIncomingTransactions(
    ts: ReadonlyTransaction[],
    /** @internal */
    opts?: {
      /** This can be false if the transaction lock is already held already when calling from the outside.
       * The method will throw if takeTransactionLock is false and the lock is not held.
       */
      _takeTransactionLock?: boolean
    },
  ) {
    // note: not checking for `applyIncomingTransaction` here as we have to call it before we enable
    // transactions to be created... this could be better.
    assert(this.#gateway !== undefined, "Gateway not initialized")
    assert(this.#validator !== undefined, "Validator not initialized")
    assert(!this.#documentStopped, "Document stopped")

    const lock =
      (opts?._takeTransactionLock ?? true)
        ? await this.#transactionLock.acquire()
        : assert(
            this.#transactionLock.locked,
            "if takeTransactionLock is false, the lock must be held.",
          )

    for (const t of ts) {
      for (const [modIndex, mod] of t.modifications.entries()) {
        this.#applyModification(mod, {
          local: false,
          throwIfInvalid: true,
        })

        if (modIndex % this.#incomingModificationsBatchSize === 0) {
          // yield to scheduler to do something else if he feels like it
          await sleep(0)
        }
      }
    }

    // define iff takeTransactionLock is true.
    lock?.release()
  }

  /**
   * Apply a modification to the document after validating it, and dispatch events to
   * {@link onModification} listeners. Throws if the modification is invalid, unless `throwIfInvalid` is false;
   * in that case, the function returns `string` on error and doesn't change the document state. If application
   * succeeds, always returns undefined.
   */
  #applyModification(
    modification: Modification,
    {
      local = true,
      throwIfInvalid = true,
      actionId,
    }: {
      /** should be true for modification that the user of this session did, and false for modifications
       * coming from other users, or indirect user actions, such as undo/redo.
       */
      local: boolean
      /** if true, the document will throw if the modification is invalid, otherwise it will return silently */
      throwIfInvalid: boolean
      /** The action this modification belongs to */
      actionId?: symbol
    },
  ): string | undefined {
    assert(this.#validator !== undefined, "Validator not initialized")
    assert(
      this.#transactionLock.locked,
      "tried applying modification without lock",
    )

    const validation = this.#validator.validate(modification)
    if (validation !== undefined) {
      if (throwIfInvalid) {
        throw new Error(`modification failed validation: ${validation}`)
      }
      return validation
    }

    this.#state.applyModification(modification)

    // notify listeners on modification
    this.onModification.notify({ modification, local, actionId })
  }

  /** For debugging purposes */
  getStats() {
    return this.#state.getStats()
  }

  /** Stop the document from syncing. This will have the following effect:
   * First, all pending `modify` and `createTransaction` calls will finish.
   * The modifications they create will be synced with the backend, and the document is locked down.
   *
   * After this, calling `modify` or `createTransaction` will throw an error. The only property that
   * can still be accessed is `queryEntities`. The document can be thrown away safely after this.
   */
  async terminate(): Promise<void> {
    if (!this.#transactionsAllowed) {
      throw new Error("Can't stop a document that hasn't started yet.")
    }

    if (this.#documentStopping) {
      return // do nothing
    }

    this.#documentStopping = true
    // wait for all pending transactions to finish. Throw the lock away; it won't be unlocked.`
    await this.#transactionLock.acquire()
    this.#terminateSyncLoop?.() // always defined but ts doesn't know it
    // safety net to avoid pending promises left after termination.
    this.#transactionLock.acquire = () =>
      throw_(
        "invariant violated: cannot get transaction lock after document stopped",
      )

    // block further transactions

    this.#documentStopped = true
    // terminate
    await this.#gateway?.terminate()

    // clean up wasm state
    this.#validator?.terminate()

    // clear event listeners to avoid memory leaks
    this.events._clear()
  }
}
