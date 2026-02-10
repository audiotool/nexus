import type { Schema } from "@bufbuild/protoplugin"
import { createEcmaScriptPlugin } from "@bufbuild/protoplugin"
import { generateTs } from "./ts-generator"

export const protocGenAudiotoolNexus = createEcmaScriptPlugin({
  name: "protoc-gen-audiotool-nexus",
  version: `v1.0.0`,
  generateTs: (schema: Schema): void => {
    try {
      generateTs(schema)
    } catch (error: unknown) {
      console.error(error)
    }
  },
})
