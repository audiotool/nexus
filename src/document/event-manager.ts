import type { NexusEntity, NexusEntityUnion } from "@document/entity"
import type { NexusLocation } from "@document/location"
import type { EntityTypes } from "@gen/document/v1/utils/types"
import { HashMap } from "@utils/hash-map"
import { throw_ } from "@utils/lang"
import { Terminable, TerminableBuilder } from "@utils/terminable"
import {
  nexusDocumentState,
  type NexusDocumentState,
} from "./document-state/state"
import type { PrimitiveField, PrimitiveType } from "./fields"

/** @internal */
type CreateCallback = (location: NexusEntity) => void

/** @internal */
type UpdateCallback = (value: PrimitiveType) => void

/** @internal */
type RemoveCallback = (entity: NexusEntity) => void

/** @internal */
type PointerCallback = (source: NexusLocation) => void

/** Can be used to subscribe to changes in the document.
 *
 * Events for all existing entities are dispatched after {@link index.SyncedDocument.start} is called;
 * after this, they are dispatched either:
 * * as a result of remote changes, which happens while the transaction lock isn't taken by your code
 * * as a result of local changes made using a {@link document.TransactionBuilder}
 *
 * @example
 * ```ts
 * nexus.events.onCreate("tonematrix", (tm) => {
 *   console.debug("tonematrix created")
 *   return () => console.debug("tonematrix removed")
 * })
 * await nexus.modify(t => t.create("tonematrix", {}))
 * ```
 *
 *
 * When modifying the document using the {@link document.TransactionBuilder}, the event callbacks are
 * executed _immediately_ during the callback that creates the modification(s).
 *
 *
 * @example
 * ```ts
 * const tm = await nexus.modify((t) => t.create("tonematrix", {}))
 *
 * // attach onUpdate callback
 * nexus.events.onUpdate(tm.fields.isActive, (isActive) =>
 *   console.debug("(2) updating", isActive === tm.fields.isActive.value),
 * )
 *
 * await nexus.modify((t) => {
 *   console.debug("(1) will update")
 *   // update the field - callback above is executed before this method returns
 *   t.update(tm.fields.isActive, true)
 *  console.debug("(3) have updated")
 * })
 * ```
 *
 */
export class NexusEventManager {
  /**
   * @internal
   * For debugging purposes, the first instance of the nexus event manager ever created. */
  static debugWindowInstance: NexusEventManager | undefined

  #updateCallbacks: HashMap<NexusLocation, Set<UpdateCallback>> = new HashMap()
  #createCallbacks: Map<keyof EntityTypes | "*", Set<CreateCallback>> =
    new Map()

  /** contains either: entity id, *, or entity type */
  #removeCallbacks: Map<string | "*" | keyof EntityTypes, Set<RemoveCallback>> =
    new Map()

  #pointingToCallbacks: HashMap<NexusLocation, Set<PointerCallback>> =
    new HashMap()
  #stopPointingToCallbacks: HashMap<NexusLocation, Set<PointerCallback>> =
    new HashMap()

  #state: NexusDocumentState

  constructor(documentState: NexusDocumentState = nexusDocumentState()) {
    this.#state = documentState
    NexusEventManager.debugWindowInstance ??= this
  }

  /**
   * Subscribe to the event that an entity of a specific type is created.
   *
   * @returns A terminable that when terminated will stop dispatching new onCreate events. Cleanup functions that were returned
   * during entity creation will still be called on removal of the entity.
   */
  onCreate<T extends keyof EntityTypes | "*">(
    /**
     * The entity type to subscribe to, or `*` to subscribe to the creation of all entity types.
     */
    entityType: T,
    /**
     * The callback called right after the entity is created.
     *
     * @example
     * ```ts
     * nexus.events.onCreate("tonematrix", (tm) => {
     *   console.debug("tonematrix", tm.id, "created")
     *   return () => console.debug("tonematrix", tm.id, "removed")
     * })
     * ```
     *
     * @returns Optionally a function that's called when the created entity is removed.
     */
    callback: (
      /** The entity that was just created. */
      entity: NexusEntityUnion<T extends "*" ? keyof EntityTypes : T>,
    ) => void | (() => void),
  ): Terminable {
    // Note: Here we cast a (entity: NexusEntity<T>) => void to a `(entity: NexusEntity) => void callback.
    // This works because we already assured that the entity is of the correct type with `entityType`.
    const castedCallback: CreateCallback = (e) => {
      const ret = callback(
        e as NexusEntityUnion<T extends "*" ? keyof EntityTypes : T>,
      )
      if (ret !== void 0) {
        this.onRemove(e, ret)
      }
    }

    const callbacks = getOrDefault(this.#createCallbacks, entityType)
    callbacks.add(castedCallback)

    return TerminableBuilder.terminableFrom(() =>
      this.#createCallbacks.get(entityType)?.delete(castedCallback),
    )
  }

  /** @internal */
  _dispatchCreate(entity: NexusEntity) {
    ;[
      ...(this.#createCallbacks.get("*") ?? []),
      ...(this.#createCallbacks.get(entity.entityType) ?? []),
    ].forEach((callback) => callback(entity))
  }

  /**
   * Subscribe to updates of a mutable primitive field in the nexus document.
   *
   * @returns A terminable that when terminated will stop dispatching new onUpdate events.
   */
  onUpdate<P extends PrimitiveType>(
    /** primitive field whose updates are subscribed to */
    field: PrimitiveField<P, "mut">,
    /**
     * The callback called right after the update.
     * */
    callback: (
      /** the new value the field receives, and will always match the current field value of the field listened on. */
      value: P,
    ) => void,
    /** Whether the callback should be triggered immediately with the current value of the field */
    initialTrigger: boolean = true,
  ): Terminable {
    // Note: Here we also "upcast" from `(value: P) => void` to a `(value: PrimitiveType) => void` callback.
    // This works because we know that the value is of the correct type with `field`.
    const castedCallback = callback as UpdateCallback

    const callbacks = getOrDefault(this.#updateCallbacks, field.location)
    callbacks.add(castedCallback)

    if (initialTrigger) {
      callback(field.value)
    }
    return TerminableBuilder.terminableFrom(() =>
      this.#updateCallbacks.get(field.location)?.delete(castedCallback),
    )
  }

  /** @internal */
  _dispatchUpdate<P extends PrimitiveType>(location: NexusLocation, value: P) {
    this.#updateCallbacks.get(location)?.forEach((callback) => callback(value))
  }

  /**
   * Subscribe to an event where an entity is removed.
   *
   * @example
   * ```ts
   * const tm = await nexus.modify(t => t.create("tonematrix", {}))
   * nexus.events.onRemove(tm, (tm) => console.debug("tonematrix", tm.id, "removed"))
   * ```
   *
   *
   * @returns A terminable that when terminated will stop dispatching new onRemove events.
   */
  onRemove<F extends keyof EntityTypes>(
    /** The entity whose removal triggers the callback, or `*` to subscribe to the removal of all entities. */
    entity: NexusEntity<F> | "*",
    /**
     * The callback called right after the entity is removed.
     */
    callback: (
      /** The entity that was just removed. */
      entity: NexusEntityUnion<F>,
    ) => void,
  ): Terminable {
    // since we listen to the removal of a specific entity of type `F`
    // we can safely cast to RemoveCallback here.
    const castedCallback = callback as RemoveCallback

    const callbacks = getOrDefault(
      this.#removeCallbacks,
      typeof entity === "string" ? entity : entity.id,
    )
    callbacks.add(castedCallback)

    return TerminableBuilder.terminableFrom(() =>
      this.#removeCallbacks
        .get(typeof entity === "string" ? entity : entity.id)
        ?.delete(castedCallback),
    )
  }

  /** @internal */
  _dispatchRemove(entity: NexusEntity): void {
    // call on remove callbacks
    ;[
      ...(this.#removeCallbacks.get("*") ?? []),
      ...(this.#removeCallbacks.get(entity.id) ?? []),
      ...(this.#removeCallbacks.get(entity.entityType) ?? []),
    ].forEach((callback) => callback(entity))

    // remove onRemove callbacks
    this.#removeCallbacks.delete(entity.id)

    // remove pointingTo callbacks
    ;[...this.#pointingToCallbacks.keys()]
      .filter((to) => to.entityId === entity.id)
      .forEach((to) => this.#pointingToCallbacks.delete(to))

    // remove stopPointingTo callbacks
    ;[...this.#stopPointingToCallbacks.keys()]
      .filter((to) => to.entityId === entity.id)
      .forEach((to) => this.#stopPointingToCallbacks.delete(to))

    // remove update callbacks
    ;[...this.#updateCallbacks.keys()]
      .filter((of) => of.entityId === entity.id)
      .forEach((of) => this.#updateCallbacks.delete(of))
  }

  /** Subscribe to the event that some pointer in the document starts pointing to a given location.
   *
   * @example
   * ```ts
   * const tm = await nexus.modify(t => t.create("tonematrix", {}))
   * nexus.events.onPointingTo(tm.fields.audioOutput, (from) =>
   *  console.debug(
   *    "pointing from field",
   *    from.toString(),
   *    "which is entity",
   *    nexus.queryEntities.getEntity(from.entityId)?.id
   * ))
   * ```
   *
   * If the pointer is the result of an entity being created, then `onCreate` is called before this callback.
   *
   * @returns A terminable that when terminated will stop dispatching new onPointingTo events.
   */
  onPointingTo(
    /** The location that is being pointed to */
    to: NexusLocation,
    /** Called right after `from` starts pointing to `to`. */
    callback: (
      /** The location that points to `to`. `from` is always the location of a pointer field.*/
      from: NexusLocation,
    ) => void,
    /**
     * Whether the callback should be executed immediately with all pointers pointing to `to`.
     */
    initialTrigger: boolean = true,
  ): Terminable {
    // same same as onUpdate
    const callbacks = getOrDefault(this.#pointingToCallbacks, to)
    callbacks.add(callback)

    if (initialTrigger) {
      this.#state.references.get(to)?.forEach((from) => callback(from))
    }

    return TerminableBuilder.terminableFrom(() =>
      this.#pointingToCallbacks.get(to)?.delete(callback),
    )
  }

  /** @internal */
  _dispatchPointingTo(to: NexusLocation, from: NexusLocation) {
    this.#pointingToCallbacks.get(to)?.forEach((callback) => callback(from))
  }

  /** Subscribe to the event that some pointer in the document stops pointing to a given location.
   *
   * @example
   * ```ts
   * const tm = await nexus.modify(t => t.create("tonematrix", {}))
   * nexus.events.onStopPointingTo(tm.fields.audioOutput, (from) =>
   *  console.debug("pointing from field", from.toString(), "which is entity", nexus.queryEntities.getEntity(from.entityId)?.id
   * ))
   * ```
   *
   * If the pointer is the result of an entity being removed, then `onRemove` is called after this callback.
   *
   * @returns A terminable that when terminated will stop dispatching new onStopPointingTo events.
   */
  onStopPointingTo(
    /** The location that is being stopped pointing to. */
    to: NexusLocation,
    /** Called right after `from` stops pointing to `to`. */
    callback: (
      /** The location that stops pointing to `to`. `from` is always the location of a pointer field. */
      from: NexusLocation,
    ) => void,
  ): Terminable {
    const callbacks = getOrDefault(this.#stopPointingToCallbacks, to)
    callbacks.add(callback)

    return TerminableBuilder.terminableFrom(() =>
      this.#stopPointingToCallbacks.get(to)?.delete(callback),
    )
  }

  /** @internal */
  _dispatchStopPointingTo(to: NexusLocation, from: NexusLocation) {
    this.#stopPointingToCallbacks.get(to)?.forEach((callback) => callback(from))
  }

  /**
   * @internal
   *
   * Removes all event listeners.*/
  _clear(): void {
    this.#createCallbacks.clear()
    this.#updateCallbacks.clear()
    this.#removeCallbacks.clear()
    this.#pointingToCallbacks.clear()
    this.#stopPointingToCallbacks.clear()
  }

  /**
   * @internal
   * Some stats for debugging. Static for easy access. This method can get quite slow, 6.5ms measured
   * on large documents. Don't call too often. */
  getStats(): {
    numCreateListeners: number
    numUpdateListeners: number
    numRemoveListeners: number
    numPointingToListeners: number
    numStopPointingToListeners: number
  } {
    return {
      numCreateListeners: sizeOf(this.#createCallbacks),
      numUpdateListeners: sizeOf(this.#updateCallbacks),
      numRemoveListeners: sizeOf(this.#removeCallbacks),
      numPointingToListeners: sizeOf(this.#pointingToCallbacks),
      numStopPointingToListeners: sizeOf(this.#stopPointingToCallbacks),
    }
  }
}

/** Purpose built method to determine the total element count across all sets in a Map<_, Set<_>> */
const sizeOf = <T extends Map<unknown, Set<unknown>>>(map: T) =>
  map.values().reduce((acc, set) => acc + set.size, 0)

/** Purpose built method to get the element `key` from a `map`, and if it doesn't exist yet, insert a default value */
const getOrDefault = <K, V>(map: Map<K, Set<V>>, key: K): Set<V> =>
  map.get(key) ?? map.set(key, new Set()).get(key) ?? throw_()
