import { beforeEach, describe, expect, it, vi } from "vitest"
import type { NexusEntity } from "./entity"
import { NexusEventManager } from "./event-manager"
import { PrimitiveField } from "./fields"
import { NexusLocation } from "./location"

type TestContext = {
  manager: NexusEventManager
  /** an example entity */
  entity1: NexusEntity
  /** an example location in entity 1 */
  location1: NexusLocation
  /** another example location */
  location2: NexusLocation
}

const primitiveField = (location: NexusLocation, value: number) =>
  new PrimitiveField(location, value, "float", true)

describe("EventManager", () => {
  beforeEach<TestContext>((context) => {
    context.manager = new NexusEventManager()
    context.location1 = new NexusLocation("test", "tinyGain", [0])
    context.location2 = new NexusLocation("test2", "tinyGain", [1])
    context.entity1 = {
      id: context.location1.entityId,
      entityType: "quasar",
    } as NexusEntity // only few fields are relevant for manager
  })

  describe("stats test", () => {
    describe("initial stats", () => {
      it<TestContext>("should have 0 create callbacks at first", (context) => {
        expect(context.manager.getStats().numCreateListeners).toEqual(0)
      })

      it<TestContext>("should have 0 update callbacks at first", (context) => {
        expect(context.manager.getStats().numUpdateListeners).toEqual(0)
      })

      it<TestContext>("should have 0 remove callbacks at first", (context) => {
        expect(context.manager.getStats().numRemoveListeners).toEqual(0)
      })

      it<TestContext>("should have 0 pointing to callbacks at first", (context) => {
        expect(context.manager.getStats().numPointingToListeners).toEqual(0)
      })

      it<TestContext>("should have 0 stop pointing to callbacks at first", (context) => {
        expect(context.manager.getStats().numStopPointingToListeners).toEqual(0)
      })
    })

    describe("add callbacks", () => {
      it<TestContext>("adding an create callback should increase count", (context) => {
        context.manager.onCreate("quasar", () => {})
        expect(context.manager.getStats().numCreateListeners).toEqual(1)
      })

      it<TestContext>("adding an update callback should increase count", (context) => {
        context.manager.onUpdate(primitiveField(context.location1, 0), () => {})
        expect(context.manager.getStats().numUpdateListeners).toEqual(1)
      })

      it<TestContext>("adding an delete callback should increase count", (context) => {
        context.manager.onRemove({ id: "test" } as NexusEntity, () => {})
        expect(context.manager.getStats().numRemoveListeners).toEqual(1)
      })

      it<TestContext>("adding a start pointing to callback should increase count", (context) => {
        context.manager.onPointingTo(context.location1, () => {})
        expect(context.manager.getStats().numPointingToListeners).toEqual(1)
      })

      it<TestContext>("adding a stop pointing to callback should increase count", (context) => {
        context.manager.onStopPointingTo(context.location1, () => {})
        expect(context.manager.getStats().numStopPointingToListeners).toEqual(1)
      })
    })

    describe("dispatch remove", () => {
      it<TestContext>("removing entity should remove stop pointing to callbacks", (context) => {
        context.manager.onStopPointingTo(context.location1, () => {})
        context.manager._dispatchRemove(context.entity1)
        expect(context.manager.getStats().numStopPointingToListeners).toEqual(0)
      })

      it<TestContext>("removing entity should remove pointing to callbacks", (context) => {
        context.manager.onPointingTo(context.location1, () => {})
        context.manager._dispatchRemove(context.entity1)
        expect(context.manager.getStats().numPointingToListeners).toEqual(0)
      })

      it<TestContext>("removing entity should remove update callbacks", (context) => {
        context.manager.onUpdate(primitiveField(context.location1, 0), () => {})
        context.manager._dispatchRemove(context.entity1)

        expect(context.manager.getStats().numUpdateListeners).toEqual(0)
      })

      it<TestContext>("removing entity should remove remove callbacks", (context) => {
        context.manager.onRemove(context.entity1, () => {})
        context.manager._dispatchRemove(context.entity1)
        expect(context.manager.getStats().numRemoveListeners).toEqual(0)
      })
    })
  })

  describe("test callbacks", () => {
    describe("update callbacks", () => {
      it<TestContext>("update callback should not be triggered if immediate trigger is false", (context) => {
        const spy = vi.fn()
        context.manager.onUpdate(
          primitiveField(context.location1, 0),
          spy,
          false,
        )
        expect(spy).not.toHaveBeenCalled()
      })

      it<TestContext>("update callback should  be triggered if immediate trigger is true", (context) => {
        const spy = vi.fn()
        context.manager.onUpdate(
          primitiveField(context.location1, 0.2),
          spy,
          true,
        )
        expect(spy).toHaveBeenCalledWith(0.2)
      })

      it<TestContext>("update callback should  be called if dispatched", (context) => {
        const spy = vi.fn()
        context.manager.onUpdate(
          primitiveField(context.location1, 0.2),
          spy,
          false,
        )
        context.manager._dispatchUpdate(context.location1, 0.6)
        expect(spy).toHaveBeenCalledWith(0.6)
      })

      it<TestContext>("update callback should be called if dispatched", (context) => {
        const spy = vi.fn()
        context.manager.onUpdate(
          primitiveField(context.location1, 0.2),
          spy,
          false,
        )
        context.manager._dispatchUpdate(context.location1, 0.6)
        expect(spy).toHaveBeenCalledWith(0.6)
      })

      it<TestContext>("update callback should not be called if unsubscribed", (context) => {
        const spy = vi.fn()
        const uns = context.manager.onUpdate(
          primitiveField(context.location1, 0.2),
          spy,
          false,
        )
        uns.terminate()
        context.manager._dispatchUpdate(context.location1, 0.6)
        expect(spy).not.toHaveBeenCalled()
      })
    })

    describe("create callbacks", () => {
      it<TestContext>("create callback should be called if dispatched", (context) => {
        const spy = vi.fn()
        context.manager.onCreate(context.entity1.entityType, spy)
        context.manager._dispatchCreate(context.entity1)
        expect(spy).toHaveBeenCalledWith(context.entity1)
      })

      it<TestContext>("create callback should not be called if unsubscribed", (context) => {
        const spy = vi.fn()
        const uns = context.manager.onCreate(context.entity1.entityType, spy)
        uns.terminate()
        context.manager._dispatchCreate(context.entity1)
        expect(spy).not.toHaveBeenCalled()
      })

      it<TestContext>("create callback for * should be called if dispatched", (context) => {
        const spy = vi.fn()
        context.manager.onCreate("*", spy)
        context.manager._dispatchCreate(context.entity1)
        expect(spy).toHaveBeenCalledWith(context.entity1)
      })

      it<TestContext>("create callback for * should not be called if unsubscribed", (context) => {
        const spy = vi.fn()
        const uns = context.manager.onCreate("*", spy)
        uns.terminate()
        context.manager._dispatchCreate(context.entity1)

        expect(spy).not.toHaveBeenCalled()
      })

      it<TestContext>("callback returned by onCreate callback should be called on remove", (context) => {
        const spy = vi.fn()
        context.manager.onCreate(context.entity1.entityType, () => {
          return () => spy()
        })
        context.manager._dispatchCreate(context.entity1)
        context.manager._dispatchRemove(context.entity1)
        expect(spy).toHaveBeenCalled()
      })

      it<TestContext>("callback returned by onCreate callback should still be called even if unsubscribed", (context) => {
        const spy = vi.fn()
        const uns = context.manager.onCreate(context.entity1.entityType, () => {
          return () => spy()
        })
        context.manager._dispatchCreate(context.entity1)
        uns.terminate()
        context.manager._dispatchRemove(context.entity1)
        expect(spy).toHaveBeenCalled()
      })
    })

    describe("remove callbacks", () => {
      it<TestContext>("remove callback should be called if dispatched", (context) => {
        const spy = vi.fn()
        context.manager.onRemove(context.entity1, spy)
        context.manager._dispatchRemove(context.entity1)
        expect(spy).toHaveBeenCalledWith(context.entity1)
      })
      it<TestContext>("remove callback for * should be called if dispatched", (context) => {
        const spy = vi.fn()
        context.manager.onRemove("*", spy)
        context.manager._dispatchRemove(context.entity1)
        expect(spy).toHaveBeenCalledWith(context.entity1)
      })

      it<TestContext>("remove callback for * should not be called if unsubscribed", (context) => {
        const spy = vi.fn()
        const uns = context.manager.onRemove("*", spy)
        uns.terminate()
        context.manager._dispatchRemove(context.entity1)
        expect(spy).not.toHaveBeenCalled()
      })

      it<TestContext>("remove callback should not be called if unsubscribed", (context) => {
        const spy = vi.fn()
        const uns = context.manager.onRemove(context.entity1, spy)
        uns.terminate()
        context.manager._dispatchRemove(context.entity1)
        expect(spy).not.toHaveBeenCalled()
      })
    })

    describe("pointing to callbacks", () => {
      it<TestContext>("pointing to callback should be called if dispatched", (context) => {
        const spy = vi.fn()
        context.manager.onPointingTo(context.location1, spy)
        context.manager._dispatchPointingTo(
          context.location1,
          context.location2,
        )
        expect(spy).toHaveBeenCalledWith(context.location2)
      })

      it<TestContext>("pointing to callback should not be called if unsubscribed", (context) => {
        const spy = vi.fn()
        const uns = context.manager.onPointingTo(context.location1, spy)
        uns.terminate()
        context.manager._dispatchPointingTo(
          context.location1,
          context.location2,
        )
        expect(spy).not.toHaveBeenCalled()
      })
    })

    describe("stop pointing to callbacks", () => {
      it<TestContext>("stop pointing to callback should be called if dispatched", (context) => {
        const spy = vi.fn()
        context.manager.onStopPointingTo(context.location1, spy)
        context.manager._dispatchStopPointingTo(
          context.location1,
          context.location2,
        )
        expect(spy).toHaveBeenCalledWith(context.location2)
      })

      it<TestContext>("stop pointing to callback should not be called if unsubscribed", (context) => {
        const spy = vi.fn()
        const uns = context.manager.onStopPointingTo(context.location1, spy)
        uns.terminate()
        context.manager._dispatchStopPointingTo(
          context.location1,
          context.location2,
        )
        expect(spy).not.toHaveBeenCalled()
      })
    })
  })
})
