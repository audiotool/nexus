import { createAudiotoolClient } from "@audiotool/nexus"
import { throw_ } from "@audiotool/nexus/utils"

console.debug("HELLO")
// Example usage
const client = await createAudiotoolClient({
  authorization: import.meta.env.AT_PAT ?? throw_("AT_PAT is not set"),
})

const project = await client.api.projectService.createProject({
  project: {
    displayName: "Test - remove",
  },
})
if (project instanceof Error) {
  throw project
}

const nexus = await client.createSyncedDocument({
  mode: "online",
  project: project.project?.name ?? throw_("couldn't find project"),
})

nexus.events.onCreate("tonematrix", () => {
  console.debug("tonematrix created")
})

await nexus.start()

await nexus.modify((t) => {
  t.create("tonematrix", {})
})

client.api.projectService.deleteProject({
  name: project.project?.name ?? throw_("couldn't find project"),
})
