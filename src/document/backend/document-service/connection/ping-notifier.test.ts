import type { PartialMessage } from "@bufbuild/protobuf"
import type { DocumentService } from "@gen/document/v1/document_service_connect"
import {
  PingResponse,
  type PingRequest,
} from "@gen/document/v1/document_service_pb"
import type { RetryingClient } from "@utils/grpc/retrying-client"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { createPingNotifier } from "./ping-notifier"

/** create a document service with a mock ping function */
const createDocumentService = (
  pingFn: RetryingClient<typeof DocumentService>["ping"],
): Pick<RetryingClient<typeof DocumentService>, "ping"> => ({
  ping: vi.fn(pingFn),
})

describe("ping-notifier", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  it("should ping the backend", async () => {
    const documentService = createDocumentService(
      async () => new PingResponse({}),
    )
    createPingNotifier(documentService, "test")
    vi.advanceTimersByTime(1000)
    expect(documentService.ping).toHaveBeenCalled()
  })

  it("should crash if the ping call returns an unrecoverable error", async () => {
    // create document service that returns an unrecoverable error.
    // document service is of type RetryingClient which never throws, but returns errors.
    const error = new Error("unrecoverable")
    const documentService = createDocumentService(async () => error)

    // we expect the ping notifier to throw an unhandled rejection, so we need to catch it.
    const rejectionPromise = new Promise<unknown>((resolve) => {
      const handler = (reason: unknown) => {
        process.off("unhandledRejection", handler)
        resolve(reason)
      }
      process.on("unhandledRejection", handler)
    })

    // create notifier
    createPingNotifier(documentService, "test")

    // wait for some unhandled rejection to be thrown
    const uncaughtRejection = await rejectionPromise

    // make sure it's the right one
    expect(uncaughtRejection).toBe(error)
  })

  describe("pingCallResults", () => {
    it("should emit true on a successful ping call", async () => {
      // create document service that returns a successful ping response.
      // resolve a promise we can await to know when the ping call is complete.
      const pingCompleted = Promise.withResolvers<void>()
      const documentService = createDocumentService(async () => {
        pingCompleted.resolve()
        return new PingResponse({})
      })

      // create notifier
      const pingNotifier = createPingNotifier(documentService, "test")

      // create spy on pingCallResults
      const spy = vi.fn()
      pingNotifier.pingCallResults.subscribe(spy)

      // advance timers to trigger the ping call being made
      vi.advanceTimersByTime(1000)

      // wait for the ping call to complete
      await pingCompleted.promise

      expect(spy).toHaveBeenCalledWith(true)
    })

    it("should emit false on an unsuccessful ping call", async () => {
      // create document service that returns an unsuccessful ping response.
      // resolve a promise we can await to know when the ping call is complete.
      const pingCompleted = Promise.withResolvers<void>()
      const documentService = createDocumentService(
        async (_: PartialMessage<PingRequest>, opts) => {
          // wait a task scheduling interval before emitting false
          // so the we can attach an event listener first. This is slightly awkward
          // js task scheduling shenanigans but it works.
          //
          // In practice, if the network is down,
          // multiple ping calls will fail, in which case the emission of false will still be
          // caught even if the first emission is missed. If the network is up after one
          // try, then we have a problem, but this unlikely and good enough for now.
          await Promise.resolve()
          // onRetry by contract of RetryingClient is called when a network call fails.
          opts?.onRetry?.(new Error("test"))
          pingCompleted.resolve()
          return new PingResponse({})
        },
      )

      // create notifier.
      const pingNotifier = createPingNotifier(documentService, "test")

      // create spy on pingCallResults
      const spy = vi.fn()
      pingNotifier.pingCallResults.subscribe(spy)

      // advance time
      vi.advanceTimersByTime(1000)

      // wait for the ping call to complete
      await pingCompleted.promise
      expect(spy).toHaveBeenCalledWith(false)
    })
  })
})
