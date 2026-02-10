import { beforeEach, describe, expect, it } from "vitest"
import { HashMap, hashSymbol, type Hashable } from "./hash-map"

type MapTest = {
  map: HashMap<Hashable, number>
  // contains a list of unique key/value pairs
  keyValues: [Hashable, number][]
  // contains a copy of keys in `keyValues`, with DIFFERENT values
  duplicateKeyValues: [Hashable, number][]
}

const newHashable = (hash: number): Hashable => ({
  [hashSymbol]: hash.toString(),
})

describe("HashMap", () => {
  beforeEach<MapTest>((context) => {
    context.map = new HashMap()
    context.keyValues = [
      [newHashable(0), 0],
      [newHashable(1), 1],
      [newHashable(2), 2],
      [newHashable(3), 3],
      [newHashable(4), 4],
    ]
    context.duplicateKeyValues = [
      [newHashable(0), 1],
      [newHashable(1), 2],
      [newHashable(2), 3],
      [newHashable(3), 4],
      [newHashable(4), 5],
    ]
  })

  it<MapTest>("is empty on init", (ctx) => {
    expect(ctx.map.size).toBe(0)
  })

  it<MapTest>("takes all elements", (ctx) => {
    ctx.keyValues.forEach(([k, v]) => ctx.map.set(k, v))
    expect(ctx.map.size).toBe(ctx.keyValues.length)
  })

  it<MapTest>("returns correct `entries`", (ctx) => {
    ctx.keyValues.forEach(([k, v]) => ctx.map.set(k, v))
    expect([...ctx.map.entries()]).toEqual(ctx.keyValues)
  })

  it<MapTest>("returns correct `keys`", (ctx) => {
    ctx.keyValues.forEach(([k, v]) => ctx.map.set(k, v))
    expect([...ctx.map.keys()]).toContainExactly(ctx.keyValues.map(([k]) => k))
  })

  it<MapTest>("returns correct `values`", (ctx) => {
    ctx.keyValues.forEach(([k, v]) => ctx.map.set(k, v))
    expect([...ctx.map.values()]).toContainExactly(
      ctx.keyValues.map(([_, v]) => v),
    )
  })

  it<MapTest>("equivalents don't increase size", (ctx) => {
    ctx.keyValues.forEach(([k, v]) => ctx.map.set(k, v))
    ctx.duplicateKeyValues.forEach(([k, v]) => ctx.map.set(k, v))
    expect(ctx.map.size).toBe(ctx.keyValues.length)
  })

  it<MapTest>("return correct values after equivalent inserts", (ctx) => {
    ctx.keyValues.forEach(([k, v]) => ctx.map.set(k, v))
    ctx.duplicateKeyValues.forEach(([k, v]) => ctx.map.set(k, v))
    expect([...ctx.map.values()]).toContainExactly(
      ctx.duplicateKeyValues.map(([_k, v]) => v),
    )
  })

  it<MapTest>("returns correct `entries` after removal", (ctx) => {
    ctx.keyValues.forEach(([k, v]) => ctx.map.set(k, v))
    ctx.map.delete(ctx.keyValues[0][0])
    expect([...ctx.map.entries()]).toEqual(ctx.keyValues.slice(1))
  })

  it<MapTest>("returns correct `keys` after removal", (ctx) => {
    ctx.keyValues.forEach(([k, v]) => ctx.map.set(k, v))
    ctx.map.delete(ctx.keyValues[0][0])
    expect([...ctx.map.keys()]).toContainExactly(
      ctx.keyValues.map(([k]) => k).slice(1),
    )
  })

  it<MapTest>("returns correct `values` after removal", (ctx) => {
    ctx.keyValues.forEach(([k, v]) => ctx.map.set(k, v))
    ctx.map.delete(ctx.keyValues[0][0])
    expect([...ctx.map.values()]).toContainExactly(
      ctx.keyValues.map(([_, v]) => v).slice(1),
    )
  })

  it<MapTest>("returns correct `entries` after equivalent removal", (ctx) => {
    ctx.keyValues.forEach(([k, v]) => ctx.map.set(k, v))
    ctx.map.delete(ctx.duplicateKeyValues[0][0])
    expect([...ctx.map.entries()]).toEqual(ctx.keyValues.slice(1))
  })

  it<MapTest>("returns correct `keys` after equivalent removal", (ctx) => {
    ctx.keyValues.forEach(([k, v]) => ctx.map.set(k, v))
    ctx.map.delete(ctx.duplicateKeyValues[0][0])
    expect([...ctx.map.keys()]).toContainExactly(
      ctx.keyValues.map(([k]) => k).slice(1),
    )
  })

  it<MapTest>("returns correct `values` after equivalent removal", (ctx) => {
    ctx.keyValues.forEach(([k, v]) => ctx.map.set(k, v))
    ctx.map.delete(ctx.duplicateKeyValues[0][0])
    expect([...ctx.map.values()]).toContainExactly(
      ctx.keyValues.map(([_, v]) => v).slice(1),
    )
  })

  it<MapTest>("returns undefined for equal after equal removal", (ctx) => {
    ctx.keyValues.forEach(([k, v]) => ctx.map.set(k, v))
    const key = ctx.keyValues[0][0]
    ctx.map.delete(key)
    expect(ctx.map.get(key)).toBeUndefined()
  })

  it<MapTest>("returns undefined for equal after equivalent removal", (ctx) => {
    ctx.keyValues.forEach(([k, v]) => ctx.map.set(k, v))
    const key = ctx.keyValues[0][0]
    const equivalentKey = ctx.duplicateKeyValues[0][0]
    ctx.map.delete(equivalentKey)
    expect(ctx.map.get(key)).toBeUndefined()
  })

  it<MapTest>("returns undefined for equivalent after equal removal", (ctx) => {
    ctx.keyValues.forEach(([k, v]) => ctx.map.set(k, v))
    const key = ctx.keyValues[0][0]
    const equivalentKey = ctx.duplicateKeyValues[0][0]
    ctx.map.delete(key)
    expect(ctx.map.get(equivalentKey)).toBeUndefined()
  })

  it<MapTest>("returns undefined for equivalent after equivalent removal", (ctx) => {
    ctx.keyValues.forEach(([k, v]) => ctx.map.set(k, v))
    const equivalentKey = ctx.duplicateKeyValues[0][0]
    ctx.map.delete(equivalentKey)
    expect(ctx.map.get(equivalentKey)).toBeUndefined()
  })
})
