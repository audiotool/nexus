/**
 * @packageDocumentation
 *
 * # Audiotool Nexus SDK
 *
 * The main entry point for the Audiotool Nexus SDK. This package enables real-time
 * collaboration and document manipulation for Audiotool projects.
 *
 * ## Quick Start (Browser)
 *
 * ```typescript
 * import { audiotool } from "@audiotool/nexus"
 *
 * const at = await audiotool({
 *   clientId: "your-client-id",
 *   redirectUrl: "http://127.0.0.1:5173/",
 *   scope: "project:write",
 * })
 *
 * if (at.status === "authenticated") {
 *   // at IS the client
 *   const projects = await at.projects.listProjects({})
 *   console.log(`Hello, ${at.userName}!`)
 * }
 *
 * if (at.status === "unauthenticated") {
 *   button.onclick = () => at.login()
 * }
 * ```
 *
 * ## Node.js Usage
 *
 * ```typescript
 * import { createAudiotoolClient, createServerAuth } from "@audiotool/nexus"
 * import { createNodeTransport, createDiskWasmLoader } from "@audiotool/nexus/node"
 *
 * const client = await createAudiotoolClient({
 *   auth: createServerAuth({ accessToken, refreshToken, expiresAt, clientId }),
 *   transport: createNodeTransport(),
 *   wasm: createDiskWasmLoader(),
 * })
 * ```
 */

// Main browser entry point
export {
  audiotool,
  type BrowserAuthResult,
  type AuthenticatedClient,
  type UnauthenticatedResult,
} from "../browser-auth"

// Client creation for advanced use cases
export {
  createAudiotoolClient,
  type AudiotoolClient,
} from "../audiotool-client"
export type { SyncedDocument } from "../synced-document"

// Auth utilities
export { createPATAuth } from "../auth/pat-auth"
export { createServerAuth } from "../auth/server-auth"
export type { AuthProvider, TokenData } from "../auth/types"

// Offline document
export { createOfflineDocument } from "../synced-document"
export type { OfflineDocument } from "../synced-document"

// WASM loader type (implementation in @audiotool/nexus/node)
export type { WasmLoader } from "../wasm/types"
