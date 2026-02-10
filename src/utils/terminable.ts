import { throw_ } from "./lang"

/**
 * The `Terminable` interface provides a mechanism for lifecycle management
 * of certain operations or entities.
 * It offers a means to terminate or invalidate an action, essentially acting as a cleanup or undo mechanism.
 *
 * This interface is especially useful in scenarios where dynamic adjustments,
 * resource releases, or reversions of temporary settings are needed.
 *
 * Typical usage:
 * ```typescript
 * const action: Terminable = subscribeToAProgress()
 * // ... some code ...
 * action.terminate() // This will undo or clean up the action.
 * ```
 *
 * Implementing classes should ensure that the `terminate` method safely
 * handles the necessary cleanup or invalidation actions required for
 * the context in which it's used.
 */
export type Terminable = {
  terminate(): void
}

export const TerminableBuilder = {
  terminableFrom: (...callbacks: (() => void)[]): Terminable => ({
    terminate: (): void => {
      for (const callback of callbacks) {
        callback()
      }
    },
  }),
} as const

export class Terminator implements Terminable {
  readonly #terminables: Terminable[] = []

  constructor(...terminables: Terminable[]) {
    this.own(...terminables)
  }

  own = (...terminables: Terminable[]): void => {
    for (const terminable of terminables) {
      this.#terminables.push(terminable)
    }
  }

  terminate = (): void => {
    while (this.#terminables.length > 0) {
      ;(this.#terminables.pop() ?? throw_()).terminate()
    }
  }
}
