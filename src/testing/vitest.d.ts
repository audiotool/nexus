import "vitest"

interface CustomMatchers<R = unknown> {
  /**
   * Custom matcher for arrays that returns true exactly if the expected
   * and received arrays contain the same elements, irrespective of order.
   *
   * Elements are compared with strict equality.
   *
   * Example:
   * ```
   * expect([1, 2, 3]).toContainExactly([3, 2, 1]) // true
   * expect([1, 2, 3]).toContainExactly([3, 2, 1, 4]) // false
   * expect([1, 2, 3]).toContainExactly([3, 2]) // false
   * ```
   */
  toContainExactly(expected: unknown[]): R
}

declare module "vitest" {
  interface Assertion<T> extends CustomMatchers<T> {}

  interface AsymmetricMatchersContaining extends CustomMatchers {}
}
