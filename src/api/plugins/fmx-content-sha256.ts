import { readRawJsonObjectFields } from "@utils/json-raw-fields"

/** The top-level `.fmx` fields the content hash covers, in hash order. */
const HASHED_FIELDS = ["wasm", "html", "metadata"] as const

const toHex = (bytes: Uint8Array): string =>
  Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("")

/**
 * The hex sha256 the backend identifies a plugin file by (`PluginAsset.sha256`):
 * the hash of `wasm:{wasm}html:{html}metadata:{metadata}`, where each
 * placeholder is the raw JSON text of that top-level field. A missing field is
 * empty, every other field is ignored, a repeated key keeps its last value,
 * and a file that is not a JSON object hashes as three empty fields.
 */
export const computeFmxContentSha256 = async (
  bytes: Uint8Array,
): Promise<string> => {
  const fields = readRawJsonObjectFields(bytes)
  const encoder = new TextEncoder()
  const parts = HASHED_FIELDS.flatMap((field) => [
    encoder.encode(`${field}:`),
    fields.get(field) ?? new Uint8Array(),
  ])
  const preimage = new Uint8Array(
    parts.reduce((length, part) => length + part.length, 0),
  )
  let offset = 0
  for (const part of parts) {
    preimage.set(part, offset)
    offset += part.length
  }
  return toHex(new Uint8Array(await crypto.subtle.digest("SHA-256", preimage)))
}
