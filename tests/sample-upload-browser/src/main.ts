/**
 * Browser sample upload example
 *
 * Demonstrates:
 * - Uploading a sample with the high-level API
 * - Using AbortController for cancellation
 * - Using preventTabClose to warn before leaving
 * - Automatic cleanup on page unload (built into the SDK)
 *
 * Run with: npm run dev
 */

import { createAudiotoolClient } from "@audiotool/nexus"

const patInput = document.getElementById("pat") as HTMLInputElement
const fileInput = document.getElementById("file") as HTMLInputElement
const nameInput = document.getElementById("name") as HTMLInputElement
const preventCloseCheckbox = document.getElementById(
  "preventClose",
) as HTMLInputElement
const uploadButton = document.getElementById("upload") as HTMLButtonElement
const cancelButton = document.getElementById("cancel") as HTMLButtonElement
const statusDiv = document.getElementById("status") as HTMLDivElement

let currentController: AbortController | null = null

function log(message: string) {
  statusDiv.textContent += `\n${new Date().toISOString().slice(11, 19)} ${message}`
  statusDiv.scrollTop = statusDiv.scrollHeight
}

uploadButton.addEventListener("click", async () => {
  const pat = patInput.value.trim()
  if (!pat) {
    log("ERROR: Please enter a PAT")
    return
  }

  const file = fileInput.files?.[0]
  if (!file) {
    log("ERROR: Please select an audio file")
    return
  }

  const displayName = nameInput.value.trim() || file.name.replace(/\.[^.]+$/, "")
  const preventTabClose = preventCloseCheckbox.checked

  statusDiv.textContent = "Starting upload..."
  uploadButton.disabled = true
  cancelButton.disabled = false

  currentController = new AbortController()

  try {
    log("Creating client...")
    const client = await createAudiotoolClient({ auth: pat })

    log(`Uploading "${displayName}"...`)
    log(`preventTabClose: ${preventTabClose}`)

    const upload = await client.samples.upload(
      {
        file,
        displayName,
        tags: ["example", "browser-upload"],
        preventTabClose,
      },
      currentController.signal,
    )

    if (upload instanceof Error) {
      log(`ERROR creating sample: ${upload.message}`)
      return
    }

    log(`Sample created: ${upload.name}`)
    log("Waiting for processing...")

    const result = await upload.ready

    if (result instanceof Error) {
      log(`ERROR: ${result.message}`)
    } else {
      log("Upload complete!")
      log(`  Name: ${result.name}`)
      log(`  Duration: ${result.durationSeconds.toFixed(2)}s`)
      log(`  WAV URL: ${result.wavUrl}`)
      log(`  FLAC URL: ${result.flacUrl}`)
    }
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      log("Upload cancelled by user")
    } else {
      log(`ERROR: ${err}`)
    }
  } finally {
    uploadButton.disabled = false
    cancelButton.disabled = true
    currentController = null
  }
})

cancelButton.addEventListener("click", () => {
  if (currentController) {
    log("Cancelling upload...")
    currentController.abort()
  }
})
