import type {
  KeepaliveTransport,
  TransportFactory,
  TransportOptions,
} from "./types"
import { KEEPALIVE_HEADER } from "./types"

/**
 * Create a transport for Node.js.
 *
 * Pass this to `createAudiotoolClient` when running in Node.js. This transport
 * uses HTTP/2 and properly manages TCP connection pools, ensuring your process
 * exits cleanly when done rather than hanging for minutes waiting for idle
 * connections to timeout.
 *
 * @example
 * ```typescript
 * import { createAudiotoolClient, createServerAuth } from "@audiotool/nexus"
 * import { createNodeTransport, createDiskWasmLoader } from "@audiotool/nexus/node"
 *
 * const client = await createAudiotoolClient({
 *   auth: createServerAuth({ accessToken, refreshToken, expiresAt, clientId }),
 *   transport: createNodeTransport(),
 *   wasm: createDiskWasmLoader(),
 * })
 *
 * const projects = await client.projects.listProjects({})
 * ```
 */
export const createNodeTransport = (): TransportFactory => ({
  createTransport: async (opts: TransportOptions): Promise<KeepaliveTransport> => {
    const { createConnectTransport } = await import("@connectrpc/connect-node")

    return createConnectTransport({
      baseUrl: opts.baseUrl,
      httpVersion: "2",
      jsonOptions: {
        typeRegistry: opts.typeRegistry,
      },
      useBinaryFormat: opts.useBinaryFormat,
      interceptors: [
        (next) => async (req) => {
          // delete keepalive header, that concept doesn't exist in node
          req.header.delete(KEEPALIVE_HEADER)
          // set auth header
          req.header.set("Authorization", await opts.getToken())
          return next(req)
        },
      ],
    }) as KeepaliveTransport
  },
})
