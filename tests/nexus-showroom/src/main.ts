/**
 * Nexus Showroom - Main Entry Point
 *
 * This showcases the Audiotool Nexus SDK capabilities.
 */

import type { AuthenticatedClient, SyncedDocument } from "@audiotool/nexus"
import { audiotool } from "@audiotool/nexus"
import { subscribeToProjectStats, type ProjectStats } from "./sdk"
import {
  $,
  clear,
  el,
  renderDrumExample,
  renderLoginSection,
  renderMelodyExample,
  renderProjectSelector,
  renderSampleInsertExample,
  renderSampleUploadExample,
  renderStatsSection,
  renderUserBar,
  status,
} from "./ui"

const CLIENT_ID = "44409854-1d9a-4e3c-af4d-01b6e3b6dd8b"
// Derive the redirect URL from the current origin + Vite's configured base so
// the same build works locally (http://127.0.0.1:5173/) and when deployed to
// GitHub Pages (https://audiotool.github.io/nexus-sdk/).
const REDIRECT_URL = new URL(import.meta.env.BASE_URL, window.location.origin)
  .href

async function main() {
  const app = $("#app")
  if (!app) return

  const at = await audiotool({
    clientId: CLIENT_ID,
    redirectUrl: REDIRECT_URL,
    scope: "project:write sample:write",
  })

  if (at.status === "unauthenticated") {
    if (at.error) {
      app.appendChild(
        status(`Authentication error: ${at.error.message}`, "error"),
      )
    }
    app.appendChild(renderLoginSection(() => at.login()))
    return
  }

  app.appendChild(renderUserBar(at.userName, () => at.logout()))

  // If the URL has ?project=<uuid>, jump straight into that project so a reload
  // brings the user back to the same place.
  const projectFromUrl = getProjectFromUrl()
  if (projectFromUrl) {
    openProject(at, projectFromUrl)
    return
  }

  app.appendChild(
    renderProjectSelector(at, (projectName) => openProject(at, projectName)),
  )
}

const PROJECT_QUERY_PARAM = "project"

function getProjectFromUrl(): string | null {
  const value = new URL(window.location.href).searchParams.get(
    PROJECT_QUERY_PARAM,
  )
  return value && value.trim() ? value.trim() : null
}

/** Extract the UUID from a DAW URL like "https://...studio?project=<uuid>". */
function projectIdFromDawUrl(dawUrl: string): string | null {
  try {
    return new URL(dawUrl).searchParams.get(PROJECT_QUERY_PARAM)
  } catch {
    return null
  }
}

function setProjectParam(projectId: string) {
  const url = new URL(window.location.href)
  if (url.searchParams.get(PROJECT_QUERY_PARAM) === projectId) return
  url.searchParams.set(PROJECT_QUERY_PARAM, projectId)
  window.history.replaceState({}, "", url.toString())
}

function clearProjectParam() {
  const url = new URL(window.location.href)
  if (!url.searchParams.has(PROJECT_QUERY_PARAM)) return
  url.searchParams.delete(PROJECT_QUERY_PARAM)
  window.history.replaceState({}, "", url.toString())
}

async function openProject(
  client: AuthenticatedClient,
  projectNameOrUrl: string,
) {
  const app = $("#app")
  if (!app) return

  clear(app)
  app.appendChild(renderUserBar(client.userName, () => client.logout()))
  app.appendChild(el("div", {}, ["Opening project..."]))

  let doc: SyncedDocument
  let projectStats: ProjectStats

  try {
    doc = await client.open(projectNameOrUrl)
    // Set up the live stats listeners BEFORE start(): start() will dispatch
    // an onCreate event for every entity that already exists in the project.
    projectStats = subscribeToProjectStats(doc)
    await doc.start()
  } catch (err) {
    // Bad URL/UUID in the address bar would re-fail forever on reload; clear it.
    clearProjectParam()
    clear(app)
    app.appendChild(renderUserBar(client.userName, () => client.logout()))
    app.appendChild(status(`Failed to open project: ${err}`, "error"))
    app.appendChild(
      renderProjectSelector(client, (name) => openProject(client, name)),
    )
    return
  }

  // Pin the project UUID in the URL so reloading lands on the same project.
  const projectId = projectIdFromDawUrl(doc.dawUrl)
  if (projectId) setProjectParam(projectId)

  clear(app)
  app.appendChild(renderUserBar(client.userName, () => client.logout()))

  app.appendChild(renderStatsSection(projectStats, doc.dawUrl))

  app.appendChild(
    el("div", { className: "divider" }, [
      el("p", {}, ["Below here, your project will be modified"]),
    ]),
  )

  app.appendChild(renderDrumExample(client, doc))
  app.appendChild(renderMelodyExample(client, doc))
  app.appendChild(renderSampleUploadExample(client, doc))
  app.appendChild(renderSampleInsertExample(client, doc))
}

main().catch((err) => {
  console.error("Fatal error:", err)
  const app = $("#app")
  if (app) {
    app.appendChild(status(`Fatal error: ${err}`, "error"))
  }
})
