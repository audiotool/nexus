/** Creates an array with `length` elements, in such a way that the output's type
 * includes the length of the array. This function is equivalent to:
 * ```
 * Array.from({length}, (_, i) => init(i)) as T[] & { length: L }
 * ```
 * but less verbose.
 *
 * This can be used to create arrays matching constructor types, for example:
 * ```
 * const t = await nexus.createTransaction()
 * const rasselbock = t.create("rasselbock", {
 *   // requires an array of 32 elements
 *   patterns: createArray(32, () => ({
 *     // requires an array of 7 elements
 *     effectOrder: createArray(7, (i) => i),
 *    })),
 * })
 * ```
 */
export const createTypedArray = <T, L extends number>(
  length: L,
  init: (index: number) => T,
): T[] & { length: L } =>
  Array.from({ length }, (_, i) => init(i)) as T[] & { length: L }
