/** An async task queue allows to create a series of "tasks" in the form
 * of functions that should be executed in order, one after the other.
 *
 * Useful for something that repeatedly emits event, e.g.
 * ```
 * foo.on("bar", () => taskQueue.push(async () => {
 *   await fetch()
 *   await fetch()
 * }))
 * ```
 */
export type AsyncTaskQueue = {
  push: (task: () => Promise<void>) => void
}

export const createAsyncTaskQueue = (): AsyncTaskQueue => {
  let promise: Promise<void> = Promise.resolve()
  return {
    push: (task: () => Promise<void>) => {
      promise = promise
        .then(() => task())
        .catch((error) => {
          console.error("Error in async task queue:", error)
        })
    },
  }
}
