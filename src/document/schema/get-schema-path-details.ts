import { schemaPathToSchemaLocation } from "./converters"
import { getSchemaLocationDetails } from "./get-schema-location-details"
import type { SchemaLocationDetails } from "./schema-location-details"
import type { SchemaPath } from "./schema-path"

/** Extract schema location details from a schema path. */
export const getSchemaPathDetails = (path: SchemaPath): SchemaLocationDetails =>
  getSchemaLocationDetails(schemaPathToSchemaLocation(path))
