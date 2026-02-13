import type { createAudiotoolClient } from "./audiotool-client"
import { neverThrowingFetch } from "./utils/fetch/never-throwing-fetch"

export type LoggedInStatus = {
  /** The app is authorized to make actions on a user's behalf. */
  loggedIn: true

  /** Simple utility to get the current user name. The result of this function is cached. */
  getUserName(): Promise<string | Error>

  /** Log the current user out and reload the page. */
  logout: () => void

  /** Get the current authentication token. Might refresh the token if need be, but most often
   * just returns the token.
   */
  getToken: () => Promise<string | Error>
}

export type LoggedOutStatus = {
  /** The app is not authorized to make actions on a user's behalf. Call login to authorize.*/
  loggedIn: false

  /** If an error is the reason the user is logged out, this is set. Otherwise, the user just hasn't logged in yet. */
  error?: Error

  /** start the authorization flow by redirecting the user to the login page of audiotool. */
  login: () => Promise<void>
}

/**
 * The current authentication status of the user in this tab. Either logged in or logged out.
 * To change the authentication status, call login or logout on this object.
 */
export type LoginStatus = LoggedInStatus | LoggedOutStatus

type LocalStorageKeys = {
  accessToken: string
  refreshToken: string
  expiresAt: string
  codeVerifier: string
  userName: string
  state: string
}

const AUTHORIZATION_ENDPOINT = "https://oauth.audiotool.com/oauth2/auth"
const TOKEN_ENDPOINT = "https://oauth.audiotool.com/oauth2/token"
const API_ENDPOINT = "https://rpc.audiotool.com"

/**
 * This function allows to let arbitrary users use your app by letting them login/logout using the audiotool accounts system.
 *
 * Calling it will first return the current authentication status of the user in this tab.
 *
 * If the status is logged in, you can continue initializing the rest of your app by passing it to the {@link createAudiotoolClient} function.
 * If the status is logged out, you can show a button to let the user login.
 *
 * This function should be called only once and early in the app. The status returned should be considered definite;
 * the only way to change that is to call login/logout, which will refresh the page, and change the return value of this function.
 *
 * ## Example
 * Register your application on https://developer.audiotool.com/applications, then call it like this:
 *
 * ```ts
 * const status = await getLoginStatus({
 *   clientId: "<client-id of your app>",
 *   redirectUrl: "<your apps URL>",
 *   scope: "<scopes your app needs>",
 * });
 *
 * if (status.loggedIn) {
 *   console.debug("Logged in!!");
 *   createButton("Logout", () => status.logout())
 * } else {
 *   console.debug("Not logged in.");
 *   createButton("Login", () => status.login())
 * }
 * ```
 *
 * See more detailed instructions at [Login](./docs/login.md).
 */
export const getLoginStatus = async ({
  clientId,
  redirectUrl,
  scope,
}: {
  /**
   * Client id assigned to your application on https://developer.audiotool.com/applications.
   **/
  clientId: string
  /**
   * Redirect URL after the user presses "Allow" on the consent screen. Must be the same URL this app is deployed at, and must be registered
   * as a redirect URL for your application on https://developer.audiotool.com/applications.
   */
  redirectUrl: string
  /**
   * The scope your app requires. Must be a subset of the scopes assigned to your application on https://developer.audiotool.com/applications.
   * Scopes define which part of a user's account your app is allowed to access. If you change this value while already logged in, you will
   * need to log out and log in again to get the new scope.
   */
  scope: string
}): Promise<LoginStatus> => {
  const localStorageKeys: LocalStorageKeys = {
    accessToken: `oidc_${clientId}_oidc_access_token`,
    refreshToken: `oidc_${clientId}_oidc_refresh_token`,
    expiresAt: `oidc_${clientId}_oidc_expires_at`,
    codeVerifier: `oidc_${clientId}_oidc_code_verifier`,
    userName: `oidc_${clientId}_oidc_user_name`,
    state: `oidc_${clientId}_oidc_state`,
  }

  const login = () =>
    redirectUserToLogin(localStorageKeys, clientId, scope, redirectUrl)

  // if this is called, the first thing we have to do is inspect the query
  // params. They will be set if the user is coming back from the login page of audiotool.
  const urlParams = new URLSearchParams(window.location.search)

  // First, check if we got an error back. If so, return the error.
  const error = urlParams.get("error")
  const errorDescription = urlParams.get("error_description")

  if (error != null) {
    cleanupUrl()
    cleanUpLocalStorage(localStorageKeys)
    return {
      loggedIn: false,
      error: toError(error, errorDescription),
      login,
    }
  }

  // If code is set, the user is coming back from the login page of audiotool, and it
  // was successfully completed - so we have to exchange the code for a token.
  const code = urlParams.get("code")

  if (code != null) {
    // check validity: the state must match the previously stored state,
    // otherwise this might be a CSRF attack.
    const state = urlParams.get("state")
    const storedState = localStorage.getItem(localStorageKeys.state)
    if (state == null || storedState == null || state !== storedState) {
      return {
        loggedIn: false,
        error: toError(
          "Invalid state URL parameter.",
          "Clean the URL of stale query parameters and try again.",
        ),
        login,
      }
    }

    const codeVerifier = localStorage.getItem(localStorageKeys.codeVerifier)
    if (codeVerifier == null) {
      return {
        loggedIn: false,
        error: toError("Code verifier not found. Restart the auth flow."),
        login,
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
      error,
      error_description,
    } = await response.json()

    // check if things worked out, or if we got an error
    if (error) {
      return {
        loggedIn: false,
        error: toError(error, error_description),
        login,
      }
    }

    localStorage.setItem(localStorageKeys.accessToken, access_token)
    localStorage.setItem(localStorageKeys.refreshToken, refresh_token)
    localStorage.setItem(
      localStorageKeys.expiresAt,
      (Date.now() + expires_in * 1000).toString(),
    )

    // clean up URL and local storage
    cleanupUrl()
    localStorage.removeItem(localStorageKeys.codeVerifier)
  }

  // Clean up state after validation
  localStorage.removeItem(localStorageKeys.state)

  const token = await getOrFetchValidToken(localStorageKeys, clientId)

  let refreshPromise: Promise<string | Error> | undefined = undefined
  if (typeof token === "string") {
    const getToken = async () => {
      if (refreshPromise == undefined) {
        refreshPromise = (async () =>
          (await getOrFetchValidToken(localStorageKeys, clientId)) ??
          new Error("User not logged in."))()
        const result = await refreshPromise
        refreshPromise = undefined
        return result
      }
      return await refreshPromise
    }

    let userInfoCache: undefined | Promise<string | Error> = undefined
    return {
      loggedIn: true,
      getToken,
      getUserName: async () => {
        // return cached values if available
        if (userInfoCache !== undefined) {
          return await userInfoCache
        }
        const { promise, resolve } = Promise.withResolvers<string | Error>()
        userInfoCache = promise

        const accessToken = await getToken()
        if (accessToken instanceof Error) {
          resolve(accessToken)
          return await userInfoCache
        }
        const response = await neverThrowingFetch(
          `${API_ENDPOINT}/audiotool.auth.v1.AuthService/GetWhoami`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
          },
        )

        if (response instanceof Error) {
          resolve(response)
          return await userInfoCache
        }

        if (!response.ok) {
          resolve(new Error(`Failed to get user info: ${response.statusText}`))
          return await userInfoCache
        }

        const { whoami } = await response.json()
        console.debug("whoami", whoami)
        resolve(whoami?.userName ?? "Unknown User")

        return await userInfoCache
      },
      logout() {
        cleanUpLocalStorage(localStorageKeys)
        cleanupUrl()
        window.location.reload()
      },
    }
  }
  return {
    loggedIn: false,
    error: token,
    login,
  }
}

const cleanUpLocalStorage = (localStorageKeys: LocalStorageKeys) => {
  localStorage.removeItem(localStorageKeys.accessToken)
  localStorage.removeItem(localStorageKeys.refreshToken)
  localStorage.removeItem(localStorageKeys.expiresAt)
  localStorage.removeItem(localStorageKeys.codeVerifier)
  localStorage.removeItem(localStorageKeys.userName)
  localStorage.removeItem(localStorageKeys.state)
}

/** cleans up the URL by removing the code, state, error, and error_description query parameters. */
const cleanupUrl = () => {
  const url = new URL(window.location.href)
  url.searchParams.delete("code")
  url.searchParams.delete("scope")
  url.searchParams.delete("state")
  url.searchParams.delete("error")
  url.searchParams.delete("error_description")
  // replace query params - discarding "?" if no query params remain.
  window.history.replaceState(
    {},
    document.title,
    url.search ? url.href : url.href.replace("?", ""),
  )
}

/** starts the login flow by redirecting the user to the login page of audiotool. */
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

/**
 * Generate a cryptographically secure random string for PKCE code verifier.
 * @returns A random 64-character string suitable for use as a PKCE code verifier.
 */
const generateCodeVerifier = (): string => {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  const randomValues = crypto.getRandomValues(new Uint8Array(64))
  return randomValues.reduce(
    (acc, x) => acc + possible[x % possible.length],
    "",
  )
}

/**
 * Generate PKCE code challenge from verifier.
 * @returns A base64url-encoded SHA-256 hash of the verifier, suitable for use as a PKCE code challenge.
 */
const generateCodeChallenge = async (verifier: string): Promise<string> => {
  const data = new TextEncoder().encode(verifier)
  const hashed = await crypto.subtle.digest("SHA-256", data)
  return btoa(String.fromCharCode(...new Uint8Array(hashed)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
}

/** Retrieves the current access token, refreshing it if necessary. */
const getOrFetchValidToken = async (
  localStorageKeys: LocalStorageKeys,
  clientId: string,
): Promise<undefined | string | Error> => {
  const currentToken = localStorage.getItem(localStorageKeys.accessToken)
  if (currentToken == null) {
    return undefined
  }

  // will be true if expiresAt time can't be found, or expiry is at most 60 seconds
  // into the future
  let isExpired: boolean = true
  {
    const expiresAtStr = localStorage.getItem(localStorageKeys.expiresAt)
    isExpired =
      expiresAtStr == null
        ? true
        : Date.now() >= parseInt(expiresAtStr) - 60_000 // 60 seconds before expiry
  }

  // not expired - can just return
  if (!isExpired) {
    return currentToken
  }

  // else we have to refresh it using the refresh token
  const refreshToken = localStorage.getItem(localStorageKeys.refreshToken)

  // no refresh token - go home, we're not logged in
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
