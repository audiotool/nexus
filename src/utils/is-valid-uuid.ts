const uuidRegexp =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/** Checks weather a string is a uuid, for example:
 * ```
 * isValidUUID("123e4567-e89b-12d3-a456-426614174000") // true
 * isValidUUID("123e4567-e89b-12d3-a456-42661417400") // false
 * isValidUUID("") // false
 * isValidUUID("yo mama") // false
 * ```
 */
export const isValidUUID = (uuid: string): boolean => uuidRegexp.test(uuid)
