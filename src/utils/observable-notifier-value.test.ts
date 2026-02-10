import { assertType, describe, expect, it, vi } from "vitest"
import type { ObservableValue } from "./observable-notifier-value"
import {
  MapValueNotifier,
  SetValueNotifier,
  ValueNotifier,
} from "./observable-notifier-value"

describe("ValueNotifier", () => {
  it("should initialize with the correct value", () => {
    const notifier = new ValueNotifier<number>(42)
    expect(notifier.getValue()).toBe(42)
  })

  it("should notify subscribers on value change", () => {
    const notifier = new ValueNotifier<number>(42)
    const callback = vi.fn()
    notifier.subscribe(callback)

    notifier.setValue(100)
    expect(callback).toHaveBeenCalledWith(100)
  })

  it("should update the value if set", () => {
    const notifier = new ValueNotifier<number>(42)
    notifier.setValue(100)
    expect(notifier.getValue()).toBe(100)
  })

  it("should termiante subscribers", () => {
    const notifier = new ValueNotifier<number>(42)
    const callback = vi.fn()
    const terminable = notifier.subscribe(callback)
    terminable.terminate()
    notifier.setValue(100)
    expect(callback).not.toHaveBeenCalled()
  })

  it("should have a type satisfying observable", () => {
    const notifier = new ValueNotifier<number>(42)
    assertType<ObservableValue<number>>(notifier)
  })
})

describe("SetValueNotifier", () => {
  it("should have the type satisfying readonly set observable", () => {
    const notifier = new SetValueNotifier<number>()
    assertType<ObservableValue<ReadonlySet<number>>>(notifier)
  })

  it("should initialize with an empty set", () => {
    const notifier = new SetValueNotifier<number>()
    expect(notifier.getValue()).toEqual(new Set())
  })

  it("should allow initialization with a set", () => {
    const initialSet = new Set([1, 2, 3])
    const notifier = new SetValueNotifier<number>(initialSet)
    expect(notifier.getValue()).toEqual(new Set([1, 2, 3]))
  })

  it("should notify subscribers on value change", () => {
    const notifier = new SetValueNotifier<number>()
    const callback = vi.fn()
    notifier.subscribe(callback)

    notifier.add(1)
    expect(callback).toHaveBeenCalledWith(new Set([1]))
  })

  it("should add values to the set subscribers on value change", () => {
    const notifier = new SetValueNotifier<number>()
    const callback = vi.fn()
    notifier.subscribe(callback)

    notifier.add(1)
    notifier.add(2)

    expect(callback).toHaveBeenCalledWith(new Set([1, 2]))
  })

  it("should not notify subscribers if the value already exists", () => {
    const notifier = new SetValueNotifier<number>()
    const callback = vi.fn()
    notifier.subscribe(callback, false)

    notifier.add(1)
    notifier.add(1)

    expect(callback).toHaveBeenCalledTimes(1)
  })

  it("should delete values from the set", () => {
    const notifier = new SetValueNotifier<number>(new Set([1, 2]))

    notifier.delete(1)

    expect(notifier.getValue()).toEqual(new Set([2]))
  })

  it("should not notify subscribers if the value does not exist", () => {
    const notifier = new SetValueNotifier<number>(new Set([1, 2]))
    const callback = vi.fn()
    notifier.subscribe(callback, false)

    notifier.delete(3)

    expect(callback).not.toHaveBeenCalled()
  })

  it("should notify subscribers on value deletion", () => {
    const notifier = new SetValueNotifier<number>(new Set([1, 2]))
    const callback = vi.fn()
    notifier.subscribe(callback)
    notifier.delete(1)
    expect(callback).toHaveBeenCalledWith(new Set([2]))
  })

  it("should call subscription immediately if initialTrigger is true", () => {
    const notifier = new SetValueNotifier<number>(new Set([1, 2]))
    const callback = vi.fn()
    notifier.subscribe(callback, true)
    expect(callback).toHaveBeenCalledWith(new Set([1, 2]))
  })
})

describe("MapValueNotifier", () => {
  it("should have the type satisfying readonly map observable", () => {
    const notifier = new MapValueNotifier<string, number>()
    assertType<ObservableValue<ReadonlyMap<string, number>>>(notifier)
  })

  it("should initialize with an empty map", () => {
    const notifier = new MapValueNotifier<string, number>()
    expect(notifier.getValue()).toEqual(new Map())
  })

  it("should allow initialization with a map", () => {
    const initialMap = new Map([
      ["a", 1],
      ["b", 2],
    ])
    const notifier = new MapValueNotifier<string, number>(initialMap)
    expect(notifier.getValue()).toEqual(
      new Map([
        ["a", 1],
        ["b", 2],
      ]),
    )
  })

  it("should notify subscribers on value change", () => {
    const notifier = new MapValueNotifier<string, number>()
    const callback = vi.fn()
    notifier.subscribe(callback)

    notifier.set("a", 1)
    expect(callback).toHaveBeenCalledWith(new Map([["a", 1]]))
  })

  it("should add values to the map", () => {
    const notifier = new MapValueNotifier<string, number>()
    const callback = vi.fn()
    notifier.subscribe(callback)

    notifier.set("a", 1)
    notifier.set("b", 2)

    expect(callback).toHaveBeenCalledWith(
      new Map([
        ["a", 1],
        ["b", 2],
      ]),
    )
  })

  it("should notify subscribers even if the key already exists", () => {
    // bcs the value might be different
    const notifier = new MapValueNotifier<string, number>()
    const callback = vi.fn()
    notifier.subscribe(callback, false)

    notifier.set("a", 1)
    notifier.set("a", 1)

    expect(callback).toHaveBeenCalledTimes(2)
  })

  it("should delete values from the map", () => {
    const notifier = new MapValueNotifier<string, number>(new Map([["a", 1]]))

    notifier.delete("a")

    expect(notifier.getValue()).toEqual(new Map())
  })

  it("should not notify subscribers if the key does not exist", () => {
    const notifier = new MapValueNotifier<string, number>(new Map([["a", 1]]))
    const callback = vi.fn()
    notifier.subscribe(callback, false)

    notifier.delete("b")

    expect(callback).not.toHaveBeenCalled()
  })
  it("should notify subscribers on value deletion", () => {
    const notifier = new MapValueNotifier<string, number>(new Map([["a", 1]]))
    const callback = vi.fn()
    notifier.subscribe(callback)
    notifier.delete("a")
    expect(callback).toHaveBeenCalledWith(new Map())
  })

  it("should clear the map", () => {
    const notifier = new MapValueNotifier<string, number>(new Map([["a", 1]]))
    notifier.clear()
    expect(notifier.getValue()).toEqual(new Map())
  })

  it("should notify subscribers on map clear", () => {
    const notifier = new MapValueNotifier<string, number>(new Map([["a", 1]]))
    const callback = vi.fn()
    notifier.subscribe(callback)
    notifier.clear()
    expect(callback).toHaveBeenCalledWith(new Map())
  })

  it("should not notify subscribers on map clear if size is 0", () => {
    const notifier = new MapValueNotifier<string, number>(new Map())
    const callback = vi.fn()
    notifier.subscribe(callback, false)
    notifier.clear()
    expect(callback).not.toHaveBeenCalled()
  })
})
