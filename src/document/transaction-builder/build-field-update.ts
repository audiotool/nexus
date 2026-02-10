import type { Modification } from "@gen/document/v1/document_service_pb"
import { Pointer } from "@gen/document/v1/pointer_pb"
import type { PrimitiveField, PrimitiveType } from "../fields"
import { NexusLocation } from "../location"
import { buildUpdateModification } from "./build-modifications"

/** @internal Builds a modification updating the value of a `PrimitiveField` */
export const buildModificationForFieldUpdate = <P extends PrimitiveType>(
  field: PrimitiveField<P>,
  /** either P or, if P is a NexusLocation, also takes pointer for convenience */
  value: P | Pointer,
): Modification => {
  if (value instanceof Pointer && field._protoType !== "pointer") {
    throw new Error(
      `Expected value of type ${field._protoType}, but got Pointer`,
    )
  }
  return buildUpdateModification(
    field.location,
    field._protoType,
    value instanceof NexusLocation ? value.toPointerMessage() : value,
  )
}
