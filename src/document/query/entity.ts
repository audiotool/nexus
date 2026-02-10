import type { EntityTypeKey } from "@document/entity-utils"
import type { TargetType } from "@gen/document/v1/opt/opt_pb"
import type { AsyncLock } from "@utils/async-lock"
import { assert, throw_ } from "@utils/lang"
import {
  nexusDocumentState,
  type NexusDocumentState,
} from "../document-state/state"
import type { NexusEntityUnion } from "../entity"
import { NexusEntity } from "../entity"
import type { NexusField } from "../fields"
import { ArrayField, PrimitiveField } from "../fields"
import type { NexusLocation } from "../location"
import type { NexusFieldTypes } from "../object"
import { NexusObject } from "../object"
import { getSchemaLocationDetails } from "../schema/get-schema-location-details"
import { FieldQuery } from "./field"

/**
 * @internal
 * Internal type alias of the type returned by `#getEntities()`, for brevity. */
type TypedEntityMap<T extends EntityTypeKey = EntityTypeKey> = ReadonlyMap<
  string,
  NexusEntityUnion<T>
>

/**
 * @internal
 * Type alias of the type returned by `#getRefs()`, for brevity. */
type RefsMap = ReadonlyMap<NexusLocation, NexusLocation[]>

/**
 *
 * Provides facilities to query the nexus document.
 *
 * Once the query is built, execute it by calling `get()`.
 *
 * There are two ways to get access to an entity query.
 * * by creating a transaction and accessing the field `{@link TransactionBuilder.entities}`
 * * by accessing the field `{@link NexusDocument.queryEntitiesWithoutLock}`
 *
 * Example usage:
 * ```
 * const nexus = new NexusDocument()
 * await nexus.modify(t => {
 *   // all entities of the nexus document
 *   const allEntities = t.entities.get()
 *
 *   // all connections pointing to a tb303
 *   const tb303Entity = ...
 *   const connections = t.entities
 *        .ofTypes("desktopAudioCable", "desktopNoteCable")
 *        .pointingToEntity(tbt303Entity.id)
 *        .get()
 * })
 *
 * // the returned values are typed; `connections` is of type
 * // NexusEntity<'desktopAudioCable' | 'desktopNoteCable'>[]
 * // so we can access shared fields of the entity:
 * const fromSocket = connections[0]?.fields.fromSocket
 * ```
 *
 * If the results of a query are used to create a transaction, the `entities` of the
 * `TransactionBuilder` should be used. Transactions are created asynchronously, so
 * the result of the query can become out of date once the transaction lock is acquired,
 * and transaction errors can occur.
 *
 * Entity queries can technically be "recycled", meaning that
 * you can type:
 * ```
 * const t = await nexus.createTransaction()
 * const query = t.entities.pointingTo.entities(bassline3)
 * const audioConnsToBassline3 = query.ofTypes("desktopAudioCable").get()
 * const noteConnsToBassline3 = query.ofTypes("desktopNoteCable").get()
 * t.send()
 * ```
 *
 * However, note that queries created this way will throw if they're used outside of a transaction.
 *
 * To query the document without awaiting the transaction lock, you can use
 * ```
 * nexus.queryEntitiesWithoutLock.ofTypes("desktopAudioCable").get()
 * ```
 *
 */
export class EntityQuery<T extends EntityTypeKey = EntityTypeKey> {
  readonly #documentState: NexusDocumentState

  /** This function filters & transforms entities. When modifying a query,
   * (e.g. with `ofTypes`, we basically "append" another function
   * to this one that filters and casts the entities.
   *
   * When calling `run`, we get all entities and filter them using this function
   * before returning all existing entities.
   */
  #filterEntities: (
    entities: TypedEntityMap<EntityTypeKey>,
  ) => TypedEntityMap<T>

  #documentLock: AsyncLock | undefined

  /** Don't construct this class, it is constructed by NexusDocument. */
  constructor(opts?: {
    documentState?: NexusDocumentState
    filterEntities?: (
      entities: TypedEntityMap<EntityTypeKey>,
    ) => TypedEntityMap<T>
    documentLock?: AsyncLock | undefined
  }) {
    this.#documentState = opts?.documentState ?? nexusDocumentState()
    this.#filterEntities =
      opts?.filterEntities ??
      (((entities) => entities) as (
        entities: TypedEntityMap<EntityTypeKey>,
      ) => TypedEntityMap<T>)
    this.#documentLock = opts?.documentLock
  }

  /** Returns all entities selected by this query, in undefined order.
   */
  get(): NexusEntityUnion<T>[] {
    this.#assertLocked()
    return [...this.#filterEntities(this.#documentState.entities).values()]
  }

  /** Returns the first entity returned by `get()`, if any.
   *
   *  Since the order of entities in `get()` is undefined, which of the selected
   * entity this method returns is also undefined. This method is intended to be used
   * if it's known that the query will return at most one entity.
   */
  getOne(): NexusEntityUnion<T> | undefined {
    this.#assertLocked()
    return this.get()[0]
  }

  /** Of all selected entities, return the one with id `id`, if it exists. */
  getEntity(uuid: string): NexusEntityUnion<T> | undefined {
    this.#assertLocked()
    return this.#filterEntities(this.#documentState.entities).get(uuid)
  }

  /**
   * Of all selected entities, return the one with id `id`. Throw if it doesn't
   * exist.
   */
  mustGetEntity(uuid: string): NexusEntityUnion<T> {
    return this.getEntity(uuid) ?? throw_(`can't find entity with uuid ${uuid}`)
  }

  /**
   * Get an entity as a specific type, if it exists and has the type matching one
   * of the provided types.
   */
  getEntityAs<E extends T>(
    uuid: string,
    ...types: E[]
  ): NexusEntityUnion<E> | undefined {
    this.#assertLocked()

    assert(types.length > 0, "must provide at least one type")

    const entity = this.getEntity(uuid)

    if (entity === undefined) {
      return undefined
    }

    if (!(types as string[]).includes(entity.entityType)) {
      return undefined
    }

    return entity as NexusEntityUnion<E>
  }

  /**
   * Get an entity as a specific type, if it has the type matching one of the
   * provided types. Throw if it doesn't exist.
   */
  mustGetEntityAs<E extends T>(
    uuid: string,
    ...types: E[]
  ): NexusEntityUnion<E> {
    this.#assertLocked()

    assert(types.length > 0, "must provide at least one type")

    const entity = this.mustGetEntity(uuid)

    if (!(types as string[]).includes(entity.entityType)) {
      return throw_(
        `entity with uuid ${uuid} is not of any of the provided types ${types}`,
      )
    }

    return entity as NexusEntityUnion<E>
  }

  /** Only keep entities whose id appears in `ids`. */
  withIds(...uuids: string[]): EntityQuery<T> {
    return this.#withAppendedFilter((entities) =>
      filterByUuids(entities, uuids),
    )
  }

  /** Return the `FieldQuery<NexusField>` that starts with all fields of all
   * currently selected entities.
   */
  fields(): FieldQuery<NexusField> {
    return new FieldQuery<NexusField>({
      getFields: () =>
        [
          ...this.#filterEntities(this.#documentState.entities).values(),
        ].flatMap((entity) => toFields(entity)),
      getRefs: () => this.#documentState.references,
      filterFields: () => true,
      documentLock: this.#documentLock,
    })
  }

  /** Only keep entities whose messages are marked with a target type appearing
   * in `targetTypes`. Target types of fields of entities are ignored.
   */
  ofTargetTypes(...targetTypes: (keyof typeof TargetType)[]): EntityQuery<T> {
    return this.#withAppendedFilter((entities) => {
      const clone = new Map()
      entities.forEach((entity, entityId) => {
        if (
          getSchemaLocationDetails(entity.location).targetTypes.some((tt) =>
            targetTypes.includes(tt),
          )
        ) {
          clone.set(entityId, entity)
        }
      })
      return clone as TypedEntityMap<T>
    })
  }

  /** Check if a specific entity is contained in the current query. */
  has(uuidOrEntity: string | NexusEntity): boolean {
    this.#assertLocked()
    const uuid =
      typeof uuidOrEntity === "string" ? uuidOrEntity : uuidOrEntity.id
    return this.#filterEntities(this.#documentState.entities).has(uuid)
  }

  /** Only keep entities whose type string appears in `types`. */
  ofTypes<Q extends EntityTypeKey[]>(...types: Q): EntityQuery<Q[number] & T> {
    return this.#withAppendedFilter((entities) => filterByType(entities, types))
  }

  /** Omit entities whose type string appears in `types`. */
  notOfTypes<Q extends EntityTypeKey[]>(
    ...types: Q
  ): EntityQuery<Exclude<T, Q[number]>> {
    return this.#withAppendedFilter((entities) => omitByType(entities, types))
  }

  /** Only keep entities that have some fields that point to:
   * * `entityOfType`: some field of entities of a set of types
   * * `locations`: specific locations
   * * `entities`: some field of specific entities
   *
   * Passing an empty list to any of these methods will result in an empty query result.
   *
   * Use e.g. like:
   * ```
   * nexus.entities.pointingTo.entitiesOfType("tb303").get()
   * ```
   */
  get pointingTo(): ReferenceQuery<T> {
    return {
      entityOfType: (...types) =>
        this.#withAppendedFilter((entities) =>
          filterByUuids(
            entities,
            getUuidsPointingToTypes(
              this.#documentState.references,
              this.#documentState.entities,
              ...types,
            ),
          ),
        ),
      locations: (...locs) =>
        this.#withAppendedFilter((entities) =>
          filterByUuids(
            entities,
            getUuidsPointingToLocations(this.#documentState.references, locs),
          ),
        ),
      entities: (...ids) =>
        this.#withAppendedFilter((entities) =>
          filterByUuids(
            entities,
            getUuidsPointingToEntities(this.#documentState.references, ids),
          ),
        ),
    }
  }

  /** Only keep entities that are themselves, or have fields that are, pointed to by:
   * * `entityOfType`: some field of entities of a set of types
   * * `locations`: specific locations
   * * `entities`: some field of specific entities
   *
   * Passing an empty list to any of these methods will result in an empty query result.
   *
   * Use e.g. as:
   * ```
   * nexus.entities.pointedToBy.entitiesOfType("tb303").get()
   * ```
   */
  get pointedToBy(): ReferenceQuery<T> {
    return {
      entityOfType: (...types) =>
        this.#withAppendedFilter((entities) =>
          filterByUuids(
            entities,
            getUuidsPointedToByTypes(
              this.#documentState.references,
              this.#documentState.entities,
              ...types,
            ),
          ),
        ),
      locations: (...locs) =>
        this.#withAppendedFilter((entities) =>
          filterByUuids(
            entities,
            getUuidsPointedToByLocations(this.#documentState.references, locs),
          ),
        ),
      entities: (...ids) =>
        this.#withAppendedFilter((entities) =>
          filterByUuids(
            entities,
            getUuidsPointedToByEntities(this.#documentState.references, ids),
          ),
        ),
    }
  }

  /** Return a copy of this class, with a new function "appended" to the
   * filter pipeline. The filter can change the type of the entity, or
   * remove entities from the query.
   */
  #withAppendedFilter<Q extends EntityTypeKey>(
    filter: (from: TypedEntityMap<T>) => TypedEntityMap<Q>,
  ): EntityQuery<Q> {
    return new EntityQuery({
      documentState: this.#documentState,
      filterEntities: (entities) => filter(this.#filterEntities(entities)),
      documentLock: this.#documentLock,
    })
  }

  #assertLocked() {
    if (!(this.#documentLock?.locked ?? true)) {
      throw new Error("EntityQuery method called without locking the document")
    }
  }
}

/** Internal type used for `pointingTo` and `pointedToBy`.
 *
 * Because we don't know which entities point to or are pointed to by which entities,
 * the return type doesn't change.
 *  */
export type ReferenceQuery<T extends EntityTypeKey> = {
  entityOfType<Q extends EntityTypeKey[]>(...types: Q): EntityQuery<T>
  locations(...loc: NexusLocation[]): EntityQuery<T>
  entities(...ids: string[]): EntityQuery<T>
}

/** Takes an EntityMap<T>, returns the map that contains the intersection of the types
 * of the original map, with the types given through the `types` argument.
 */
const filterByType = <S extends EntityTypeKey, Ts extends EntityTypeKey[]>(
  entityMap: TypedEntityMap<S>,
  types: Ts,
): TypedEntityMap<Ts[number] & S> => {
  const filteredMap = new Map()
  ;[...entityMap.values()]
    .filter((entity) => types.includes(entity.entityType))
    .forEach((entity) => filteredMap.set(entity.id, entity))
  return filteredMap as TypedEntityMap<(typeof types)[number] & S>
}

/** Takes an EntityMap<T>, returns the map that does not contain types given
 * through the `types` argument.
 */
const omitByType = <S extends EntityTypeKey, Ts extends EntityTypeKey[]>(
  entityMap: TypedEntityMap<S>,
  types: Ts,
): TypedEntityMap<Exclude<S, Ts[number]>> => {
  const filteredMap = new Map()
  ;[...entityMap.values()]
    .filter((entity) => !types.includes(entity.entityType))
    .forEach((entity) => filteredMap.set(entity.id, entity))
  return filteredMap as TypedEntityMap<Exclude<S, Ts[number]>>
}

/** Returns the entity map that contains the subset of entities that
 * are also in the list of uuids
 */
const filterByUuids = <T extends EntityTypeKey>(
  entityMap: TypedEntityMap<T>,
  uuids: string[],
): TypedEntityMap<T> => {
  const filteredMap = new Map()
  uuids.forEach((uuid) => {
    const entity = entityMap.get(uuid)
    if (entity !== undefined) {
      filteredMap.set(uuid, entityMap.get(uuid))
    }
  })
  return filteredMap as TypedEntityMap<T>
}

/** Given a references map, returns al uuids pointing to one of a list of locations*/
const getUuidsPointingToLocations = (
  refs: RefsMap,
  locs: NexusLocation[],
): string[] =>
  locs.flatMap((loc) => refs.get(loc)?.map((loc) => loc.entityId) ?? [])

/** Given a references map, returns all uuids that have pointers to one of a list of entities */
const getUuidsPointingToEntities = (refs: RefsMap, ids: string[]): string[] =>
  [...refs.entries()]
    .filter(([to, _]) => ids.some((id) => to.entityId === id))
    .flatMap(([_, froms]) => froms.map((loc) => loc.entityId))

const getUuidsPointedToByLocations = (
  refs: RefsMap,
  locs: NexusLocation[],
): string[] =>
  [...refs.entries()]
    .filter(([_, froms]) =>
      locs.some((loc) => froms.some((fromLoc) => loc.equals(fromLoc))),
    )
    .map(([to, _]) => to.entityId)

const getUuidsPointingToTypes = (
  refs: RefsMap,
  entities: TypedEntityMap,
  ...types: EntityTypeKey[]
): string[] =>
  [...refs.entries()]
    .filter(([to, _]) => {
      const entity = entities.get(to.entityId)
      return entity !== undefined && types.includes(entity.entityType)
    })
    .flatMap(([_, froms]) => froms.map((loc) => loc.entityId))

const getUuidsPointedToByTypes = (
  refs: RefsMap,
  entities: TypedEntityMap,
  ...types: EntityTypeKey[]
): string[] =>
  [...refs.entries()]
    .filter(([_, froms]) =>
      froms.some((from) => {
        const entity = entities.get(from.entityId)
        return entity !== undefined && types.includes(entity.entityType)
      }),
    )
    .map(([to, _]) => to.entityId)

/*** Given a references map, returns a list of uuids pointed to bya pointer in an entity */
const getUuidsPointedToByEntities = (refs: RefsMap, ids: string[]): string[] =>
  [...refs.entries()]
    .filter(([_, froms]) =>
      ids.some((id) => froms.some((loc) => loc.entityId === id)),
    )
    .map(([to, _]) => to.entityId)

const toFields = (entity: NexusEntity): NexusField[] => {
  const getFieldLocations = (field: NexusField): NexusField[] => {
    if (field instanceof PrimitiveField) {
      return [field]
    }

    if (field instanceof ArrayField) {
      return [field, ...field.array.flatMap((f) => getFieldLocations(f))]
    }

    if (field instanceof NexusObject) {
      const objectFields = Object.values(
        (field as NexusObject<NexusFieldTypes>).fields,
      ).flatMap((fields): NexusField[] => getFieldLocations(fields))

      return field instanceof NexusEntity
        ? objectFields
        : [field, ...objectFields]
    }

    throw new Error(`field of unknown type: ${field}`)
  }
  return getFieldLocations(entity)
}
