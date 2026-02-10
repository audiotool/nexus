import { Modification, Transaction } from "@gen/document/v1/document_service_pb"
import { assert, throw_ } from "@utils/lang"

import wasmUrl from "@document/mock/wasm/document_validator.wasm?no-inline"
import wasmJsUrl from "@document/mock/wasm/wasm_exec.js?no-inline"
;[wasmUrl, wasmJsUrl] // make sure these aren't optimized away

/** true if in a node.js-like environment */
const runningInNode: boolean = typeof process !== "undefined"

// caches past initializations of the wasm document state builder
let wasmDocumentStateBuilderCache:
  | Promise<() => WasmDocumentState>
  | undefined = undefined

/**
 * Get a new {@link WasmDocumentState} instance. On first run, this fetches and initializes the wasm module.
 * Subsequent calls return {@link WasmDocumentState}s from the same wasm instance.
 */
export const getWasmDocumentState = async (): Promise<WasmDocumentState> => {
  if (wasmDocumentStateBuilderCache !== undefined) {
    const builder = await wasmDocumentStateBuilderCache
    return builder()
  }
  const { promise, resolve } = Promise.withResolvers<() => WasmDocumentState>()
  wasmDocumentStateBuilderCache = promise

  // start importing the js wrapper. TODO: start this earlier.
  const wrapperImportPromise: Promise<void> = executeWrapperJs()
  // start loading the wasm module. TODO: start this earlier.
  const wasmPromise: Promise<WebAssembly.Module> = loadWasm()

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

/** Executes the wrapper js code required to initialize the validator wasm.
 *
 * In node.js-like environments, it will read the file from the filesystem.
 * In the browser, it will import the file.
 */
const executeWrapperJs = async (): Promise<void> => {
  if (!runningInNode) {
    return import(`${import.meta.env.VITE_WASM_ASSETS_PREFIX}/wasm_exec.js`)
  }

  // load node.js modules only now so the imports aren't triggered in the web.
  const path = await import("node:path")
  const url = await import("node:url")
  const fs = await import("node:fs")

  let filePath: string

  if (import.meta.env.MODE === "test") {
    // this happens when executing unit tests via vitest, which doesn't bundle the code.
    filePath = "src/document/mock/wasm/wasm_exec.js"
  } else {
    // bundled mode, need to resolve the path relative to this file's location.
    filePath = path.resolve(
      path.dirname(url.fileURLToPath(import.meta.url)),
      `.${wasmJsUrl}`,
    )
  }
  // read the file async to get some perf boost
  const { promise, resolve } = Promise.withResolvers<void>()
  fs.readFile(filePath, "utf-8", (err, data) =>
    // throw error or eval and resolve promise
    err != null ? throw_(err) : (eval(data), resolve()),
  )
  return await promise
}

const loadWasm = async (): Promise<WebAssembly.Module> => {
  if (!runningInNode) {
    return await fetch(
      `${import.meta.env.VITE_WASM_ASSETS_PREFIX}/document_validator.wasm.gz`,
    ).then(async (res) =>
      res.ok
        ? WebAssembly.compileStreaming(res)
        : throw_("couldn't fetch wasm module"),
    )
  }

  // load node.js modules only now so the imports aren't triggered in the web.
  const fs = await import("node:fs")
  const path = await import("node:path")
  const url = await import("node:url")

  let filePath: string
  // test mode, no bundling. used during npm run test.
  if (import.meta.env.MODE === "test") {
    filePath = "src/document/mock/wasm/document_validator.wasm"
  } else {
    // bundled mode, need to resolve the path relative to this file's location.
    filePath = path.resolve(
      path.dirname(url.fileURLToPath(import.meta.url)),
      `.${wasmUrl}`,
    )
  }

  return WebAssembly.compile(new Uint8Array(fs.readFileSync(filePath)))
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
