import type { EntityConstructorType } from "@document/entity-utils"
import { NexusLocation } from "../location"

/** Takes a constructor type argument, clones it, and applies a mapping
 * function to all locations.
 */
export const mapConstructorLocations = <C extends EntityConstructorType>(
  cons: C,
  fn: (loc: NexusLocation) => NexusLocation,
): C => {
  const updateLocations = (cons: unknown): unknown => {
    if (cons instanceof NexusLocation) {
      return fn(cons)
    }
    if (cons instanceof Array) {
      return cons.map((el) => updateLocations(el))
    }
    if (typeof cons === "object" && cons != null) {
      const ret: Record<string, unknown> = {}
      Object.entries(cons).forEach(([key, value]) => {
        ret[key as string] = updateLocations(value)
      })
      return ret
    }
    return cons
  }
  return updateLocations(cons) as C
}
