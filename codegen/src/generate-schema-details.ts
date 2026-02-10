import {
  ScalarType,
  type DescField,
  type DescMessage,
} from "@bufbuild/protobuf"
import { localName } from "@bufbuild/protoplugin/ecmascript"
import * as opt_pb from "../../src/gen/audiotool/document/v1/opt/opt_pb"
import { throw_ } from "../../src/utils/lang.js"
import type { GeneratedFile } from "./file"
import type { NexusFieldOptions } from "./options"
import { messageIsEntity } from "./ts-generator"
import { findOptions, getFieldOptions, typeNameToEntityName } from "./utils"

export const generateSchemaDetails = (
  file: GeneratedFile,
  messages: DescMessage[],
): void => {
  file.print(`
  export const NEXUS_SCHEMA_INFO = {${messages
    .filter((msg) => messageIsEntity(msg))
    .flatMap((message) => [
      // entity itself:
      `"${typeNameToEntityName(message.typeName)}": {
        type: "entity",
        targetTypes: ${JSON.stringify(getEntityTargetTypes(message))},
        typeKey: "${typeNameToEntityName(message.typeName)}",
      },`,
      // and its fields:
      ...toSchemaFields(file, typeNameToEntityName(message.typeName), message),
    ])
    .join(
      "\n",
    )}} satisfies Record<string, ${file.import("SchemaDetails", true)}>;
  `)
  file.write()
}

const toSchemaFields = (
  file: GeneratedFile,
  prefix: string,
  msg: DescMessage,
): string[] =>
  msg.fields
    // filter id fields
    .filter((field) => !(field.name === "id" && field.number === 1))
    .flatMap((field) => processField(file, prefix, field))

/** process all fields of a message */
const processField = (
  file: GeneratedFile,
  prefix: string,
  field: DescField,
  isArrayElement: boolean = false,
): string[] => {
  const options = getFieldOptions(field)

  // if we're already in an array, then we must add prefix []
  prefix = isArrayElement ? `${prefix}:[]` : `${prefix}:${field.number}`

  // array elements have name [], rest normal field name
  const fieldName = isArrayElement ? "[]" : localName(field)

  // if we're not in an array, but the field is repeated, then we go down the array route
  if (field.repeated && !isArrayElement) {
    return [
      // prefix with []
      `"${prefix}": {
        type: "array",
        targetTypes: ${optionsToTargets(options, false)},
        fieldName: "${fieldName}",
        length: ${options?.list?.length ?? throw_("repeated field without length")},
      },`,
      // and process, this time indicating we're in an array
      ...processField(file, prefix, field, true),
    ]
  }

  // if we're a pointer field or a scalar, then we're a primitive.
  if (
    field.fieldKind === "scalar" ||
    (field.fieldKind === "message" &&
      field.message.typeName === "audiotool.document.v1.Pointer")
  ) {
    return [
      `"${prefix}": {
            type: "primitive",
            targetTypes: ${optionsToTargets(options, isArrayElement)},
            immutable: ${options?.immutable ?? false},
            primitive: ${
              field.fieldKind === "scalar"
                ? // split into two because it's easier: scalar
                  getPrimitiveInfo(file, field)
                : // pointer
                  getPrimitiveInfoForPointer(field)
            },
            fieldName: "${fieldName}",
          },`,
    ]
  }
  // else we're dealing with a submessage.
  if (field.fieldKind === "message") {
    return [
      // message itself:
      `"${prefix}": {
            type: "object",
            targetTypes: ${optionsToTargets(options, isArrayElement)},
            fieldName: "${fieldName}",
          },`,
      // and its fields:
      ...toSchemaFields(file, prefix, field.message),
    ]
  }
  throw new Error("unsupported field kind: " + field.fieldKind)
}

/** the "primitive" subtype of a scalar field indicating what kind of primitive */
const getPrimitiveInfo = (
  file: GeneratedFile,
  field: DescField & { fieldKind: "scalar" },
): string => {
  const options = getFieldOptions(field)
  const scalarType = `${file.import("ScalarType", false)}.${ScalarType[field.scalar]}`
  switch (field.scalar) {
    case ScalarType.FIXED32:
    case ScalarType.FIXED64:
    case ScalarType.FLOAT:
    case ScalarType.DOUBLE:
    case ScalarType.INT32:
    case ScalarType.INT64:
    case ScalarType.SFIXED32:
    case ScalarType.SFIXED64:
    case ScalarType.UINT32:
    case ScalarType.UINT64:
    case ScalarType.SINT32:
    case ScalarType.SINT64:
      return `{
      type: "number",
      scalarType: ${scalarType},
      default: ${options.float?.init ?? options.int32?.init ?? options.uint32?.init ?? 0},
      range: ${getMinMax(field.scalar, options)},
      }`
    case ScalarType.BOOL:
      return `{
      type: "boolean",
      scalarType: ${scalarType},
      default: ${options.bool?.init ?? false},
      }`
    case ScalarType.STRING:
      return `{
      type: "string",
      scalarType: ${scalarType},
      maxByteLength: ${options.string?.maxByteLength ?? throw_("string field without maxByteLength")},
      }`
    case ScalarType.BYTES:
      return `{
      type: "bytes",
      scalarType: ${scalarType},
      }`
    default:
      field.scalar satisfies never
      return ""
  }
}

const getMinMax = (
  scalarType: ScalarType,
  fieldOptions: NexusFieldOptions,
): string => {
  switch (scalarType) {
    case ScalarType.INT32:
      return JSON.stringify(
        fieldOptions.int32?.range ?? { min: i32min, max: i32max },
      )
    case ScalarType.UINT32:
      return JSON.stringify(
        fieldOptions.uint32?.range ?? { min: 0, max: u32max },
      )
    case ScalarType.FLOAT:
      return fieldOptions.float?.range !== undefined
        ? JSON.stringify(fieldOptions.float.range)
        : "{ min: -Infinity, max: +Infinity }"

    default:
      console.error(
        "Warning: have unconstrained field without possibility to set min/max of type " +
          ScalarType[scalarType],
      )
      return "{ min: -Infinity, max: +Infinity }"
  }
}

/** The "primitive" subtype of a primitive field indicating what kind of primitive */
const getPrimitiveInfoForPointer = (
  field: DescField & { fieldKind: "message" },
): string => {
  const options = getFieldOptions(field)
  return `{
    type: "nexus-location",
    targets: ${JSON.stringify(options.pointer?.target ?? throw_("pointer targets nothing"))},
    required: ${options.pointer?.required ?? false},
  }`
}

const optionsToTargets = (
  options: NexusFieldOptions,
  isArrayElement: boolean,
): string =>
  JSON.stringify(
    (isArrayElement ? options?.list?.elementIs : options?.target?.is) ?? [],
  )

const getEntityTargetTypes = (message: DescMessage): string[] =>
  (findOptions(message, opt_pb.entity)?.is ?? []).map(
    (e) => opt_pb.TargetType[e],
  )

// duplicate bcs we can't import from @utils/proto-precision
const i32max = 2147483647
const i32min = -2147483648
const u32max = 4294967295
// const u64maxN = 18446744073709551615n
// const u64minN = 0n
// const i64minN = -9223372036854775808n
// const i64maxN = 9223372036854775807n
