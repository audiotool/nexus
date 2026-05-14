import { createAudiotoolClient, createPATAuth } from "@audiotool/nexus"
import { throw_ } from "@audiotool/nexus/utils"
import { createDiskWasmLoader, createNodeTransport } from "../../../dist/node"

const PAT = process.env.AT_PAT ?? throw_("AT_PAT is required")
const projectId = `projects/${
  process.env.PROJECT_ID ??
  throw_(
    "PROJECT_ID is required, set to the UUID of the project you want to open",
  )
}`

import { readFileSync } from "fs"

const client = await createAudiotoolClient({
  auth: createPATAuth(PAT),
  transport: createNodeTransport(),
  wasm: createDiskWasmLoader(),
})

console.debug(process.cwd())

const groove = readFileSync("./groovy-120bpm.mp3")
console.debug("starting upload...")

const upload = await client.samples.upload({
  displayName: "groove",
  file: new Blob([groove], { type: "audio/mpeg" }),
  visibility: "unlisted",
})

if (upload instanceof Error) {
  console.error("failed to upload:", upload.message)
  process.exit(1)
}

console.debug("upload phase 1:", upload)

const uploaded = await upload.uploaded

if (uploaded instanceof Error) {
  console.error("failed to upload:", uploaded.message)
  process.exit(1)
}

console.debug("upload phase 2:", uploaded)

const ready = await upload.ready
if (ready instanceof Error) {
  console.error("failed to upload:", ready.message)
  process.exit(1)
}

console.debug("upload phase 3:", ready)

console.debug("done, shutting down")
process.exit(0)
