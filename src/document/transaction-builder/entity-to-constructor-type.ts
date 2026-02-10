import type {
  EntityConstructorType,
  EntityTypeKey,
} from "@document/entity-utils"

import type { NexusEntity } from "../entity"
import type { NexusField, PrimitiveType } from "../fields"
import { ArrayField, PrimitiveField } from "../fields"
import { NexusLocation } from "../location"
import { NexusObject } from "../object"

/** Takes an entity, and returns that entity as `ConstructorType` */
export const entityToConstructorType = <T extends EntityTypeKey>(
  entity: NexusEntity<T>,
): EntityConstructorType<T> => convertField(entity) as EntityConstructorType<T>

/** Converts a nexus field to constructor type. Defined separately for recursion. */
const convertField = (value: NexusField): object => {
  if (value instanceof ArrayField) {
    return value.array.map((v) => convertField(v))
  }
  if (value instanceof NexusObject) {
    const result: Record<string, PrimitiveType | object> = {}
    Object.entries(value.fields).forEach(([key, v]) => {
      // skip `Empty` nexus objects
      if (
        !(v instanceof NexusObject && Object.entries(v.fields).length === 0)
      ) {
        result[key] = convertField(v as NexusField)
      }
    })
    return result
  }

  if (value instanceof PrimitiveField) {
    if (value.value instanceof NexusLocation) {
      return value.value
    }
    return value.value
  }

  throw new Error(`unknown value ${value} `)
}
