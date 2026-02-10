export const hashSymbol = Symbol()

/** Something that can be hashed. An object that implements this interface can be used as a key in a {@link HashMap}. */
export type Hashable = { readonly [hashSymbol]: string }

/**
 * The map we've all been waiting for: a proper hash map.
 *
 * But, it's js, so you have to implement the hashing yourself.
 *
 * Make an object {@link Hashable} to use as a key.
 *
 */
export class HashMap<K extends Hashable, V> implements Map<K, V> {
  /** Maps the hash of a key to both key and value */
  #map: Map<Hashable[typeof hashSymbol], [K, V]> = new Map()

  clear(): void {
    this.#map.clear()
  }

  delete(key: K): boolean {
    const hash = key[hashSymbol]
    return this.#map.delete(hash)
  }

  forEach(
    callbackfn: (value: V, key: K, map: Map<K, V>) => void,
    thisArg?: unknown,
  ): void {
    this.#map.forEach(([key, value]) => {
      callbackfn(value, key, this)
    }, thisArg)
  }

  entries(): MapIterator<[K, V]> {
    return this.#map
      .entries()
      .map(([_, [key, value]]) => [key, value] as [K, V])
  }

  get(key: K): V | undefined {
    return this.#map.get(key[hashSymbol])?.[1]
  }

  has(key: K): boolean {
    return this.#map.has(key[hashSymbol])
  }

  keys(): MapIterator<K> {
    return this.#map.values().map(([key, _]) => key)
  }

  set(key: K, value: V): this {
    const hash = key[hashSymbol]
    this.#map.set(hash, [key, value])
    return this
  }

  values(): MapIterator<V> {
    return this.#map.values().map(([_, value]) => value)
  }

  get size(): number {
    return this.#map.size
  }

  [Symbol.iterator](): MapIterator<[K, V]> {
    return this.entries()
  }

  get [Symbol.toStringTag](): string {
    return "StringHashMap"
  }
}
