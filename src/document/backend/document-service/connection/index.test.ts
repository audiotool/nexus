import { Code, ConnectError } from "@connectrpc/connect"
import type { RehomableRetryingClient } from "@utils/grpc/rehomable-retrying-client"
import type { DocumentService } from "@gen/document/v1/document_service_connect"
import {
  ApplyTransactionsResponse,
  PingResponse,
  Transaction,
} from "@gen/document/v1/document_service_pb"
import { ValueNotifier } from "@utils/observable-notifier-value"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { createDocumentServiceConnection } from "."

/**
 * An attach iterator that resolves only when its abort signal fires. The
 * receiver constructs an iterator in its constructor and, in the absence
 * of any backend traffic, will sit on `next()` until something either
 * yields or aborts the call. We use the latter to observe `reconnect()`.
 */
async function* attachUntilAborted(
  signal: AbortSignal | undefined,
): AsyncIterable<never> {
  await new Promise((_, reject) => {
    const onAbort = () => reject(new ConnectError("aborted", Code.Canceled))
    if (signal?.aborted ?? false) {
      onAbort()
      return
    }
    signal?.addEventListener("abort", onAbort)
  })
  yield null as never
}

/**
 * The narrowed view returned by {@link createMockDocumentService}. It is
 * structurally a {@link RehomableRetryingClient} (so the connection can
 * consume it) but exposes `rehoming` as the concrete writable
 * {@link ValueNotifier} so tests can drive transitions directly.
 */
type MockDocumentService = Omit<
  RehomableRetryingClient<typeof DocumentService>,
  "rehoming"
> & {
  rehoming: ValueNotifier<boolean>
}

const createMockDocumentService = (): MockDocumentService => {
  const rehoming = new ValueNotifier(false)
  // Cast: we only implement the four methods the connection touches plus
  // `rehome` / `rehoming`. The rest of the surface is unused at runtime.
  return {
    attach: vi.fn((_req, opts) => attachUntilAborted(opts?.signal)),
    applyTransactions: vi.fn(() =>
      Promise.resolve(new ApplyTransactionsResponse()),
    ),
    ping: vi.fn(() => Promise.resolve(new PingResponse())),
    rehome: vi.fn(() => Promise.resolve(undefined)),
    resetRehomeBackoff: vi.fn(),
    rehoming,
  } as unknown as MockDocumentService
}

describe("createDocumentServiceConnection", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  describe("rehome -> reconnect wiring", () => {
    it("should reconnect the receiver when a rehome completes", async () => {
      const documentService = createMockDocumentService()

      const connection = createDocumentServiceConnection(
        documentService,
        "test",
      )

      // Start iterating so the receiver's master loop is actually awaiting
      // `attach.next()`; otherwise the loop never spins and we wouldn't
      // observe the recreate-after-abort behaviour.
      const iterator = connection.receiveNextTransaction[Symbol.asyncIterator]()
      const pendingNext = iterator.next()

      // The receiver constructs its iterator eagerly, which dispatches the
      // first `attach` call.
      expect(documentService.attach).toHaveBeenCalledTimes(1)

      // Simulate a rehome triggered elsewhere (typically by the sender):
      // the rehomable client flips `rehoming` true while in flight, then
      // back to false once the new transport is wired up.
      documentService.rehoming.setValue(true)
      documentService.rehoming.setValue(false)

      // The reconnect aborts the previous attach iterator. The receiver's
      // catch path treats the resulting Canceled error as recoverable and
      // backs off before re-issuing `attach`. Advance past the (default
      // 1s) backoff so the recreated iterator dispatches.
      await vi.advanceTimersByTimeAsync(2000)

      expect(documentService.attach).toHaveBeenCalledTimes(2)

      // Tear everything down so the still-pending `iterator.next()` doesn't
      // leak into the next test.
      await connection.terminate()
      await pendingNext
    })

    it("should resend a transaction retrying against the previous worker when a rehome completes", async () => {
      const documentService = createMockDocumentService()
      const firstSendStarted = Promise.withResolvers<void>()
      vi.mocked(documentService.applyTransactions)
        .mockImplementationOnce(
          (_request, options) =>
            new Promise((resolve) => {
              firstSendStarted.resolve()
              // Retrying against a worker that is gone: only an abort settles the call.
              options?.signal?.addEventListener("abort", () =>
                resolve(new Error("aborted")),
              )
            }),
        )
        .mockResolvedValue(new ApplyTransactionsResponse())

      const connection = createDocumentServiceConnection(
        documentService,
        "test",
      )
      const result = connection.sendNextTransaction(new Transaction())
      await firstSendStarted.promise
      documentService.rehoming.setValue(true)
      documentService.rehoming.setValue(false)

      expect(await result).toBeUndefined()
      await connection.terminate()
    })

    it("should send a new ping when a rehome completes", async () => {
      const documentService = createMockDocumentService()
      const firstPingStarted = Promise.withResolvers<void>()
      vi.mocked(documentService.ping)
        .mockImplementationOnce(
          (_request, options) =>
            new Promise((resolve) => {
              firstPingStarted.resolve()
              // Retrying against a worker that is gone: only an abort settles the call.
              options?.signal?.addEventListener("abort", () =>
                resolve(new Error("aborted")),
              )
            }),
        )
        .mockResolvedValue(new PingResponse())

      const connection = createDocumentServiceConnection(
        documentService,
        "test",
      )
      await firstPingStarted.promise
      documentService.rehoming.setValue(true)
      documentService.rehoming.setValue(false)
      await vi.advanceTimersByTimeAsync(1000)

      expect(documentService.ping).toHaveBeenCalledTimes(2)
      await connection.terminate()
    })

    it("should NOT reconnect the receiver if rehoming flips false without ever being true", async () => {
      // Defensive: e.g. an idempotent setValue(false) at construction time
      // must not trigger a reconnect.
      const documentService = createMockDocumentService()

      const connection = createDocumentServiceConnection(
        documentService,
        "test",
      )

      expect(documentService.attach).toHaveBeenCalledTimes(1)

      // Setting to the same value is a no-op for ValueNotifier, but assert
      // explicitly that no spurious reconnect happens through other paths.
      documentService.rehoming.setValue(false)
      await vi.advanceTimersByTimeAsync(2000)

      expect(documentService.attach).toHaveBeenCalledTimes(1)

      await connection.terminate()
    })

    it("should surface rehoming through connectionOk while in flight", async () => {
      const documentService = createMockDocumentService()

      const connection = createDocumentServiceConnection(
        documentService,
        "test",
      )

      const seen: boolean[] = []
      connection.connectionOk.subscribe((ok) => seen.push(ok), true)

      documentService.rehoming.setValue(true)
      documentService.rehoming.setValue(false)
      // Let the reconnect-induced backoff settle so the receiver's
      // connectionOk has a chance to come back true.
      await vi.advanceTimersByTimeAsync(2000)

      // We expect at minimum: an initial true, a transition to false while
      // re-homing, and a transition back to true once it completes.
      expect(seen[0]).toBe(true)
      expect(seen).toContain(false)
      expect(seen[seen.length - 1]).toBe(true)

      await connection.terminate()
    })
  })

  describe("ping failure -> sender reconnect wiring", () => {
    it("should resend a hanging transaction when a ping fails", async () => {
      const documentService = createMockDocumentService()
      const firstSendStarted = Promise.withResolvers<void>()
      vi.mocked(documentService.applyTransactions)
        .mockImplementationOnce(
          (_request, options) =>
            new Promise((resolve) => {
              firstSendStarted.resolve()
              // A server that silently stopped answering: only an abort settles the call.
              options?.signal?.addEventListener("abort", () =>
                resolve(new Error("aborted")),
              )
            }),
        )
        .mockResolvedValue(new ApplyTransactionsResponse())
      vi.mocked(documentService.ping).mockImplementationOnce(
        async (_request, options) => {
          await firstSendStarted.promise
          // RetryingClient calls onRetry when the ping times out.
          options?.onRetry?.(new ConnectError("timeout", Code.DeadlineExceeded))
          return new PingResponse()
        },
      )

      const connection = createDocumentServiceConnection(
        documentService,
        "test",
      )
      const result = await connection.sendNextTransaction(new Transaction())

      expect(result).toBeUndefined()
      await connection.terminate()
    })
  })
})
