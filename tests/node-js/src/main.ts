import { createAudiotoolClient } from "@audiotool/nexus"
import { throw_ } from "@audiotool/nexus/utils"

const PAT = process.env.AT_PAT ?? throw_("AT_PAT is required")
const projectId = `projects/${
  process.env.PROJECT_ID ??
  throw_(
    "PROJECT_ID is required, set to the UUID of the project you want to open",
  )
}`

const client = await createAudiotoolClient({
  authorization: PAT,
})

const nexus = await client.createSyncedDocument({
  project: projectId,
})

await nexus.start()

console.debug(
  "connected and started nexus - waiting for connection to be established",
)

let c = 0
await new Promise((resolve) => {
  const interval = setInterval(() => {
    const connected = nexus.connected.getValue()
    console.debug("connected: ", connected)
    c++
    if (connected) {
      clearInterval(interval)
      resolve(true)
    } else if (c > 10) {
      console.error("connection not established after 10 seconds")
      process.exit(1)
    }
  }, 1000)
})

await nexus.stop()
console.debug("done, shutting down")
