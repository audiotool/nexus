import { Terminable } from "./terminable"

/** Something that can be observed by subscribing to it. If the thing
 * observed represents a value that has meaning between updates, see `ObservableValue`.
 */
export interface Observable<T> {
  subscribe(observer: (v: T) => void): Terminable
}

/** A Notifier is something that can notify subscribed parties of a change.
 *  If the notifier represents a value that has meaning outside of updates, look
 *  at `ValueNotifier`.
 *
 * If relevant, the following pattern can be used to only expose the `subscribe` function:
 * ```
 * class Foo {
 *   #notifier: Notifier<number> = new Notifier()
 *    get notifier(): Observable<number> {
 *        return this.#notifier
 *    }
 * }
 * ```
 *
 * or
 * ```
 * class Test {
 *    readonly #notifier: Notifier<number> = new Notifier()
 *    readonly observer = this.#notifier as Observable<number>
 * }
 * ```
 */
export class Notifier<T> implements Observable<T>, Terminable {
  readonly #observers: Set<(v: T) => void> = new Set<(v: T) => void>() // A set allows us to remove while iterating

  subscribe(observer: (v: T) => void): Terminable {
    this.#observers.add(observer)
    return { terminate: (): unknown => this.#observers.delete(observer) }
  }

  notify(value: T): void {
    this.#observers.forEach((observer: (v: T) => void) => observer(value))
  }

  terminate(): void {
    this.#observers.clear()
  }
}
