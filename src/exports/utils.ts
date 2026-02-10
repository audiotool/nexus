/**
 * @packageDocumentation
 * Some utility functions, classes, types, used across the package.
 */

export { secondsToTicks, Ticks, ticksToSeconds } from "@utils/ticks"

export { AsyncLock } from "@utils/async-lock"
export type { Lock } from "@utils/async-lock"

export { HashMap } from "@utils/hash-map"
export type { Hashable } from "@utils/hash-map"

export type { Terminable } from "@utils/terminable"

export { Notifier } from "@utils/observable-notifier"
export type { Observable } from "@utils/observable-notifier"

export { SetNotifier } from "@utils/observable-notifier-set"
export {
  MapValueNotifier,
  ValueNotifier,
} from "@utils/observable-notifier-value"
export type { ObservableValue } from "@utils/observable-notifier-value"

export { throw_ } from "@utils/lang"

export { createTypedArray } from "@utils/typed-array"

export * from "@gen/document/v1/utils/path"
