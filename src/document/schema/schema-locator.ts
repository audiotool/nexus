import type { NEXUS_SCHEMA_INFO } from "@gen/document/v1/utils/schema"

/** This type represents a location in the document schema. It can
 * be used to fetch details about that location. It does not contain array indices because those
 * are irrelevant for the pure proto Schema information.
 *
 * This type is more an "internal" type for nexus and doesn't need to be used outside of files
 * implementing nexus.
 */
export type _SchemaLocator = keyof typeof NEXUS_SCHEMA_INFO
