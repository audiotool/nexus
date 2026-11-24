import { Code, ConnectError, createRouterTransport } from "@connectrpc/connect"
import { DocumentService } from "@gen/document/v1/document_service_connect"
import {
  ApplyTransactionsResponse,
  AttachResponse,
  Noop,
  PingResponse,
  Transaction,
} from "@gen/document/v1/document_service_pb"
import { OpenSessionResponse } from "@gen/project/v1/project_service_pb"
import { createRehomableRetryingClient } from "@utils/grpc/rehomable-retrying-client"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import {
  createGetDocumentServiceUrl,
  OPEN_SESSION_TIMEOUT_MS,
} from "../../../synced-document"
import type { KeepaliveTransport } from "../../../transport/types"
import { createDocumentServiceConnection } from "./connection"
import { DOCUMENT_SERVICE_RETRY_OPTIONS } from "./document-service-retry-options"

/** An in-memory document server. While it doesn't own the project, attach and
 * applyTransactions fail with FailedPrecondition, like a real one.
 */
const createFakeServer = (opts: {
  ownsProject: boolean
  serverCommitIndex: bigint
}) => {
  const server = {
    ownsProject: opts.ownsProject,
    attachCommitIndices: [] as bigint[],
    receivedTransactionIds: [] as string[],
    /** Release the attach stream of this server with a failure. */
    unassign: () => {},
  }
  const transport = createRouterTransport(({ service }) => {
    service(DocumentService, {
      async *attach(req, ctx) {
        server.attachCommitIndices.push(req.commitIndex)
        if (!server.ownsProject) {
          throw new ConnectError("not assigned", Code.FailedPrecondition)
        }
        yield new AttachResponse({
          message: {
            case: "noop",
            value: new Noop({ serverCommitIndex: opts.serverCommitIndex }),
          },
        })
        await new Promise<void>((resolve, reject) => {
          ctx.signal.addEventListener("abort", () => resolve())
          server.unassign = () => {
            server.ownsProject = false
            reject(new ConnectError("not assigned", Code.FailedPrecondition))
          }
        })
      },
      applyTransactions: (req) => {
        if (!server.ownsProject) {
          throw new ConnectError("not assigned", Code.FailedPrecondition)
        }
        server.receivedTransactionIds.push(...req.transactions.map((t) => t.id))
        return new ApplyTransactionsResponse()
      },
      ping: () => new PingResponse(),
    })
  }) as KeepaliveTransport
  return { server, transport }
}

const setup = async () => {
  const a = createFakeServer({ ownsProject: true, serverCommitIndex: 5n })
  const b = createFakeServer({ ownsProject: true, serverCommitIndex: 5n })
  const transports: Record<string, KeepaliveTransport> = {
    a: a.transport,
    b: b.transport,
  }
  const getNextBaseUrl = vi.fn(() => Promise.resolve("b"))
  const documentService = await createRehomableRetryingClient({
    service: DocumentService,
    initialBaseUrl: "a",
    getNextBaseUrl,
    createTransport: (baseUrl) => Promise.resolve(transports[baseUrl]),
    retryOptions: { ...DOCUMENT_SERVICE_RETRY_OPTIONS, logIfRetrying: false },
  })
  const connection = createDocumentServiceConnection(
    documentService,
    "projects/test",
    { pingIntervalMs: 60_000 },
  )
  // keep reading, like the gateway does
  const received: Transaction[] = []
  void (async () => {
    for await (const transaction of connection.receiveNextTransaction) {
      received.push(transaction)
    }
  })()
  // the document is loaded from server a
  await vi.advanceTimersByTimeAsync(0)
  expect(received).toHaveLength(1)
  return { a: a.server, b: b.server, getNextBaseUrl, connection }
}

describe("rehoming the document service connection", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it("moves receiving and sending to the new server when the old one stops owning the project", async () => {
    const { a, b, getNextBaseUrl, connection } = await setup()
    expect(a.attachCommitIndices).toEqual([0n])

    a.unassign()
    await vi.advanceTimersByTimeAsync(100)

    expect(getNextBaseUrl).toHaveBeenCalledTimes(1)
    // continues from the commit index the old server reported
    expect(b.attachCommitIndices).toEqual([5n])
    expect(connection.connectionOk.getValue()).toBe(true)

    const result = connection.sendNextTransaction(
      new Transaction({ id: "local-1" }),
    )
    await vi.advanceTimersByTimeAsync(100)

    expect(await result).toBeUndefined()
    expect(a.receivedTransactionIds).toEqual([])
    expect(b.receivedTransactionIds).toEqual(["local-1"])
    await connection.terminate()
  })

  it("resends a rejected batch to the new server, and moves the receiver too", async () => {
    const { a, b, getNextBaseUrl, connection } = await setup()

    // the server stops owning the project, but its attach stream stays open
    a.ownsProject = false
    const result = connection.sendNextTransaction(
      new Transaction({ id: "local-1" }),
    )
    await vi.advanceTimersByTimeAsync(100)

    expect(await result).toBeUndefined()
    expect(getNextBaseUrl).toHaveBeenCalledTimes(1)
    expect(b.receivedTransactionIds).toEqual(["local-1"])
    // the receiver was kicked off the stale stream of server a
    expect(b.attachCommitIndices).toEqual([5n])
    await connection.terminate()
  })

  it("ends up on the new server when the receiver and the sender fail at the same time", async () => {
    const { a, b, connection } = await setup()

    const result = connection.sendNextTransaction(
      new Transaction({ id: "local-1" }),
    )
    a.unassign()
    await vi.advanceTimersByTimeAsync(100)

    expect(await result).toBeUndefined()
    expect(a.receivedTransactionIds).toEqual([])
    expect(b.receivedTransactionIds).toEqual(["local-1"])
    expect(b.attachCommitIndices.length).toBeGreaterThan(0)
    expect(b.attachCommitIndices.every((index) => index === 5n)).toBe(true)
    expect(connection.connectionOk.getValue()).toBe(true)
    await connection.terminate()
  })

  it("keeps the old server if the project service still assigns it", async () => {
    const { a, b, getNextBaseUrl, connection } = await setup()
    getNextBaseUrl.mockResolvedValue("a")

    // e.g. the server restarted and owns the project again
    a.unassign()
    a.ownsProject = true
    await vi.advanceTimersByTimeAsync(100)

    expect(a.attachCommitIndices).toEqual([0n, 5n])
    expect(b.attachCommitIndices).toEqual([])
    expect(connection.connectionOk.getValue()).toBe(true)
    await connection.terminate()
  })
})

describe("createGetDocumentServiceUrl", () => {
  const createProjectService = (
    response: OpenSessionResponse | Error,
  ): Parameters<typeof createGetDocumentServiceUrl>[0] => ({
    openSession: vi.fn(() => Promise.resolve(response)),
  })

  it("returns the document service url of the session", async () => {
    const projectService = createProjectService(
      new OpenSessionResponse({
        session: { documentServiceUrl: "https://worker-2" },
      }),
    )

    const url = await createGetDocumentServiceUrl(
      projectService,
      "projects/test",
    )()

    expect(url).toBe("https://worker-2")
    expect(projectService.openSession).toHaveBeenCalledWith(
      { projectName: "projects/test" },
      { timeoutMs: OPEN_SESSION_TIMEOUT_MS },
    )
  })

  it("returns an error if the session can't be opened", async () => {
    const url = await createGetDocumentServiceUrl(
      createProjectService(new Error("permission denied")),
      "projects/test",
    )()

    expect(url).toBeInstanceOf(Error)
  })

  it("returns an error if the session has no document service url", async () => {
    const url = await createGetDocumentServiceUrl(
      createProjectService(new OpenSessionResponse({ session: {} })),
      "projects/test",
    )()

    expect(url).toBeInstanceOf(Error)
  })
})
