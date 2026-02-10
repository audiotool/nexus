import { NexusPreset } from "@api/preset-utils"
import type { NexusEntityUnion } from "@document/entity"
import { NexusEntity } from "@document/entity"
import {
  type EntityConstructorType,
  type EntityTypeKey,
} from "@document/entity-utils"
import type { Modification } from "@gen/document/v1/document_service_pb"
import type { Preset } from "@gen/document/v1/preset/v1/preset_pb"
import { assert, throw_ } from "@utils/lang"
import { protoPrecision } from "@utils/proto-precision"
import type { SyncedDocument } from "src/synced-document"
import type { DeepPartial } from "utility-types"
import {
  buildModificationForEntityClone,
  buildModificationForFieldUpdate,
  buildModificationForNewEntity,
  buildModificationForRemove,
  buildModificationForRemoveWithDependencies,
  buildModificationsForCloneLinkedEntities,
  buildModificationsForPresetApplication,
  preparePreset,
} from "."
import type { PrimitiveField, PrimitiveType } from "../fields"
import type { EntityQuery } from "../query/entity"
import type { EntityWithOverwrites } from "./build-clone-linked-entities"
import { createDevicePreset } from "./create-preset"
import type { DevicePresetEntityType } from "./prepare-preset"

/** A transaction builder can be used to make changes on a document.
 *
 * All changes made using the same transaction builder will be part of the same transaction,
 * and as such applied atomically to the backend.
 *
 * While a transaction builder exists, the document is locked, and no other builders can be created,
 * to avoid race conditions.
 *
 * To finish a transaction, call {@link send}, which will unlock the document and let other builders be created.
 * After {@link send} is called, all methods of the builder will throw.
 *
 * Modifications to the document with a builder are applied to the local document immediately,
 * and only sent to the backend when {@link send} is called.
 *
 * Note that if receiving a builder through {@link SyncedDocument.modify}, then {@link send} method is called
 * automatically once the function returns.
 * See [Overview](../../docs/overview.md#modifying-the-document) for more information.
 */
export type TransactionBuilder = {
  /** Create a new entity with default values */
  create<T extends EntityTypeKey>(
    name: T,
    args: EntityConstructorType<T>,
  ): NexusEntityUnion<T>

  /** Update a primitive field value */
  update<P extends PrimitiveType>(
    field: PrimitiveField<P, "mut">,
    value: P,
  ): void

  /** Try to update a primitive field. Don't throw if it fails; return a string explaining the error
   * instead. If this returns `undefined`, the update was applied. Useful when e.g. a user enters a value
   * and it's not possible to know if the value is valid or not.
   */
  tryUpdate<P extends PrimitiveType>(
    field: PrimitiveField<P, "mut">,
    value: P,
  ): string | undefined

  /** Delete an entity with id `id` from the document  */
  remove(idOrEntity: string | NexusEntity): void

  /** Delete an entity with `id`, after all entities with pointers to it, transitively,
   * are deleted. In other words, remove entity `id`, after all entities are deleted
   * that would result in dangling pointers if `id` was removed.
   *
   * # Example
   * Let's say we have entities `a`, `b`, `c`, `d`, `e`, with pointers between each
   * other like this:
   *
   * ```text
   *   a ─► b ─┐
   *   │       ├──► d ─► e
   *   │       │
   *   └──► c ─┘
   * ```
   *
   * Then calling `removeWithDependencies(d.id)` will remove all entities except `e`,
   * in an order that keeps all existing pointers valid after every modification.
   */
  removeWithDependencies(idOrEntity: string | NexusEntity): void

  /** Clone an existing entity, optionally overwriting some fields.
   *
   * Note that ts by default doesn't correctly type the output. To get correctly
   * typed output, do:
   * ```
   * const tonematrix = t.create("tonematrix", {})
   * const tonematrix2 = t.clone<"tonematrix">(tonematrix)
   * ```
   */
  clone<T extends EntityTypeKey>(
    entity: NexusEntity<T>,
    args?: DeepPartial<EntityConstructorType<T>>,
  ): NexusEntityUnion<T>

  /** Clone a list of entities, in such a way that pointers that
   * are both from to entities in this list are updated to point to
   * the cloned versions. The resulting `creates` command are ordered in such a way
   * that all pointers are always valid, and no transaction errors occur.
   *
   * Each element in the past list can either be an entity itself, or an object
   * ```
   * {
   *  entity: NexusEntity<T>,
   *  overwrites?: ConstructorTypes[T]
   * }
   * ```
   * where `overwrites` work the same as the second parameter of `t.clone()` or `t.create()`.
   *
   * Pointers from and to entities not in the list remain unchanged, unless overwritten.
   *
   * Returns the cloned version of the entities in order. Robust towards duplicates
   * in the passed entities list.
   *
   * # Example
   *
   * Let's say we have entities `a`, `b`, `c`, `d`, `e`, with pointers between each
   * other like this:
   *
   * ```text
   *
   *  a ──► b ──► c ──► d
   *              ▲
   *              │
   *              e
   * ```
   *
   * And we call `cloneLinked(b, c)`. Then:
   * * the relationship between `b` and `c` is updated to duplicates
   * * relationships from `b` or `c` to other entities remain untouched
   * * relationships from other entities to `b` or `c` remain untouched
   *
   * Leading to a graph like this:
   *
   * ```text
   *
   *        b'──► c' ───┐
   *                    ▼
   *  a ──► b ──► c ──► d
   *              ▲
   *              │
   *              e
   * ```
   *
   *
   * If overwrite arguments are given for a specific entity, they overwrite any value
   * _after_ the links have been adjusted.
   *
   */
  cloneLinked(
    ...entities: (EntityWithOverwrites | NexusEntity)[]
  ): NexusEntity[]

  /** Apply a preset to a given entity. The preset is a special transaction. */
  applyPresetTo(
    entity: NexusEntity<DevicePresetEntityType>,
    preset: NexusPreset,
  ): void

  /** Create a preset of a given entity. This doesn't modify the nexus document.  */
  createPresetFor(entity: NexusEntity<DevicePresetEntityType>): Preset

  /**
   * Release the transaction lock and send the modifications to the backend. After this method
   * is called, this `TransactionBuilder` can't be used anymore.
   */
  send(): void

  /** Allows querying all entities of the document.  */
  entities: EntityQuery

  /**
   * @internal
   * Add a generic modification message to this transaction. This is for internal use. */
  _addModification(modification: Modification): void
}

/**
 * SafeTransactionBuilder type is used in places where we want to indicate that
 * 'send()' method of TransactionBuilder instance is already handled somewhere else
 * and shouldn't be called.
 */
export type SafeTransactionBuilder = Omit<TransactionBuilder, "send">

/** Create a transaction builder. The transaction builder as an abstraction that allow easy
 * building of modifications. It's used in the `createTransaction` method of the `NexusDocument` class.
 */
export const transactionBuilder = (opts: {
  /** Query the current state of the document. For the nexus document to work as intended,
   * modifications applied using `applyModification` should immediately be reflected
   * in the query.
   */
  query: EntityQuery
  /** Modifications created during this transaction. If `throwIfInvalid` is false, it should
   * return `string` in case an error occurs, otherwise it should throw an error or return undefined.
   *
   * The modifications must immediately be applied to `query`, otherwise the builder will throw.
   */
  applyModification: (
    mod: Modification,
    throwIfInvalid: boolean,
  ) => string | void
  /** Called when `t.send()` is called, and the transaction becomes "invalid". */
  finish?: () => void
}): TransactionBuilder => {
  let finished: boolean = false
  return {
    create: <T extends EntityTypeKey>(
      name: T,
      args: EntityConstructorType<T>,
    ): NexusEntityUnion<T> => {
      if (finished) {
        throw new CallAfterSendError("create")
      }
      const { modification, entityId: newEntityId } =
        buildModificationForNewEntity(name, args)
      opts.applyModification(modification, true)
      return opts.query.mustGetEntity(newEntityId) as NexusEntityUnion<T>
    },

    clone: <T extends EntityTypeKey>(
      entity: NexusEntity<T>,
      args: DeepPartial<EntityConstructorType<T>>,
    ): NexusEntityUnion<T> => {
      if (finished) {
        throw new CallAfterSendError("clone")
      }
      const { modification, entityId: newEntityId } =
        buildModificationForEntityClone(entity, args)
      opts.applyModification(modification, true)
      return opts.query.mustGetEntity(newEntityId) as NexusEntityUnion<T>
    },

    cloneLinked: (
      ...entities: (EntityWithOverwrites | NexusEntity)[]
    ): NexusEntity[] => {
      if (finished) {
        throw new CallAfterSendError("cloneLinked")
      }
      const { modifications: newModifications, uuidMap } =
        buildModificationsForCloneLinkedEntities(...entities)
      newModifications.forEach((mod) => opts.applyModification(mod, true))

      return entities.map((e) => {
        const oldEntityId = e instanceof NexusEntity ? e.id : e.entity.id
        const newEntityId = uuidMap.get(oldEntityId) ?? throw_()
        return opts.query.mustGetEntity(newEntityId)
      })
    },

    update: <P extends PrimitiveType>(
      field: PrimitiveField<P>,
      value: P,
    ): void => {
      if (finished) {
        throw new CallAfterSendError("update")
      }
      // skip update if the value is the same as the current value
      value = protoPrecision[field._protoType](value)
      if (value === field.value) {
        return
      }
      const modification = buildModificationForFieldUpdate(field, value)
      opts.applyModification(modification, true)
    },

    tryUpdate: <P extends PrimitiveType>(
      field: PrimitiveField<P, "mut">,
      value: P,
    ): string | undefined => {
      if (finished) {
        throw new CallAfterSendError("tryUpdate")
      }
      const modification = buildModificationForFieldUpdate(field, value)
      return opts.applyModification(modification, false) ?? undefined
    },

    remove: (idOrEntity: string | NexusEntity) => {
      if (finished) {
        throw new CallAfterSendError("remove")
      }
      const id = idOrEntity instanceof NexusEntity ? idOrEntity.id : idOrEntity
      const modification = buildModificationForRemove(id)
      opts.applyModification(modification, true)
    },

    removeWithDependencies: (idOrEntity: string | NexusEntity) => {
      if (finished) {
        throw new CallAfterSendError("removeWithDependencies")
      }
      const id = idOrEntity instanceof NexusEntity ? idOrEntity.id : idOrEntity
      const mods = buildModificationForRemoveWithDependencies(id, opts.query)
      mods.forEach((mod) => opts.applyModification(mod, true))
    },

    applyPresetTo: (
      applyTo: NexusEntity<DevicePresetEntityType>,
      preset: NexusPreset,
    ) => {
      if (finished) {
        throw new CallAfterSendError("applyPreset")
      }

      const presetInfo = preparePreset(preset.data)

      // assert preset is for entity of correct type
      {
        const entityType = applyTo.entityType
        assert(
          preset.entityType === entityType,
          `attempted to apply preset for entity of type ${preset.entityType} to entity of type ${entityType}`,
        )
      }

      const mods = buildModificationsForPresetApplication(
        opts.query,
        presetInfo,
        applyTo,
      )
      mods.forEach((mod) => opts.applyModification(mod, true))
    },

    createPresetFor: (entity: NexusEntity<DevicePresetEntityType>): Preset => {
      if (finished) {
        throw new CallAfterSendError("createPresetFor")
      }

      return createDevicePreset(entity, opts.query)
    },

    _addModification: (mod: Modification) => {
      if (finished) {
        throw new CallAfterSendError("_addModification")
      }
      opts.applyModification(mod, true)
    },

    send() {
      if (finished) {
        throw new CallAfterSendError("send")
      }
      finished = true
      opts.finish?.()
    },

    entities: opts.query,
  }
}

/** Thrown when a method of the builder is called after `send` has already been called. */
export class CallAfterSendError extends Error {
  constructor(methodName: string) {
    super(
      `Tried calling method ${methodName} on transaction that was already sent`,
    )
  }
}
