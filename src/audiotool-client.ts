import { createRegistry } from "@bufbuild/protobuf"
import { initWasmLoader } from "@document/backend/create-wasm-document-state"
import { createPresetUtil, type PresetUtil } from "./api/preset-utils"
import { createPATAuth } from "./auth/pat-auth"
import type { AuthProvider } from "./auth/types"
import { AudiographService } from "./gen/audiotool/audiograph/v1/audiograph_service_connect"
import { Preset } from "./gen/audiotool/document/v1/preset/v1/preset_pb"
import { ProjectRoleService } from "./gen/audiotool/project/v1/project_role_service_connect"
import { ProjectService } from "./gen/audiotool/project/v1/project_service_connect"
import { SampleService } from "./gen/audiotool/sample/v1/sample_service_connect"
import { UserService } from "./gen/audiotool/user/v1/user_service_connect"
import { createOnlineDocument, SyncedDocument } from "./synced-document"
import { createBrowserTransportFactory } from "./transport/browser-transport"
import type { TransportFactory } from "./transport/types"
import { extractUuid } from "./utils/extract-uuid"
import {
  neverThrowingFetch,
  type NeverThrowingFetch,
} from "./utils/fetch/never-throwing-fetch"
import {
  createRetryingPromiseClient,
  type RetryingClient,
} from "./utils/grpc/retrying-client"
import type { WasmLoader } from "./wasm/types"

export type { SyncedDocument }

/**
 * An instance of the client that's authorized to make calls on a user's behalf.
 *
 * Provides direct access to all Audiotool services and the ability to open projects
 * for real-time collaboration.
 *
 * @example
 * ```typescript
 * // Browser app
 * import { audiotool } from "@audiotool/nexus"
 * const at = await audiotool({...})
 * if (at.status === "authenticated") {
 *   const projects = await at.projects.listProjects({})
 *   const doc = await at.open(projects.projects[0].name)
 * }
 *
 * // Node.js app (with tokens from browser OAuth)
 * import { createAudiotoolClient, createServerAuth } from "@audiotool/nexus"
 * import { createNodeTransport, createDiskWasmLoader } from "@audiotool/nexus/node"
 * const client = await createAudiotoolClient({
 *   auth: createServerAuth({ accessToken, refreshToken, expiresAt, clientId }),
 *   transport: createNodeTransport(),
 *   wasm: createDiskWasmLoader(),
 * })
 * const projects = await client.projects.listProjects({})
 * ```
 */
export type AudiotoolClient = {
  /**
   * Open a project for real-time collaboration.
   *
   * Returns a {@link SyncedDocument} that syncs with the Audiotool backend.
   * Call {@link SyncedDocument.start} to begin syncing and {@link SyncedDocument.stop}
   * when done.
   *
   * @param project - The project to open. Can be a project URL, UUID, or name.
   *
   * @example
   * ```typescript
   * const doc = await client.open("https://beta.audiotool.com/studio?project=abc123")
   * await doc.start()
   * // ... work with the document
   * await doc.stop()
   * ```
   */
  open: (project: string) => Promise<SyncedDocument>

  /** Lookup, create, and delete projects. */
  projects: RetryingClient<typeof ProjectService>

  /** Add collaborators to your projects. */
  projectRoles: RetryingClient<typeof ProjectRoleService>

  /** Lookup users. */
  users: RetryingClient<typeof UserService>

  /** Lookup and upload samples. */
  samples: RetryingClient<typeof SampleService>

  /** Work with presets - get, apply, and manage device presets. */
  presets: PresetUtil

  /** Manage audio graphs (waveform plots for samples). */
  audioGraph: RetryingClient<typeof AudiographService>

  /**
   * Fetch with authorization headers included.
   * Never throws - returns Error on failure.
   */
  authorizedFetch: NeverThrowingFetch

  /**
   * Fetch without authorization.
   * Never throws - returns Error on failure.
   */
  fetch: NeverThrowingFetch
}

/**
 * Internal client creation function used by both audiotool() and createAudiotoolClient().
 * @internal
 */
export const createAudiotoolClientInternal = async ({
  getToken,
  transportFactory,
}: {
  getToken: () => Promise<string>
  transportFactory: TransportFactory
}): Promise<AudiotoolClient> => {
  // Create the RPC transport
  const rpcTransport = await transportFactory.createTransport({
    baseUrl: "https://rpc.audiotool.com/",
    useBinaryFormat: false,
    typeRegistry: createRegistry(Preset),
    getToken,
  })

  // Create service clients
  const projects = createRetryingPromiseClient(ProjectService, rpcTransport)
  const projectRoles = createRetryingPromiseClient(
    ProjectRoleService,
    rpcTransport,
  )
  const users = createRetryingPromiseClient(UserService, rpcTransport)
  const samples = createRetryingPromiseClient(SampleService, rpcTransport)
  const presets = createPresetUtil(rpcTransport)
  const audioGraph = createRetryingPromiseClient(
    AudiographService,
    rpcTransport,
  )

  const authorizedFetch = async (
    input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response | Error> => {
    return neverThrowingFetch(input, {
      credentials: "omit",
      ...init,
    })
  }

  return {
    projects,
    projectRoles,
    users,
    samples,
    presets,
    audioGraph,
    authorizedFetch,
    fetch: neverThrowingFetch,

    open: async (project) => {
      const projectName = extractProjectName(project)
      const document = await createOnlineDocument(
        projects,
        projectName,
        getToken,
        transportFactory,
      )
      return document
    },
  }
}

/**
 * Create an Audiotool client with explicit auth and transport configuration.
 *
 * Use this for Node.js scripts, server-side code, or when you need manual control
 * over authentication and transport.
 *
 * For browser apps with OAuth, use `audiotool()` instead - it's simpler and handles
 * the OAuth flow automatically.
 *
 * @example
 * ```typescript
 * // Node.js with server auth (tokens from browser OAuth)
 * import { createAudiotoolClient, createServerAuth } from "@audiotool/nexus"
 * import { createNodeTransport, createDiskWasmLoader } from "@audiotool/nexus/node"
 *
 * const client = await createAudiotoolClient({
 *   auth: createServerAuth({ accessToken, refreshToken, expiresAt, clientId }),
 *   transport: createNodeTransport(),
 *   wasm: createDiskWasmLoader(),
 * })
 *
 * // List projects (flat API)
 * const projects = await client.projects.listProjects({})
 *
 * // Open a project for editing
 * const doc = await client.open(projects.projects[0].name)
 * await doc.start()
 * ```
 *
 * @see {@link audiotool} for browser apps with OAuth
 */
export const createAudiotoolClient = async ({
  auth,
  transport,
  wasm,
}: {
  /**
   * Authentication provider or PAT string.
   * - String: treated as a Personal Access Token
   * - AuthProvider: custom auth provider (e.g., from createPATAuth, createServerAuth)
   */
  auth: string | AuthProvider
  /**
   * Transport factory for making RPC calls.
   * - For Node.js: use `createNodeTransport()` from `@audiotool/nexus/node`
   * - For browser: can be omitted (defaults to browser transport)
   */
  transport?: TransportFactory
  /**
   * WASM loader for loading the document validator.
   * - For Node.js/Bun/Deno: use `createDiskWasmLoader()` from `@audiotool/nexus/node`
   * - For browser: can be omitted (defaults to fetch-based loader)
   */
  wasm?: WasmLoader
}): Promise<AudiotoolClient> => {
  const authProvider = typeof auth === "string" ? createPATAuth(auth) : auth
  const transportFactory = transport ?? createBrowserTransportFactory()

  // Initialize WASM loader if provided
  if (wasm) {
    initWasmLoader(wasm)
  }

  return createAudiotoolClientInternal({
    getToken: () => authProvider.getToken(),
    transportFactory,
  })
}

export const extractProjectName = (project: string) => {
  const projectId = extractUuid(project)
  if (projectId instanceof Error) {
    throw new Error(
      `couldn't extract project uuid from string: ${project}, should be URL/UUID/project name`,
    )
  }

  return `projects/${projectId}`
}
