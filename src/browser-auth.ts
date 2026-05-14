import type { AudiotoolClient } from "./audiotool-client"
import { createAudiotoolClientInternal } from "./audiotool-client"
import type { TokenData } from "./auth/types"
import { createBrowserTransportFactory } from "./transport/browser-transport"
import { neverThrowingFetch } from "./utils/fetch/never-throwing-fetch"

const AUTHORIZATION_ENDPOINT = "https://oauth.audiotool.com/oauth2/auth"
const TOKEN_ENDPOINT = "https://oauth.audiotool.com/oauth2/token"
const API_ENDPOINT = "https://rpc.audiotool.com"

// Where the popup-mode entry endpoint lives. Different host than the
// AUTHORIZATION_ENDPOINT (which is Hydra) because /oauth/popup/start is
// implemented by the accounts service in front of Hydra.
const ACCOUNTS_POPUP_START = "https://accounts.audiotool.com/oauth/popup/start"

// Origin of the accounts service. We require postMessage events received
// from the popup to come from this exact origin; anything else is rejected.
const ACCOUNTS_ORIGIN = "https://accounts.audiotool.com"

// The fixed window.name we use for the popup. Reusing the same name means
// repeat calls focus the existing popup instead of opening a second one.
const POPUP_WINDOW_NAME = "audiotool-oauth"

const DEFAULT_POPUP_FEATURES = "popup,width=480,height=720,noopener=no"

type LocalStorageKeys = {
  accessToken: string
  refreshToken: string
  expiresAt: string
  codeVerifier: string
  userName: string
  state: string
}

/**
 * Result of the browser authentication flow.
 *
 * When `status` is `"authenticated"`, this object IS the Audiotool client -
 * you can call `projects`, `open`, etc. directly on it.
 *
 * @example
 * ```typescript
 * const at = await audiotool({ clientId, redirectUrl, scope })
 *
 * if (at.status === "authenticated") {
 *   // at IS the client
 *   const projects = await at.projects.listProjects({})
 *   console.log(`Logged in as ${at.userName}`)
 * }
 *
 * if (at.status === "unauthenticated") {
 *   if (at.error) {
 *     console.error("Auth failed:", at.error)
 *   }
 *   showLoginButton(at.login)
 * }
 * ```
 */
export type BrowserAuthResult = AuthenticatedClient | UnauthenticatedResult

/**
 * Authenticated client that extends AudiotoolClient with auth-specific methods.
 */
export type AuthenticatedClient = AudiotoolClient & {
  /** The authentication status */
  status: "authenticated"
  /** The authenticated user's name */
  userName: string
  /** Log out and reload the page */
  logout: () => void
  /**
   * Export tokens for server-side use.
   *
   * Send these to your server (via cookie, session, etc.) to make
   * API calls on behalf of the user using `createServerAuth()`.
   */
  exportTokens: () => TokenData
}

export type UnauthenticatedResult = {
  status: "unauthenticated"
  /** Start the OAuth login flow by redirecting to the consent screen */
  login: () => void
  /** If authentication failed, the error that occurred */
  error?: Error
}

/**
 * Initialize Audiotool in the browser with OAuth2 authentication.
 *
 * This is the main entry point for browser applications. It handles the OAuth2 PKCE
 * flow, including redirects to the consent screen and token management.
 *
 * When authenticated, the returned object IS the client - you can call API methods
 * directly on it.
 *
 * @example
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
 *   const projects = await at.projects.listProjects({})
 *   console.log(`Hello, ${at.userName}!`)
 *
 *   // To use on server, export tokens
 *   const tokens = at.exportTokens()
 *   await fetch("/api/store-session", { body: JSON.stringify(tokens) })
 * }
 *
 * if (at.status === "unauthenticated") {
 *   if (at.error) {
 *     console.error("Auth failed:", at.error)
 *   }
 *   // Show login button
 *   button.onclick = () => at.login()
 * }
 * ```
 */
export const audiotool = async ({
  clientId,
  redirectUrl,
  scope,
}: {
  /**
   * Client ID assigned to your application on https://developer.audiotool.com/applications
   */
  clientId: string
  /**
   * Redirect URL after the user presses "Allow" on the consent screen.
   * Must be registered for your application on https://developer.audiotool.com/applications
   */
  redirectUrl: string
  /**
   * The scopes your app requires (e.g., "project:write").
   * Must be a subset of scopes assigned to your app.
   */
  scope: string
}): Promise<BrowserAuthResult> => {
  const localStorageKeys: LocalStorageKeys = {
    accessToken: `oidc_${clientId}_oidc_access_token`,
    refreshToken: `oidc_${clientId}_oidc_refresh_token`,
    expiresAt: `oidc_${clientId}_oidc_expires_at`,
    codeVerifier: `oidc_${clientId}_oidc_code_verifier`,
    userName: `oidc_${clientId}_oidc_user_name`,
    state: `oidc_${clientId}_oidc_state`,
  }

  const login = () => {
    cleanUpLocalStorage(localStorageKeys)
    redirectUserToLogin(localStorageKeys, clientId, scope, redirectUrl)
  }

  // Check URL params - may be returning from OAuth redirect
  const urlParams = new URLSearchParams(window.location.search)

  // Check for OAuth error
  const error = urlParams.get("error")
  const errorDescription = urlParams.get("error_description")

  if (error != null) {
    cleanupUrl()
    cleanUpLocalStorage(localStorageKeys)
    return {
      status: "unauthenticated",
      login,
      error: toError(error, errorDescription),
    }
  }

  // Check for OAuth code - returning from consent screen
  const code = urlParams.get("code")

  if (code != null) {
    const state = urlParams.get("state")
    const storedState = localStorage.getItem(localStorageKeys.state)
    if (state == null || storedState == null || state !== storedState) {
      return {
        status: "unauthenticated",
        login,
        error: toError(
          "Invalid state URL parameter.",
          "Clean the URL of stale query parameters and try again.",
        ),
      }
    }

    const codeVerifier = localStorage.getItem(localStorageKeys.codeVerifier)
    if (codeVerifier == null) {
      return {
        status: "unauthenticated",
        login,
        error: toError("Code verifier not found. Restart the auth flow."),
      }
    }

    const response = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUrl,
        code_verifier: codeVerifier,
        token_endpoint_auth_method: "none",
      }),
    })

    const {
      access_token,
      refresh_token,
      expires_in,
      error: tokenError,
      error_description: tokenErrorDescription,
    } = await response.json()

    if (tokenError) {
      return {
        status: "unauthenticated",
        login,
        error: toError(tokenError, tokenErrorDescription),
      }
    }

    localStorage.setItem(localStorageKeys.accessToken, access_token)
    localStorage.setItem(localStorageKeys.refreshToken, refresh_token)
    localStorage.setItem(
      localStorageKeys.expiresAt,
      (Date.now() + expires_in * 1000).toString(),
    )

    cleanupUrl()
    localStorage.removeItem(localStorageKeys.codeVerifier)
  }

  // Clean up state after validation
  localStorage.removeItem(localStorageKeys.state)

  // Get or refresh token
  const tokenResult = await getOrFetchValidToken(localStorageKeys, clientId)

  if (tokenResult === undefined) {
    return { status: "unauthenticated", login }
  }

  if (tokenResult instanceof Error) {
    return { status: "unauthenticated", login, error: tokenResult }
  }

  // We have a valid token - create the authenticated client
  // (tokenResult is the access token string, used internally by getOrFetchValidToken)

  // Create token refresh mechanism
  let refreshPromise: Promise<string | Error> | undefined = undefined
  const getToken = async (): Promise<string> => {
    if (refreshPromise === undefined) {
      refreshPromise = (async () => {
        const result = await getOrFetchValidToken(localStorageKeys, clientId)
        if (result === undefined) {
          return new Error("User not logged in.")
        }
        return result
      })()
      const result = await refreshPromise
      refreshPromise = undefined
      if (result instanceof Error) {
        throw result
      }
      return result.startsWith("Bearer ") ? result : `Bearer ${result}`
    }
    const result = await refreshPromise
    if (result instanceof Error) {
      throw result
    }
    return result.startsWith("Bearer ") ? result : `Bearer ${result}`
  }

  // Fetch user name
  const userName = await fetchUserName(getToken)
  if (userName instanceof Error) {
    return { status: "unauthenticated", login, error: userName }
  }

  // Create the client with browser transport
  const transportFactory = createBrowserTransportFactory()
  const client = await createAudiotoolClientInternal({
    getToken,
    transportFactory,
  })

  const logout = () => {
    cleanUpLocalStorage(localStorageKeys)
    cleanupUrl()
    window.location.reload()
  }

  const exportTokens = (): TokenData => {
    const accessToken = localStorage.getItem(localStorageKeys.accessToken)
    const refreshToken = localStorage.getItem(localStorageKeys.refreshToken)
    const expiresAtStr = localStorage.getItem(localStorageKeys.expiresAt)

    if (!accessToken || !refreshToken || !expiresAtStr) {
      throw new Error("Cannot export tokens: not authenticated")
    }

    return {
      accessToken,
      refreshToken,
      expiresAt: parseInt(expiresAtStr, 10),
    }
  }

  return {
    ...client,
    status: "authenticated",
    userName,
    logout,
    exportTokens,
  }
}

const fetchUserName = async (
  getToken: () => Promise<string>,
): Promise<string | Error> => {
  const token = await getToken()
  const response = await neverThrowingFetch(
    `${API_ENDPOINT}/audiotool.auth.v1.AuthService/GetWhoami`,
    {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    },
  )

  if (response instanceof Error) {
    return response
  }

  if (!response.ok) {
    return new Error(`Failed to get user info: ${response.statusText}`)
  }

  const { whoami } = await response.json()
  return whoami?.userName ?? "Unknown User"
}

const cleanUpLocalStorage = (localStorageKeys: LocalStorageKeys) => {
  localStorage.removeItem(localStorageKeys.accessToken)
  localStorage.removeItem(localStorageKeys.refreshToken)
  localStorage.removeItem(localStorageKeys.expiresAt)
  localStorage.removeItem(localStorageKeys.codeVerifier)
  localStorage.removeItem(localStorageKeys.userName)
  localStorage.removeItem(localStorageKeys.state)
}

const cleanupUrl = () => {
  const url = new URL(window.location.href)
  url.searchParams.delete("code")
  url.searchParams.delete("scope")
  url.searchParams.delete("state")
  url.searchParams.delete("error")
  url.searchParams.delete("error_description")
  window.history.replaceState(
    {},
    document.title,
    url.search ? url.href : url.href.replace("?", ""),
  )
}

const redirectUserToLogin = async (
  localStorageKeys: LocalStorageKeys,
  clientId: string,
  scope: string,
  redirectUrl: string,
) => {
  const codeVerifier = generateCodeVerifier()
  localStorage.setItem(localStorageKeys.codeVerifier, codeVerifier)

  const codeChallenge = await generateCodeChallenge(codeVerifier)
  const state = crypto.getRandomValues(new Uint8Array(16)).join("")
  localStorage.setItem(localStorageKeys.state, state)

  const authUrl = new URL(AUTHORIZATION_ENDPOINT)
  authUrl.search = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    scope: scope,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
    redirect_uri: redirectUrl,
    state: state,
  }).toString()

  window.location.href = authUrl.toString()
}

const toError = (message: string, description?: string | null): Error => {
  description = description ? `: ${description}` : ""
  return new Error(`${message}${description}`)
}

const generateCodeVerifier = (): string => {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  const randomValues = crypto.getRandomValues(new Uint8Array(64))
  return randomValues.reduce(
    (acc, x) => acc + possible[x % possible.length],
    "",
  )
}

const generateCodeChallenge = async (verifier: string): Promise<string> => {
  const data = new TextEncoder().encode(verifier)
  const hashed = await crypto.subtle.digest("SHA-256", data)
  return btoa(String.fromCharCode(...new Uint8Array(hashed)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
}

const getOrFetchValidToken = async (
  localStorageKeys: LocalStorageKeys,
  clientId: string,
): Promise<undefined | string | Error> => {
  const currentToken = localStorage.getItem(localStorageKeys.accessToken)
  if (currentToken == null) {
    return undefined
  }

  let isExpired: boolean = true
  {
    const expiresAtStr = localStorage.getItem(localStorageKeys.expiresAt)
    isExpired =
      expiresAtStr == null
        ? true
        : Date.now() >= parseInt(expiresAtStr) - 60_000
  }

  if (!isExpired) {
    return currentToken
  }

  const refreshToken = localStorage.getItem(localStorageKeys.refreshToken)
  if (refreshToken == null) {
    cleanUpLocalStorage(localStorageKeys)
    return undefined
  }

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
    return new Error(`Error during refresh token request: ${response.name}`, {
      cause: response.message,
    })
  }

  const { error, error_description, access_token, refresh_token, expires_in } =
    await response.json()
  if (error) {
    return toError(error, error_description)
  }

  localStorage.setItem(localStorageKeys.accessToken, access_token)
  localStorage.setItem(localStorageKeys.refreshToken, refresh_token)
  localStorage.setItem(
    localStorageKeys.expiresAt,
    (Date.now() + expires_in * 1000).toString(),
  )
  return access_token
}

// =========================================================================
// Popup-mode OAuth
// =========================================================================
//
// Use this in apps that run inside an iframe (e.g. base44-embedded apps)
// where a top-level navigation to oauth.audiotool.com isn't possible. Opens
// accounts.audiotool.com in a popup, runs the standard login + consent flow
// there, and posts the authorization code back to this window via
// postMessage.
//
// Must be called synchronously from a user-gesture event handler (e.g. a
// button onclick) — popup blockers will otherwise refuse to open the window.

/**
 * Result of the popup authentication flow.
 *
 * Mirrors {@link BrowserAuthResult} but does not need a `login()` callback,
 * since calling {@link audiotoolPopup} is itself the trigger.
 */
export type PopupAuthResult =
  | AuthenticatedClient
  | { status: "unauthenticated"; error: Error }

/**
 * Authenticate via a window.open() popup and postMessage. Use this when your
 * app runs in an iframe or otherwise cannot do a full-page redirect.
 *
 * Must be called synchronously from a click (or other user-gesture)
 * handler, otherwise the browser's popup blocker will reject the
 * `window.open()` call.
 *
 * @example
 * ```typescript
 * import { audiotoolPopup } from "@audiotool/nexus"
 *
 * button.onclick = async () => {
 *   const at = await audiotoolPopup({
 *     clientId: "your-client-id",
 *     scope: "project:write",
 *   })
 *
 *   if (at.status === "authenticated") {
 *     const projects = await at.projects.listProjects({})
 *   } else {
 *     console.error("Login failed:", at.error)
 *   }
 * }
 * ```
 */
export const audiotoolPopup = async ({
  clientId,
  scope,
  targetOrigin = window.location.origin,
  windowFeatures = DEFAULT_POPUP_FEATURES,
}: {
  /**
   * Client ID assigned to your application on
   * https://developer.audiotool.com/applications. Must have an origin
   * matching `targetOrigin` registered in its redirect URIs.
   */
  clientId: string
  /** OAuth scopes (e.g. "project:write"). */
  scope: string
  /**
   * The origin the popup will postMessage the result to. Defaults to
   * `window.location.origin`. The accounts service validates this against
   * the client's registered redirect-uri origins.
   */
  targetOrigin?: string
  /** Features string passed to window.open(). */
  windowFeatures?: string
}): Promise<PopupAuthResult> => {
  // Step 1: open the popup synchronously while we still have the user
  // gesture. We point it at about:blank and navigate it once we have built
  // the auth URL — generating the PKCE challenge requires SubtleCrypto
  // which is async.
  const popup = window.open("about:blank", POPUP_WINDOW_NAME, windowFeatures)
  if (popup == null) {
    return {
      status: "unauthenticated",
      error: new Error(
        "Popup was blocked. audiotoolPopup() must be called from a user-gesture handler.",
      ),
    }
  }

  try {
    return await runPopupFlow({ popup, clientId, scope, targetOrigin })
  } catch (err) {
    return {
      status: "unauthenticated",
      error: err instanceof Error ? err : new Error(String(err)),
    }
  }
}

const runPopupFlow = async ({
  popup,
  clientId,
  scope,
  targetOrigin,
}: {
  popup: Window
  clientId: string
  scope: string
  targetOrigin: string
}): Promise<PopupAuthResult> => {
  const codeVerifier = generateCodeVerifier()
  const codeChallenge = await generateCodeChallenge(codeVerifier)
  const state = crypto.getRandomValues(new Uint8Array(16)).join("")

  const startURL = new URL(ACCOUNTS_POPUP_START)
  startURL.search = new URLSearchParams({
    client_id: clientId,
    scope,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
    target_origin: targetOrigin,
  }).toString()

  // Navigate the (already-opened) popup. If popup-blocker latency caused
  // popup to be cross-origin only after this point, .location.href set
  // can throw — caller's try/catch turns it into an unauthenticated result.
  popup.location.href = startURL.toString()

  // Step 2: race the postMessage delivery against (a) the user closing the
  // popup and (b) a timeout. The result of the race is either a delivered
  // {code,state} pair, an error string, or "cancelled".
  const message = await waitForPopupMessage(popup, state)
  if (message.kind === "cancelled") {
    return {
      status: "unauthenticated",
      error: new Error("Popup was closed before login completed."),
    }
  }
  if (message.kind === "error") {
    return {
      status: "unauthenticated",
      error: toError(message.error, message.errorDescription),
    }
  }

  // Step 3: exchange the code for tokens via PKCE. The popup itself does
  // not see the tokens — only this window does, because only this window
  // knows the code_verifier.
  const tokenResp = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: "authorization_code",
      code: message.code,
      // For popup-mode the redirect_uri is the accounts popup-callback
      // endpoint; Hydra expects it to match exactly what was sent to the
      // /oauth2/auth call.
      redirect_uri: `${ACCOUNTS_ORIGIN}/oauth/popup/callback`,
      code_verifier: codeVerifier,
      token_endpoint_auth_method: "none",
    }),
  })

  const {
    access_token,
    refresh_token,
    expires_in,
    error: tokenError,
    error_description: tokenErrorDescription,
  } = await tokenResp.json()

  if (tokenError) {
    return {
      status: "unauthenticated",
      error: toError(tokenError, tokenErrorDescription),
    }
  }

  // Step 4: persist tokens under the same localStorage key shape as
  // audiotool() so a refresh-token rotation by either entrypoint is shared.
  const localStorageKeys: LocalStorageKeys = {
    accessToken: `oidc_${clientId}_oidc_access_token`,
    refreshToken: `oidc_${clientId}_oidc_refresh_token`,
    expiresAt: `oidc_${clientId}_oidc_expires_at`,
    codeVerifier: `oidc_${clientId}_oidc_code_verifier`,
    userName: `oidc_${clientId}_oidc_user_name`,
    state: `oidc_${clientId}_oidc_state`,
  }
  localStorage.setItem(localStorageKeys.accessToken, access_token)
  localStorage.setItem(localStorageKeys.refreshToken, refresh_token)
  localStorage.setItem(
    localStorageKeys.expiresAt,
    (Date.now() + expires_in * 1000).toString(),
  )

  // Step 5: build the same shape audiotool() returns. The token-refresh
  // function below is a copy of the one in audiotool(); centralising it is
  // a follow-up — for now keeping the two paths visually parallel.
  let refreshPromise: Promise<string | Error> | undefined = undefined
  const getToken = async (): Promise<string> => {
    if (refreshPromise === undefined) {
      refreshPromise = (async () => {
        const result = await getOrFetchValidToken(localStorageKeys, clientId)
        if (result === undefined) {
          return new Error("User not logged in.")
        }
        return result
      })()
      const result = await refreshPromise
      refreshPromise = undefined
      if (result instanceof Error) throw result
      return result.startsWith("Bearer ") ? result : `Bearer ${result}`
    }
    const result = await refreshPromise
    if (result instanceof Error) throw result
    return result.startsWith("Bearer ") ? result : `Bearer ${result}`
  }

  const userName = await fetchUserName(getToken)
  if (userName instanceof Error) {
    return { status: "unauthenticated", error: userName }
  }

  const transportFactory = createBrowserTransportFactory()
  const client = await createAudiotoolClientInternal({
    getToken,
    transportFactory,
  })

  const logout = () => {
    cleanUpLocalStorage(localStorageKeys)
    window.location.reload()
  }

  const exportTokens = (): TokenData => {
    const accessToken = localStorage.getItem(localStorageKeys.accessToken)
    const refreshToken = localStorage.getItem(localStorageKeys.refreshToken)
    const expiresAtStr = localStorage.getItem(localStorageKeys.expiresAt)
    if (!accessToken || !refreshToken || !expiresAtStr) {
      throw new Error("Cannot export tokens: not authenticated")
    }
    return {
      accessToken,
      refreshToken,
      expiresAt: parseInt(expiresAtStr, 10),
    }
  }

  return {
    ...client,
    status: "authenticated",
    userName,
    logout,
    exportTokens,
  }
}

/**
 * Internal: wait for the popup to either deliver a postMessage with our
 * expected `state`, or for the user to close it.
 *
 * - Origin-filters incoming messages against ACCOUNTS_ORIGIN. Anything from
 *   another origin is ignored (this is the standard postMessage hardening).
 * - Validates `event.data.type === "audiotool-oauth"` and that the returned
 *   `state` matches the one we passed to /oauth/popup/start (CSRF guard).
 * - Polls popup.closed every 500ms so we surface user-cancellation even if
 *   no message ever arrives.
 */
type PopupMessage =
  | { kind: "ok"; code: string; state: string }
  | { kind: "error"; error: string; errorDescription?: string }
  | { kind: "cancelled" }

const waitForPopupMessage = (
  popup: Window,
  expectedState: string,
): Promise<PopupMessage> => {
  return new Promise((resolve) => {
    const cleanup = () => {
      window.removeEventListener("message", onMessage)
      window.clearInterval(closedInterval)
    }

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== ACCOUNTS_ORIGIN) return
      const data = event.data
      if (data == null || typeof data !== "object") return
      if (data.type !== "audiotool-oauth") return

      cleanup()

      if (typeof data.error === "string" && data.error.length > 0) {
        resolve({
          kind: "error",
          error: data.error,
          errorDescription:
            typeof data.error_description === "string"
              ? data.error_description
              : undefined,
        })
        return
      }

      if (typeof data.code !== "string" || typeof data.state !== "string") {
        resolve({
          kind: "error",
          error: "invalid_response",
          errorDescription: "Popup returned an unexpected message shape.",
        })
        return
      }

      if (data.state !== expectedState) {
        resolve({
          kind: "error",
          error: "invalid_state",
          errorDescription:
            "State mismatch — possible CSRF or mismatched popup session.",
        })
        return
      }

      resolve({ kind: "ok", code: data.code, state: data.state })
    }

    const closedInterval = window.setInterval(() => {
      if (popup.closed) {
        cleanup()
        resolve({ kind: "cancelled" })
      }
    }, 500)

    window.addEventListener("message", onMessage)
  })
}
