/**
 * Upload-and-download sample example UI (Example 3).
 *
 * Layout:
 *
 * 1. "How to obtain a SampleMeta" intro — two collapsible code panes.
 * 2. **Upload demo** — uploads one short preset, then exposes the resulting
 *    SampleMeta with code snippets (read metadata, fetch the audio Blob,
 *    insert it) plus play/insert buttons.
 */

import type { AuthenticatedClient, SyncedDocument } from "@audiotool/nexus"
import type { SampleMeta } from "@audiotool/nexus/api"
import { button, el, status } from "./elements"
import { highlightTs } from "./highlight"

/** Filename (without extension) of the sample uploaded by the upload demo. */
const UPLOAD_DEMO_FILE = "loop-1-bar-120bpm"
// Vite rewrites BASE_URL at build time so this works both locally (`/`) and
// under a sub-path on GitHub Pages (`/nexus-sdk/`).
const UPLOAD_DEMO_URL = `${import.meta.env.BASE_URL}samples/${UPLOAD_DEMO_FILE}.mp3`

export function renderSampleUploadExample(
  client: AuthenticatedClient,
  doc: SyncedDocument,
): HTMLElement {
  const container = el("div", { className: "example" }, [
    el("span", { className: "example-badge" }, ["Example 3"]),
    el("h3", {}, ["Uploading and downloading samples"]),
    el("p", {}, [
      "Upload a local file, get it back as a SampleMeta, then download " +
        "the audio Blob — or insert it straight on the timeline.",
    ]),
    renderMetaExplainer(),
    renderUploadDemo(client, doc),
  ])

  const statusContainer = el("div", { className: "scenario-status" })
  container.appendChild(statusContainer)
  const setStatus = (
    message: string,
    kind: "info" | "success" | "error",
  ): void => {
    statusContainer.innerHTML = ""
    statusContainer.appendChild(status(message, kind))
  }
  // Expose setStatus via a custom event for descendant rows.
  container.addEventListener("scenario:status" as never, ((
    ev: CustomEvent<{ message: string; kind: "info" | "success" | "error" }>,
  ) => {
    setStatus(ev.detail.message, ev.detail.kind)
  }) as EventListener)

  return container
}

// -- Status reporting -----------------------------------------------------

function reportStatus(
  source: HTMLElement,
  message: string,
  kind: "info" | "success" | "error",
): void {
  source.dispatchEvent(
    new CustomEvent("scenario:status", {
      detail: { message, kind },
      bubbles: true,
    }),
  )
}

// -- Meta explainer -------------------------------------------------------

const META_BY_ID = `// Fetch a sample you already know the name of:
const meta = await client.samples.get("samples/my-sample-id")
if (meta instanceof Error) throw meta
// \`meta\` is a SampleMeta you can pass to t.insertSample(meta, ...)`

const META_BY_UPLOAD = `// Upload a Blob / File and wait for the server to finish processing it:
const upload = await client.samples.upload({
  file,
  displayName: "My Sample",
  visibility: "unlisted",
})
if (upload instanceof Error) throw upload
const meta = await upload.ready
if (meta instanceof Error) throw meta
// \`meta\` is a SampleMeta you can pass to t.insertSample(meta, ...)`

function renderMetaExplainer(): HTMLElement {
  return el("div", { className: "scenario-intro" }, [
    renderHowtoDetails("By sample id", META_BY_ID),
    renderHowtoDetails("By uploading a local file", META_BY_UPLOAD),
  ])
}

function renderHowtoDetails(label: string, snippet: string): HTMLElement {
  const codeInner = el("code", {
    className: "language-typescript",
  }) as HTMLElement
  codeInner.innerHTML = highlightTs(snippet)
  const pre = el("pre", { className: "scenario-code" }, [codeInner])

  const details = el("details", { className: "scenario-howto" }, [
    el("summary", {}, [label]),
    pre,
  ])
  return details
}

// -- Upload demo ----------------------------------------------------------

const UPLOAD_DEMO_CODE = `// 1. Fetch the local file and upload it.
const response = await fetch("/samples/${UPLOAD_DEMO_FILE}.mp3")
const file = await response.blob()

const upload = await client.samples.upload({
  file,
  displayName: "Showroom upload demo",
  visibility: "unlisted",
})
if (upload instanceof Error) throw upload

// 2. Wait for the server to finish transcoding.
const meta = await upload.ready
if (meta instanceof Error) throw meta`

const UPLOAD_DEMO_META_CODE = `// SampleMeta exposes display name, duration, BPM, etc.
console.log(meta.displayName) // "Showroom upload demo"
console.log(meta.durationSeconds, meta.bpm)`

const UPLOAD_DEMO_DOWNLOAD_CODE = `// Need the raw audio bytes back? Use samples.download.
const audio = await client.samples.download(meta, { format: "mp3" })
if (audio instanceof Error) throw audio
// \`audio\` is a Blob you can hand to <audio>, AudioBuffer, etc.`

const UPLOAD_DEMO_INSERT_CODE = `// Drop the just-uploaded sample on the timeline.
await doc.modify((t) => t.insertSample(meta))`

function renderUploadDemo(
  client: AuthenticatedClient,
  doc: SyncedDocument,
): HTMLElement {
  const card = el("div", { className: "scenario-row scenario-row--upload" })

  card.appendChild(
    el("div", { className: "scenario-head" }, [
      el("span", { className: "scenario-id scenario-id--upload" }, ["U"]),
      el("h4", { className: "scenario-title" }, [
        `Upload and insert ${UPLOAD_DEMO_FILE}.mp3`,
      ]),
    ]),
  )
  card.appendChild(
    el("p", { className: "scenario-desc" }, [
      "Live demo of the upload flow. Click Execute to upload the short " +
        "preset above; once the server finishes transcoding, you get a " +
        "SampleMeta you can play, inspect, or insert.",
    ]),
  )
  card.appendChild(renderCodeBlock(UPLOAD_DEMO_CODE))

  const sampleIdSlot = el("div", { className: "scenario-sample-id" })
  card.appendChild(sampleIdSlot)

  const actions = el("div", { className: "scenario-actions" })

  const previewAudio = new Audio(UPLOAD_DEMO_URL)
  const previewBtn = button("Play sample", () => togglePlay(previewAudio), "secondary")
  previewBtn.classList.add("scenario-run")
  previewAudio.addEventListener("play", () => (previewBtn.textContent = "Pause"))
  previewAudio.addEventListener("pause", () => (previewBtn.textContent = "Play sample"))
  previewAudio.addEventListener("ended", () => (previewBtn.textContent = "Play sample"))
  actions.appendChild(previewBtn)

  const executeBtn = button(
    "Execute upload",
    async () => {
      executeBtn.disabled = true
      executeBtn.textContent = "Uploading..."
      reportStatus(card, "Uploading sample...", "info")
      sampleIdSlot.replaceChildren()
      try {
        const meta = await runUploadDemo(client)
        executeBtn.textContent = "Re-run upload"
        sampleIdSlot.appendChild(renderSampleIdRow(meta.name))
        renderUploadResult(actions, meta, doc, card)
        reportStatus(
          card,
          `Uploaded as ${meta.name}. Play or Insert below.`,
          "success",
        )
      } catch (err) {
        reportStatus(
          card,
          `Upload failed: ${err instanceof Error ? err.message : String(err)}`,
          "error",
        )
      } finally {
        executeBtn.disabled = false
      }
    },
    "primary",
  )
  executeBtn.classList.add("scenario-run")
  actions.appendChild(executeBtn)
  card.appendChild(actions)

  card.appendChild(
    el("div", { className: "scenario-howto-list" }, [
      renderHowtoDetails("Read metadata from the SampleMeta", UPLOAD_DEMO_META_CODE),
      renderHowtoDetails(
        "Get the audio Blob back from the backend",
        UPLOAD_DEMO_DOWNLOAD_CODE,
      ),
      renderHowtoDetails("Insert the uploaded sample", UPLOAD_DEMO_INSERT_CODE),
    ]),
  )

  return card
}

async function runUploadDemo(
  client: AuthenticatedClient,
): Promise<SampleMeta> {
  const response = await fetch(UPLOAD_DEMO_URL)
  if (!response.ok) {
    throw new Error(`Failed to load ${UPLOAD_DEMO_URL}: ${response.status}`)
  }
  const file = await response.blob()
  const upload = await client.samples.upload({
    file,
    displayName: "Showroom upload demo",
    description: "Uploaded by the Nexus Showroom upload demo",
    visibility: "unlisted",
  })
  if (upload instanceof Error) throw upload
  const meta = await upload.ready
  if (meta instanceof Error) throw meta
  return meta
}

function renderSampleIdRow(name: string): HTMLElement {
  return el("div", { className: "scenario-sample-id-row" }, [
    el("span", { className: "scenario-sample-id-label" }, ["Sample id:"]),
    el("code", { className: "scenario-sample-id-value" }, [name]),
  ])
}

function renderUploadResult(
  actions: HTMLElement,
  meta: SampleMeta,
  doc: SyncedDocument,
  source: HTMLElement,
): void {
  // Remove any previously rendered Play / Insert buttons.
  for (const oldBtn of Array.from(
    actions.querySelectorAll(".scenario-run--after-upload"),
  )) {
    oldBtn.remove()
  }

  const audio = new Audio(meta.previewMp3Url || meta.mp3Url)
  const playBtn = button(
    "Play",
    () => togglePlay(audio),
    "secondary",
  )
  playBtn.classList.add("scenario-run", "scenario-run--after-upload")
  audio.addEventListener("play", () => (playBtn.textContent = "Pause"))
  audio.addEventListener("pause", () => (playBtn.textContent = "Play"))
  audio.addEventListener("ended", () => (playBtn.textContent = "Play"))

  const insertBtn = button(
    "Insert",
    async () => {
      insertBtn.disabled = true
      insertBtn.textContent = "Inserting..."
      try {
        await doc.modify((t) => t.insertSample(meta))
        reportStatus(source, `Inserted "${meta.displayName}".`, "success")
      } catch (err) {
        reportStatus(
          source,
          `Insert failed: ${err instanceof Error ? err.message : String(err)}`,
          "error",
        )
      } finally {
        insertBtn.disabled = false
        insertBtn.textContent = "Insert"
      }
    },
    "primary",
  )
  insertBtn.classList.add("scenario-run", "scenario-run--after-upload")

  actions.appendChild(playBtn)
  actions.appendChild(insertBtn)
}

// -- Shared helpers --------------------------------------------------------

function renderCodeBlock(snippet: string): HTMLElement {
  const codeInner = el("code", {
    className: "language-typescript",
  }) as HTMLElement
  codeInner.innerHTML = highlightTs(snippet)
  return el("pre", { className: "scenario-code" }, [codeInner])
}

function togglePlay(audio: HTMLAudioElement): void {
  if (audio.paused) {
    void audio.play()
  } else {
    audio.pause()
  }
}
