import pkg from "./package.json" with { type: "json" }

// derive entry points from package.json `exports` field
const entryPoints = Object.keys(pkg.exports).map((key) => {
  const name = key === "." ? "index" : key.slice(2)
  return `src/exports/${name}.ts`
})

/** @type {Partial<import("typedoc").TypeDocOptions>} */
const config = {
  entryPoints,
  sortEntryPoints: false,
  out: "docs",
  plugin: [
    // "typedoc-plugin-missing-exports",
    "typedoc-plugin-mdn-links",
    "@8hobbies/typedoc-plugin-plausible",
    "./codegen/typedoc/qualified-link-text.mjs",
  ],
  navigation: {
    includeCategories: false,
  },
  navigationLinks: {
    "Developer Hub": "https://developer.audiotool.com",
    "Github Repository": "https://github.com/audiotool/nexus",
  },
  readme: "src/docs/index.md",
  projectDocuments: [
    "src/docs/getting-started.md",
    "src/docs/overview.md",
    "src/docs/login.md",
    "src/docs/api.md",
    "src/docs/transaction-errors.md",
    "src/docs/entities.md",
    "src/docs/changelog.md",
  ],
  disableSources: false,
  gitRemote: "origin",
  includeVersion: true,
  searchInComments: true,
  searchInDocuments: true,
  excludePrivate: true,
  excludeInternal: true,
  exclude: ["**/*.test.ts", "**/_*.ts"],
  skipErrorChecking: false,
  validation: {
    notExported: true,
  },
  preserveLinkText: true,
  modifierTags: [
    "@generated",
    "@internal",
    "@alpha",
    "@beta",
    "@experimental",
    "@deprecated",
    "@packageDocumentation",
    "@internalType",
    "@hidden",
  ],
  name: "@audiotool/nexus",
  customCss: "src/docs/style.css",
  // cookie banner with google analytics
  customFooterHtml: `<script type="module">
			(await import('https://cdn.audiotool.com/website-assets/cookie-banner/latest/cookie-banner.js')).banner()
  </script>`,
  // disable wrapping footer
  customFooterHtmlDisableWrapper: true,
  plausibleSiteDomain: "developer.audiotool.com",
}

export default config
