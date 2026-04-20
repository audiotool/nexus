/**
 * @packageDocumentation
 *
 * # Audiotool Nexus SDK - Node.js/Bun/Deno
 *
 * Server-side exports for Node.js, Bun, and Deno runtimes.
 *
 * - `createNodeTransport()`: Node.js only - handles HTTP/2 connection pooling quirks
 * - `createDiskWasmLoader()`: All server runtimes - loads WASM from filesystem
 * - `createOfflineDocument()`: All server runtimes - offline document with disk-based WASM
 *
 * ## Quick Start
 *
 * ```typescript
 * // Node.js - needs both transport and wasm loader
 * import { createAudiotoolClient, createServerAuth } from "@audiotool/nexus"
 * import { createNodeTransport, createDiskWasmLoader } from "@audiotool/nexus/node"
 *
 * const client = await createAudiotoolClient({
 *   auth: createServerAuth({ accessToken, refreshToken, expiresAt, clientId }),
 *   transport: createNodeTransport(),
 *   wasm: createDiskWasmLoader(),
 * })
 *
 * // Bun/Deno - only needs wasm loader
 * import { createAudiotoolClient, createServerAuth } from "@audiotool/nexus"
 * import { createDiskWasmLoader } from "@audiotool/nexus/node"
 *
 * const client = await createAudiotoolClient({
 *   auth: createServerAuth({ accessToken, refreshToken, expiresAt, clientId }),
 *   wasm: createDiskWasmLoader(),
 * })
 *
 * // Offline document for testing (Node.js/Bun/Deno)
 * import { createOfflineDocument } from "@audiotool/nexus/node"
 *
 * const doc = await createOfflineDocument()
 * ```
 */

import { initWasmLoader } from "../document/backend/create-wasm-document-state"
import { createOfflineDocument as createOfflineDocumentBase } from "../synced-document"
import type { OfflineDocument } from "../synced-document"
import { createDiskWasmLoader } from "../wasm/disk-wasm-loader"

export { createNodeTransport } from "../transport/node-transport"
export { createDiskWasmLoader } from "../wasm/disk-wasm-loader"
export type { TransportFactory } from "../transport/types"
export type { WasmLoader } from "../wasm/types"
export type { OfflineDocument } from "../synced-document"

/**
 * Create an offline document for server-side use (Node.js/Bun/Deno).
 *
 * Uses disk-based WASM loading automatically - no need to pass a wasm loader.
 *
 * @example
 * ```typescript
 * import { createOfflineDocument } from "@audiotool/nexus/node"
 *
 * const doc = await createOfflineDocument()
 * const tm = await doc.modify((t) => t.create("tonematrix", {}))
 * ```
 */
export const createOfflineDocument = async (opts?: {
  /** Whether validation is enabled. Turning that off results in fewer transaction errors, but can lead to invalid states. */
  validated?: boolean
}): Promise<OfflineDocument> => {
  initWasmLoader(createDiskWasmLoader())
  return createOfflineDocumentBase(opts)
}
