import type {
  EntityConstructorType,
  EntityTypeKey,
} from "@document/entity-utils"
import type { Modification } from "@gen/document/v1/document_service_pb"

import { buildCreateModification } from "./build-modifications"
import { createDefaultEntityMessage } from "./create-default-entity"
import { updateEntityMessageWithConstructor } from "./update-pb-message"

/** Builds a new `Create` modification based on:
 * * the name of an entity type
 * * partially optional constructor parameters for that entity type
 *@internal
 * The entity is initialized with the default values from the proto annotations,
 * which are then overwritten with the constructor parameters.
 *
 * Returns the modification, and for simplicity the id of the entity created.
 */
export const buildModificationForNewEntity = <T extends EntityTypeKey>(
  name: T,
  args: EntityConstructorType<T>,
): { modification: Modification; entityId: string } => {
  // TODO: Ugly hotfix
  if (name === "gakki") {
    args = {
      ...args,
      // @ts-ignore
      soundfontId: args.soundfontId ?? "ce79731c-f100-4f54-9ccc-2d2c60269483",
    }
  }
  // create new default entity message
  const entityMessage = createDefaultEntityMessage(name)
  updateEntityMessageWithConstructor(entityMessage, args)

  return {
    modification: buildCreateModification(entityMessage),
    entityId: entityMessage.id,
  }
}
