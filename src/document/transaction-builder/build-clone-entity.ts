import type { NexusEntity } from "@document/entity"
import type {
  EntityConstructorType,
  EntityTypeKey,
} from "@document/entity-utils"
import type { Modification } from "@gen/document/v1/document_service_pb"
import type { DeepPartial } from "utility-types"
import { buildCreateModification } from "./build-modifications"
import { entityToPbMessage } from "./entity-to-pb"
import { updateEntityMessageWithConstructor } from "./update-pb-message"

/**
 * @internal
 *  Builds a new `Create` modification that clones an existing entity,
 * optionally overwriting fields.
 *
 * Returns the modification, and for simplicity the entity id.
 */
export const buildModificationForEntityClone = <T extends EntityTypeKey>(
  entity: NexusEntity<T>,
  args?: DeepPartial<EntityConstructorType<T>>,
): { modification: Modification; entityId: string } => {
  const entityMessage = entityToPbMessage(entity)
  if (args !== undefined) {
    updateEntityMessageWithConstructor(entityMessage, args)
  }

  return {
    modification: buildCreateModification(entityMessage),
    entityId: entityMessage.id,
  }
}
