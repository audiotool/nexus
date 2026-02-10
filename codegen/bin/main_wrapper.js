#!/usr/bin/env node

import { createRequire } from "node:module"

const require = createRequire(import.meta.url)
const path = require("path")
const child_process = require("child_process")

const __dirname = import.meta.dirname

const tsxPath = path.resolve(
  __dirname,
  "..",
  "..",
  "node_modules",
  ".bin",
  "tsx",
)

const args = [path.resolve(__dirname, "main.ts")]
const child = child_process.spawnSync(tsxPath, args, { stdio: "inherit" })
process.exit(child.status)
