import { Code, ConnectError } from "@connectrpc/connect"
import type { DocumentService } from "@gen/document/v1/document_service_connect"
import {
  AttachResponse,
  Noop,
  Transaction,
} from "@gen/document/v1/document_service_pb"
import type { RetryingClient } from "@utils/grpc/retrying-client"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { createTransactionReceiver } from "./transaction-receiver"

type AttachFn = RetryingClient<typeof DocumentService>["attach"]

/** Creates a mock document service with a controllable attach function */
const createDocumentService = (
  attachFn: AttachFn,
): Pick<RetryingClient<typeof DocumentService>, "attach"> => ({
  attach: vi.fn(attachFn),
})

/** Creates an AttachResponse with a transaction */
const createAttachResponse = (id: string, commitIndex: number) =>
  new AttachResponse({
    message: {
      case: "transaction",
      value: new Transaction({ id, commitIndex: BigInt(commitIndex) }),
    },
  })

/** Creates an AttachResponse with a noop */
const createNoopResponse = () =>
  new AttachResponse({
    message: { case: "noop", value: new Noop() },
  })

/** Creates an async iterable from an array of items, useful when mocking streaming grpc
 * methods in the document service.
 */
async function* asyncIterateElements<T>(items: T[]): AsyncIterable<T> {
  for (const item of items) yield item
}

/** Creates an async iterable that yields items then throws an error */
async function* asyncIterateElementsThenThrow<T>(
  items: T[],
  error: Error,
): AsyncIterable<T> {
  for (const item of items) yield item
  throw error
}

/** Creates an async iterable that blocks until aborted */
async function* blockingAsyncIterableUntilAbort<T>(
  signal: AbortSignal,
): AsyncIterable<T> {
  await new Promise((_, reject) => {
    signal.addEventListener("abort", () =>
      reject(new ConnectError("aborted", Code.Canceled)),
    )
  })
}

describe("transaction-receiver", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  describe("nextTransactionIterator", () => {
    it("should yield transactions from the backend", async () => {
      // create document service that yields two transactions
      const documentService = createDocumentService(() =>
        asyncIterateElements([
          createAttachResponse("tx-1", 1),
          createAttachResponse("tx-2", 2),
        ]),
      )

      // create transaction receiver and get iterator
      const receiver = createTransactionReceiver(documentService, "test")
      const iterator = receiver.nextTransactionIterator[Symbol.asyncIterator]()

      // get the first 2 transaction ids
      const transactionIds = [
        (await iterator.next()).value?.id,
        (await iterator.next()).value?.id,
      ]

      // make sure we got the right transactions
      expect(transactionIds).toEqual(["tx-1", "tx-2"])
      receiver.terminate()
    })

    it("should yield Transaction with UUID on first noop message", async () => {
      // the document service might emit a noop message if the document is empty - in that case,
      // the iterator should return an empty transaction with a random id.

      const documentService = createDocumentService(() =>
        asyncIterateElements([createNoopResponse()]),
      )

      const receiver = createTransactionReceiver(documentService, "test")
      const iterator = receiver.nextTransactionIterator[Symbol.asyncIterator]()

      const transactionId = (await iterator.next()).value?.id
      expect(transactionId).not.toBe("")

      receiver.terminate()
    })

    it("should skip subsequent noop messages", async () => {
      // we don't expect noop message to be emitted after the first transaction,
      // but just in case, we test that no-op messages are skipped after the first one,
      // so as not to mess with the consolidation logic.
      const documentService = createDocumentService(() =>
        asyncIterateElements([
          createNoopResponse(),
          createNoopResponse(), // should not result in a transaction being yielded
          createAttachResponse("tx-1", 1),
        ]),
      )

      const receiver = createTransactionReceiver(documentService, "test")
      const iterator = receiver.nextTransactionIterator[Symbol.asyncIterator]()

      // First noop yields a transaction with UUID
      const first = await iterator.next()
      expect(first.value?.id).toMatch(/^[0-9a-f-]{36}$/)

      // Second noop is skipped, we get tx-1 directly
      const second = await iterator.next()
      expect(second.value?.id).toBe("tx-1")

      receiver.terminate()
    })

    it("should skip noop messages after first transaction", async () => {
      const documentService = createDocumentService(() =>
        asyncIterateElements([
          createAttachResponse("tx-1", 1),
          createNoopResponse(), // noop should also be skipped if the first transaction is not empty
          createAttachResponse("tx-2", 2),
        ]),
      )

      const receiver = createTransactionReceiver(documentService, "test")
      const iterator = receiver.nextTransactionIterator[Symbol.asyncIterator]()

      // First transaction
      const first = await iterator.next()
      expect(first.value?.id).toBe("tx-1")

      // Noop is skipped, we get tx-2 directly
      const second = await iterator.next()
      expect(second.value?.id).toBe("tx-2")

      receiver.terminate()
    })

    it("should stop yielding after terminate is called", async () => {
      const documentService = createDocumentService((_req, opts) =>
        blockingAsyncIterableUntilAbort(opts!.signal!),
      )

      const receiver = createTransactionReceiver(documentService, "test")
      const iterator = receiver.nextTransactionIterator[Symbol.asyncIterator]()

      const nextPromise = iterator.next()
      receiver.terminate()
      // Waiting for the result after the iterator is done should result in a done result.
      // In the syntax `for await (const f of iterator)`, this will result in the for loop breaking.
      const result = await nextPromise
      expect(result.done).toBe(true)
    })

    it("should throw on unknown message case", async () => {
      // to be safe, we throw if we don't know an attach response message case
      // todo: maybe better just ignore?
      const documentService = createDocumentService(() =>
        asyncIterateElements([
          new AttachResponse({ message: { case: undefined } }),
        ]),
      )

      const receiver = createTransactionReceiver(documentService, "test")
      const iterator = receiver.nextTransactionIterator[Symbol.asyncIterator]()

      await expect(iterator.next()).rejects.toThrow("unknown message case")
      receiver.terminate()
    })

    it("should throw on unrecoverable errors", async () => {
      const documentService = createDocumentService(() =>
        asyncIterateElementsThenThrow(
          [],
          new ConnectError("permission denied", Code.PermissionDenied),
        ),
      )

      const receiver = createTransactionReceiver(documentService, "test")
      const iterator = receiver.nextTransactionIterator[Symbol.asyncIterator]()

      await expect(iterator.next()).rejects.toThrow()
      receiver.terminate()
    })
  })

  describe("reconnect behavior", () => {
    it("should reconnect on recoverable errors", async () => {
      let callCount = 0
      const documentService = createDocumentService(() => {
        callCount++
        if (callCount === 1) {
          return asyncIterateElementsThenThrow(
            [], // no transactions to yield
            new ConnectError("unavailable", Code.Unavailable), // recoverable error
          )
        }
        return asyncIterateElements([createAttachResponse("tx-1", 1)])
      })

      const receiver = createTransactionReceiver(documentService, "test", {
        backoffMs: 1, // low backoff to speed up tests
      })
      const iterator = receiver.nextTransactionIterator[Symbol.asyncIterator]()

      // get the next element, this should: fail, backoff, try again, then get tx-1
      const nextPromise = iterator.next()

      // Advance past the backoff
      await vi.advanceTimersByTimeAsync(150)

      const result = await nextPromise
      expect(result.value?.id).toBe("tx-1")
      expect(callCount).toBe(2)

      receiver.terminate()
    })

    it("should use last commitIndex when reconnecting", async () => {
      // when reconnecting, the receiver should use the last known commit index from the backend.
      //
      // We test for this:
      // 1. client sets up the stream with a commit index of 0
      // 2. we return a transaction with commit index 42 then throw
      // 3. client should reestablish stream with commit index 42

      let callCount = 0
      let lastSeenCommitIndex = -1n

      const documentService = createDocumentService((req) => {
        callCount++
        lastSeenCommitIndex = req.commitIndex ?? 0n
        if (callCount === 1) {
          // First call: return a transaction then error
          return asyncIterateElementsThenThrow(
            [createAttachResponse("tx-1", 42)], // commit index 42
            new ConnectError("unavailable", Code.Unavailable), // then throw
          )
        }
        // then continue
        return asyncIterateElements([createAttachResponse("tx-2", 43)])
      })

      const receiver = createTransactionReceiver(documentService, "test", {
        backoffMs: 1,
      })
      const iterator = receiver.nextTransactionIterator[Symbol.asyncIterator]()

      // Get first transaction
      const first = await iterator.next()
      expect(first.value?.id).toBe("tx-1")

      // Next call will fail and reconnect
      const secondPromise = iterator.next()
      await vi.advanceTimersByTimeAsync(150)

      const second = await secondPromise
      expect(second.value?.id).toBe("tx-2")
      expect(lastSeenCommitIndex).toBe(42n)

      receiver.terminate()
    })
  })

  describe("connectionOk", () => {
    it("should start as true", () => {
      const documentService = createDocumentService(() =>
        asyncIterateElements([]),
      )
      const receiver = createTransactionReceiver(documentService, "test")

      expect(receiver.connectionOk.getValue()).toBe(true)
      receiver.terminate()
    })

    it("should turn false during reconnection", async () => {
      let callCount = 0
      const documentService = createDocumentService(() => {
        callCount++
        if (callCount === 1) {
          return asyncIterateElementsThenThrow(
            [],
            new ConnectError("unavailable", Code.Unavailable),
          )
        }
        return asyncIterateElements([createAttachResponse("tx-1", 1)])
      })

      const receiver = createTransactionReceiver(documentService, "test", {
        backoffMs: 100,
      })
      const connectionSpy = vi.fn()
      receiver.connectionOk.subscribe(connectionSpy)

      const iterator = receiver.nextTransactionIterator[Symbol.asyncIterator]()
      const nextPromise = iterator.next()

      // Advance a bit to let the error be caught
      await vi.advanceTimersByTimeAsync(100)

      // should turn false...
      expect(receiver.connectionOk.getValue()).toBe(false)

      await vi.advanceTimersByTimeAsync(100)
      await nextPromise
      // ...and back to true
      expect(receiver.connectionOk.getValue()).toBe(true)
      receiver.terminate()
    })

    it("should stay true after successful receive", async () => {
      const documentService = createDocumentService(() =>
        asyncIterateElements([createAttachResponse("tx-1", 1)]),
      )

      const receiver = createTransactionReceiver(documentService, "test")
      const iterator = receiver.nextTransactionIterator[Symbol.asyncIterator]()

      await iterator.next()

      expect(receiver.connectionOk.getValue()).toBe(true)
      receiver.terminate()
    })
  })
})
