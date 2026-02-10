import type { EntityTypeKey } from "@document/entity-utils"
import type * as pbDocumentService from "@gen/document/v1/document_service_pb"
import { throw_ } from "@utils/lang"
import type { PrimitiveType } from "../fields"
import { NexusLocation } from "../location"

export const extractPbUpdateValue = (
  value: pbDocumentService.Update["value"],
  getEntityType: (id: string) => EntityTypeKey,
): PrimitiveType => {
  switch (value.case) {
    case "pointer":
      return NexusLocation.fromPointerMessage(getEntityType, value.value)
    case "sfixed64":
    case "fixed64":
    case "int64":
    case "sint64":
    case "uint64":
    case "sfixed32":
    case "fixed32":
    case "bool":
    case "float":
    case "double":
    case "int32":
    case "sint32":
    case "uint32":
    case "string":
      return value.value
    case "bytes":
      throw "unexpected update message type 'bytes'"
    case undefined:
      return throw_("update message type is undefined")
  }
}
