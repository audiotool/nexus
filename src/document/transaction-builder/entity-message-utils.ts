import type { EntityMessage } from "@document/entity-utils"
import { Pointer } from "@gen/document/v1/pointer_pb"
import { throw_ } from "@utils/lang"
import toposort from "toposort"

/** Topologically sorts a list of entity messages. */
export const toposortEntityMessages = (
  entityMessages: EntityMessage[],
): EntityMessage[] => {
  const entityMap = new Map(entityMessages.map((entity) => [entity.id, entity]))

  const links: [string, string][] = []
  entityMessages.forEach((entity) => {
    visitPointers(entity, (pointer) => {
      if (entityMap.has(pointer.entityId)) {
        links.push([entity.id, pointer.entityId])
      }
    })
  })

  const toposorted = toposort(links)
    .reverse()
    .map((id) => entityMap.get(id) ?? throw_())
  const unsorted = entityMessages.filter(
    (entity) => !toposorted.includes(entity),
  )

  return [...toposorted, ...unsorted]
}

/**
 * Visits all pointers of an entity message.
 */
export const visitPointers = (
  of: EntityMessage | unknown,
  callback: (pointer: Pointer) => void,
) => {
  if (of instanceof Pointer) {
    callback(of)
    return
  }

  if (of instanceof Array) {
    of.forEach((element) => visitPointers(element, callback))
    return
  }

  if (typeof of === "object") {
    Object.values(of as Record<string, unknown>).forEach((value) =>
      visitPointers(value, callback),
    )
    return
  }

  // ignore primitives
  if (["string", "number", "boolean", "bigint"].includes(typeof of)) {
    return
  }

  throw new Error(`unknown type ${typeof of}: ${of}`)
}
