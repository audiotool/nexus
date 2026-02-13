/** True if we're not in bun, deno, or node.js. */
export const runningInBrowser =
  // use typeof process instead of typeof window so this check is accurate even if running vitest which commonly uses
  // jsdom to polyfill window.
  typeof process === "undefined"

/** True if we're in node.js */
export const runningInNodeJs =
  typeof process !== "undefined" &&
  typeof process.versions?.node === "string" &&
  typeof process.versions?.bun === "undefined" &&
  typeof (globalThis as any).Deno === "undefined"
