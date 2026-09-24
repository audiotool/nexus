/**
 * One-off Node script that uploads the showroom preset MP3s to the backend
 * and prints a `PRESET_SAMPLE_IDS` constant ready to paste into
 * `src/ui/example-sample-upload.ts`. Re-uploads are idempotent at the API
 * level (each call creates a new sample id), so only run this when you
 * actually want fresh ids.
 *
 * Usage:
 *
 *   AUDIOTOOL_API_TOKEN=at_pat_... npx tsx scripts/upload-presets.ts
 */

import { createAudiotoolClient } from "@audiotool/nexus"
import { createDiskWasmLoader, createNodeTransport } from "@audiotool/nexus/node"
import { readFileSync } from "node:fs"
import { basename, dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const PRESET_FILES = [
  "loop-1-bar-120bpm.mp3",
  "loop-4bar-125bpm-distinct.mp3",
  "phraser-3bar-130bpm.mp3",
  "pad-ambient.mp3",
  "groovy-120bpm.mp3",
] as const

const BPM_BY_FILE: Record<string, number | undefined> = {
  "loop-1-bar-120bpm.mp3": 120,
  "loop-4bar-125bpm-distinct.mp3": 125,
  "phraser-3bar-130bpm.mp3": 130,
  "pad-ambient.mp3": undefined,
  "groovy-120bpm.mp3": 120,
}

async function main(): Promise<void> {
  const token = process.env["AUDIOTOOL_API_TOKEN"]
  if (token === undefined || token === "") {
    throw new Error("AUDIOTOOL_API_TOKEN env var is required")
  }

  const here = dirname(fileURLToPath(import.meta.url))
  const samplesDir = join(here, "..", "public", "samples")

  const client = await createAudiotoolClient({
    auth: token,
    transport: createNodeTransport(),
    wasm: createDiskWasmLoader(),
  })

  const results: Array<{ file: string; meta: { name: string } }> = []
  for (const file of PRESET_FILES) {
    const filePath = join(samplesDir, file)
    const bytes = readFileSync(filePath)
    const blob = new Blob([new Uint8Array(bytes)], { type: "audio/mpeg" })
    const id = basename(file, ".mp3")
    const displayName = `Nexus Showroom · ${id}`

    process.stdout.write(`Uploading ${file}... `)
    const upload = await client.samples.upload({
      file: blob,
      displayName,
      description: "Pre-uploaded preset for the Nexus Showroom",
      visibility: "unlisted",
      tags: ["showroom"],
      bpm: BPM_BY_FILE[file],
      kind: "loop",
    })
    if (upload instanceof Error) {
      throw upload
    }
    const meta = await upload.ready
    if (meta instanceof Error) {
      throw meta
    }
    process.stdout.write(`${meta.name}\n`)
    results.push({ file: id, meta })
  }

  process.stdout.write("\n// Paste into example-sample-upload.ts:\n")
  process.stdout.write("export const PRESET_SAMPLE_IDS = {\n")
  for (const { file, meta } of results) {
    process.stdout.write(`  "${file}": "${meta.name}",\n`)
  }
  process.stdout.write("} as const\n")

  process.exit(0)
}

main().catch((err) => {
  process.stderr.write(`${err instanceof Error ? err.stack ?? err.message : String(err)}\n`)
  process.exit(1)
})
