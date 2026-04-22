import { NexusLocation } from "@document/location"
import type { Modification } from "@gen/document/v1/document_service_pb"
import { throw_ } from "@utils/lang"
import { protoDownCast } from "@utils/proto-down-cast"
import type { PrimitiveField, PrimitiveType } from "../fields"
import { primitiveEquals } from "../fields"
import {
  getAllSchemaLocationDetails,
  getSchemaLocationDetails,
} from "../schema/get-schema-location-details"
import type { SchemaLocation } from "../schema/schema-location"
import type { SchemaLocationDetails } from "../schema/schema-location-details"
import { buildUpdateModification } from "./build-modifications"
import { entityDefaultsMap } from "./defaults"

/** Builds a modification resetting the value of a `PrimitiveField` to the value
 * defined by the defaults map with all the predetermined defaults.
 * Returns undefined iif the field is already at its default value or it's of type NexusLocation.
 */
export const buildModificationForFieldReset = <P extends PrimitiveType>(
  field: PrimitiveField<P, "mut">,
): Modification | undefined => {
  const details =
    getSchemaLocationDetails(field.location) ??
    throw_(
      `invariant violation: couldn't fetch details of primitive field location ${field.location.toString()}`,
    )

  if (details.type !== "primitive") {
    throw new Error("expected primitive field to have primitive details")
  }
  if (details.immutable) {
    return
  }
  if (details.primitive.type === "nexus-location") {
    return undefined
  }

  const fieldDefault = getDefaultForSchemaLocation(field.location)
  if (fieldDefault instanceof Error) {
    throw new Error("invariant violation: couldn't extract default value", {
      cause: fieldDefault,
    })
  }
  const downCastedDefault = protoDownCast(
    field._protoType,
    fieldDefault as Exclude<PrimitiveType, NexusLocation>,
  )
  if (primitiveEquals(field.value, downCastedDefault)) {
    return undefined
  }
  return buildUpdateModification(
    field.location,
    field._protoType,
    downCastedDefault,
  )
}

/**
 * Gets the default value for a schema location from the entityDefaultsMap.
 */
export const getDefaultForSchemaLocation = (
  schemaLocation: SchemaLocation,
): DefaultsPrimitive | Error => {
  const entityType = schemaLocation.entityType
  if (entityType === undefined) {
    return new Error(`contract violation: schema location has no entity type`)
  }

  const entityDefaults = entityDefaultsMap[entityType]
  if (entityDefaults === undefined) {
    return new Error(
      `contract violation: entity type ${entityType} has no defaults defined`,
    )
  }

  const [, ...fieldDetails] = getAllSchemaLocationDetails(schemaLocation)
  return traverseDefaults(fieldDetails, entityDefaults)
}

// Type hierarchy for defaults structure
type DefaultsPrimitive = string | number | bigint | boolean | Uint8Array
interface DefaultsObject {
  readonly [key: string]: DefaultsNode
}

type DefaultsNode = DefaultsPrimitive | DefaultsObject | readonly DefaultsNode[]

/**
 * Core traversal function that walks through the defaults object using field details.
 * @param fieldDetails - The path details to traverse (excluding entity info)
 * @param entityDefaults - The defaults object to traverse
 * returns a DefaultsPrimitive or Error if the default value is not found. Or there is something wrong with the defaults structure.
 */
const traverseDefaults = (
  fieldDetails: readonly SchemaLocationDetails[],
  entityDefaults: DefaultsNode,
): DefaultsPrimitive | Error => {
  let current: DefaultsNode = entityDefaults

  for (const detail of fieldDetails) {
    switch (detail.type) {
      case "array": {
        const next: DefaultsNode | undefined = (current as DefaultsObject)[
          detail.fieldName
        ]
        if (next === undefined || !Array.isArray(next)) {
          return new Error(
            `expects an array field ${detail.fieldName}, but defaults contains ${typeof next}`,
          )
        }
        current = next
        continue
      }
      case "object": {
        if (detail.index !== undefined) {
          if (!Array.isArray(current)) {
            return new Error(
              `expects an array at index ${detail.index}, but defaults contains ${typeof current}`,
            )
          }
          const next: DefaultsNode | undefined = (
            current as readonly DefaultsNode[]
          )[detail.index]
          if (next === undefined) {
            return new Error(
              `expects an array at index ${detail.index}, but defaults contains ${typeof current}`,
            )
          }
          current = next
        } else {
          const next: DefaultsNode | undefined = (current as DefaultsObject)[
            detail.fieldName
          ]
          if (next === undefined) {
            return new Error(
              `expects an object with field name ${detail.fieldName}, but defaults contains ${typeof current}`,
            )
          }
          current = next
        }
        break
      }
      case "primitive": {
        // Handle array element primitives (e.g., splitFrequencyHz[0])
        // where detail.index is the array index and current is the array
        if (detail.index !== undefined) {
          if (!Array.isArray(current)) {
            return new Error(
              `expects an array at index ${detail.index}, but defaults contains ${typeof current}`,
            )
          }
          const defaultValue = (current as readonly DefaultsNode[])[
            detail.index
          ]
          if (defaultValue === undefined) {
            return new Error(
              `expects an array element at index ${detail.index}, but defaults array has length ${current.length}`,
            )
          }
          return defaultValue as DefaultsPrimitive
        }
        const defaultValue = (current as DefaultsObject)[detail.fieldName]
        if (defaultValue === undefined) {
          return new Error(
            `expects a primitive with field name ${detail.fieldName}, but defaults contains ${typeof current}`,
          )
        }
        return defaultValue as DefaultsPrimitive
      }
      case "entity": {
        return new Error(
          `expected a field but got entity ${detail.typeKey} instead`,
        )
      }
    }
  }
  return new Error(`contract violation: field had no details to traverse`)
}
