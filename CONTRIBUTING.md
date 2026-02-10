# Contributing

Overview of repo:

- `src/` source code
- `src/exports/*.ts` - the entry points of the package
- `src/docs/` docs `.md` pages
- `tests` - tests of the package in various platforms (bun, browser, ...), very superficial
- `codegen` - code generators executed when running `npm run codegen`

## Running tests in `tests/`:

Add env var `AT_PAT=<pat>` with PAT found at https://developer.audiotool.com/personal-access-tokens.

## Testing the package

To create a new test project testing the current package's functionality, best use bun or npm, then:

1. in this directory, call `npm/bun link`
2. in your new directory, call `npm/bun link @audiotool/nexus --save`

This will create a symlink from your project to this package's `dist` directory.
If you run `npm run build` here, your new directory will immediately see the updated
package.

What's finally uploaded to npm can be seen by calling `npm run pack`, which generates a `.tgz` file in `dist/`; this file can then be installed with:

```
npm/bun install <file>.tgz
```

You can then check what's part of the package by checking `node_modules/@audiotool/nexus` or similar.

## Config files

- `tsconfig.json`: configures the typescript settings
- `typedoc.config.mjs`: configures the docs generator
- `vite.config.ts`: configures vite, which bundles the package, together `package.json`
- `package.json`: configures the package as well: imports, exports

The package path aliases like `@audiotool/nexus/utils` have to be mentioned
in multiple config files. To avoid a mismatch between the exported types, the exported
js files, and the exported documentation, the files were interlinked:

- `package.json`: defines the main package entry points via `exports` field
- `vite.config.ts`, defines how vite bundles the files during build, which includes:
  - a list of entry points `entry` generated from `package.json` (& validated)
  - a list of path aliases like `@utils`, internal to the package, imported from `tsconfig.json`
- `typedoc.config.mjs` configures the docs builder `typedoc` (run using `npm run typedoc`). It also derives the package exports from `package.json`
