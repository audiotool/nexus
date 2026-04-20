/**
 * Platform-agnostic auth provider interface.
 * Provides tokens for authenticating API requests.
 */
export interface AuthProvider {
  getToken(): Promise<string>
}

/**
 * Token data that can be exported from browser auth and imported into server auth.
 */
export interface TokenData {
  accessToken: string
  refreshToken: string
  expiresAt: number
}
