import { createAudiotoolClient } from "@audiotool/nexus"
import { throw_ } from "@audiotool/nexus/utils"

// This file tests if document.stop() works as expected, which means in particular,
// if all pending promises are resolved before a timeout is hit. For example,
// ping loops, sync loops must all be terminated; if they aren't, the bun process
// will hang and use memory forever.

const client = await createAudiotoolClient({
  authorization: Bun.env.AT_PAT ?? throw_("AT_PAT is not set"),
})

const nexus = await client.createSyncedDocument({
  project: Bun.env.PROJECT_ID ?? throw_("PROJECT_ID is not set"),
})

const nexus2 = await client.createSyncedDocument({
  project: Bun.env.PROJECT_ID ?? throw_("PROJECT_ID is not set"),
})

await nexus.start()
await nexus2.start()
await nexus.stop()
await nexus2.stop()
