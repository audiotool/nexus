import type { IMessageTypeRegistry } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import { createConnectTransport } from "@connectrpc/connect-web"
import type { Brand } from "utility-types"
import type { RetryOptions } from "./retrying-client"

export const KEEPALIVE_HEADER = "###keepalive###"

/** A transport that can send gRPC requests that are "kept alive" after
 * page unloads by passing in a special header to the gRPC method, namely:
 *
 * ```ts
 * {
 *  ["###keepalive###"]: "true"
 * }
 * ```
 *
 * This header will not be passed to the `fetch` function as a header, instead
 * it will be extracted and used to determine the keepalive option for fetch.
 */
export type KeepaliveTransport = Brand<Transport, "keepalive">

export const createAuthorizedKeepaliveTransport = ({
  baseUrl,
  useBinaryFormat,
  typeRegistry,
  getToken,
}: {
  baseUrl: string
  useBinaryFormat: boolean
  typeRegistry?: IMessageTypeRegistry
  getToken: () => Promise<string>
}): KeepaliveTransport =>
  createConnectTransport({
    baseUrl,
    useBinaryFormat,
    fetch: async (input, init) => {
      const { headers, keepalive } = unpackHeader(init?.headers)
      headers.set("Authorization", await getToken())

      return fetch(input, {
        credentials: "omit",
        ...init,
        headers,
        keepalive,
      })
    },
    jsonOptions: {
      typeRegistry,
    },
  }) as KeepaliveTransport

/** Takes the `keepalive` parameter out of `options`, packs it into the
 * keepalive header.
 */
export const packRetryingOptions = (
  options?: RetryOptions,
): RetryOptions | undefined => {
  if (options === undefined) {
    return undefined
  }
  const keepalive = options?.keepalive ?? false
  const headers = new Headers(options?.headers)
  headers.set(KEEPALIVE_HEADER, keepalive ? "true" : "false")
  options = {
    ...options,
    headers,
  }
  delete options.keepalive
  return options
}

/** Doing the thing from above, but in reverse.  */
export const unpackHeader = (
  headers?: HeadersInit,
): {
  headers: Headers
  keepalive: boolean
} => {
  const newHeaders = new Headers(headers)
  const keepalive = newHeaders.get(KEEPALIVE_HEADER) === "true"
  // remove the keepalive header so it doesn't get sent to the server
  newHeaders.delete(KEEPALIVE_HEADER)
  return { headers: newHeaders, keepalive }
}
