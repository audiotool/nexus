import type { Modification } from "@gen/document/v1/document_service_pb"
import { buildDeleteModification } from "./build-modifications"

/** @internal Builds a modification that removes an entity. */
export const buildModificationForRemove = (id: string): Modification => {
  const modif = buildDeleteModification(id)
  return modif
}
