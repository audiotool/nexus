/**
 * @packageDocumentation
 *
 * This module contains mostly types related to the nexus document.
 */

export type { _EntityWithOverwrites } from "@document/transaction-builder/build-clone-linked-entities"

export type { NexusEntity } from "@document/entity"
export type { EntityTypeKey } from "@document/entity-utils"
export type { NexusEventManager } from "@document/event-manager"
export type {
  ArrayField,
  NexusField,
  PrimitiveField,
  PrimitiveType,
} from "@document/fields"
export type { NexusLocation } from "@document/location"
export type { NexusObject } from "@document/object"
export type { EntityQuery, ReferenceQuery } from "@document/query/entity"
export type { FieldQuery } from "@document/query/field"
export {
  schemaLocationToSchemaPath,
  schemaPathToSchemaLocation,
} from "@document/schema/converters"
export type { EntityWithOverwrites } from "@document/transaction-builder/build-clone-linked-entities"
export { TargetType } from "@gen/document/v1/opt/opt_pb"
export type { EntityTypes } from "@gen/document/v1/utils/types"

export type * from "@gen/document/v1/utils/path"

export { getSchemaLocationDetails } from "@document/schema/get-schema-location-details"

export * from "@document/schema/schema-details"
export type { SchemaLocation } from "@document/schema/schema-location"
export type { SchemaLocationDetails } from "@document/schema/schema-location-details"

export type {
  SafeTransactionBuilder,
  TransactionBuilder,
} from "@document/transaction-builder"

export type { NexusEntityUnion } from "@document/entity"
export type { EntityConstructorType } from "@document/entity-utils"
export type { NexusFieldTypes } from "@document/object"
export type { DevicePresetEntityType } from "@document/transaction-builder/prepare-preset"
