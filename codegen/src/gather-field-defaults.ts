import {
  type DescField,
  type DescMessage,
  ScalarType,
} from "@bufbuild/protobuf"
import { localName } from "@bufbuild/protoplugin/ecmascript"
import { entityDefaultsMap } from "../../src/document/transaction-builder/defaults/index"

/**
 * Collects the default value of every field from the SDK's defaults objects,
 * formatted for doc comments. Keys are `<message type name>.<field name>`.
 *
 * Nested messages can be used in several places with different defaults. Fields of
 * such messages only get an entry if all usages agree on the default.
 */
export const gatherFieldDefaults = (
  entityMessages: DescMessage[],
  entityNames: Map<string, string>,
): Map<string, string> => {
  const usages = new Map<string, (string | undefined)[]>()

  const visit = (message: DescMessage, defaults: Record<string, unknown>) => {
    for (const field of message.fields) {
      const value = defaults[localName(field)]
      if (value === undefined) {
        continue
      }
      if (field.fieldKind === "message") {
        if (
          field.message.name === "Pointer" ||
          field.message.name === "Empty"
        ) {
          continue
        }
        const nested = field.repeated ? (value as unknown[]) : [value]
        nested.forEach((v) =>
          visit(field.message, v as Record<string, unknown>),
        )
        continue
      }
      const key = fieldKey(message, field)
      usages.set(key, [...(usages.get(key) ?? []), formatValue(field, value)])
    }
  }

  for (const message of entityMessages) {
    const name = entityNames.get(message.typeName)
    const defaults = entityDefaultsMap[name as keyof typeof entityDefaultsMap]
    if (defaults !== undefined) {
      visit(message, defaults as Record<string, unknown>)
    }
  }

  const result = new Map<string, string>()
  for (const [key, formatted] of usages) {
    const first = formatted[0]
    if (first !== undefined && formatted.every((f) => f === first)) {
      result.set(key, first)
    }
  }
  return result
}

export const fieldKey = (message: DescMessage, field: DescField): string =>
  `${message.typeName}.${field.name}`

/** Formats a default value for a doc comment table, or undefined if it can't be shown in one line. */
const formatValue = (field: DescField, value: unknown): string | undefined => {
  if (Array.isArray(value)) {
    const elements = value.map((v) => formatValue(field, v))
    const first = elements[0]
    return first !== undefined && elements.every((e) => e === first)
      ? `${first} (every element)`
      : undefined
  }
  if (value instanceof Uint8Array) {
    return value.length === 0 ? "empty" : undefined
  }
  if (typeof value === "string") {
    return `\`${JSON.stringify(value)}\``
  }
  if (
    typeof value === "number" &&
    field.fieldKind === "scalar" &&
    field.scalar === ScalarType.FLOAT
  ) {
    return shortestFloat32(value)
  }
  return String(value)
}

/** Returns the shortest decimal representation that rounds to the same 32 bit float. */
const shortestFloat32 = (value: number): string => {
  const target = Math.fround(value)
  for (let precision = 1; precision < 17; precision++) {
    const candidate = Number(value.toPrecision(precision))
    if (Math.fround(candidate) === target) {
      return String(candidate)
    }
  }
  return String(value)
}
