import { Any } from "@bufbuild/protobuf"
import { packEntity, type EntityMessage } from "@document/entity-utils"
import type { Update } from "@gen/document/v1/document_service_pb"
import { Modification } from "@gen/document/v1/document_service_pb"
import type { NexusLocation } from "../location"

/** utility function to create a `Create` modification message */
export const buildCreateModification = (
  entity: EntityMessage | Any,
): Modification =>
  new Modification({
    modification: {
      case: "create",
      value: {
        entity: entity instanceof Any ? entity : packEntity(entity),
      },
    },
  }).clone()

/** utility function to create an `Update` modification message */
export const buildUpdateModification = <T extends Update["value"]>(
  location: NexusLocation,
  case_: T["case"],
  value: T["value"],
): Modification =>
  new Modification({
    modification: {
      case: "update",
      value: {
        field: location.toPointerMessage(),
        value: {
          case: case_,
          value,
        } as Update["value"],
      },
    },
  }).clone()

/** utility function to create an `Delete` modification message */
export const buildDeleteModification = (entityId: string): Modification =>
  new Modification({
    modification: {
      case: "delete",
      value: { entityId },
    },
  }).clone()
