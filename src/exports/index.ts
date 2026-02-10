/**
 * @packageDocumentation
 *
 * # Audiotool Nexus SDK
 *
 * The main entry point for the Audiotool Nexus SDK. This package enables real-time
 * collaboration and document manipulation for Audiotool projects.
 *
 * ## Quick Start
 *
 * ```typescript
 * import { createAudiotoolClient } from "@audiotool/nexus";
 *
 * // Create client and set authentication
 * const client = await createAudiotoolClient({pat: "at_pat_your_token_here"});
 *
 * // Connect to a project
 * const document = await client.createSyncedDocument({
 *   mode: "online",
 *   project: "https://beta.audiotool.com/studio?project=abc123"
 * });
 *
 * await document.start();
 *
 * // Access API services
 * const projects = await client.api.projectService.listProjects({});
 * ```
 */

export {
  createAudiotoolClient,
  type AudiotoolClient,
} from "../audiotool-client"
export type { SyncedDocument } from "../synced-document"

export { getLoginStatus, type LoginStatus } from "../login-status"

export { createOfflineDocument } from "../synced-document"
export type { OfflineDocument } from "../synced-document"
