import { createAudiotoolClient } from "@audiotool/nexus"
import { throw_ } from "@audiotool/nexus/utils"
import { sys } from "typescript"

// This file tests if document.stop() works as expected, which means in particular,
// if all pending promises are resolved before a timeout is hit. For example,
// ping loops, sync loops must all be terminated; if they aren't, the bun process
// will hang and use memory forever.

// This test is the final integration test that tests if document.stop() works as expected.
// We don't use that in the DAW itself since that one never terminates - this is the replacement
// for that.

const client = await createAudiotoolClient({
  authorization: Bun.env.AT_PAT ?? throw_("AT_PAT is not set"),
})

const nexus = await client.createSyncedDocument({
  project: Bun.env.PROJECT_ID ?? throw_("PROJECT_ID is not set"),
})

await nexus.start()
await nexus.stop()

// if this timeout is hit, the test failed
setTimeout(() => {
  console.error(
    "stop didn't result in process exiting, something's still happening",
  )
  sys.exit(1)
}, 1000)
  // unref the timeout, which will cause it to not block the process from exiting -
  // thus the timeout will execute exactly if bun thinks it shouldn't end the process
  // for 1 second.
  //
  // I haven't found a more reliable way to test this or even figure out _what_ hangs
  // if the process doesn't close, but if this works we should be good to go.
  .unref()

console.debug("done")
