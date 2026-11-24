// Real-backend checks for re-homing the document service connection.
//
// SCENARIO=wrong-server (default): the first OpenSession answer is rewritten to point at the
// document server of a different project. That server answers FailedPrecondition, so the SDK
// must re-home to the server that actually hosts the project, then load and edit the document.
//
// SCENARIO=outage: the document service is cut off for OUTAGE_MS (default 90s), long enough for
// the backend to close the idle session. Then the connection is restored.
//
// Both scenarios check with a fresh client that all changes arrived, and delete their projects.
//
// Run with: AT_PAT=... [SCENARIO=outage] npx tsx src/rehome.ts
import { Code, ConnectError, type Transport } from "@connectrpc/connect"
import { createAudiotoolClient, createPATAuth } from "@audiotool/nexus"
import { throw_ } from "@audiotool/nexus/utils"
import { createDiskWasmLoader, createNodeTransport } from "../../../dist/node"

const PAT = process.env.AT_PAT ?? throw_("AT_PAT is required")
const SCENARIO = process.env.SCENARIO ?? "wrong-server"
const OUTAGE_MS = Number(process.env.OUTAGE_MS ?? 90_000)

const start = performance.now()
const log = (...args: unknown[]) =>
  console.log(`[${((performance.now() - start) / 1000).toFixed(1)}s]`, ...args)
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
const withTimeout = <T>(
  promise: Promise<T>,
  ms: number,
  what: string,
): Promise<T> =>
  Promise.race([
    promise,
    sleep(ms).then(() => throw_(`timed out after ${ms / 1000}s: ${what}`)),
  ])

let failed = false
process.on("unhandledRejection", (error) => {
  failed = true
  log("unhandled rejection:", error instanceof Error ? error.message : error)
})

let blocked = false
const openStreams = new Set<AbortController>()
const documentServiceUrls: string[] = []
const openSessionUrls: string[] = []
const errorCodes: string[] = []
/** If set, the next OpenSession answer is rewritten to this url. */
let rewriteNextSessionUrl: string | undefined

const nodeTransport = createNodeTransport()

const logError = (method: string, error: unknown) => {
  const code = error instanceof ConnectError ? Code[error.code] : String(error)
  if (!blocked) {
    errorCodes.push(`${method}: ${code}`)
  }
  log(
    `  ${method} failed: ${code}`,
    error instanceof Error ? error.message : "",
  )
}

/** Wraps the document service transport, so it can be cut off. */
const interruptible = (transport: Transport): Transport => ({
  unary: async (service, method, signal, timeoutMs, header, input, ctx) => {
    if (blocked) {
      throw new ConnectError("simulated outage", Code.Unavailable)
    }
    try {
      return await transport.unary(
        service,
        method,
        signal,
        timeoutMs,
        header,
        input,
        ctx,
      )
    } catch (error) {
      logError(method.name, error)
      throw error
    }
  },
  stream: async (service, method, signal, timeoutMs, header, input, ctx) => {
    if (blocked) {
      throw new ConnectError("simulated outage", Code.Unavailable)
    }
    const controller = new AbortController()
    openStreams.add(controller)
    const combined = signal
      ? AbortSignal.any([signal, controller.signal])
      : controller.signal
    try {
      const response = await transport.stream(
        service,
        method,
        combined,
        timeoutMs,
        header,
        input,
        ctx,
      )
      const messages = response.message
      return {
        ...response,
        message: (async function* () {
          try {
            yield* messages
          } catch (error) {
            logError(method.name, error)
            throw error
          } finally {
            openStreams.delete(controller)
          }
        })(),
      }
    } catch (error) {
      openStreams.delete(controller)
      logError(method.name, error)
      throw error
    }
  },
})

/** Logs (and optionally rewrites) the document service url of every OpenSession answer. */
const observed = (transport: Transport): Transport => ({
  ...transport,
  unary: async (service, method, signal, timeoutMs, header, input, ctx) => {
    const response = await transport.unary(
      service,
      method,
      signal,
      timeoutMs,
      header,
      input,
      ctx,
    )
    if (method.name === "OpenSession") {
      const session = (
        response.message as { session?: { documentServiceUrl: string } }
      ).session
      const url = session?.documentServiceUrl ?? ""
      if (session !== undefined && rewriteNextSessionUrl !== undefined) {
        log(`  OpenSession -> ${url}, rewritten to ${rewriteNextSessionUrl}`)
        session.documentServiceUrl = rewriteNextSessionUrl
        rewriteNextSessionUrl = undefined
      } else {
        log(`  OpenSession -> ${url}`)
      }
      openSessionUrls.push(url)
    }
    return response
  },
  stream: transport.stream.bind(transport),
})

const client = await createAudiotoolClient({
  auth: createPATAuth(PAT),
  transport: {
    createTransport: async (opts) => {
      const transport = await nodeTransport.createTransport(opts)
      if (opts.baseUrl.includes("rpc.audiotool.com")) {
        return observed(transport) as typeof transport
      }
      documentServiceUrls.push(opts.baseUrl)
      log(`  created document service transport for ${opts.baseUrl}`)
      return interruptible(transport) as typeof transport
    },
  },
  wasm: createDiskWasmLoader(),
})

const createProject = async (displayName: string): Promise<string> => {
  const created = await client.projects.createProject({
    project: { displayName },
  })
  if (created instanceof Error) throw created
  const name = created.project?.name ?? throw_("no project name")
  log("created", name)
  return name
}

const projectsToDelete: string[] = []

/** Applies `changes` to the project, returns the tonematrix names that are expected afterwards. */
type Scenario = (
  doc: Awaited<ReturnType<typeof client.open>>,
) => Promise<string[]>

const wrongServer: Scenario = async (doc) => {
  await withTimeout(doc.start(), 60_000, "loading the document")
  log("document started")
  await doc.modify((t) => t.create("tonematrix", { displayName: "first" }))
  await sleep(2_000)
  await doc.modify((t) => t.create("tonematrix", { displayName: "second" }))
  await sleep(3_000)
  return ["first", "second"]
}

const outage: Scenario = async (doc) => {
  await withTimeout(doc.start(), 60_000, "loading the document")
  log("document started")
  const tonematrix = await doc.modify((t) =>
    t.create("tonematrix", { displayName: "before" }),
  )
  await sleep(3_000)

  // applied locally, but most likely still being sent when the connection drops
  await doc.modify((t) =>
    t.create("tonematrix", { displayName: "right before outage" }),
  )
  log(`--- cutting off the document service for ${OUTAGE_MS / 1000}s`)
  blocked = true
  openStreams.forEach((controller) => controller.abort())

  // the document is locked while disconnected, so this runs after reconnecting
  await sleep(5_000)
  const duringOutage = doc.modify((t) => {
    t.update(tonematrix.fields.displayName, "during")
    t.create("tonematrix", { displayName: "requested during outage" })
  })
  log("requested a change during the outage")

  await sleep(OUTAGE_MS - 5_000)
  log("--- restoring the document service")
  blocked = false
  await withTimeout(
    duringOutage,
    120_000,
    "applying the change requested during the outage",
  )
  log("change requested during the outage was applied")

  await doc.modify((t) => t.create("tonematrix", { displayName: "after" }))
  await sleep(5_000)
  return ["after", "during", "requested during outage", "right before outage"]
}

try {
  const projectName = await createProject(
    "nexus sdk re-home test (safe to delete)",
  )
  projectsToDelete.push(projectName)

  if (SCENARIO === "wrong-server") {
    // a second project, to get a document server that doesn't host the first one
    const decoy = await createProject(
      "nexus sdk re-home test decoy (safe to delete)",
    )
    projectsToDelete.push(decoy)
    const decoySession = await client.projects.openSession({
      projectName: decoy,
    })
    if (decoySession instanceof Error) throw decoySession
    rewriteNextSessionUrl =
      decoySession.session?.documentServiceUrl ?? throw_("no url")
  }

  const doc = await client.open(projectName)
  doc.connected.subscribe((connected) => log(`connected: ${connected}`))
  const expected = await (SCENARIO === "outage" ? outage : wrongServer)(doc)
  await doc.stop()
  log("document stopped")

  // check with a fresh connection what the backend has
  const check = await client.open(projectName)
  await withTimeout(check.start(), 60_000, "loading the document for the check")
  const names = check.queryEntities
    .ofTypes("tonematrix")
    .get()
    .map((e) => e.fields.displayName.value)
    .sort()
  await check.stop()

  const matches = JSON.stringify(names) === JSON.stringify(expected)
  failed ||= !matches
  log(
    "tonematrix names on the backend:",
    names,
    matches ? "as expected" : "MISMATCH",
  )
} catch (error) {
  failed = true
  log("test failed:", error instanceof Error ? error.message : error)
} finally {
  for (const name of projectsToDelete) {
    const deleted = await client.projects.deleteProject({ name })
    log(
      deleted instanceof Error
        ? `failed to delete ${name}: ${deleted.message}`
        : `deleted ${name}`,
    )
  }
}

log("summary:", {
  scenario: SCENARIO,
  documentServiceUrls,
  openSessionUrls,
  errorsWhileNotBlocked: errorCodes,
  result: failed ? "FAILED" : "PASSED",
})
process.exit(failed ? 1 : 0)
