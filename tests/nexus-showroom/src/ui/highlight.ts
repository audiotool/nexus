/**
 * Centralised Prism.js wiring for the showroom.
 *
 * We deliberately import only the typescript component and inline a minimal
 * light theme inside `index.html` so the bundle stays self-contained.
 */

import Prism from "prismjs"
import "prismjs/components/prism-typescript"

/**
 * Highlight a TypeScript snippet and return HTML ready to drop into the
 * `innerHTML` of a `<code class="language-typescript">` element.
 */
export function highlightTs(code: string): string {
  return Prism.highlight(code, Prism.languages.typescript, "typescript")
}
