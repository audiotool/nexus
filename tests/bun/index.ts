import { createAudiotoolClient } from "@audiotool/nexus"
import { throw_ } from "@audiotool/nexus/utils"

// import something from api
import { ProjectService } from "@audiotool/nexus/api"
ProjectService

// import something from entities
import type { Tonematrix } from "@audiotool/nexus/entities"
type _T = Tonematrix

// Example usage
console.debug("creating client")
const client = await createAudiotoolClient({
  authorization: Bun.env.AT_PAT ?? throw_("AT_PAT is not set"),
})

console.debug("creating nexus")

const nexus = await client.createSyncedDocument({
  project: Bun.env.PROJECT_ID ?? throw_("PROJECT_ID is not set"),
})

nexus.events.onCreate("tonematrix", () => {
  console.debug("tonematrix created")
})

console.debug("starting nexus")
await nexus.start()

console.debug("modifying nexus")
await nexus.modify((t) => {
  t.create("tonematrix", {})
})

console.debug("stopping nexus")
await nexus.stop()

console.debug("done")
