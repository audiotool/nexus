import type { AuthProvider } from "./types"

/**
 * Create an auth provider from a Personal Access Token (PAT).
 *
 * PATs grant full access to your Audiotool account and should never be shared
 * or checked into version control.
 *
 * Get your PAT at https://developer.audiotool.com/personal-access-tokens
 *
 * @example
 * ```typescript
 * import { createPATAuth, createAudiotoolClient } from "@audiotool/nexus"
 * import { createNodeTransport, createDiskWasmLoader } from "@audiotool/nexus/node"
 *
 * const client = await createAudiotoolClient({
 *   auth: createPATAuth(process.env.AT_PAT!),
 *   transport: createNodeTransport(),
 *   wasm: createDiskWasmLoader(),
 * })
 * ```
 */
export const createPATAuth = (pat: string): AuthProvider => {
  const token = pat.startsWith("Bearer ") ? pat : `Bearer ${pat}`
  return {
    getToken: async () => token,
  }
}
