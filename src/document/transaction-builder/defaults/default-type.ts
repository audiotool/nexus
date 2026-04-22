import type { OptionalKeys } from "utility-types"

/**
 * The type of a "defaults" object that defines the defaults for every optional entity field
 * has to satisfy.
 *
 * This type extracts the optional fields from a constructor type and maps it to a non-nullable variant.
 * Fields that are required in the constructor type have to be provided by the nexus api user every
 * time and thus no defaults are needed for them.
 */
export type Defaults<ConstructorType> = {
  // for each key that's marked as optional
  [key in OptionalKeys<ConstructorType>]-?: NonNullable<
    // check if the value is an object itself
    ConstructorType[key]
  > extends object
    ? // if so recourse
      Defaults<NonNullable<ConstructorType[key]>>
    : // if not, nonnullable
      NonNullable<ConstructorType[key]>
}
