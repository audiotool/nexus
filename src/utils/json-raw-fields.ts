/**
 * The raw JSON text of every top-level field of a JSON object, by key, as
 * views into `bytes` (UTF-8). The text is exactly what the document holds,
 * whitespace and escapes inside the value included. A repeated key keeps its
 * last value. Returns an empty map for bytes that are not a JSON object.
 */
export const readRawJsonObjectFields = (
  bytes: Uint8Array,
): Map<string, Uint8Array> => {
  const fields = new Map<string, Uint8Array>()
  let document: unknown
  try {
    document = JSON.parse(new TextDecoder().decode(bytes))
  } catch {
    return fields
  }
  if (
    typeof document !== "object" ||
    document === null ||
    Array.isArray(document)
  ) {
    return fields
  }
  // The document is valid JSON, so the scan only has to find value
  // boundaries, not validate. Structural characters are ASCII, so scanning
  // UTF-8 bytes is safe.
  let index = skipWhitespace(bytes, 0) + 1
  while (true) {
    index = skipWhitespace(bytes, index)
    if (bytes[index] === CLOSE_BRACE) {
      return fields
    }
    const keyEnd = skipString(bytes, index)
    const key = JSON.parse(
      new TextDecoder().decode(bytes.subarray(index, keyEnd)),
    ) as string
    const valueStart = skipWhitespace(bytes, skipWhitespace(bytes, keyEnd) + 1)
    const valueEnd = skipValue(bytes, valueStart)
    fields.set(key, bytes.subarray(valueStart, valueEnd))
    index = skipWhitespace(bytes, valueEnd)
    if (bytes[index] === COMMA) {
      index += 1
    }
  }
}

const QUOTE = 0x22
const BACKSLASH = 0x5c
const COMMA = 0x2c
const OPEN_BRACE = 0x7b
const CLOSE_BRACE = 0x7d
const OPEN_BRACKET = 0x5b
const CLOSE_BRACKET = 0x5d
const WHITESPACE = new Set([0x20, 0x09, 0x0a, 0x0d])

const skipWhitespace = (bytes: Uint8Array, index: number): number => {
  while (WHITESPACE.has(bytes[index])) {
    index += 1
  }
  return index
}

/** The index after the string that starts at `index`. */
const skipString = (bytes: Uint8Array, index: number): number => {
  index += 1
  while (bytes[index] !== QUOTE) {
    index += bytes[index] === BACKSLASH ? 2 : 1
  }
  return index + 1
}

/** The index after the value that starts at `index`. */
const skipValue = (bytes: Uint8Array, index: number): number => {
  if (bytes[index] === QUOTE) {
    return skipString(bytes, index)
  }
  if (bytes[index] === OPEN_BRACE || bytes[index] === OPEN_BRACKET) {
    let depth = 0
    do {
      const byte = bytes[index]
      if (byte === QUOTE) {
        index = skipString(bytes, index)
        continue
      }
      if (byte === OPEN_BRACE || byte === OPEN_BRACKET) {
        depth += 1
      } else if (byte === CLOSE_BRACE || byte === CLOSE_BRACKET) {
        depth -= 1
      }
      index += 1
    } while (depth > 0)
    return index
  }
  // numbers and literals end at the next separator
  while (
    index < bytes.length &&
    bytes[index] !== COMMA &&
    bytes[index] !== CLOSE_BRACE &&
    !WHITESPACE.has(bytes[index])
  ) {
    index += 1
  }
  return index
}
