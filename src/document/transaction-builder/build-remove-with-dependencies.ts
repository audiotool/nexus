import type { Modification } from "@gen/document/v1/document_service_pb"
import toposort from "toposort"
import type { EntityQuery } from "../query/entity"
import { buildModificationForRemove } from "./build-remove"

/** @internal Builds a modification that removes an entity and all entities that depend on it. */
export const buildModificationForRemoveWithDependencies = (
  id: string,
  query: EntityQuery,
): Modification[] => {
  // then, build the set of entities we have to remove
  const entitiesToDelete: Set<string> = new Set()
  const toDeleteEdges: [string, string][] = []
  entitiesToDelete.add(id)

  // Here, we build the set of `entitiesToDelete` by going over ids in the set,
  // and adding all ids that the reference the id. This works because in js, a forEach callback
  // visits only new elements added to the set during the iteration.
  //
  // We also add the edge that is responsible for us adding the new id in the first place. We later
  // use it to sort the entities topologically.
  //
  // `toDeleteEdges` will contain _all_ edges between the ids contained in `entitiesToDelete`, since we
  // visit all ids in the set in the `forEach` callback, and add all edges adjacent to the id to `toDeleteEdges`.
  //
  // `toDeleteEdges` will contain all edges at most once, since the edges are directed there's only one `id`
  // that can result in the edge being added to `toDeleteEdges`, and we visit each id at most once.
  entitiesToDelete.forEach((id) => {
    query.pointingTo
      .entities(id)
      .get()
      .forEach((from) => {
        toDeleteEdges.push([from.id, id])
        entitiesToDelete.add(from.id)
      })
  })

  let sortedEntities: string[]
  if (toDeleteEdges.length > 0) {
    // sort the entities topologically, so we remove them in the correct order
    sortedEntities = toposort(toDeleteEdges)
  } else {
    sortedEntities = [id]
  }

  return sortedEntities.map((id) => buildModificationForRemove(id))
}
