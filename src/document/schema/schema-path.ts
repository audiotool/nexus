/** Re-exported here for completeness.
 *
 * This is equivalent to `SchemaLocation` but more human-readable.
 *
 * /** This is a generated type that is a subset of \`string\` that represents a path
 * to a field in the schema.
 *
 * Examples:
 * \`\`\`ts
 * import { SchemaPath } from "@audiotool/nexus/utils/path"
 *
 * "/desktopAudioCable" satisfies SchemaPath
 * "/desktopAudioCable/audioInput" satisfies SchemaPath
 * "/heisenberg/pitchEnvelope/releaseBendFactor" satisfies SchemaPath
 * "/heisenberg/operators/0/pitchEnvelope/releaseBendFactor" satisfies SchemaPath
 * \`\`\`
 *
 * Converter functions:
 * * {@link document.schemaLocationToSchemaPath}
 * * {@link document.schemaPathToSchemaLocation}
 */

export type { SchemaPath } from "@gen/document/v1/utils/path"
