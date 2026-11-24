import { Code, ConnectError } from "@connectrpc/connect"
import type { RehomableRetryingClient } from "@utils/grpc/rehomable-retrying-client"
import type { RetryingClient } from "@utils/grpc/retrying-client"
import type { DocumentService } from "@gen/document/v1/document_service_connect"
import {
  ApplyTransactionsResponse,
  Transaction,
} from "@gen/document/v1/document_service_pb"
import { throw_ } from "@utils/lang"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { createTransactionSender } from "./transaction-sender"

type ApplyTransactionsFn = RetryingClient<
  typeof DocumentService
>["applyTransactions"]

const createDocumentService = (
  applyFn: ApplyTransactionsFn,
  rehomeFn: () => Promise<Error | undefined> = () => Promise.resolve(undefined),
): Pick<
  RehomableRetryingClient<typeof DocumentService>,
  "applyTransactions" | "rehome" | "resetRehomeBackoff"
> => ({
  applyTransactions: vi.fn(applyFn),
  rehome: vi.fn(rehomeFn),
  resetRehomeBackoff: vi.fn(),
})

/**
 * The sender's send loop runs as a detached promise; when it throws, the
 * rejection surfaces as an unhandledRejection on the process. We grab the
 * next one so rehome-failure / unrecoverable-error tests can assert on it
 * without contaminating subsequent tests.
 */
const captureUnhandledRejection = (): Promise<unknown> =>
  new Promise((resolve) => {
    const handler = (reason: unknown) => {
      process.off("unhandledRejection", handler)
      resolve(reason)
    }
    process.on("unhandledRejection", handler)
  })

describe("transaction-sender", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  describe("sendNextTransaction", () => {
    it("should send a transaction to the backend", async () => {
      const applyCompleted = Promise.withResolvers<void>()
      const documentService = createDocumentService(() => {
        applyCompleted.resolve()
        return Promise.resolve(new ApplyTransactionsResponse())
      })

      const sender = createTransactionSender(documentService, "test")
      const tx = new Transaction({ id: "tx-1" })

      sender.sendNextTransaction(tx)
      await applyCompleted.promise

      expect(documentService.applyTransactions).toHaveBeenCalledWith(
        expect.objectContaining({
          projectName: "test",
          transactions: [tx],
        }),
        expect.any(Object),
      )
      await sender.terminate()
    })

    it("should batch multiple transactions sent simultaneously", async () => {
      const applyCompleted = Promise.withResolvers<void>()
      const documentService = createDocumentService(() => {
        applyCompleted.resolve()
        return Promise.resolve(new ApplyTransactionsResponse())
      })

      const sender = createTransactionSender(documentService, "test")
      const tx1 = new Transaction({ id: "tx-1" })
      const tx2 = new Transaction({ id: "tx-2" })

      // Send both before the loop processes them - these will be batched due
      // to js' async nature.
      sender.sendNextTransaction(tx1)
      sender.sendNextTransaction(tx2)
      await applyCompleted.promise

      expect(documentService.applyTransactions).toHaveBeenCalledWith(
        expect.objectContaining({
          transactions: [tx1, tx2],
        }),
        expect.any(Object),
      )
      await sender.terminate()
    })

    it("should resolve with undefined on success", async () => {
      const documentService = createDocumentService(() =>
        Promise.resolve(new ApplyTransactionsResponse()),
      )

      const sender = createTransactionSender(documentService, "test")
      const result = await sender.sendNextTransaction(
        new Transaction({ id: "tx-1" }),
      )

      expect(result).toBeUndefined()
      await sender.terminate()
    })

    it("should resolve with error string if backend returns error for transaction", async () => {
      const documentService = createDocumentService(() =>
        Promise.resolve(
          new ApplyTransactionsResponse({
            errors: { "tx-1": "validation failed" }, // error for tx-1
          }),
        ),
      )

      const sender = createTransactionSender(documentService, "test")
      const result = await sender.sendNextTransaction(
        new Transaction({ id: "tx-1" }),
      )

      expect(result).toBe("validation failed")
      await sender.terminate()
    })

    it("should resolve errors/successes if transactions are batched", async () => {
      const documentService = createDocumentService(() =>
        Promise.resolve(
          new ApplyTransactionsResponse({
            errors: { "tx-1": "tx-1 failed", "tx-3": "tx-3 failed" }, // error for tx-1, tx-2
          }),
        ),
      )

      const sender = createTransactionSender(documentService, "test")
      const tx1Result = sender.sendNextTransaction(
        new Transaction({ id: "tx-1" }),
      )
      const tx2Result = sender.sendNextTransaction(
        new Transaction({ id: "tx-2" }),
      )
      const tx3Result = sender.sendNextTransaction(
        new Transaction({ id: "tx-3" }),
      )
      const tx4Result = sender.sendNextTransaction(
        new Transaction({ id: "tx-4" }),
      )

      // the backend reply will be an error object containing errors for _some_ transactions;
      // this tests if the errors are correctly mapped to the right sendNextTransaction calls.

      expect([
        await tx1Result,
        await tx2Result,
        await tx3Result,
        await tx4Result,
      ]).toEqual(["tx-1 failed", undefined, "tx-3 failed", undefined])
      await sender.terminate()
    })

    it("should throw if called after terminate", async () => {
      const documentService = createDocumentService(() =>
        Promise.resolve(new ApplyTransactionsResponse()),
      )
      const sender = createTransactionSender(documentService, "test")

      await sender.terminate()

      await expect(
        sender.sendNextTransaction(new Transaction({ id: "tx-1" })),
      ).rejects.toThrow("tried sending transaction after termination")
    })
  })

  describe("rehome behavior", () => {
    it("should reset the rehome backoff after a successful send", async () => {
      const documentService = createDocumentService(() =>
        Promise.resolve(new ApplyTransactionsResponse()),
      )

      const sender = createTransactionSender(documentService, "test")
      await sender.sendNextTransaction(new Transaction({ id: "tx-1" }))

      expect(documentService.resetRehomeBackoff).toHaveBeenCalled()
      await sender.terminate()
    })

    it("should rehome and retry the batch on any FailedPrecondition from applyTransactions", async () => {
      let callCount = 0
      const rehomeFn = vi.fn((): Promise<Error | undefined> =>
        Promise.resolve(undefined),
      )
      const seenBatches: string[][] = []
      const documentService = createDocumentService((req) => {
        callCount++
        seenBatches.push((req.transactions ?? []).map((t) => t.id ?? throw_()))
        if (callCount === 1) {
          // RetryingClient wraps the underlying ConnectError as the cause of
          // a generic Error; the sender treats any FailedPrecondition as
          // rehome-worthy regardless of the ConnectError message.
          return Promise.resolve(
            new Error("apply failed", {
              cause: new ConnectError(
                "worker is not assigned to any project",
                Code.FailedPrecondition,
              ),
            }),
          )
        }
        return Promise.resolve(new ApplyTransactionsResponse())
      }, rehomeFn)

      const sender = createTransactionSender(documentService, "test")
      const result = await sender.sendNextTransaction(
        new Transaction({ id: "tx-1" }),
      )

      expect(result).toBeUndefined()
      expect(rehomeFn).toHaveBeenCalledTimes(1)
      // The same batch must be retried against the freshly-homed worker.
      expect(seenBatches).toEqual([["tx-1"], ["tx-1"]])
      await sender.terminate()
    })

    it("should throw if rehome fails", async () => {
      const rehomeFn = vi.fn(() =>
        Promise.resolve(new Error("prisma unavailable")),
      )
      const documentService = createDocumentService(
        () =>
          Promise.resolve(
            new Error("apply failed", {
              cause: new ConnectError(
                "worker is not assigned to any project",
                Code.FailedPrecondition,
              ),
            }),
          ),
        rehomeFn,
      )

      const rejection = captureUnhandledRejection()
      const sender = createTransactionSender(documentService, "test")
      sender.sendNextTransaction(new Transaction({ id: "tx-1" }))

      const reason = await rejection
      expect(reason).toBeInstanceOf(Error)
      expect((reason as Error).message).toBe(
        "error sending transaction after re-home: prisma unavailable",
      )
      expect((reason as Error).cause).toBeInstanceOf(Error)
      expect(((reason as Error).cause as Error).message).toBe(
        "prisma unavailable",
      )
      expect(rehomeFn).toHaveBeenCalledTimes(1)
    })

    it("should rehome and retry when FailedPrecondition message is arbitrary", async () => {
      let callCount = 0
      const rehomeFn = vi.fn((): Promise<Error | undefined> =>
        Promise.resolve(undefined),
      )
      const seenBatches: string[][] = []
      const documentService = createDocumentService((req) => {
        callCount++
        seenBatches.push((req.transactions ?? []).map((t) => t.id ?? throw_()))
        if (callCount === 1) {
          return Promise.resolve(
            new Error("apply failed", {
              cause: new ConnectError(
                "arbitrary message does not affect rehome",
                Code.FailedPrecondition,
              ),
            }),
          )
        }
        return Promise.resolve(new ApplyTransactionsResponse())
      }, rehomeFn)

      const sender = createTransactionSender(documentService, "test")
      const result = await sender.sendNextTransaction(
        new Transaction({ id: "tx-1" }),
      )

      expect(result).toBeUndefined()
      expect(rehomeFn).toHaveBeenCalledTimes(1)
      expect(seenBatches).toEqual([["tx-1"], ["tx-1"]])
      await sender.terminate()
    })

    it("should not rehome on non-FailedPrecondition ConnectErrors", async () => {
      const rehomeFn = vi.fn((): Promise<Error | undefined> =>
        Promise.resolve(undefined),
      )
      const documentService = createDocumentService(
        () =>
          Promise.resolve(
            new Error("apply failed", {
              cause: new ConnectError(
                "permission denied",
                Code.PermissionDenied,
              ),
            }),
          ),
        rehomeFn,
      )

      const rejection = captureUnhandledRejection()
      const sender = createTransactionSender(documentService, "test")
      sender.sendNextTransaction(new Transaction({ id: "tx-1" }))

      const reason = await rejection
      expect(reason).toBeInstanceOf(Error)
      expect((reason as Error).message).toBe(
        "error sending transaction: apply failed",
      )
      expect(rehomeFn).not.toHaveBeenCalled()
    })

    it("should not rehome when the cause is not a ConnectError", async () => {
      const rehomeFn = vi.fn((): Promise<Error | undefined> =>
        Promise.resolve(undefined),
      )
      const documentService = createDocumentService(
        () =>
          Promise.resolve(
            new Error("apply failed", {
              // Looks like the rehomeable error message, but is not a
              // ConnectError, so it must not trigger a rehome.
              cause: new Error("worker is not assigned to any project"),
            }),
          ),
        rehomeFn,
      )

      const rejection = captureUnhandledRejection()
      const sender = createTransactionSender(documentService, "test")
      sender.sendNextTransaction(new Transaction({ id: "tx-1" }))

      const reason = await rejection
      expect(reason).toBeInstanceOf(Error)
      expect((reason as Error).message).toBe(
        "error sending transaction: apply failed",
      )
      expect(rehomeFn).not.toHaveBeenCalled()
    })

    it("should preserve ordering of queued transactions across a rehome", async () => {
      let callCount = 0
      const rehomeFn = vi.fn((): Promise<Error | undefined> =>
        Promise.resolve(undefined),
      )
      const seenBatches: string[][] = []
      const documentService = createDocumentService((req) => {
        callCount++
        seenBatches.push((req.transactions ?? []).map((t) => t.id ?? throw_()))
        if (callCount === 1) {
          return Promise.resolve(
            new Error("apply failed", {
              cause: new ConnectError(
                "worker is not assigned to any project",
                Code.FailedPrecondition,
              ),
            }),
          )
        }
        return Promise.resolve(new ApplyTransactionsResponse())
      }, rehomeFn)

      const sender = createTransactionSender(documentService, "test")

      // Queue two transactions synchronously so they're batched on the
      // first send attempt.
      const tx1Result = sender.sendNextTransaction(
        new Transaction({ id: "tx-1" }),
      )
      const tx2Result = sender.sendNextTransaction(
        new Transaction({ id: "tx-2" }),
      )

      await Promise.all([tx1Result, tx2Result])
      expect(rehomeFn).toHaveBeenCalledTimes(1)
      // The retried batch must be the same, in the same order, so Hermes
      // sees transactions in the order they were submitted.
      expect(seenBatches).toEqual([
        ["tx-1", "tx-2"],
        ["tx-1", "tx-2"],
      ])
      await sender.terminate()
    })
  })

  describe("reconnect", () => {
    it("should resend the batch when reconnect aborts a hanging send", async () => {
      const seenBatches: string[][] = []
      const firstSendStarted = Promise.withResolvers<void>()
      const documentService = createDocumentService((request, options) => {
        seenBatches.push(
          (request.transactions ?? []).map((t) => t.id ?? throw_()),
        )
        if (seenBatches.length > 1) {
          return Promise.resolve(new ApplyTransactionsResponse())
        }
        firstSendStarted.resolve()
        // A server that silently stopped answering: only an abort settles the call.
        return new Promise((resolve) => {
          options?.signal?.addEventListener("abort", () =>
            resolve(new Error("aborted")),
          )
        })
      })

      const sender = createTransactionSender(documentService, "test")
      const result = sender.sendNextTransaction(new Transaction({ id: "tx-1" }))
      await firstSendStarted.promise
      sender.reconnect()
      await result

      expect(seenBatches).toEqual([["tx-1"], ["tx-1"]])
      await sender.terminate()
    })
  })

  describe("terminate", () => {
    it("should resolve after pending transactions arrived at the backend", async () => {
      // track which transactions the server received
      const receivedTransactionIds: string[] = []
      // resolve to make the server reply
      const waitToRespond = Promise.withResolvers<ApplyTransactionsResponse>()

      const documentService = createDocumentService(async (req) => {
        for (const tx of req.transactions ?? []) {
          receivedTransactionIds.push(tx.id ?? throw_())
        }
        return waitToRespond.promise
      })

      const sender = createTransactionSender(documentService, "test")
      // send a transaction to the backend
      sender.sendNextTransaction(new Transaction({ id: "tx-1" }))

      // Start termination while transaction is pending
      const terminatePromise = sender.terminate()

      // Complete the backend response
      waitToRespond.resolve(new ApplyTransactionsResponse())
      await terminatePromise

      // Verify the transaction was received by the server before termination completed
      expect(receivedTransactionIds).toEqual(["tx-1"])
    })
  })
})
