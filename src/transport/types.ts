import type { CallOptions } from "@connectrpc/connect"
import type { Transport } from "@connectrpc/connect"
import type { Brand } from "utility-types"

/**
 * Opaque transport factory type.
 *
 * Browser users never need to interact with this directly - it's handled
 * automatically. Node.js users import `createNodeTransport()` from
 * `@audiotool/nexus/node`.
 */
export type TransportFactory = {
  createTransport: (opts: TransportOptions) => Promise<KeepaliveTransport>
}

export type TransportOptions = {
  baseUrl: string
  useBinaryFormat: boolean
  typeRegistry?: import("@bufbuild/protobuf").IMessageTypeRegistry
  getToken: () => Promise<string>
}

export const KEEPALIVE_HEADER = "###keepalive###"

/**
 * A transport that can send gRPC requests that are "kept alive" after
 * page unloads by passing in a special header to the gRPC method.
 */
export type KeepaliveTransport = Brand<Transport, "keepalive">

/**
 * Retry options for gRPC calls.
 */
export type KeepaliveRetryOptions = CallOptions & {
  keepalive?: boolean
}

/**
 * Takes the `keepalive` parameter out of `options`, packs it into the
 * keepalive header.
 */
export const packKeepaliveOptions = <T extends KeepaliveRetryOptions>(
  options?: T,
): T | undefined => {
  if (options === undefined) {
    return undefined
  }
  const keepalive = options?.keepalive ?? false
  const headers = new Headers(options?.headers)
  headers.set(KEEPALIVE_HEADER, keepalive ? "true" : "false")
  const result = {
    ...options,
    headers,
  }
  delete result.keepalive
  return result
}
