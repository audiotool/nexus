import type { AnyMessage, FieldInfo, MessageType } from "@bufbuild/protobuf"
import type { EntityTypeKey } from "@document/entity-utils"
import { Pointer } from "@gen/document/v1/pointer_pb"
import type { SchemaPath } from "@gen/document/v1/utils/path"
import { entityMessageTypes } from "@gen/document/v1/utils/types"
import { assert, throw_ } from "@utils/lang"

import { _getSchemaLocatorDetails } from "./get-schema-details-from-locator"
import type { SchemaLocation } from "./schema-location"
import type { _SchemaLocator } from "./schema-locator"

/** Converts a {@link SchemaPath} to a {@link SchemaLocation} */
export const schemaPathToSchemaLocation = (p: SchemaPath): SchemaLocation => {
  // given message & field name, returns the FieldInfo with that name or throws
  const findField = (
    message: MessageType<AnyMessage>,
    name: string,
  ): FieldInfo =>
    message.fields.list().find((field) => field.localName === name) ??
    throw_(`can't find field "${name}"`)

  const result: number[] = []
  // start with entity
  const [_, first, second, ...elements] = p.split("/")
  if (first === "") {
    throw new Error("path is empty")
  }
  // this happens in the case where path is `/foo`.
  if (second === undefined) {
    return {
      entityType: first as EntityTypeKey,
      fieldIndex: [],
    }
  }
  const message = entityMessageTypes[first as EntityTypeKey]

  let cursor = findField(message, second)
  result.push(cursor.no)
  for (const element of elements) {
    // first check if we have a number
    const num = (/\[(\d+)\]/.exec(element) ?? [])[1]
    if (num !== undefined) {
      result.push(Number(num))
      continue
    }
    // if we can't index into the current message using element, something's wrong
    if (!(cursor.kind === "message")) {
      throw new Error(
        `expected message field. have ${cursor.kind}, for element "${element}", for path "${p}"`,
      )
    }

    // if not, fetch the name, and continue
    cursor = findField(cursor.T, element)
    result.push(cursor.no)
  }

  return {
    entityType: first as EntityTypeKey,
    fieldIndex: result,
  }
}
/** Converts a {@link SchemaLocation} to a {@link SchemaPath} */
export const schemaLocationToSchemaPath = (
  schemaLocation: SchemaLocation,
): SchemaPath => {
  const { entityType, fieldIndex } = schemaLocation
  if (entityType === undefined) {
    throw new Error("schema location has no entity type")
  }
  const [first, ...rest] = fieldIndex
  const errorMsg = (wanted: number, index: number) =>
    `can't find field '${wanted}' at index ${index} of path [${fieldIndex.join(
      ", ",
    )}] for entity type '${entityType}'`
  const message = entityMessageTypes[entityType]
  if (message === undefined) {
    throw new Error(`unknown entity type: ${entityType}`)
  }
  let result = `/${entityType}`
  if (first === undefined) {
    return result as SchemaPath
  }

  let cursor = message.fields.find(first)
  result += "/" + (cursor?.localName ?? throw_(new Error(errorMsg(first, 1))))
  if (cursor === undefined) {
    throw new Error(errorMsg(first, 1))
  }

  // If we have an array, we don't have to "advance" the cursor.
  // We use this flag to check if we already added the array indices.
  let arrayProcessed = false
  for (const [i, fieldno] of rest.entries()) {
    if (cursor.repeated && !arrayProcessed) {
      result += `/[${fieldno}]`
      arrayProcessed = true
      continue
    }

    if (cursor.kind !== "message") {
      throw new Error(errorMsg(fieldno, i + 1))
    }

    cursor =
      cursor.T.fields.find(fieldno) ??
      throw_(new Error(errorMsg(fieldno, i + 1)))
    result += `/${cursor.localName}`
    arrayProcessed = false
  }

  return result as SchemaPath
}

/** utility function to create a pointer quickly, useful for unit tests. */
export const createPointerFromNexusPath = (
  entityId: string,
  path: SchemaPath,
): Pointer =>
  new Pointer({
    entityId,
    fieldIndex: schemaPathToSchemaLocation(path).fieldIndex as number[],
  })

/** @deprecated rewrite apis so they use {@link SchemaLocation} instead. */
export const nexusPathToIndices = (path: SchemaPath): number[] =>
  schemaPathToSchemaLocation(path).fieldIndex.slice()

/** Converts a {@link SchemaLocation} to a {@link _SchemaLocator} */
export const schemaLocationToSchemaLocator = (
  location: SchemaLocation,
): _SchemaLocator => {
  assert(location.entityType !== undefined, "location has no entity type")
  let subpath = location.entityType
  let nextIsArrayIndex = false
  for (const index of location.fieldIndex) {
    if (nextIsArrayIndex) {
      subpath += ":[]"
      nextIsArrayIndex = false
      continue // can't have 2 arrays in a row
    }
    subpath += `:${index}`

    nextIsArrayIndex =
      _getSchemaLocatorDetails(subpath as _SchemaLocator).type === "array"
  }
  return subpath as _SchemaLocator
}

// If you reach this point and wonder: How to convert a _SchemaLocator to a SchemaLocation or SchemaPath?
// The answer is: we can't, schema location contains more than _SchemaLocator do.
