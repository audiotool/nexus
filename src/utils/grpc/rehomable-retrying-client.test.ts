import { createRouterTransport } from "@connectrpc/connect"
import { DocumentService } from "@gen/document/v1/document_service_connect"
import { GetClientStatsResponse } from "@gen/document/v1/document_service_pb"
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type Mock,
} from "vitest"
import type { KeepaliveTransport } from "../../transport/types"
import {
  createRehomableRetryingClient,
  REHOME_ATTEMPTS_WITHOUT_BACKOFF,
  REHOME_BACKOFF_MS,
  type RehomableRetryingClient,
} from "./rehomable-retrying-client"

/**
 * These tests cover only the re-home wrapper's responsibilities:
 *   - forwarding to whichever client is current,
 *   - swapping that client when `rehome` succeeds,
 *   - state machine of the `rehoming` notifier and `inFlight` deduping,
 *   - cleanup after both successful and failed re-homes.
 *
 * Retry, backoff and error-wrapping behavior is owned by RetryingClient
 * and is covered in retrying-client.test.ts.
 *
 * Each base URL produces a router transport whose `getClientStats` handler stamps the
 * URL into the response. That tells us which backend the wrapper is pointed at.
 */
const createTransport = vi.fn((baseUrl: string): Promise<KeepaliveTransport> =>
  Promise.resolve(
    createRouterTransport(({ service }) => {
      service(DocumentService, {
        getClientStats: () =>
          new GetClientStatsResponse({
            clientInfo: [{ client: { clientId: baseUrl } }],
          }),
      })
    }) as KeepaliveTransport,
  ),
)

describe("createRehomableRetryingClient", () => {
  describe("forwarding", () => {
    it("dispatches method calls to the initial client", async () => {
      const rehomable = await createRehomableRetryingClient({
        createTransport,
        service: DocumentService,
        initialBaseUrl: "initial",
        getNextBaseUrl: () => Promise.resolve("never-used"),
      })

      const response = await rehomable.getClientStats({})

      expect(response).not.toBeInstanceOf(Error)
      if (response instanceof Error) return
      expect(response.clientInfo[0]?.client?.clientId).toBe("initial")
    })

    it("forwards every method on the service, including streaming methods", async () => {
      const rehomable = await createRehomableRetryingClient({
        createTransport,
        service: DocumentService,
        initialBaseUrl: "initial",
        getNextBaseUrl: () => Promise.resolve("next"),
      })

      // Server-streaming methods are forwarded unchanged. Ensures the
      // wrapper iterates all service methods rather than only unary ones.
      expect(typeof rehomable.attach).toBe("function")
      expect(typeof rehomable.attachMetadata).toBe("function")
      expect(typeof rehomable.getClientStats).toBe("function")
      expect(typeof rehomable.applyTransactions).toBe("function")
    })

    it("dispatches at call time, so retries issued after a re-home land on the new client", async () => {
      const rehomable = await createRehomableRetryingClient({
        createTransport,
        service: DocumentService,
        initialBaseUrl: "initial",
        getNextBaseUrl: () => Promise.resolve("next"),
      })

      // Sanity: initial dispatch goes to initial client.
      const before = await rehomable.getClientStats({})
      if (before instanceof Error) throw before
      expect(before.clientInfo[0]?.client?.clientId).toBe("initial")

      const rehomeResult = await rehomable.rehome()
      expect(rehomeResult).toBeUndefined()

      // After re-home, the SAME wrapper now dispatches to the new client.
      const after = await rehomable.getClientStats({})
      if (after instanceof Error) throw after
      expect(after.clientInfo[0]?.client?.clientId).toBe("next")
    })
  })

  describe("re-home state machine", () => {
    it("flips `rehoming` true while in flight and back to false on success", async () => {
      let release: (() => void) | undefined
      const getNextBaseUrl = vi.fn(async () => {
        await new Promise<void>((resolve) => {
          release = resolve
        })
        return "next"
      })

      const rehomable = await createRehomableRetryingClient({
        createTransport,
        service: DocumentService,
        initialBaseUrl: "initial",
        getNextBaseUrl,
      })

      const observed: boolean[] = []
      rehomable.rehoming.subscribe((v) => observed.push(v))

      const inFlight = rehomable.rehome()

      expect(rehomable.rehoming.getValue()).toBe(true)

      release?.()
      const result = await inFlight

      expect(result).toBeUndefined()
      expect(rehomable.rehoming.getValue()).toBe(false)
      expect(observed).toEqual([true, false])
    })

    it("dedupes concurrent re-home calls so getNextBaseUrl runs once", async () => {
      let release: (() => void) | undefined
      const getNextBaseUrl = vi.fn(async () => {
        await new Promise<void>((resolve) => {
          release = resolve
        })
        return "next"
      })

      const rehomable = await createRehomableRetryingClient({
        createTransport,
        service: DocumentService,
        initialBaseUrl: "initial",
        getNextBaseUrl,
      })

      const a = rehomable.rehome()
      const b = rehomable.rehome()
      const c = rehomable.rehome()

      release?.()
      const [ra, rb, rc] = await Promise.all([a, b, c])

      expect(getNextBaseUrl).toHaveBeenCalledTimes(1)
      expect(ra).toBeUndefined()
      expect(rb).toBeUndefined()
      expect(rc).toBeUndefined()
    })

    it("the first/triggering caller awaits the swap before resolving", async () => {
      // Regression test: an earlier version of `rehome` was an `async`
      // function that assigned `inFlight` but never returned/awaited it,
      // so the first caller saw a resolved `undefined` immediately - even
      // though `currentClient` had not yet been swapped. Any follow-up RPC
      // would still hit the OLD client.
      const rehomable = await createRehomableRetryingClient({
        createTransport,
        service: DocumentService,
        initialBaseUrl: "initial",
        getNextBaseUrl: () => Promise.resolve("next"),
      })

      await rehomable.rehome()

      // Issued synchronously after `await rehome()` resolves: must already
      // dispatch through the swapped-in client.
      const stats = await rehomable.getClientStats({})
      if (stats instanceof Error) throw stats
      expect(stats.clientInfo[0]?.client?.clientId).toBe("next")
    })

    it("keeps the current client if the new base URL is unchanged", async () => {
      // A re-home while the worker is still assigned (e.g. after being offline) must
      // not rebuild the transport.
      const rehomable = await createRehomableRetryingClient({
        createTransport,
        service: DocumentService,
        initialBaseUrl: "initial",
        getNextBaseUrl: () => Promise.resolve("initial"),
      })
      const transportsBefore = createTransport.mock.calls.length

      await rehomable.rehome()

      expect(createTransport.mock.calls.length).toBe(transportsBefore)
    })
  })

  describe("re-home failure", () => {
    it("returns the Error from getNextBaseUrl and does NOT swap the client", async () => {
      const failure = new Error("no fresh URL available")
      const rehomable = await createRehomableRetryingClient({
        createTransport,
        service: DocumentService,
        initialBaseUrl: "initial",
        getNextBaseUrl: () => Promise.resolve(failure),
      })

      const result = await rehomable.rehome()

      expect(result).toBe(failure)

      // Underlying client must still be the initial one.
      const stats = await rehomable.getClientStats({})
      if (stats instanceof Error) throw stats
      expect(stats.clientInfo[0]?.client?.clientId).toBe("initial")
    })

    it("resets state after a failed re-home so subsequent attempts can succeed", async () => {
      let nextResult: string | Error = new Error("first attempt fails")
      const getNextBaseUrl = vi.fn(() => Promise.resolve(nextResult))

      const rehomable = await createRehomableRetryingClient({
        createTransport,
        service: DocumentService,
        initialBaseUrl: "initial",
        getNextBaseUrl,
      })

      // First attempt fails.
      const firstResult = await rehomable.rehome()
      expect(firstResult).toBeInstanceOf(Error)
      // State must be reset, not stuck in "rehoming = true" forever.
      expect(rehomable.rehoming.getValue()).toBe(false)

      // Second attempt is allowed to run getNextBaseUrl again, and on
      // success, the underlying client is swapped.
      nextResult = "next"
      const secondResult = await rehomable.rehome()
      expect(secondResult).toBeUndefined()
      expect(getNextBaseUrl).toHaveBeenCalledTimes(2)

      const stats = await rehomable.getClientStats({})
      if (stats instanceof Error) throw stats
      expect(stats.clientInfo[0]?.client?.clientId).toBe("next")
    })

    it("flips `rehoming` back to false even when the re-home fails", async () => {
      let release: (() => void) | undefined
      const getNextBaseUrl = async (): Promise<string | Error> => {
        await new Promise<void>((resolve) => {
          release = resolve
        })
        return new Error("fail")
      }

      const rehomable = await createRehomableRetryingClient({
        createTransport,
        service: DocumentService,
        initialBaseUrl: "initial",
        getNextBaseUrl,
      })

      const inFlight = rehomable.rehome()
      expect(rehomable.rehoming.getValue()).toBe(true)

      release?.()
      await inFlight

      expect(rehomable.rehoming.getValue()).toBe(false)
    })
  })

  describe("transport failure", () => {
    it("returns an Error and keeps the current client if the new transport can't be created", async () => {
      const rehomable = await createRehomableRetryingClient({
        createTransport: (baseUrl) =>
          baseUrl === "next"
            ? Promise.reject(new Error("no token"))
            : createTransport(baseUrl),
        service: DocumentService,
        initialBaseUrl: "initial",
        getNextBaseUrl: () => Promise.resolve("next"),
      })

      const result = await rehomable.rehome()

      expect(result).toBeInstanceOf(Error)
      expect(rehomable.rehoming.getValue()).toBe(false)
      const stats = await rehomable.getClientStats({})
      if (stats instanceof Error) throw stats
      expect(stats.clientInfo[0]?.client?.clientId).toBe("initial")
    })
  })

  describe("backoff on consecutive re-homes", () => {
    let getNextBaseUrl: Mock<() => Promise<string>>
    let rehomable: RehomableRetryingClient<typeof DocumentService>

    beforeEach(async () => {
      vi.useFakeTimers()
      getNextBaseUrl = vi.fn(() => Promise.resolve("next"))
      rehomable = await createRehomableRetryingClient({
        createTransport,
        service: DocumentService,
        initialBaseUrl: "initial",
        getNextBaseUrl,
      })
      for (
        let attempt = 0;
        attempt < REHOME_ATTEMPTS_WITHOUT_BACKOFF;
        attempt++
      ) {
        await rehomable.rehome()
      }
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it("runs the first consecutive re-homes immediately", () => {
      expect(getNextBaseUrl).toHaveBeenCalledTimes(
        REHOME_ATTEMPTS_WITHOUT_BACKOFF,
      )
    })

    it("does not fetch a new URL before the backoff has elapsed", async () => {
      void rehomable.rehome()
      await vi.advanceTimersByTimeAsync(REHOME_BACKOFF_MS - 1)
      expect(getNextBaseUrl).toHaveBeenCalledTimes(
        REHOME_ATTEMPTS_WITHOUT_BACKOFF,
      )
    })

    it("fetches a new URL once the backoff has elapsed", async () => {
      void rehomable.rehome()
      await vi.advanceTimersByTimeAsync(REHOME_BACKOFF_MS)
      expect(getNextBaseUrl).toHaveBeenCalledTimes(
        REHOME_ATTEMPTS_WITHOUT_BACKOFF + 1,
      )
    })

    it("runs the next re-home immediately after resetRehomeBackoff", async () => {
      rehomable.resetRehomeBackoff()
      await rehomable.rehome()
      expect(getNextBaseUrl).toHaveBeenCalledTimes(
        REHOME_ATTEMPTS_WITHOUT_BACKOFF + 1,
      )
    })
  })

  describe("guard rails", () => {
    it("throws if the service has a method named `rehome` or `rehoming`", async () => {
      // Forge a service shape with a colliding method name. This guards the
      // forwarding loop from silently shadowing the wrapper's own API.
      const collidingService = {
        ...DocumentService,
        methods: {
          ...DocumentService.methods,
          rehome: DocumentService.methods.getClientStats,
        },
      } as unknown as typeof DocumentService

      await expect(
        createRehomableRetryingClient({
          createTransport,
          service: collidingService,
          initialBaseUrl: "initial",
          getNextBaseUrl: () => Promise.resolve("next"),
        }),
      ).rejects.toThrow(/method named rehome/)
    })
  })
})
