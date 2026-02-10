/**
 * Lock returned by {@link AsyncLock.acquire}. */
export type Lock = {
  /** Release the lock. Can be called at most once per lock. */
  release: () => void
}

/** A lock to lock a resource in an async environment.
 *
 * Await `lock.acquire()` to wait until the lock is released before code is continued.
 *
 * Note that this is not a "real" thread lock, it won't put the thread to sleep differently than
 * any other `await` call. This means that there's very little performance overhead incurred
 * simply by acquiring a lock. Tests on my machine show that acquiring a lock takes in order of
 * about 100 us.
 *
 */
export class AsyncLock {
  #locked: boolean = false
  #queue: (() => void)[] = []

  #warnAfterMs: number | undefined

  /** if `warnAfterMs` is set, the lock will emit a warning if a call to `lock.acquire()
   * tok more than `warnAfterMs` milliseconds.
   */
  constructor(props?: { warnAfterMs?: number }) {
    this.#warnAfterMs = props?.warnAfterMs ?? undefined
  }

  /**
   * Wait until no other async thread holds a lock, then returns a lock.
   *
   * Once the lock is held, all other threads that call `acquire()` will have to wait until
   * the lock is released.
   *
   *
   * Release the lock with `lock.release()`.
   *
   * Example:
   * ```ts
   * const lock = new AsyncLock()
   * ...
   * const l = await lock.acquire()
   * // do stuff
   * l.release()
   * ```
   *
   */
  async acquire(): Promise<Lock> {
    let cancelWarning = () => {}
    if (this.#warnAfterMs !== undefined) {
      // if we don't call this function before `warnAfterMs` ms, a warning is logged to the console.
      cancelWarning = warnAfterTimeout(
        this.#warnAfterMs,
        `Waited for lock.acquire() for more than ${this.#warnAfterMs} ms, deadlock?`,
      )
    }

    // If lock is taken, await a promise whose `resolve` we push onto a queue, to be called
    // by another call to `release()`
    if (this.#locked) {
      await new Promise<void>((resolve) => this.#queue.push(resolve))
    }

    // cancel the warning if not already emitted
    cancelWarning()

    // put lock into locked state
    this.#locked = true

    // flag to make sure `release` can be called at most once.
    let isReleased = false

    return {
      release: () => {
        if (isReleased) {
          throw new Error("Lock already released")
        }
        // set to true to allow at most one call to this function
        isReleased = true

        if (this.#queue.length > 0) {
          // if there's something in the queue, release it. Keep locked.
          this.#queue.shift()?.()
        } else {
          // Else unlock and return.
          this.#locked = false
        }
      },
    }
  }

  /**
   * Execute a function after acquiring a lock, and release the lock after the function is done.
   *
   * Example:
   * ```ts
   * const v = await lock.runAcquired(() => {
   *  // do something
   *  return 42
   * })
   * ```
   *
   * This function is **safe against exceptions**. If the function throws an exception, the lock
   * is released before the exception is thrown.
   *
   */
  async runAcquired<T>(fn: () => T | Promise<T>): Promise<T> {
    const lock = await this.acquire()
    let v: T
    try {
      v = await fn()
      lock.release()
      return v
    } catch (e) {
      lock.release()
      throw e
    }
  }

  /** Weather the lock is currently taken. Because javascript is single-threaded, it is safe
   * to do e.g.:
   * ```ts
   * if (!lock.locked) {
   *   lock.acquire()
   *   // do something
   *   lock.release()
   * }
   *
   * ```
   *
   * without `await`ing the `lock.acquire()`.
   */
  get locked(): boolean {
    return this.#locked
  }
}

/** Returns a function. If the function hasn't been called before `timeout` ms,
 * `message` is `warn`ed to the console.
 */
const warnAfterTimeout = (timeout: number, message?: string): (() => void) => {
  const timoutSub = setTimeout(() => {
    console.warn(message)
    console.trace("Waited here:")
  }, timeout)
  return () => clearTimeout(timoutSub)
}
