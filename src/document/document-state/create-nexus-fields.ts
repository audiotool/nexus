import type { AnyMessage, FieldInfo, Message } from "@bufbuild/protobuf"
import { ScalarType } from "@bufbuild/protobuf"
import type { EntityTypeKey } from "@document/entity-utils"
import { NexusLocation } from "@document/location"
import type { Update } from "@gen/document/v1/document_service_pb"
import { Empty } from "@gen/document/v1/empty_pb"
import { Pointer } from "@gen/document/v1/pointer_pb"
import { assert } from "@utils/lang"
import type { NexusField, PrimitiveType } from "../fields"
import { ArrayField, PrimitiveField } from "../fields"
import type { NexusFieldTypes } from "../object"
import { NexusObject } from "../object"
import { getSchemaLocationDetails } from "../schema/get-schema-location-details"
/**
 * Creates the `fields` object for a `NexusObject` based on a protobuf message.
 * `location` is the location of the `NexusObject`.
 */
export const createNexusFields = (
  getEntityType: (id: string) => EntityTypeKey,
  entityType: EntityTypeKey,
  message: Message<AnyMessage>,
  location: NexusLocation,
): NexusFieldTypes => {
  const fields = {} as NexusFieldTypes
  message
    .getType()
    .fields.list()
    .forEach((field) => {
      if (field.name === "id" && field.no === 1) {
        return
      }
      const fieldLocation = location.withAppendedFieldNumber(field.no)
      const fieldValue = (message as unknown as { [index: string]: unknown })[
        field.localName
      ]
      let nexusField: NexusField
      if (!field.repeated) {
        nexusField = createField(
          getEntityType,
          entityType,
          fieldLocation,
          fieldValue,
          field,
        )
      } else {
        const arrayValues = (fieldValue as unknown[]).map(
          (value: unknown, i: number) =>
            createField(
              getEntityType,
              entityType,
              fieldLocation.withAppendedFieldNumber(i),
              value,
              field,
            ),
        )
        nexusField = new ArrayField(fieldLocation, arrayValues)
      }
      // assign this field
      fields[field.localName] = nexusField
    })
  return fields
}

/** Takes a field location, a value of unknown type, and FieldInfo, and creates a NexusField
 * according to FieldInfo, assuming value is of the correct type.
 */
const createField = (
  getEntityType: (id: string) => EntityTypeKey,
  entityType: EntityTypeKey,
  location: NexusLocation,
  value: unknown,
  field: FieldInfo,
): NexusField => {
  switch (field.kind) {
    case "message": {
      if (value instanceof Pointer) {
        return new PrimitiveField<PrimitiveType>(
          location,
          NexusLocation.fromPointerMessage(getEntityType, value),
          "pointer",
          !mustExtractMutability(entityType, location.fieldIndex),
        )
      }
      if (field.T === Empty) {
        // empty fields don't have to be defined.
        return new NexusObject({}, location)
      }
      assert(value !== undefined, `undefined value for field ${location}`)
      const fields = createNexusFields(
        getEntityType,
        entityType,
        value as Message,
        location,
      )
      return new NexusObject(fields, location)
    }
    case "scalar": {
      return new PrimitiveField<PrimitiveType>(
        location,
        value as PrimitiveType,
        scalarTypes[field.T],
        !mustExtractMutability(entityType, location.fieldIndex),
      )
    }
    default:
      throw new Error(`unsupported field kind: ${field.kind}`)
  }
}

/**
 * Object used to convert protobuf ScalarType to the field names used in
 * the protobuf update message of that type.
 */
export const scalarTypes: Record<
  ScalarType,
  NonNullable<Update["value"]["case"]>
> = {
  [ScalarType.DOUBLE]: "double",
  [ScalarType.FIXED32]: "fixed32",
  [ScalarType.FIXED64]: "fixed64",
  [ScalarType.FLOAT]: "float",
  [ScalarType.INT32]: "int32",
  [ScalarType.INT64]: "int64",
  [ScalarType.SFIXED32]: "sfixed32",
  [ScalarType.SFIXED64]: "sfixed64",
  [ScalarType.SINT32]: "sint32",
  [ScalarType.SINT64]: "sint64",
  [ScalarType.UINT32]: "uint32",
  [ScalarType.UINT64]: "uint64",
  [ScalarType.STRING]: "string",
  [ScalarType.BOOL]: "bool",
  [ScalarType.BYTES]: "bytes",
}

export const mustExtractMutability = (
  type: EntityTypeKey,
  fieldIndex: readonly number[],
): boolean => {
  const details = getSchemaLocationDetails({ entityType: type, fieldIndex })
  if (details?.type !== "primitive") {
    throw "Expected primitive field details, got: " + details?.type
  }
  return details?.immutable ?? false
}
