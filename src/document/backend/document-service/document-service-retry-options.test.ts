import { Code, ConnectError, createRouterTransport } from "@connectrpc/connect"
import { DocumentService } from "@gen/document/v1/document_service_connect"
import { PingResponse } from "@gen/document/v1/document_service_pb"
import { createRetryingPromiseClient } from "@utils/grpc/retrying-client"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import type { KeepaliveTransport } from "../../../transport/types"
import { DOCUMENT_SERVICE_RETRY_OPTIONS } from "./document-service-retry-options"

const createClientFailingWith = (codes: Code[]) => {
  const ping = vi.fn(() => {
    const code = codes.shift()
    if (code !== undefined) {
      throw new ConnectError("failed", code)
    }
    return new PingResponse({})
  })
  const transport = createRouterTransport(({ service }) => {
    service(DocumentService, { ping })
  }) as KeepaliveTransport
  const client = createRetryingPromiseClient(DocumentService, transport, {
    ...DOCUMENT_SERVICE_RETRY_OPTIONS,
    logIfRetrying: false,
  })
  return { client, ping }
}

describe("DOCUMENT_SERVICE_RETRY_OPTIONS", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it.each([Code.DeadlineExceeded, Code.Unavailable, Code.Unknown])(
    "retries calls that fail with code %s",
    async (code) => {
      const { client, ping } = createClientFailingWith([code])

      const response = client.ping({})
      await vi.advanceTimersByTimeAsync(1_100)

      expect(await response).toBeInstanceOf(PingResponse)
      expect(ping).toHaveBeenCalledTimes(2)
    },
  )

  it("returns other errors without retrying", async () => {
    const { client, ping } = createClientFailingWith([Code.PermissionDenied])

    expect(await client.ping({})).toBeInstanceOf(Error)
    expect(ping).toHaveBeenCalledTimes(1)
  })

  it("backs off for at most 2 seconds", async () => {
    const { client, ping } = createClientFailingWith(
      Array<Code>(5).fill(Code.Unavailable),
    )

    const response = client.ping({})
    // 1 s, then 2 s for every following retry, plus up to 10% jitter
    await vi.advanceTimersByTimeAsync(1_100 + 4 * 2_000)

    expect(await response).toBeInstanceOf(PingResponse)
    expect(ping).toHaveBeenCalledTimes(6)
  })
})
