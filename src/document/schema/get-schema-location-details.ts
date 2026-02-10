import { assert, throw_ } from "@utils/lang"
import type { NexusLocation } from "../location"
import { schemaLocationToSchemaLocator } from "./converters"
import {
  _getSchemaLocatorDetails,
  getAllSchemaDetailsFromLocator,
} from "./get-schema-details-from-locator"
import type {
  BooleanPrimitive,
  EntityDetails,
  NumberPrimitive,
} from "./schema-details"
import type { SchemaLocation } from "./schema-location"
import type { SchemaLocationDetails } from "./schema-location-details"

/** Returns metadata about a specific location in the nexus document schema.  */
export const getSchemaLocationDetails = (
  location: SchemaLocation,
): SchemaLocationDetails => {
  const details = _getSchemaLocatorDetails(
    schemaLocationToSchemaLocator(location),
  )
  switch (details.type) {
    case "entity":
    case "array":
      return details
    case "primitive":
    case "object":
      return details.fieldName === "[]"
        ? { ...details, index: location.fieldIndex.at(-1) ?? throw_() }
        : details
  }
}

/** Get number info. Location must point to a number primitive field. */
export const mustGetNumberInfo = (location: NexusLocation): NumberPrimitive => {
  const details = getSchemaLocationDetails(location)
  assert(details.type === "primitive", "location is not a primitive")
  assert(details.primitive.type === "number", "location is not a number")
  return details.primitive
}

/** Get boolean info. Location must point to a boolean primitive field. */
export const mustGetBooleanInfo = (
  location: NexusLocation,
): BooleanPrimitive => {
  const details = getSchemaLocationDetails(location)
  assert(details.type === "primitive", "location is not a primitive")
  assert(details.primitive.type === "boolean", "location is not a boolean")
  return details.primitive
}

/** A list of schema location details, where the first element describes an entity,
 * and the others describe something other than an entity, for convenience.
 */
export type AllSchemaLocationDetails = [
  EntityDetails,
  ...Exclude<SchemaLocationDetails, EntityDetails>[],
]

/** Returns a list `l` where `l[i]` contains details for the segment up until
 * index `i`. Which is, point to a field it will return:
 * * entity (no index)
 * * field 1 details (index 0)
 * * field 2 details (index 1)
 * * ...
 */
export const getAllSchemaLocationDetails = (
  location: SchemaLocation,
): AllSchemaLocationDetails => {
  const [entity, ...fields] = getAllSchemaDetailsFromLocator(
    schemaLocationToSchemaLocator(location),
  )

  const details = fields.map((segment, i) => {
    if (segment.fieldName === "[]") {
      return { ...segment, index: location.fieldIndex[i] }
    }
    return segment as Exclude<SchemaLocationDetails, EntityDetails>
  })
  return [entity, ...details]
}
