import { Notifier, type Observable } from "./observable-notifier"
import { Terminable } from "./terminable"

/** A value who can be observed by attaching a callback that is called
 * whenever the value changes. Shouldn't be used for things that don't
 * have meaning outside of updates, look at `Observable` for that.
 */
export interface ObservableValue<T> extends Observable<T> {
  subscribe(callback: (v: T) => void, initialTrigger?: boolean): Terminable
  getValue(): T
}

/** A value to which observers can subscribe to, which will then
 * be notified whenever the value changes.
 * If relevant, the following pattern can be used to only expose the `subscribe` function:
 * ```
 * class Foo {
 *   #notifier: ValueNotifier<number> = new ValueNotifier(0)
 *    get notifier(): ObservableValue<number> {
 *        return this.#notifier
 *    }
 * }
 * ```
 *
 * or
 * ```
 * class Test {
 *    readonly #notifier: ValueNotifier<number> = new ValueNotifier(0)
 *    readonly observer = this.#notifier as ObservableValue<number>
 * }
 * ```
 */

export class ValueNotifier<T> implements ObservableValue<T> {
  readonly #notifier = new Notifier<T>()
  #value: T
  readonly #svelteSubscriber = createSvelteSubscriber(this.#notifier)
  constructor(value: T) {
    this.#value = value
  }

  getValue(): T {
    this.#svelteSubscriber()
    return this.#value
  }

  setValue(value: T): void {
    if (this.#value === value) {
      return
    }
    this.#value = value
    this.#notifier.notify(value)
  }

  subscribe(
    callback: (v: T) => void,
    initialTrigger: boolean = false,
  ): Terminable {
    if (initialTrigger) {
      callback(this.#value)
    }
    return this.#notifier.subscribe(callback)
  }

  terminate(): void {
    this.#notifier.terminate()
  }
}

/** Composes multiple observable values into one, preserving their types. */
export function composeObservableValues<T extends unknown[]>(
  ...observables: { [K in keyof T]: ObservableValue<T[K]> }
): ObservableValue<T> {
  const getCurrentValue = () =>
    observables.map((observable) => observable.getValue()) as T

  return {
    subscribe: (callback: (v: T) => void, initialTrigger = false) => {
      let currentValue = getCurrentValue()

      if (initialTrigger) {
        callback(currentValue)
      }

      const subscriptions = observables.map((observable, i) =>
        observable.subscribe((value) => {
          currentValue = currentValue.map((v, j) => (i === j ? value : v)) as T

          callback(currentValue)
        }, false),
      )

      return {
        terminate: () => {
          subscriptions.forEach((subscription) => subscription.terminate())
        },
      }
    },
    getValue: () => getCurrentValue(),
  }
}

/** Can be used as an ObservableValue<ReadonlySet<T>>, but unlike `new ValueNotifier<Set<T>>`,
 *  actually triggers the callback when the value is changed, and also has easier syntax.
 */
export class SetValueNotifier<T> implements ObservableValue<ReadonlySet<T>> {
  readonly #notifier = new Notifier<void>()
  #value: Set<T>
  readonly #svelteSubscriber = createSvelteSubscriber(this.#notifier)
  constructor(init?: Set<T>) {
    this.#value = init ?? new Set()
  }

  /** Get the underlying set. Readonly because changing it won't trigger updates. */
  getValue(): ReadonlySet<T> {
    this.#svelteSubscriber()
    return this.#value
  }

  /** Add a value to the set */
  add(value: T): void {
    if (this.#value.has(value)) {
      return
    }
    this.#value.add(value)
    this.#notifier.notify()
  }

  /** Delete a value from the set */
  delete(value: T): boolean {
    if (!this.#value.has(value)) {
      return false
    }
    this.#value.delete(value)
    this.#notifier.notify()
    return true
  }

  /** Subscribe to updates of the set */
  subscribe(
    callback: (v: ReadonlySet<T>) => void,
    initialTrigger: boolean = true,
  ): Terminable {
    if (initialTrigger) {
      callback(this.#value)
    }
    return this.#notifier.subscribe(() => callback(this.#value))
  }

  clear(): void {
    if (this.#value.size === 0) {
      return
    }
    this.#value.clear()
    this.#notifier.notify()
  }

  terminate(): void {
    this.#notifier.terminate()
  }
}

/** Implements `ObservableValue<ReadonlyMap<K, V>>`, which is notified
 * whenever set(), delete() or clear() is called.
 */
export class MapValueNotifier<K, V>
  implements ObservableValue<ReadonlyMap<K, V>>
{
  readonly #notifier = new Notifier<void>()
  readonly #svelteSubscriber = createSvelteSubscriber(this.#notifier)
  #value: Map<K, V>
  constructor(init?: Map<K, V>) {
    this.#value = init ?? new Map()
  }

  /** Subscribe to updates of the set */
  subscribe(
    callback: (v: ReadonlyMap<K, V>) => void,
    initialTrigger: boolean = false,
  ): Terminable {
    if (initialTrigger) {
      callback(this.#value)
    }
    return this.#notifier.subscribe(() => callback(this.#value))
  }

  /** Get the underlying map. Readonly because changing it won't trigger updates. */
  getValue(): ReadonlyMap<K, V> {
    this.#svelteSubscriber()
    return this.#value
  }

  set(key: K, value: V): this {
    this.#value.set(key, value)
    this.#notifier.notify()
    return this
  }

  delete(key: K): boolean {
    const changed = this.#value.delete(key)
    if (changed) {
      this.#notifier.notify()
    }
    return changed
  }

  clear(): void {
    const changed = this.#value.size > 0
    this.#value.clear()
    if (changed) {
      this.#notifier.notify()
    }
  }
}

/** Create a svelte subscriber that notifies on notifier.subscribe calls */
const createSvelteSubscriber =
  (_: unknown): (() => void) =>
  () => {}
