import { throw_ } from "@utils/lang"
import type { WasmLoader } from "./types"

import wasmUrl from "@document/mock/wasm/document_validator.wasm?no-inline"
import wasmJsUrl from "@document/mock/wasm/wasm_exec.js?no-inline"
;[wasmUrl, wasmJsUrl] // ensure these aren't optimized away

/**
 * Create a WASM loader that loads files from disk using Node.js APIs.
 *
 * Works in Node.js, Bun, and Deno (all support node: imports).
 *
 * Use this when running the SDK outside of a browser environment.
 *
 * @example
 * ```typescript
 * import { createAudiotoolClient } from "@audiotool/nexus"
 * import { createNodeTransport, createDiskWasmLoader } from "@audiotool/nexus/node"
 *
 * // Node.js - needs both transport and wasm loader
 * const client = await createAudiotoolClient({
 *   auth: "at_pat_xxx",
 *   transport: createNodeTransport(),
 *   wasm: createDiskWasmLoader(),
 * })
 *
 * // Bun/Deno - only needs wasm loader (transport uses fetch which works fine)
 * const client = await createAudiotoolClient({
 *   auth: "at_pat_xxx",
 *   wasm: createDiskWasmLoader(),
 * })
 * ```
 */
export const createDiskWasmLoader = (): WasmLoader => {
  return {
    async executeRuntime() {
      const path = await import("node:path")
      const url = await import("node:url")
      const fs = await import("node:fs")

      let filePath: string

      if (import.meta.env.MODE === "test") {
        filePath = "src/document/mock/wasm/wasm_exec.js"
      } else {
        filePath = path.resolve(
          path.dirname(url.fileURLToPath(import.meta.url)),
          `.${wasmJsUrl}`,
        )
      }

      const { promise, resolve } = Promise.withResolvers<void>()
      fs.readFile(filePath, "utf-8", (err, data) =>
        err != null ? throw_(err) : (eval(data), resolve()),
      )
      return await promise
    },

    async loadModule() {
      const fs = await import("node:fs")
      const path = await import("node:path")
      const url = await import("node:url")

      let filePath: string

      if (import.meta.env.MODE === "test") {
        filePath = "src/document/mock/wasm/document_validator.wasm"
      } else {
        filePath = path.resolve(
          path.dirname(url.fileURLToPath(import.meta.url)),
          `.${wasmUrl}`,
        )
      }

      return WebAssembly.compile(new Uint8Array(fs.readFileSync(filePath)))
    },
  }
}
