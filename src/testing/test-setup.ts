import { expect } from "vitest"

// see vitest.d.ts
expect.extend({
  toContainExactly: <T>(received: T[], expected: T[]) => {
    // contains all expected values
    const expectedSet = new Set<T>()
    // contains the intersection of expected & received values
    const expectedAndReceivedSet = new Set<T>()

    // create expected set
    expected.forEach((item) => expectedSet.add(item))

    // created intersection of expected and received, by adding to `expectedAndReceived`
    // by adding all `received` values that are in `expected` set. Also, if a value can't
    // be found, set `failed` to `true`.
    const failed = received.some((item) => {
      if (expectedSet.has(item)) {
        expectedAndReceivedSet.add(item)
        return false
      }
      return true
    })
    // if `received` has a value not found in `expected`, or `expected.length` != `expectedAndReceived.length`
    if (failed || expectedSet.size !== expectedAndReceivedSet.size) {
      return {
        message: () =>
          `AssertionError: array contents do not match. Expected length: ${expected.length}, received length: ${received.length}`,
        pass: false,
      }
    } else {
      return { pass: true, message: () => "" }
    }
  },
})
