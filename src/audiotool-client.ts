import type { getLoginStatus } from "src/login-status"
import { AudiotoolAPI, createAudiotoolAPI } from "./api/audiotool-api"
import { createOnlineDocument, SyncedDocument } from "./synced-document"
import { extractUuid } from "./utils/extract-uuid"

export type { SyncedDocument }

/**
 * An instance of the client that's authorized to make calls on a use's behalf.
 *
 * Lets you create synced documents and make API calls to the audiotool backend.
 *
 * Use {@link getLoginStatus} to get authorized to make calls on a user's behalf.
 *
 * @example
 * ```typescript
 * const status = await getLoginStatus({...})
 * if (status.loggedIn){
 *   const client = await createAudiotoolClient({authorization: status});
 * } else {
 *   console.error("User is not logged in");
 * }
 * ```
 */
export type AudiotoolClient = {
  /**
   * Create a synced document instance for real-time collaboration.
   *
   * **NOTE:** Can currently only create one synced document per tab.
   *
   * @param opts Configuration for the document connection
   * @returns Promise resolving to a SyncedDocument instance
   */
  createSyncedDocument: (opts: {
    /** The project to sync to; this can be anything containing a project's UUID, e.g. the URL of the studio
     * when the project is open in the browser.
     */
    project: string
  }) => Promise<SyncedDocument>

  /**
   * Collection of Audiotool API service clients.
   *
   * Provides access to all Audiotool services including projects, users, samples, presets, and more.
   * All services use retrying clients that handle network issues gracefully.
   */
  api: AudiotoolAPI
}

/**
 * Create the main Audiotool client instance.
 *
 * This is the primary entry point to interact with the audiotool backend.
 *
 * See {@link getLoginStatus} for how to authorize the client.
 *
 * @example
 * ```typescript
 * // Basic setup
 * import { createAudiotoolClient } from "@audiotool/nexus";
 *
 *
 * // create client
 * const client = await createAudiotoolClient({authorization: status});
 *
 * // Connect to an online project
 * const document = await client.createSyncedDocument({
 *   mode: "online",
 *   project: "https://beta.audiotool.com/studio?project=abc123"
 * });
 *
 * await document.start();
 * ```
 *
 * @example API usage
 * ```typescript
 * // Access API services
 * const client = await createAudiotoolClient({authorization: status});
 *
 * // List projects
 * const projects = await client.api.projectService.listProjects({});
 * ```
 *
 * @see {@link AudiotoolClient} for the client interface
 * @see {@link SyncedDocument} for document manipulation
 * @see {@link AudiotoolAPI} for available API services
 */
export const createAudiotoolClient = async ({
  authorization: authorization,
}: {
  /**
   * The token provider used to generate authorization tokens to authenticate against the API.
   *
   * This could be:
   * * the return value of {@link getLoginStatus}, if it returns the user is logged in
   * * a constant authorization token as a string (e.g. the PAT from https://developer.audiotool.com/personal-access-tokens)
   * */
  authorization: string | { getToken: () => Promise<string | Error> }
}): Promise<AudiotoolClient> => {
  // wrap the token provider in a function that adds the bearer prefix if needed
  const getToken = async () => {
    if (typeof authorization === "string") {
      return addBearerPrefix(authorization)
    }
    const tokenValue = await authorization.getToken()
    if (tokenValue instanceof Error) {
      throw new Error("Failed to get authentication token", {
        cause: tokenValue,
      })
    }
    return addBearerPrefix(tokenValue)
  }

  const api = await createAudiotoolAPI(getToken)
  return {
    api,
    createSyncedDocument: async ({ project }) => {
      const projectName = extractProjectName(project)
      const document = await createOnlineDocument(api, projectName, getToken)
      return document
    },
  }
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

const addBearerPrefix = (token: string) => {
  return token.startsWith("Bearer") ? token : `Bearer ${token}`
}
