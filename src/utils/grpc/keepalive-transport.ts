import type { IMessageTypeRegistry } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"

import { runningInNodeJs } from "@utils/platform"
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
export const createAuthorizedKeepaliveTransport = async ({
  baseUrl,
  useBinaryFormat,
  typeRegistry,
  getToken,
}: {
  baseUrl: string
  useBinaryFormat: boolean
  typeRegistry?: IMessageTypeRegistry
  getToken: () => Promise<string>
}): Promise<KeepaliveTransport> => {
  // Node is a special case. It appears to work fine with `connect-web`, except the termination
  // behavior, where aborting a fetch request doesn't close the underlying undici TCP
  // connection pool — those sockets stay alive for minutes waiting to be reused.
  // This is handled in connect-node, making sure the pool isn't kept alive after termination.
  if (runningInNodeJs) {
    // create note transport, differences:
    // * no cors, no credentials: omit requirement
    // * no keepalive - there's no page unload

    return (await import("@connectrpc/connect-node")).createConnectTransport({
      baseUrl,
      httpVersion: "2",
      jsonOptions: {
        typeRegistry,
      },
      useBinaryFormat,
      interceptors: [
        (next) => async (req) => {
          // delete keepalive header, that concept doesn't exist in node
          req.header.delete(KEEPALIVE_HEADER)
          // set auth header
          req.header.set("Authorization", await getToken())
          // pass the request to the next interceptor
          return next(req)
        },
      ],
    }) as KeepaliveTransport
  }
  return (await import("@connectrpc/connect-web")).createConnectTransport({
    baseUrl,
    useBinaryFormat,
    fetch: async (input, init) => {
      // remove keepalive header, extract whether it was set
      const { headers, keepalive } = unpackHeader(init?.headers)
      headers.set("Authorization", await getToken())

      return fetch(input, {
        credentials: "omit", // omit credentials to avoid CORS errors
        ...init,
        headers,
        keepalive, // pass on keepalive option to fetch
      })
    },
    jsonOptions: {
      typeRegistry,
    },
  }) as KeepaliveTransport
}

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
