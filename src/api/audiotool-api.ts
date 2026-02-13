import { createRegistry } from "@bufbuild/protobuf"
import { AudiographService } from "@gen/audiograph/v1/audiograph_service_connect"
import { Preset } from "@gen/document/v1/preset/v1/preset_pb"
import { ProjectRoleService } from "@gen/project/v1/project_role_service_connect"
import { ProjectService } from "@gen/project/v1/project_service_connect"
import { SampleService } from "@gen/sample/v1/sample_service_connect"
import { UserService } from "@gen/user/v1/user_service_connect"
import {
  neverThrowingFetch,
  NeverThrowingFetch,
} from "@utils/fetch/never-throwing-fetch"
import { createAuthorizedKeepaliveTransport } from "@utils/grpc/keepalive-transport"
import {
  createRetryingPromiseClient,
  RetryingClient,
} from "@utils/grpc/retrying-client"
import { createPresetUtil, PresetUtil } from "./preset-utils"

/**
 * Some services generated from the protobuf definitions at https://developer.audiotool.com/explore-protobufs.
 *
 * These are APIs of backend services of various parts of the audiotool infrastructure other than the
 * document services.
 * They let you make calls such as:
 * * create a project
 * * get user information
 *
 * Etc. See [API](../docs/api.md) for an overview.
 */
export type AudiotoolAPI = {
  /** Lookup users. */
  userService: RetryingClient<typeof UserService>

  /** Lookup, create and delete projects. */
  projectService: RetryingClient<typeof ProjectService>

  /** Add collaborators to your projects.  */
  projectRoleService: RetryingClient<typeof ProjectRoleService>

  /** Lookup and upload samples. */
  sampleService: RetryingClient<typeof SampleService>

  presets: PresetUtil

  /** Manage audio "graphs", i.e. plots of audio samples, as used in the sample browser. */
  audioGraphService: RetryingClient<typeof AudiographService>

  /** Same as `window.fetch`, but
   * - never throws, instead returns an error
   * - includes headers & settings for authorization
   */
  authorizedFetch: NeverThrowingFetch

  /** Same as `window.fetch`, but never throws, instead returns an error.
   */
  fetch: NeverThrowingFetch
}

export const createAudiotoolAPI = async (
  getToken: () => Promise<string>,
  prismaUrl?: string,
): Promise<AudiotoolAPI> => {
  const prismaTransport = await createAuthorizedKeepaliveTransport({
    baseUrl: prismaUrl ?? "https://rpc.audiotool.com/",
    useBinaryFormat: false,
    typeRegistry: createRegistry(Preset),
    getToken,
  })
  const projectService = createRetryingPromiseClient(
    ProjectService,
    prismaTransport,
  )

  const userService = createRetryingPromiseClient(UserService, prismaTransport)

  const projectRoleService = createRetryingPromiseClient(
    ProjectRoleService,
    prismaTransport,
  )

  const presets = createPresetUtil(prismaTransport)

  const sampleService = createRetryingPromiseClient(
    SampleService,
    prismaTransport,
  )

  const audioGraphService = createRetryingPromiseClient(
    AudiographService,
    prismaTransport,
  )

  const authorizedFetch = async (
    input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response | Error> => {
    let requestInput = input

    return neverThrowingFetch(requestInput, {
      credentials: "omit",
      ...init,
    })
  }

  return {
    authorizedFetch,
    fetch: neverThrowingFetch,
    userService,
    projectService,
    projectRoleService,
    sampleService,
    presets,
    audioGraphService,
  }
}
