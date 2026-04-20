/**
 * Interface for loading WASM modules required by the SDK.
 *
 * The SDK needs two files:
 * - `wasm_exec.js`: Go's WASM runtime support
 * - `document_validator.wasm`: The compiled validator
 *
 * Different environments load these differently:
 * - Browser: fetch from URL (configured via VITE_WASM_ASSETS_PREFIX)
 * - Node.js/Bun/Deno: load from disk using node:fs
 */
export type WasmLoader = {
  /**
   * Execute the Go WASM runtime JS wrapper.
   * This must attach `Go` constructor to globalThis.
   */
  executeRuntime(): Promise<void>

  /**
   * Load and compile the WASM module.
   */
  loadModule(): Promise<WebAssembly.Module>
}
