import { neverThrowingFetch } from "../utils/fetch/never-throwing-fetch"
import type { AuthProvider, TokenData } from "./types"

const TOKEN_ENDPOINT = "https://oauth.audiotool.com/oauth2/token"

/**
 * Create an auth provider for server-side use with tokens obtained from browser OAuth flow.
 *
 * Use this when:
 * - User authenticated in browser via `audiotool()`
 * - Browser exported tokens via `exportTokens()` and sent them to your server
 * - Server needs to make API calls on user's behalf
 *
 * Handles token refresh automatically. Use `onTokenRefresh` to persist new tokens.
 *
 * @example
 * ```typescript
 * // In your API route handler (Next.js, Express, etc.)
 * import { createAudiotoolClient, createServerAuth } from "@audiotool/nexus"
 * import { createNodeTransport, createDiskWasmLoader } from "@audiotool/nexus/node"
 *
 * const client = await createAudiotoolClient({
 *   auth: createServerAuth({
 *     accessToken: session.accessToken,
 *     refreshToken: session.refreshToken,
 *     expiresAt: session.expiresAt,
 *     clientId: "your-client-id",
 *     onTokenRefresh: (tokens) => session.save(tokens),
 *   }),
 *   transport: createNodeTransport(),
 *   wasm: createDiskWasmLoader(),
 * })
 * ```
 */
export const createServerAuth = (opts: {
  /** The current access token */
  accessToken: string
  /** The refresh token for obtaining new access tokens */
  refreshToken: string
  /** Unix timestamp (ms) when the access token expires */
  expiresAt: number
  /** The OAuth client ID of your application */
  clientId: string
  /** Optional callback when tokens are refreshed - use to persist new tokens */
  onTokenRefresh?: (tokens: TokenData) => void
}): AuthProvider => {
  let { accessToken, refreshToken, expiresAt } = opts
  const { clientId, onTokenRefresh } = opts

  let refreshPromise: Promise<string> | undefined

  const refreshTokenIfNeeded = async (): Promise<string> => {
    const isExpired = Date.now() >= expiresAt - 60_000 // 60 seconds buffer

    if (!isExpired) {
      return accessToken
    }

    // If already refreshing, wait for that
    if (refreshPromise) {
      return refreshPromise
    }

    refreshPromise = (async () => {
      try {
        const response = await neverThrowingFetch(TOKEN_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            client_id: clientId,
            grant_type: "refresh_token",
            refresh_token: refreshToken,
          }),
        })

        if (response instanceof Error) {
          throw new Error(`Token refresh failed: ${response.message}`, {
            cause: response,
          })
        }

        if (!response.ok) {
          throw new Error(`Token refresh failed: ${response.statusText}`)
        }

        const data = await response.json()

        if (data.error) {
          throw new Error(`Token refresh failed: ${data.error}`, {
            cause: data.error_description,
          })
        }

        // Update stored tokens
        accessToken = data.access_token
        refreshToken = data.refresh_token
        expiresAt = Date.now() + data.expires_in * 1000

        // Notify caller to persist new tokens
        onTokenRefresh?.({
          accessToken,
          refreshToken,
          expiresAt,
        })

        return accessToken
      } finally {
        refreshPromise = undefined
      }
    })()

    return refreshPromise
  }

  return {
    getToken: async () => {
      const token = await refreshTokenIfNeeded()
      return token.startsWith("Bearer ") ? token : `Bearer ${token}`
    },
  }
}
