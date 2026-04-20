import { throw_ } from "@utils/lang"
import type { WasmLoader } from "./types"

/**
 * Create a WASM loader for browser environments.
 *
 * Loads WASM files via fetch from a configurable URL prefix.
 * The prefix is set via the `VITE_WASM_ASSETS_PREFIX` environment variable.
 *
 * @internal This is the default loader used in browser environments.
 */
export const createBrowserWasmLoader = (): WasmLoader => {
  const prefix = import.meta.env.VITE_WASM_ASSETS_PREFIX ?? ""

  return {
    async executeRuntime() {
      await import(/* @vite-ignore */ `${prefix}/wasm_exec.js`)
    },

    async loadModule() {
      const res = await fetch(`${prefix}/document_validator.wasm.gz`)
      if (!res.ok) {
        throw_("couldn't fetch wasm module")
      }
      return WebAssembly.compileStreaming(res)
    },
  }
}
