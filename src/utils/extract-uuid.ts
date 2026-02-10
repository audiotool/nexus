export const extractUuid = (str: string): string | Error => {
  const uuidRegex =
    /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i
  const match = str.match(uuidRegex)
  if (match == null) return new Error()
  return match[0]
}
