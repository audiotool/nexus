import type { NexusField } from "@document/fields"
import { ArrayField } from "@document/fields"
import type { EntityTypes } from "@gen/document/v1/utils/types"
import type { NexusLocation } from "./location"
import { NexusObject } from "./object"

/** Same as `NexusEntity<T>`, except if `T` is "a" | "b", this will be `NexusEntity<"a"> | NexusEntity<"b">`
 * instead of `NexusEntity<"a" | "b">`.
 */
export type NexusEntityUnion<T extends keyof EntityTypes = keyof EntityTypes> =
  {
    [K in keyof EntityTypes]: NexusEntity<K>
  }[T]

export class NexusEntity<
  E extends keyof EntityTypes = keyof EntityTypes,
> extends NexusObject<EntityTypes[E]> {
  /** The id of this entity. */
  readonly id: string
  /** The entity type key of this entity. */
  readonly entityType: E

  /** @internal */
  constructor(location: NexusLocation, fields: EntityTypes[E]) {
    super(fields, location)
    this.id = location.entityId
    this.entityType = location.entityType as E
  }

  /**
   * @internal
   *
   * Returns a field with a specific field index. Throws if it can't find it.
   */
  _resolveField(fieldNumbers: ReadonlyArray<number>): NexusField {
    if (fieldNumbers.length === 0) {
      throw "tried resolving empty field path"
    }

    const [first, ...rest] = fieldNumbers
    let cursor = this._getField(first)
    for (const fieldNumber of rest) {
      if (cursor instanceof NexusObject) {
        cursor = cursor._getField(fieldNumber)
        continue
      }
      if (cursor instanceof ArrayField) {
        cursor = cursor.array[fieldNumber]
        continue
      }

      // if we get here, we're trying to access a field number on a non-object and non-array field
      throw `tried resolving field number ${fieldNumber} on non-object field ${cursor}`
    }
    return cursor
  }
}
