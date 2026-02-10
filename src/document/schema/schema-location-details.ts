import type {
  ArrayDetails,
  EntityDetails,
  ObjectDetails,
  PrimitiveFieldDetails,
} from "./schema-details"

/** Schema location details are the same as schema path details, except they indicate for arrays what index
 * they're pointing on.
 */
export type SchemaLocationDetails =
  | EntityDetails // can't be in an array
  | ArrayDetails // ditto, there are no arrays in arrays
  | (PrimitiveFieldDetails & { index?: number }) // if in an array, contains the index
  | (ObjectDetails & { index?: number }) // ditto
