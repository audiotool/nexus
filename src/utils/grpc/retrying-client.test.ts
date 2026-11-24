import { Code, ConnectError, createRouterTransport } from "@connectrpc/connect"
import { DocumentService } from "@gen/document/v1/document_service_connect"
import type { ApplyTransactionsRequest } from "@gen/document/v1/document_service_pb"
import { GetClientStatsResponse } from "@gen/document/v1/document_service_pb"

import type { PartialMessage } from "@bufbuild/protobuf"
import { ValueNotifier } from "@utils/observable-notifier-value"
import { describe, expect, expectTypeOf, it, vi } from "vitest"
import type { KeepaliveTransport } from "../../transport/types"
import {
  calculateExponentialBackoff,
  createRetryingPromiseClient,
  type RetryingClient,
} from "./retrying-client"

describe("calculateExponentialBackoff", () => {
  it("should return initial backoff on attempt 0", () => {
    const result = calculateExponentialBackoff(0, 1000, 300000)
    expect(result).toBeGreaterThanOrEqual(1000)
    expect(result).toBeLessThanOrEqual(1100)
  })

  it("should double the backoff on each attempt", () => {
    const attempt1 = calculateExponentialBackoff(1, 1000, 300000)
    const attempt2 = calculateExponentialBackoff(2, 1000, 300000)
    const attempt3 = calculateExponentialBackoff(3, 1000, 300000)

    expect(attempt1).toBeGreaterThanOrEqual(2000)
    expect(attempt1).toBeLessThanOrEqual(2200)
    expect(attempt2).toBeGreaterThanOrEqual(4000)
    expect(attempt2).toBeLessThanOrEqual(4400)
    expect(attempt3).toBeGreaterThanOrEqual(8000)
    expect(attempt3).toBeLessThanOrEqual(8800)
  })

  it("should cap at maximum backoff", () => {
    const randomSpy = vi.spyOn(Math, "random").mockReturnValue(1)
    const result = calculateExponentialBackoff(100, 1000, 5000)
    expect(result).toBe(5000)
    randomSpy.mockRestore()
  })

  it("should cap at 30 seconds by default", () => {
    const randomSpy = vi.spyOn(Math, "random").mockReturnValue(1)
    const thirtySeconds = 30 * 1000
    const result = calculateExponentialBackoff(20, 1000)
    expect(result).toBe(thirtySeconds)
    randomSpy.mockRestore()
  })

  it("should still apply jitter when below maximum", () => {
    const randomSpy = vi.spyOn(Math, "random").mockReturnValue(1)
    const result = calculateExponentialBackoff(1, 1000, 300000)
    expect(result).toBe(2200)
    randomSpy.mockRestore()
  })
})

describe("RetryingPromiseClient", () => {
  describe("type tests", () => {
    it("should let me pass callOk to unary grpc calls", () => {
      const c = {} as unknown as RetryingClient<typeof DocumentService>
      expectTypeOf(c.applyTransactions)
        .parameter(0)
        .toMatchObjectType<PartialMessage<ApplyTransactionsRequest>>()
      expectTypeOf(c.applyTransactions).parameter(1).toExtend<
        | undefined
        | {
            callIsOk?: ValueNotifier<boolean>
            keepalive?: boolean
            logIfRetrying?: boolean
          }
      >()
    })

    it("should not let me pass callOk to streaming grpc calls", () => {
      const c = {} as unknown as RetryingClient<typeof DocumentService>
      expectTypeOf(c.attach)
        .parameter(1)
        .not.toExtend<undefined | { keepalive?: boolean }>()
    })
  })

  it("should forward successful network calls", async () => {
    const response = new GetClientStatsResponse({
      clientInfo: [{ name: "hello" }],
    })
    const transport = createRouterTransport(({ service }) => {
      service(DocumentService, {
        getClientStats: () => response,
      })
    })

    const client = createRetryingPromiseClient(
      DocumentService,
      transport as KeepaliveTransport,
    )
    expect(await client.getClientStats({})).toMatchObject(response)
  })

  it("should retry on network unavailable errors", async () => {
    const response = new GetClientStatsResponse({
      clientInfo: [{ name: "hello" }],
    })
    let threwError = false
    const transport = createRouterTransport(({ service }) => {
      service(DocumentService, {
        getClientStats: () => {
          if (!threwError) {
            threwError = true
            throw new ConnectError("test", Code.Unavailable)
          }
          return response
        },
      })
    })

    const client = createRetryingPromiseClient(
      DocumentService,
      transport as KeepaliveTransport,
      {
        logIfRetrying: false,
        initialBackoffMs: 10,
      },
    )
    expect(await client.getClientStats({})).toMatchObject(response)
  })

  it("should retry on network unknown errors", async () => {
    const response = new GetClientStatsResponse({
      clientInfo: [{ name: "hello" }],
    })
    let threwError = false
    const transport = createRouterTransport(({ service }) => {
      service(DocumentService, {
        getClientStats: () => {
          if (!threwError) {
            threwError = true
            throw new ConnectError("test", Code.Unknown)
          }
          return response
        },
      })
    })

    const client = createRetryingPromiseClient(
      DocumentService,
      transport as KeepaliveTransport,
      {
        logIfRetrying: false,
        initialBackoffMs: 10,
      },
    )
    expect(await client.getClientStats({})).toMatchObject(response)
  })

  it("should return an error on unknown errors", async () => {
    const response = new GetClientStatsResponse({
      clientInfo: [{ name: "hello" }],
    })
    let threwError = false
    const transport = createRouterTransport(({ service }) => {
      service(DocumentService, {
        getClientStats: () => {
          if (!threwError) {
            threwError = true
            throw new ConnectError("test", Code.DataLoss)
          }
          return response
        },
      })
    })

    const client = createRetryingPromiseClient(
      DocumentService,
      transport as KeepaliveTransport,
      {
        logIfRetrying: false,
        initialBackoffMs: 10,
      },
    )
    expect(await client.getClientStats({})).toBeInstanceOf(Error)
  })

  it("on error, should wrap the original error as error cause", async () => {
    const response = new GetClientStatsResponse({
      clientInfo: [{ name: "hello" }],
    })
    let threwError = false
    const transport = createRouterTransport(({ service }) => {
      service(DocumentService, {
        getClientStats: () => {
          if (!threwError) {
            threwError = true
            throw new ConnectError("test", Code.DataLoss)
          }
          return response
        },
      })
    })

    const client = createRetryingPromiseClient(
      DocumentService,
      transport as KeepaliveTransport,
      {
        logIfRetrying: false,
        initialBackoffMs: 10,
      },
    )
    expect(((await client.getClientStats({})) as Error).cause).toBeInstanceOf(
      ConnectError,
    )
  })

  it("should keep notifier true if network call succeeds", async () => {
    const transport = createRouterTransport(({ service }) => {
      service(DocumentService, {
        getClientStats: () => new GetClientStatsResponse(),
      })
    })

    const notifier = new ValueNotifier(true)
    const spy = vi.fn()
    notifier.subscribe((v) => spy(v), false)
    const client = createRetryingPromiseClient(
      DocumentService,
      transport as KeepaliveTransport,
      {
        logIfRetrying: false,
      },
    )
    await client.getClientStats({}, { callIsOk: notifier })
    expect(spy).not.toHaveBeenCalled()
  })

  it("should keep set notifier to true if false if network call succeeds", async () => {
    const transport = createRouterTransport(({ service }) => {
      service(DocumentService, {
        getClientStats: () => new GetClientStatsResponse(),
      })
    })

    const notifier = new ValueNotifier(false) // should be set to true
    const spy = vi.fn()
    notifier.subscribe((v) => spy(v), false)
    const client = createRetryingPromiseClient(
      DocumentService,
      transport as KeepaliveTransport,
      {
        logIfRetrying: false,
      },
    )
    await client.getClientStats({}, { callIsOk: notifier })
    expect(spy).toHaveBeenCalledWith(true)
  })

  it("should set notifier to false, then true, if network fails once, then succeeds", async () => {
    let threwError = false
    const transport = createRouterTransport(({ service }) => {
      service(DocumentService, {
        getClientStats: () => {
          if (!threwError) {
            threwError = true
            throw new ConnectError("test", Code.Unavailable)
          }
          return new GetClientStatsResponse()
        },
      })
    })

    const notifier = new ValueNotifier(true)
    const spy = vi.fn()
    notifier.subscribe((v) => spy(v), false)
    const client = createRetryingPromiseClient(
      DocumentService,
      transport as KeepaliveTransport,
      {
        logIfRetrying: false,
      },
    )
    await client.getClientStats({}, { callIsOk: notifier })
    expect(spy.mock.calls).toMatchObject([[false], [true]])
  })
})
