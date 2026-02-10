import type { Modification } from "@gen/document/v1/document_service_pb"

/** Can be used to validate all modifications. Might hold state that
 * is updated if a modification is validated, e.g. by keeping track
 * of the entire document state. Kept as an interface to allow
 * all validation to eb turned off e.g. during testing.
 */
export interface NexusValidator {
  validate(mod: Modification): string | undefined
  /** terminate causes {@link validate} to throw. */
  terminate(): void
}
