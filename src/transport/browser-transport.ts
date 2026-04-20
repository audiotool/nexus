import type {
  KeepaliveTransport,
  TransportFactory,
  TransportOptions,
} from "./types"
import { KEEPALIVE_HEADER } from "./types"

/**
 * Unpack the keepalive header from request headers.
 */
const unpackHeader = (
  headers?: HeadersInit,
): {
  headers: Headers
  keepalive: boolean
} => {
  const newHeaders = new Headers(headers)
  const keepalive = newHeaders.get(KEEPALIVE_HEADER) === "true"
  newHeaders.delete(KEEPALIVE_HEADER)
  return { headers: newHeaders, keepalive }
}

/**
 * Create a browser-compatible transport factory.
 *
 * This is used internally by `audiotool()` and should not be exported
 * from the main package entry point.
 */
export const createBrowserTransportFactory = (): TransportFactory => ({
  createTransport: async (opts: TransportOptions): Promise<KeepaliveTransport> => {
    const { createConnectTransport } = await import("@connectrpc/connect-web")

    return createConnectTransport({
      baseUrl: opts.baseUrl,
      useBinaryFormat: opts.useBinaryFormat,
      fetch: async (input, init) => {
        const { headers, keepalive } = unpackHeader(init?.headers)
        headers.set("Authorization", await opts.getToken())

        return fetch(input, {
          credentials: "omit",
          ...init,
          headers,
          keepalive,
        })
      },
      jsonOptions: {
        typeRegistry: opts.typeRegistry,
      },
    }) as KeepaliveTransport
  },
})
