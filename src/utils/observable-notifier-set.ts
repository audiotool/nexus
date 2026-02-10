import { Notifier } from "./observable-notifier"
import type { ObservableValue } from "./observable-notifier-value"
import { Terminable } from "./terminable"

export class SetNotifier<T> implements ObservableValue<T[]> {
  readonly #notifier = new Notifier<T[]>()
  readonly #set = new Set<T>()

  constructor(values: T[]) {
    values.forEach((value) => this.#set.add(value))
  }

  getValue(): T[] {
    return Array.from(this.#set)
  }

  replace(values: T[]): void {
    this.#set.clear()
    values.forEach((value) => this.#set.add(value))
    this.#notifier.notify(this.getValue())
  }

  add(value: T): void {
    if (this.#set.has(value)) {
      return
    }
    this.#set.add(value)
    this.#notifier.notify(this.getValue())
  }

  delete(value: T): void {
    if (!this.#set.has(value)) {
      return
    }
    this.#set.delete(value)
    this.#notifier.notify(this.getValue())
  }

  has(value: T): boolean {
    return this.#set.has(value)
  }

  clear(): void {
    this.#set.clear()
    this.#notifier.notify(this.getValue())
  }

  subscribe(
    callback: (v: T[]) => void,
    initialTrigger: boolean = false,
  ): Terminable {
    if (initialTrigger) {
      callback(this.getValue())
    }
    return this.#notifier.subscribe(callback)
  }

  terminate(): void {
    this.#notifier.terminate()
  }
}
