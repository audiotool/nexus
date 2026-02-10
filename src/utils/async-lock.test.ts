import { beforeEach, describe, expect, it } from "vitest"
import { AsyncLock } from "./async-lock"

type TestContext = {
  lock: AsyncLock
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

describe("async-lock", () => {
  beforeEach<TestContext>((context) => {
    context.lock = new AsyncLock()
  })

  it<TestContext>(
    "should give lock if no one took it",
    { timeout: 500 },
    async (ctx) => {
      await ctx.lock.acquire()
    },
  )

  it<TestContext>(
    "should let acquire lock after release",
    { timeout: 500 },
    async (ctx) => {
      const l = await ctx.lock.acquire()
      l.release()
      await ctx.lock.acquire()
    },
  )

  it.fails<TestContext>(
    "should wait for lock to be released",
    { timeout: 500 },
    async (ctx) => {
      await ctx.lock.acquire()
      await ctx.lock.acquire()
    },
  )

  it<TestContext>(
    "should release lock in order",
    { timeout: 500, repeats: 5 },
    async (ctx) => {
      let counter = 0
      const t1 = async () => {
        const lock = await ctx.lock.acquire()
        expect(counter).toBe(0)
        await sleep(2)
        counter += 1
        lock.release()
      }

      const t2 = async () => {
        await ctx.lock.acquire()
        expect(counter).toBe(1)
        counter += 1
        return
      }
      const t1Promise = t1()
      const t2Promise = t2()
      await Promise.all([t1Promise, t2Promise])
      expect(counter).toBe(2)
    },
  )

  it<TestContext>(
    "can't release lock twice",
    { timeout: 500, repeats: 5 },
    async (ctx) => {
      const lock = await ctx.lock.acquire()
      lock.release()
      expect(() => lock.release()).toThrow()
    },
  )
})
