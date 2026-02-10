import type * as bufbuild from "@bufbuild/protoplugin/ecmascript"
import { createSynchronizedPrettier } from "@prettier/sync"

import * as fs from "fs"
import * as path from "path"
import { throw_ } from "../../src/utils/lang.js"

const __dirname = path.dirname(new URL(import.meta.url).pathname)

const prettierOptions = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../../.prettierrc"), "utf-8"),
)

/**
 * The following class is a wrapper around buf.build's GeneratedFile class.
 * The reason we wrap it is because we need the following features that
 * don't exist in the default implementation:
 * * The ability to add custom import symbols before generating the file
 * * The ability to format the generated code before saving it as a file
 */
export class GeneratedFile {
  #map: Map<string, string> = new Map()
  #imports: Set<string> = new Set()
  #types: Set<string> = new Set()
  #excludes: Set<string> = new Set()

  #file: bufbuild.GeneratedFile

  #preamble: string[] = [
    `// THIS FILE IS GENERATED - DO NOT EDIT`,
    `// Copyright ${new Date().getFullYear()} Audiotool Inc.`,
  ]
  #content: string[] = []

  constructor(file: bufbuild.GeneratedFile, importSymbols: [string, string][]) {
    this.#file = file

    importSymbols.forEach(([symbol, path]) => {
      if (this.#map.has(symbol)) {
        throw new Error(`Duplicate symbol: ${symbol}`)
      }
      this.#map.set(symbol, path)
    })
  }

  /** Import a symbol. If path is omitted, expects the path to already
   * be registered.
   *
   * If symbol contains a colon, the left part is the imported name, the right one what it's imported as:
   * Foo:Foo_pb -> import { Foo as Foo_pb } from "Foo_pb"
   */
  import(symbol: string, typeImport: boolean, path?: string) {
    if (path !== undefined) {
      if (
        this.#map.get(symbol) !== undefined &&
        this.#map.get(symbol) !== path
      ) {
        throw new Error(
          `multiple conflicting import paths for symbol ${symbol}, existing: ${this.#map.get(symbol)}, new: ${path}`,
        )
      }
      this.#map.set(symbol, path)
    } else {
      if (!this.#map.has(symbol)) {
        throw new Error(`Unknown symbol: ${symbol}`)
      }
    }
    this.#imports.add(symbol)
    if (typeImport) {
      this.#types.add(symbol)
    }
    const [name, alias] = symbol.split(":")
    return alias ?? name
  }

  exclude(symbol: string) {
    this.#excludes.add(symbol)
    return symbol
  }

  print(...content: string[]) {
    if (content.length === 0) {
      this.#content.push("")
    }
    this.#content.push(...content)
  }

  preamble(content: string) {
    this.#preamble.push(content)
  }

  /** Write the content to the file */
  write(): void {
    // maps import path to symbols imported from that path
    const importsMap = new Map<string, Set<string>>()

    for (const symbol of this.#imports) {
      if (this.#excludes.has(symbol)) {
        continue
      }
      const path =
        this.#map.get(symbol) ?? throw_(`Symbol ${symbol} not in register map.`)

      const symbols = importsMap.get(path) ?? new Set()
      symbols.add(symbol)
      importsMap.set(path, symbols)
    }
    const imports = [...importsMap.entries()].sort().map(
      ([path, symbols]) =>
        `import { ${Array.from(symbols.values())
          .map((symbol) => {
            const [name, alias] = symbol.split(":")
            const importName =
              alias !== undefined ? `${name} as ${alias}` : name
            return this.#types.has(symbol) ? `type ${importName}` : importName
          })
          .sort()
          .join(", ")} } from "${path}"`,
    )
    // console.error(this.#imports, importsMap)
    const content =
      this.#preamble.join("\n") +
      "\n\n\n" +
      imports.join("\n") +
      "\n\n\n" +
      this.#content.join("\n")

    const synchronizedPrettier = createSynchronizedPrettier({
      prettierEntry: `${__dirname}/../../node_modules/prettier/index.mjs`,
    })

    this.#file.print(
      synchronizedPrettier.format(content, {
        parser: "typescript",
        ...prettierOptions,
      }),
    )
  }
}
