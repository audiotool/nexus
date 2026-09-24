/**
 * Node.js sample upload example
 *
 * Demonstrates:
 * - Uploading a sample from a local file
 * - Graceful shutdown with SIGINT/SIGTERM handling
 * - Proper cleanup to avoid rate limit issues
 *
 * IMPORTANT: If you stop uploading a file without proper cleanup, your user
 * will have their rate limit reduced by 1 slot until the upload is cancelled
 * automatically, which happens only within 24 hours.
 *
 * Run with: npm start
 * Or directly: npx tsx src/main.ts
 *
 * Environment variables:
 *   PAT          - Your Personal Access Token (required)
 *   AUDIO_FILE   - Path to audio file (defaults to a test tone)
 */

import { createAudiotoolClient } from "@audiotool/nexus"
import { createDiskWasmLoader } from "@audiotool/nexus/node"
import { readFileSync } from "node:fs"

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    console.error(`Missing required environment variable: ${name}`)
    process.exit(1)
  }
  return value
}

async function main() {
  const pat = requireEnv("PAT")
  const audioFilePath = process.env.AUDIO_FILE

  console.log("Sample Upload Example (Node.js)")
  console.log("================================\n")

  // Create an AbortController for graceful shutdown
  const controller = new AbortController()
  let isShuttingDown = false

  // Handle process signals for graceful shutdown
  const shutdown = () => {
    if (isShuttingDown) {
      console.log("\nForce exiting...")
      process.exit(1)
    }
    isShuttingDown = true
    console.log("\nReceived shutdown signal, cancelling upload...")
    controller.abort()
  }

  process.on("SIGINT", shutdown)
  process.on("SIGTERM", shutdown)

  console.log("Creating client...")
  const client = await createAudiotoolClient({
    auth: pat,
    wasm: createDiskWasmLoader(),
  })

  // Load audio file or create a simple test buffer
  let audioBuffer: ArrayBuffer
  let displayName: string

  if (audioFilePath) {
    console.log(`Loading audio file: ${audioFilePath}`)
    const fileBuffer = readFileSync(audioFilePath)
    audioBuffer = fileBuffer.buffer.slice(
      fileBuffer.byteOffset,
      fileBuffer.byteOffset + fileBuffer.byteLength,
    )
    displayName = audioFilePath.split("/").pop()?.replace(/\.[^.]+$/, "") ?? "Upload"
  } else {
    // Create a simple WAV file with a sine wave for testing
    console.log("No AUDIO_FILE specified, creating test tone...")
    audioBuffer = createTestWav()
    displayName = "Node.js Test Tone"
  }

  console.log(`\nUploading "${displayName}"...`)
  console.log("(Press Ctrl+C to cancel)\n")

  const upload = await client.samples.upload(
    {
      file: audioBuffer,
      displayName,
      tags: ["example", "node-upload"],
    },
    controller.signal,
  )

  if (upload instanceof Error) {
    console.error("Failed to create sample:", upload.message)
    process.exit(1)
  }

  console.log(`Sample created: ${upload.name}`)
  console.log("Waiting for server processing...")

  const result = await upload.ready

  if (result instanceof Error) {
    if (result.message.includes("aborted")) {
      console.log("\nUpload was cancelled. Cleanup was performed automatically.")
    } else {
      console.error("\nUpload failed:", result.message)
    }
    process.exit(1)
  }

  console.log("\nUpload complete!")
  console.log(`  Name: ${result.name}`)
  console.log(`  Display Name: ${result.displayName}`)
  console.log(`  Duration: ${result.durationSeconds.toFixed(2)}s`)
  console.log(`  FLAC URL: ${result.flacUrl}`)
  console.log(`  WAV URL: ${result.wavUrl}`)

  // Clean up signal handlers
  process.off("SIGINT", shutdown)
  process.off("SIGTERM", shutdown)
}

/**
 * Creates a simple WAV file with a 440Hz sine wave for testing
 */
function createTestWav(): ArrayBuffer {
  const sampleRate = 44100
  const duration = 1 // 1 second
  const frequency = 440 // A4
  const numSamples = sampleRate * duration
  const numChannels = 1
  const bitsPerSample = 16
  const bytesPerSample = bitsPerSample / 8
  const blockAlign = numChannels * bytesPerSample
  const dataSize = numSamples * blockAlign
  const fileSize = 44 + dataSize

  const buffer = new ArrayBuffer(fileSize)
  const view = new DataView(buffer)

  // RIFF header
  writeString(view, 0, "RIFF")
  view.setUint32(4, fileSize - 8, true)
  writeString(view, 8, "WAVE")

  // fmt chunk
  writeString(view, 12, "fmt ")
  view.setUint32(16, 16, true) // chunk size
  view.setUint16(20, 1, true) // audio format (PCM)
  view.setUint16(22, numChannels, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * blockAlign, true)
  view.setUint16(32, blockAlign, true)
  view.setUint16(34, bitsPerSample, true)

  // data chunk
  writeString(view, 36, "data")
  view.setUint32(40, dataSize, true)

  // Write sine wave samples
  const amplitude = 0.5 * 32767
  for (let i = 0; i < numSamples; i++) {
    const sample = Math.sin((2 * Math.PI * frequency * i) / sampleRate)
    view.setInt16(44 + i * bytesPerSample, sample * amplitude, true)
  }

  return buffer
}

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i))
  }
}

main().catch((err) => {
  console.error("Fatal error:", err)
  process.exit(1)
})
