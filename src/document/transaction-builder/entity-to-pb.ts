import type { EntityMessage, EntityTypeKey } from "@document/entity-utils"
import type { NexusEntity } from "../entity"
import { createDefaultEntityMessage } from "./create-default-entity"
import { entityToConstructorType } from "./entity-to-constructor-type"
import { updateEntityMessageWithConstructor } from "./update-pb-message"

/** Converts a nexus entity to a proto entity message, that can easily be wrapped
 * in the container `Entity` message.
 */
export const entityToPbMessage = <T extends EntityTypeKey>(
  entity: NexusEntity,
  assignNewId = true,
): EntityMessage<T> => {
  // construct a default entity message
  const entityMessage = createDefaultEntityMessage(entity.entityType)
  // update with the field values from the gotten entity
  updateEntityMessageWithConstructor(
    entityMessage,
    entityToConstructorType(entity),
  )

  if (!assignNewId) {
    entityMessage.id = entity.id
  }
  return entityMessage as EntityMessage<T>
}
