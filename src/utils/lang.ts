/* eslint-disable @typescript-eslint/ban-types,@typescript-eslint/no-explicit-any */

export type Sign = -1 | 0 | 1
export type Nullish<T = never> = T | undefined | null
export type Class<T = object> = Function & { prototype: T }
export type Comparator<T> = (a: T, b: T) => number // is zero if a is equal to b, is positive if a is greater than b

/** "lifts" a comparator to lists, i.e., given a comparator for type `T`, this returns a comparator for type `T[]`. */
export const ListComparator =
  <T>(comparator: Comparator<T>): Comparator<T[]> =>
  (a: T[], b: T[]): number => {
    const n: number = Math.min(a.length, b.length)
    for (let i: number = 0; i < n; i++) {
      const comparison: number = comparator(a[i], b[i])
      if (comparison !== 0) {
        return comparison
      }
    }
    return a.length - b.length
  }

export type Comparable<T> = { compareTo: (other: T) => number }
export type Equality<T> = { equals: (other: T) => boolean }

/** Instantly throws the message or error. `string`s are wrapped in an `Error`.
 *
 * Useful to throw early if something is expected to be defined using
 * the `??` operator. Example:
 * ```
 * const getX: () => number | undefined
 * const x: number = getX() ?? throw_("expected x to be defined")
 * ```
 */
export const throw_ = (message?: string | Error): never => {
  throw message instanceof Error ? message : new Error(message)
}

/** A generic assert function. At compile time, tells typescript to assume the condition
 * to be true, and at runtime, throws if the condition is false.
 */
export function assert(condition: boolean, msg?: string): asserts condition {
  if (!condition) {
    throw new Error(msg ?? "assertion failed")
  }
}

/** Creates a promise that resolves after (approximately) `ms` milliseconds. Can be aborted by passing an abort signal.
 * If the signal is aborted, the promise resolves immediately (no error).
 */
export const sleep = (ms: number, signal?: AbortSignal): Promise<void> =>
  new Promise((resolve) => {
    if (signal?.aborted ?? false) {
      resolve()
      return
    }
    const timeout = setTimeout(resolve, ms)
    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(timeout)
        resolve()
      },
      { once: true },
    )
  })

/**
 * Works like {@link setInterval} but accepts async functions which are
 * awaited before going to sleep for `intervalMs` ms. The callback is executed
 * immediately unless `immediateTrigger  = false` is passed.
 *
 * The callback takes an abort signal. When the interval is terminated, the abort signal is aborted.
 * It's recommended that the passed callback returns without throwing if the abort signal is aborted.
 *
 * {@link terminate} returns a promise that resolves when the interval is terminated. The
 * `intervalMs` wait time is skipped/stopped if terminate is called before the next callback is due.
 */
export const asyncInterval = (
  callback: (signal: AbortSignal) => Promise<void>,
  intervalMs: number,
  opts?: {
    immediateTrigger?: boolean
  },
): {
  terminate: () => Promise<void>
} => {
  const abortController = new AbortController()
  const done = Promise.withResolvers<void>()

  const run = async () => {
    while (true) {
      if (abortController.signal.aborted) {
        return done.resolve()
      }
      await callback(abortController.signal)

      await sleep(intervalMs, abortController.signal)
    }
  }
  if (opts?.immediateTrigger ?? true) {
    run()
  } else {
    sleep(intervalMs, abortController.signal).then(run)
  }

  return {
    terminate: async () => {
      abortController.abort()
      await done.promise
    },
  }
}
