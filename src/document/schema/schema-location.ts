import type { NexusLocation } from "../location"
import type { SchemaPath } from "./schema-path"

/**
 * Schema locations point to a specific field's schema in the document.
 *
 * This is useful when relevant schema info is needed but the array index is also relevant. Labels of fields,
 * for example, require the array index to be specified. {@link NexusLocation} satisfies {@link SchemaLocation}.
 *
 * They contain the same information as {@link SchemaPath}, in a less human-readable format.
 */
export type SchemaLocation = Pick<NexusLocation, "entityType" | "fieldIndex">
