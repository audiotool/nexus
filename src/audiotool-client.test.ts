import { DEBUG_totalOpenWasmDocuments } from "@document/backend/create-wasm-document-state"
import { throw_ } from "@utils/lang"
import { describe, expect, it } from "vitest"
import { createAudiotoolClient } from "./audiotool-client"

describe("audiotool client", () => {
  describe("createSyncedDocument", () => {
    // skipped because it relied on env vars
    it.skip("should remove all document states on termination", async () => {
      const client = await createAudiotoolClient({
        auth: import.meta.env.AT_PAT ?? throw_("AT_PAT is not set"),
      })
      const nexus = await client.open(
        import.meta.env.PROJECT_ID ?? throw_("PROJECT_ID is not set"),
      )
      await nexus.start()
      await nexus.stop()

      // this number will be non-0 if we forget to terminate some wasm state
      // somewhere, resulting in memory leaks.
      expect(DEBUG_totalOpenWasmDocuments).toBe(0)
    })
  })
})
