import { Code, ConnectError, createRouterTransport } from "@connectrpc/connect"
import { DocumentService } from "@gen/document/v1/document_service_connect"
import type { ApplyTransactionsRequest } from "@gen/document/v1/document_service_pb"
import { GetClientStatsResponse } from "@gen/document/v1/document_service_pb"

import type { PartialMessage } from "@bufbuild/protobuf"
import { ValueNotifier } from "@utils/observable-notifier-value"
import { describe, expect, expectTypeOf, it, vi } from "vitest"
import type { KeepaliveTransport } from "./keepalive-transport"
import {
  createRetryingPromiseClient,
  type RetryingClient,
} from "./retrying-client"

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
      clientInfo: [{ id: "hello" }],
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
      clientInfo: [{ id: "hello" }],
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
        backoffMs: 10,
      },
    )
    expect(await client.getClientStats({})).toMatchObject(response)
  })

  it("should retry on network unknown errors", async () => {
    const response = new GetClientStatsResponse({
      clientInfo: [{ id: "hello" }],
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
        backoffMs: 10,
      },
    )
    expect(await client.getClientStats({})).toMatchObject(response)
  })

  it("should return an error on unknown errors", async () => {
    const response = new GetClientStatsResponse({
      clientInfo: [{ id: "hello" }],
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
        backoffMs: 10,
      },
    )
    expect(await client.getClientStats({})).toBeInstanceOf(Error)
  })

  it("on error, should wrap the original error as error cause", async () => {
    const response = new GetClientStatsResponse({
      clientInfo: [{ id: "hello" }],
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
        backoffMs: 10,
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
