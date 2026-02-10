import { NEXUS_SCHEMA_INFO } from "@gen/document/v1/utils/schema"
import { throw_ } from "@utils/lang"
import type { EntityDetails, SchemaDetails } from "./schema-details"
import type { _SchemaLocator } from "./schema-locator"

/** Based on a schema locator, returns the schema path details.
 *
 * This is an internal method
 */
export const _getSchemaLocatorDetails = (path: _SchemaLocator): SchemaDetails =>
  NEXUS_SCHEMA_INFO[path] ??
  throw_("no information found for schema location: " + path)

/** Return the schema info on each segment. */
export const getAllSchemaDetailsFromLocator = (
  location: _SchemaLocator,
): [EntityDetails, ...Exclude<SchemaDetails, EntityDetails>[]] => {
  const [first, ...rest] = location.split(":")
  let cursor = first
  // first one is always entity, don't even have to check that
  const result = [_getSchemaLocatorDetails(first as _SchemaLocator)]
  for (const segment of rest) {
    cursor += `:${segment}`
    const details = _getSchemaLocatorDetails(cursor as _SchemaLocator)
    result.push(details)
  }
  return result as [EntityDetails, ...Exclude<SchemaDetails, EntityDetails>[]]
}
