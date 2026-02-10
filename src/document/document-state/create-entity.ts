import {
  entityMessageToTypeKey,
  type EntityMessage,
  type EntityTypeKey,
} from "@document/entity-utils"
import type { EntityTypes } from "@gen/document/v1/utils/types"
import { NexusEntity } from "../entity"
import { NexusLocation } from "../location"
import { createNexusFields } from "./create-nexus-fields"

/** Create a nexus entity from a proto message */
export const createEntity = <T extends EntityTypeKey>(
  getEntityType: (id: string) => EntityTypeKey,
  entityMessage: EntityMessage,
): NexusEntity => {
  const type = entityMessageToTypeKey(entityMessage)
  // convert the proto message to a `fields` object for a `NexusEntity`
  const fields = createNexusFields(
    getEntityType,
    type,
    entityMessage,
    new NexusLocation(entityMessage.id, type, []),
  ) as EntityTypes[T]

  return new NexusEntity(new NexusLocation(entityMessage.id, type, []), fields)
}
