import { Modification, Transaction } from "@gen/document/v1/document_service_pb"
import { assert, throw_ } from "@utils/lang"
import type { WasmLoader } from "../../wasm/types"

// caches past initializations of the wasm document state builder
let wasmDocumentStateBuilderCache:
  | Promise<() => WasmDocumentState>
  | undefined = undefined

// stores the wasm loader to use - set via initWasmLoader
let currentWasmLoader: WasmLoader | undefined = undefined

/**
 * Initialize the WASM loader to use for document state.
 * Must be called before getWasmDocumentState() if not using the default browser loader.
 * No-op if WASM is already initialized.
 *
 * @internal
 */
export const initWasmLoader = (loader: WasmLoader): void => {
  if (wasmDocumentStateBuilderCache !== undefined) {
    return
  }
  currentWasmLoader = loader
}

/**
 * Get a new {@link WasmDocumentState} instance. On first run, this fetches and initializes the wasm module.
 * Subsequent calls return {@link WasmDocumentState}s from the same wasm instance.
 */
export const getWasmDocumentState = async (): Promise<WasmDocumentState> => {
  if (wasmDocumentStateBuilderCache !== undefined) {
    const builder = await wasmDocumentStateBuilderCache
    return builder()
  }

  // Get the loader - use browser loader by default
  const loader = currentWasmLoader ?? (await getDefaultWasmLoader())

  const { promise, resolve } = Promise.withResolvers<() => WasmDocumentState>()
  wasmDocumentStateBuilderCache = promise

  // start importing the js wrapper
  const wrapperImportPromise: Promise<void> = loader.executeRuntime()
  // start loading the wasm module
  const wasmPromise: Promise<WebAssembly.Module> = loader.loadModule()

  // wait for the js wrapper to be imported, which should give us the exports below
  await wrapperImportPromise

  // go object is attached to globalThis by the executed wasm code
  const Go =
    globalThis.Go ??
    throw_("wasm wrapper initialization failed: Go not defined")
  const go = new Go()

  try {
    await wasmPromise
    const instance = await WebAssembly.instantiate(
      await wasmPromise,
      go.importObject,
    )
    go.run(instance)
  } catch (error: unknown) {
    throw new Error(`Failed to instantiate validator WASM`, { cause: error })
  }
  // clean up globalThis namespace
  delete globalThis.Go

  const createDocumentState =
    // createDocumentState is attached to globalThis by the executed wasm code
    globalThis.createDocumentState ??
    throw_("wasm initialization failed: createDocumentState not defined")

  // cleanup globalThis namespace
  delete globalThis.createDocumentState

  resolve((): WasmDocumentState => {
    // here we just wrap the wasm state lightly, deserializing and serializing the transactions
    const state = createDocumentState()
    let terminated = false
    DEBUG_totalOpenWasmDocuments++
    return {
      applyTransaction(transaction: Transaction): Transaction | string {
        assert(
          !terminated,
          "tried applying a transaction after document state was terminated",
        )

        const mods = state.applyTransaction(transaction.toBinary())

        if (mods instanceof Object && "error" in mods) {
          return mods.error
        }

        return new Transaction({
          modifications: mods.rollbacks.map((m) => Modification.fromBinary(m)),
        })
      },
      terminate(): void {
        terminated = true
        DEBUG_totalOpenWasmDocuments--
        state.delete()
      },
    }
  })
  const builder = await promise
  return builder()
}

/** The document state implemented by the wasm module.. */
export type WasmDocumentState = {
  /** Apply a transaction. Returns either:
   * * the reverse transaction if the transaction is valid
   * * an error string if the transaction is invalid
   */
  applyTransaction: (transaction: Transaction) => Transaction | string

  /** Causes {@link applyTransaction} to throw. Used to clean up memory in the wasm. */
  terminate(): void
}

/** Type of object returned by the wasm module if an error happens. */
type WasmError = {
  error: string
}

/** Type of object returned by the wasm module. */
type WasmState = {
  /** Returns all entities currently in the document, currently not used */
  getEntities: () => Uint8Array[] | WasmError
  /** Apply a new transaction to the document. Returns the modifications reverting the transaction. */
  applyTransaction: (
    transaction: Uint8Array,
  ) => { rollbacks: Uint8Array[] } | WasmError
  /** Delete this document, free up memory. The other calls will return error after this. */
  delete: () => void
}

/** The go wasm unfortunately communicates with the remainder of the world using globalThis.
 *
 * In the creation function above, we delete the globalThis.Go and globalThis.createDocumentState after they're moved
 * into a local namespace.
 */
declare global {
  // eslint-disable-next-line no-var
  var Go:
    | {
        new (): {
          run: (instance: WebAssembly.Instance) => void
          importObject: WebAssembly.Imports
        }
      }
    | undefined

  // eslint-disable-next-line no-var
  var createDocumentState: (() => WasmState) | undefined
}

/**
 * Get the default WASM loader for the current environment.
 * - Test mode: uses disk loader (tests run in Node.js)
 * - Browser: uses fetch-based loader
 * - Node.js/Bun/Deno without explicit loader: throws helpful error
 */
const getDefaultWasmLoader = async (): Promise<WasmLoader> => {
  // In test mode, always use disk loader since tests run in Node.js
  if (import.meta.env.MODE === "test") {
    const { createDiskWasmLoader } = await import("../../wasm/disk-wasm-loader")
    return createDiskWasmLoader()
  }

  // Detect server-side environment and throw helpful error
  if (typeof process !== "undefined") {
    throw new Error(
      "Can't load Wasm: server-side usage requires createDiskWasmLoader() from @audiotool/nexus/node",
    )
  }

  // In browser, use fetch-based loader
  const { createBrowserWasmLoader } = await import("../../wasm/browser-wasm-loader")
  return createBrowserWasmLoader()
}

/**
 * @internal
 *
 * For debugging - tracks how many documents are currently open in wasm but not yet closed.
 *
 * This can be used to assert that all documents have been terminated when a nexus document is terminated.
 * This is important because the wasm memory won't be freed on its own if it's not referenced.
 */
export let DEBUG_totalOpenWasmDocuments = 0
