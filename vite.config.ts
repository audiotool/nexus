import assert from "assert"
import { existsSync, readdirSync } from "fs"
import { resolve } from "path"
import dts from "vite-plugin-dts"
import tsconfigPaths from "vite-tsconfig-paths"
import { defineConfig } from "vitest/config"

import packageJson from "./package.json"

// Generate entry points by looking at package.json's `exports` field. For each
//
//     foo: {types: .., import: ..}
//
// - types must be "./dist/foo.d.ts"
// - import must be "./dist/foo.js"
// - file src/exports/foo.ts must exist
//
// Collect all path src/exports/foo.ts.
const entry = Object.entries(packageJson.exports).map(([key, value]) => {
  const name = key === "." ? "index" : key.slice(2)
  const path = resolve(__dirname, "src/exports", `${name}.ts`)
  console.debug(path)
  assert(
    existsSync(path),
    `export ${name} in package.json requires file ${path} to exist; missing`,
  )
  assert(
    value.types === `./dist/${name}.d.ts` &&
      value.import === `./dist/${name}.js`,
    `export ${name} in package.json requires types to be "./dist/${name}.d.ts"`,
  )
  return path
})

// make sure we have the same number of files in src/exports as in package.json `exports` field
assert(
  readdirSync(resolve(__dirname, "src/exports")).length ===
    Object.keys(packageJson.exports).length,
  "src/exports has more files than package.json `exports` field; update package.json or remove file",
)

export default defineConfig({
  assetsInclude: ["**/*.wasm", "**/*.js"],
  build: {
    sourcemap: false,
    lib: {
      name: "@audiotool/nexus",
      entry,
      formats: ["es"],
    },
    rollupOptions: {
      external: [
        "@bufbuild/protobuf",
        "@connectrpc/connect",
        "@connectrpc/connect-web",
        "@connectrpc/connect-node",
        "toposort",
        "utility-types",
        "uuid",
        "zod",
        /^node:/,
      ],
      output: {
        entryFileNames: "[name].js",
      },
    },
    // inline assets up to 1MB
    assetsInlineLimit: 1024 * 1024,
  },
  test: {
    setupFiles: ["./src/testing/test-setup.ts"],
  },
  plugins: [
    tsconfigPaths(),
    dts({
      insertTypesEntry: true,
    }),
  ],
})
