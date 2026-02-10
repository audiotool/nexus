import type { DocumentService } from "@gen/document/v1/document_service_connect"
import {
  ApplyTransactionsResponse,
  Transaction,
} from "@gen/document/v1/document_service_pb"
import type { RetryingClient } from "@utils/grpc/retrying-client"
import { throw_ } from "@utils/lang"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { createTransactionSender } from "./transaction-sender"

type ApplyTransactionsFn = RetryingClient<
  typeof DocumentService
>["applyTransactions"]

const createDocumentService = (
  applyFn: ApplyTransactionsFn,
): Pick<RetryingClient<typeof DocumentService>, "applyTransactions"> => ({
  applyTransactions: vi.fn(applyFn),
})

describe("transaction-sender", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  describe("sendNextTransaction", () => {
    it("should send a transaction to the backend", async () => {
      const applyCompleted = Promise.withResolvers<void>()
      const documentService = createDocumentService(async () => {
        applyCompleted.resolve()
        return new ApplyTransactionsResponse()
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
      const documentService = createDocumentService(async () => {
        applyCompleted.resolve()
        return new ApplyTransactionsResponse()
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
      const documentService = createDocumentService(
        async () => new ApplyTransactionsResponse(), // no error!
      )

      const sender = createTransactionSender(documentService, "test")
      const result = await sender.sendNextTransaction(
        new Transaction({ id: "tx-1" }),
      )

      expect(result).toBeUndefined()
      await sender.terminate()
    })

    it("should resolve with error string if backend returns error for transaction", async () => {
      const documentService = createDocumentService(async () => {
        return new ApplyTransactionsResponse({
          errors: { "tx-1": "validation failed" }, // error for tx-1
        })
      })

      const sender = createTransactionSender(documentService, "test")
      const result = await sender.sendNextTransaction(
        new Transaction({ id: "tx-1" }),
      )

      expect(result).toBe("validation failed")
      await sender.terminate()
    })

    it("should resolve errors/successes if transactions are batched", async () => {
      const documentService = createDocumentService(async () => {
        return new ApplyTransactionsResponse({
          errors: { "tx-1": "tx-1 failed", "tx-3": "tx-3 failed" }, // error for tx-1, tx-2
        })
      })

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
      const documentService = createDocumentService(
        async () => new ApplyTransactionsResponse(),
      )
      const sender = createTransactionSender(documentService, "test")

      await sender.terminate()

      await expect(
        sender.sendNextTransaction(new Transaction({ id: "tx-1" })),
      ).rejects.toThrow("tried sending transaction after termination")
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
