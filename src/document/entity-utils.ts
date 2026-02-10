import { Any, createRegistry } from "@bufbuild/protobuf"
import type {
  ConstructorTypes,
  EntityTypes,
} from "@gen/document/v1/utils/types"
import {
  entityMessageTypes,
  entityUrlToTypeKey,
} from "@gen/document/v1/utils/types"
import { throw_ } from "@utils/lang"
import type { DeepPartial } from "utility-types"

/** The main EntityTypeKeys type that is a "shortcut" to describe an entity
 * type. For example:
 * ```ts
 * t.create("tonematrix" satisfies EntityTypeKeys, {})
 * ```
 */
export type EntityTypeKey = keyof EntityTypes

/** The field type of entity.
 *
 * ```ts
 * const tm = t.create("tonematrix", {})
 *
 * tm.fields satisfies EntityType<"tonematrix">
 * ```
 *.
 */
export type EntityType<T extends EntityTypeKey = EntityTypeKey> = EntityTypes[T]

export type TypeKeyToType = EntityTypes

/**
 * @internal
 * The constructor type of an entity. Example:
 * ```ts
 * t.create("tonematrix", {} satisfies EntityConstructorType<"tonematrix">)
 * ```
 */
export type EntityConstructorType<T extends EntityTypeKey = EntityTypeKey> =
  ConstructorTypes[T]

/** The type URL of an entity as it's in `proto.Any`. Example:
 *
 * ```
 * const any = Any.pack(new Rasselbock({ ... }))
 * // note: this fails bcs any can contain anything, so type casting will be required
 * any.typeUrl satisfies EntityTypeUrl
 * ```
 */
export type EntityTypeUrl = keyof typeof entityUrlToTypeKey

/** Maps type urls to their type keys. */
export type EntityTypeUrlToKey<T extends EntityTypeUrl = EntityTypeUrl> =
  (typeof entityUrlToTypeKey)[T]

/** Maps the type key to an instance of the proto message. */
export type EntityMessage<T extends EntityTypeKey = EntityTypeKey> =
  InstanceType<EntityMessageClass<T>>

export type EntityMessageClass<T extends EntityTypeKey> =
  (typeof entityMessageTypes)[T]

export const entityTypeKeyToUrl = (
  entityTypeKey: EntityTypeKey,
): EntityTypeUrl => entityMessageTypes[entityTypeKey].typeName

/** From a proto.Any message, extract the EntityTypeKey. Throws if the Any message doesn't contain
 * an entity. Takes undefined for convenience. Returns undefined if undefined is passed, or the Any
 * message doesn't contain an entity.
 */
export const anyEntityToTypeKey = (
  entity: Any | undefined,
): EntityTypeKey | undefined => {
  const url = entity?.typeUrl
  if (url === undefined) {
    return undefined
  }
  const entityUrl = url.split("/").pop()
  return entityUrlToTypeKey[entityUrl as EntityTypeUrl]
}

export const entityMessageToTypeKey = (msg: EntityMessage): EntityTypeKey =>
  entityUrlToTypeKey[
    msg.getType().typeName as keyof typeof entityUrlToTypeKey
  ] ?? throw_()

/** Convert an entity message to an any message. */
export const packEntity = (message: EntityMessage): Any => Any.pack(message)

const entityTypeRegistry = createRegistry(...Object.values(entityMessageTypes))

/** Convert an any message to an entity message. */
export const unpackEntity = (
  entity: Any | undefined,
): EntityMessage | undefined => {
  if (entity === undefined) {
    return undefined
  }

  return entity.unpack(entityTypeRegistry) as EntityMessage | undefined
}

/** Like unpackEntity, but if the any message passed is undefined, or the unpacking fails, it throws an error. */
export const mustUnpackEntity = (entity: Any | undefined): EntityMessage =>
  unpackEntity(entity) ??
  throw_("couldn't unpack any entity of type " + entity?.typeUrl)

export const mustUnpackEntityAs = <T extends EntityTypeKey>(
  type: T,
  entity: Any | undefined,
): EntityMessage<T> => {
  const typeKey = anyEntityToTypeKey(entity)
  if (typeKey !== type) {
    throw new Error(
      `tried to unpack any as entity of type ${type}, got ${typeKey}`,
    )
  }
  return mustUnpackEntity(entity) as EntityMessage<T>
}

/** Syntax sugar to create & pack an entity easily. Instead of `Any.pack(new Foo({...}))`, just type `packedEntity("foo", {...})`.*/
export const packedEntity = <T extends EntityTypeKey>(
  type: T,
  params: DeepPartial<EntityMessage<T>>,
): Any => Any.pack(new entityMessageTypes[type](params))

export const getEntityTypeKeyFromProtoName = (name: string): EntityTypeKey =>
  (name.charAt(0).toLowerCase() + name.slice(1)) as EntityTypeKey
