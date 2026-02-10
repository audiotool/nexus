import type { TargetType } from "@gen/document/v1/opt/opt_pb"
import type { AsyncLock } from "@utils/async-lock"
import { throw_ } from "@utils/lang"
import type { PrimitiveType } from "../fields"
import { PrimitiveField, type NexusField } from "../fields"
import type { NexusLocation } from "../location"
import { getSchemaLocationDetails } from "../schema/get-schema-location-details"

export class FieldQuery<T extends NexusField | PrimitiveField<PrimitiveType>> {
  #getFields: () => ReadonlyArray<NexusField>
  #getRefs: () => ReadonlyMap<NexusLocation, NexusLocation[]>
  #filterFields: (field: NexusField) => boolean
  #documentLock: AsyncLock | undefined

  constructor({
    getFields,
    getRefs,
    filterFields,
    documentLock,
  }: {
    getFields: () => ReadonlyArray<NexusField>
    getRefs: () => ReadonlyMap<NexusLocation, NexusLocation[]>
    filterFields: (location: NexusField) => boolean
    documentLock: AsyncLock | undefined
  }) {
    this.#getFields = getFields
    this.#getRefs = getRefs
    this.#filterFields = filterFields
    this.#documentLock = documentLock
  }

  /** Only keep fields that are marked with target type appearing in `targetTypes`. */
  ofTargetTypes(...targetTypes: (keyof typeof TargetType)[]): FieldQuery<T> {
    return this.#withAppendedFilters((field) =>
      getSchemaLocationDetails(field.location).targetTypes.some((tt) =>
        targetTypes.includes(tt),
      ),
    )
  }

  /** Only keep fields that aren't pointed to by any other field in the nexus document. */
  notPointedTo(): FieldQuery<T> {
    return this.#withAppendedFilters((field) => {
      const refs = this.#getRefs().get(field.location)
      return refs === undefined || refs.length === 0
    })
  }

  pointedToBy(location: NexusLocation): FieldQuery<T> {
    return this.#withAppendedFilters((field) => {
      const refs = this.#getRefs().get(field.location)
      return refs !== undefined && refs.some((ref) => ref.equals(location))
    })
  }

  primitiveFields(): FieldQuery<PrimitiveField<PrimitiveType>> {
    return this.#withAppendedFilters(
      (field) => field instanceof PrimitiveField,
    ) as FieldQuery<PrimitiveField<PrimitiveType>>
  }

  /** Returns all primitive fields selected using this query */
  get(): T[] {
    return this.#getFields().filter((f) => this.#filterFields(f)) as T[]
  }

  /** Returns the first primitive field of the result, or undefined if the query is empty.
   */
  getOne(): T | undefined {
    return this.get()[0]
  }

  /** Returns all primitive fields selected using this query, as
   * part of a ComparableMap that maps entity ids to fields for that entity.
   */
  getByEntity(): Map<string, T[]> {
    this.#assertLocked()
    const map = new Map<string, T[]>()
    this.get().forEach((field) => {
      if (!map.has(field.location.entityId)) {
        map.set(field.location.entityId, [])
      }
      ;(map.get(field.location.entityId) ?? throw_()).push(field)
    })
    return map
  }

  #withAppendedFilters(filter: (field: NexusField) => boolean): FieldQuery<T> {
    return new FieldQuery({
      getFields: this.#getFields,
      getRefs: this.#getRefs,
      filterFields: (field) => this.#filterFields(field) && filter(field),
      documentLock: this.#documentLock,
    })
  }

  #assertLocked() {
    if (!(this.#documentLock?.locked ?? true)) {
      throw new Error("Document is not locked")
    }
  }
}
