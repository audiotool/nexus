import type { EntityTypeKey } from "@document/entity-utils"
import { Pointer } from "@gen/document/v1/pointer_pb"
import type { SchemaPath } from "@gen/document/v1/utils/path"
import { Hashable, hashSymbol } from "@utils/hash-map"
import { v5 } from "uuid"
import {
  schemaLocationToSchemaPath,
  schemaPathToSchemaLocation,
} from "./schema/converters"
import type { SchemaLocation } from "./schema/schema-location"

/** A NexusLocation describes a location in the document, either an entity itself,
 *  or a specific field of an entity.
 *
 * NexusLocations implement the SchemaLocation type, which describes a location
 * in the document schema, and can be used to fetch metadata about fields, such
 * as target types.
 */
export class NexusLocation implements SchemaLocation, Hashable {
  readonly entityId: string
  readonly fieldIndex: ReadonlyArray<number>
  readonly entityType: EntityTypeKey | undefined
  #hashString?: string

  constructor(
    entityId: string | undefined = undefined,
    entityType: EntityTypeKey | undefined = undefined,
    fieldIndex: number[] = [],
  ) {
    this.entityId = entityId ?? ""
    this.fieldIndex = fieldIndex
    this.entityType = entityType

    if (entityId !== undefined && entityId !== "" && entityType === undefined) {
      throw new Error("entity type is required if id is set")
    }
  }

  isEmpty(): boolean {
    return this.entityId.length === 0
  }

  equals(other: NexusLocation): boolean {
    return (
      this.entityId === other.entityId &&
      this.fieldIndex.length === other.fieldIndex.length &&
      this.fieldIndex.every((value, index) => value === other.fieldIndex[index])
    )
  }

  /** @internal */
  equalsPointer(other: Pointer | undefined): boolean {
    if (other === undefined) {
      return this.isEmpty()
    }
    return (
      this.entityId === other.entityId &&
      this.fieldIndex.length === other.fieldIndex.length &&
      this.fieldIndex.every((value, index) => value === other.fieldIndex[index])
    )
  }

  /** @internal Returns a copy of this object with an appended field number. */
  withAppendedFieldNumber(fieldNumber: number): NexusLocation {
    return new NexusLocation(this.entityId, this.entityType, [
      ...this.fieldIndex,
      fieldNumber,
    ])
  }

  /** @internal */
  withFieldIndex(fieldIndex: ReadonlyArray<number>): NexusLocation {
    return new NexusLocation(this.entityId, this.entityType, [...fieldIndex])
  }

  /** @internal */
  toPointerMessage(): Pointer {
    return new Pointer({
      entityId: this.entityId,
      fieldIndex: this.fieldIndex.slice(),
    })
  }

  get [hashSymbol](): string {
    if (this.#hashString === undefined) {
      this.#hashString = hashNexusLocation(this.entityId, this.fieldIndex)
    }
    return this.#hashString
  }

  /** Returns a human readable string representation */
  toString(): string {
    if (this.isEmpty()) {
      return `[empty location]`
    }
    const path = schemaLocationToSchemaPath(this)
    return `[location: ${this.entityId}${path}]`
  }

  /** @internal clones the location, updating only the id */
  withId(id: string): NexusLocation {
    return new NexusLocation(id, this.entityType, this.fieldIndex.slice())
  }

  /** @internal */
  static fromPointerMessage(
    getEntityType: (id: string) => EntityTypeKey | undefined,
    pointer: Readonly<Pointer>,
  ): NexusLocation {
    if (pointer.entityId === undefined || pointer.entityId === "") {
      return new NexusLocation()
    }
    const type = getEntityType(pointer.entityId)
    if (type === undefined) {
      throw new Error(
        `entity type for ${pointer.entityId} is undefined for a set pointer: ${pointer.toJsonString()}`,
      )
    }
    return new NexusLocation(pointer.entityId, type, pointer.fieldIndex.slice())
  }

  /** @internal */
  static fromSchemaPath(entityId: string, path: SchemaPath): NexusLocation {
    const { entityType, fieldIndex } = schemaPathToSchemaLocation(path)
    return new NexusLocation(entityId, entityType, fieldIndex as number[])
  }
}

export const hashNexusLocation = (
  entityId: string,
  fieldIndex: readonly number[],
): string =>
  v5(
    `${entityId}/${fieldIndex.join(",")}`,
    "4f4aaf81-65f2-4239-b1df-e34a0729f6b8",
  )
