import {
  anyEntityToTypeKey,
  mustUnpackEntity,
  unpackEntity,
  type EntityMessage,
  type EntityTypeKey,
} from "@document/entity-utils"
import type { Create, Modification } from "@gen/document/v1/document_service_pb"
import { assert, throw_ } from "@utils/lang"
import { beforeEach, describe, expect, it } from "vitest"
import type { SafeTransactionBuilder } from "."
import { NexusDocument } from "../document"
import type { NexusEntity } from "../entity"
import { createPointerFromNexusPath } from "../schema/converters"
import {
  buildModificationsForCloneLinkedEntities,
  type EntityWithOverwrites,
} from "./build-clone-linked-entities"

/** Give a modification, returns an entity of type T if the modification is a crate command
 * of an entity of that type, otherwise throws an assertion error.
 */
const mustGetCreateOfEntity = <T extends EntityTypeKey>(
  entityType: T,
  mod: Modification,
): EntityMessage<T> => {
  assert(mod.modification.case === "create", "modification isn't create")
  const create = mod.modification.value as Create
  assert(create.entity !== undefined, "empty create command")
  assert(
    anyEntityToTypeKey(create.entity) === entityType,
    "create is for unexpected entity type",
  )

  return unpackEntity(create.entity) as EntityMessage<T>
}

/** takes a list of modifications, picks out the first occurrence where */
const mustGetSomeCreateOfEntity = <T extends EntityTypeKey>(
  entityType: T,
  mods: Modification[],
): EntityMessage<T> => {
  for (const mod of mods) {
    if (mod.modification.case !== "create") {
      continue
    }
    const create = mod.modification.value as Create
    if (create.entity === undefined) {
      continue
    }
    if (anyEntityToTypeKey(create.entity) !== entityType) {
      continue
    }
    return unpackEntity(create.entity) as EntityMessage<T>
  }
  throw new Error(
    `couldn't find create command of entity of type ${entityType} amongst all modifications`,
  )
}

type TestContext = {
  nexus: NexusDocument
}

describe("build clone linked entity modification message", () => {
  beforeEach<TestContext>(async (ctx) => {
    ctx.nexus = new NexusDocument()
    await ctx.nexus.takeTransactions()
  })

  describe("clone a single entity", () => {
    it<TestContext>("should create a single create command", async (ctx) => {
      const config = (await ctx.nexus.createTransaction()).create(
        "tinyGain",
        {},
      )
      const { modifications } = buildModificationsForCloneLinkedEntities({
        entity: config,
      })

      expect(modifications.map((m) => m.modification.case)).toEqual(["create"])
    })

    it<TestContext>("should put a single uuid into uuid map", async (ctx) => {
      const config = (await ctx.nexus.createTransaction()).create(
        "tinyGain",
        {},
      )
      const { uuidMap } = buildModificationsForCloneLinkedEntities({
        entity: config,
      })

      expect(uuidMap.size).toBe(1)
    })

    it<TestContext>("old uuid should map to new uuid", async (ctx) => {
      const t = await ctx.nexus.createTransaction()
      const defaultGroove = getOrCreateDefaultGrooveLocation(t)
      const config = t.create("config", { defaultGroove })
      const { modifications, uuidMap } =
        buildModificationsForCloneLinkedEntities({
          entity: config,
        })

      const outputEntity = mustGetCreateOfEntity("config", modifications[0])
      expect(uuidMap.get(config.id)).toBe(outputEntity.id)
    })

    it<TestContext>("should correctly clone entity fields", async (ctx) => {
      const tinyGain = (await ctx.nexus.createTransaction()).create(
        "tinyGain",
        {
          isActive: false,
          gain: 0.5,
        },
      )
      const { modifications, uuidMap } =
        buildModificationsForCloneLinkedEntities({
          entity: tinyGain,
        })
      const configMessage = mustGetCreateOfEntity("tinyGain", modifications[0])
      const newUuid = uuidMap.get(tinyGain.id) ?? throw_("expected uuid to map")

      expect(configMessage).toMatchObject({
        audioInput: {},
        gain: tinyGain.fields.gain.value,
        id: newUuid,
        isActive: tinyGain.fields.isActive.value,
      })
    })

    it<TestContext>("should correctly overwrite fields", async (ctx) => {
      const tinyGain = (await ctx.nexus.createTransaction()).create(
        "tinyGain",
        {
          isActive: true,
          gain: 0.5,
        },
      )
      const { modifications } = buildModificationsForCloneLinkedEntities({
        entity: tinyGain,
        overwrites: { gain: 0.3 },
      })
      const outputMessage = mustGetCreateOfEntity("tinyGain", modifications[0])

      expect(outputMessage.gain).toBe(Math.fround(0.3))
    })
  })
  describe("should correctly clone multiple entities", () => {
    it<TestContext>("should create three create commands", async (ctx) => {
      const t = await ctx.nexus.createTransaction()
      const defaultGroove = getOrCreateDefaultGrooveLocation(t)
      const outputs = [
        t.create("config", { defaultGroove }),
        t.create("tinyGain", {}),
        t.create("stompboxChorus", {}),
      ]
      const { modifications } = buildModificationsForCloneLinkedEntities(
        // need `as` to type check
        ...outputs.map((entity) => ({ entity }) as EntityWithOverwrites),
      )

      expect(modifications.map((m) => m.modification.case)).toEqual([
        "create",
        "create",
        "create",
      ])
    })

    it<TestContext>("should put a uuid per entity into uuid map", async (ctx) => {
      const t = await ctx.nexus.createTransaction()
      const defaultGroove = getOrCreateDefaultGrooveLocation(t)
      const outputs = [
        t.create("config", { defaultGroove }),
        t.create("tinyGain", {}),
        t.create("stompboxChorus", {}),
      ]
      const { uuidMap } = buildModificationsForCloneLinkedEntities(
        // need `as` to type check
        ...outputs.map((entity) => ({ entity }) as EntityWithOverwrites),
      )

      expect(uuidMap.size).toBe(3)
    })

    it<TestContext>("old uuid should map to new uuid", async (ctx) => {
      const t = await ctx.nexus.createTransaction()
      const defaultGroove = getOrCreateDefaultGrooveLocation(t)
      const config = t.create("config", { defaultGroove })
      const tinyGain = t.create("tinyGain", {})
      const stompboxChorus = t.create("stompboxChorus", {})

      const { uuidMap, modifications } =
        buildModificationsForCloneLinkedEntities(
          ...[config, tinyGain, stompboxChorus],
        )

      const configClone = mustGetSomeCreateOfEntity("config", modifications)
      const tinyGainClone = mustGetSomeCreateOfEntity("tinyGain", modifications)
      const chorusClone = mustGetSomeCreateOfEntity(
        "stompboxChorus",
        modifications,
      )

      expect(Object.fromEntries(uuidMap)).toMatchObject({
        [config.id]: configClone.id,
        [tinyGain.id]: tinyGainClone.id,
        [stompboxChorus.id]: chorusClone.id,
      })
    })

    it<TestContext>("old uuid should map to new uuid", async (ctx) => {
      const t = await ctx.nexus.createTransaction()
      const delay = t.create("stompboxDelay", {
        mix: 0.2223,
      })
      const tinyGain = t.create("tinyGain", {
        gain: 0.2837,
      })
      const stompboxChorus = t.create("stompboxChorus", {
        delayTimeMs: 23,
      })

      const { modifications } = buildModificationsForCloneLinkedEntities(
        ...[delay, tinyGain, stompboxChorus],
      )

      const delayClone = mustGetSomeCreateOfEntity(
        "stompboxDelay",
        modifications,
      )
      const tinyGainClone = mustGetSomeCreateOfEntity("tinyGain", modifications)
      const chorusClone = mustGetSomeCreateOfEntity(
        "stompboxChorus",
        modifications,
      )

      expect([
        delayClone.mix,
        tinyGainClone.gain,
        chorusClone.delayTimeMs,
      ]).toEqual([
        delay.fields.mix.value,
        tinyGain.fields.gain.value,
        stompboxChorus.fields.delayTimeMs.value,
      ])
    })

    it<TestContext>("should correctly overwrite fields", async (ctx) => {
      const t = await ctx.nexus.createTransaction()
      const delay = t.create("stompboxDelay", {
        mix: 0.2223,
      })
      const tinyGain = t.create("tinyGain", {
        gain: 0.2837,
      })
      const stompboxChorus = t.create("stompboxChorus", {
        delayTimeMs: 23,
      })

      const { modifications } = buildModificationsForCloneLinkedEntities(
        ...[
          { entity: delay, overwrites: { mix: 0.234 } },
          { entity: tinyGain, overwrites: { gain: 0.2938 } },
          { entity: stompboxChorus, overwrites: { delayTimeMs: 24 } },
        ],
      )

      const delayClone = mustGetSomeCreateOfEntity(
        "stompboxDelay",
        modifications,
      )
      const tinyGainClone = mustGetSomeCreateOfEntity("tinyGain", modifications)
      const chorusClone = mustGetSomeCreateOfEntity(
        "stompboxChorus",
        modifications,
      )

      expect([
        delayClone.mix,
        tinyGainClone.gain,
        chorusClone.delayTimeMs,
      ]).toEqual([Math.fround(0.234), Math.fround(0.2938), 24])
    })
  })

  it<TestContext>("should correctly handle duplicate entities", async (ctx) => {
    const tinyGain = (await ctx.nexus.createTransaction()).create(
      "tinyGain",
      {},
    )

    const { modifications } = buildModificationsForCloneLinkedEntities(
      ...[tinyGain, tinyGain, { entity: tinyGain }],
    )

    // should only clone once
    expect(modifications.length).toBe(1)
  })

  describe("update links between entities", () => {
    it<TestContext>("should correctly update pointer from/to list of cloned entities", async (ctx) => {
      const t = await ctx.nexus.createTransaction()
      const device = t.create("audioDevice", {})
      const track = t.create("audioTrack", {
        player: device.location,
      })

      const { modifications } = buildModificationsForCloneLinkedEntities(
        device,
        track,
      )

      const trackClone = mustGetSomeCreateOfEntity("audioTrack", modifications)
      const deviceClone = mustGetSomeCreateOfEntity(
        "audioDevice",
        modifications,
      )
      expect(trackClone.player).toMatchObject(
        createPointerFromNexusPath(deviceClone.id, "/audioDevice"),
      )
    })

    it<TestContext>("should leave pointers to outside of list untouched", async (ctx) => {
      const t = await ctx.nexus.createTransaction()
      const device = t.create("audioDevice", {})
      const track = t.create("audioTrack", {
        player: device.location,
      })

      // only clone track
      const { modifications } = buildModificationsForCloneLinkedEntities(track)

      const trackClone = mustGetSomeCreateOfEntity("audioTrack", modifications)

      expect(trackClone.player).toMatchObject(
        createPointerFromNexusPath(device.id, "/audioDevice"),
      )
    })
  })

  it<TestContext>("should correctly order modifications", async (ctx) => {
    /**
     * This function tests if the order of create commands is correct.
     *
     * The create command order is correct iff the entities are topologically sorted.
     *
     * This is a bit annoying to test since I didn't find a chain of entities
     * a -> b -> c without also having a, b, or c pointing to other entities, which creates
     * ambiguity in the order.
     *
     * If we have entities:
     *
     * a -> b -> c
     *  \-> d
     *
     * Then b and d can arrive in any order, since they don't depend on each other.
     * This is why this test is a bit annoying to read and write.
     *
     *
     */
    const t = await ctx.nexus.createTransaction()

    // create three stompboxes, connect with cables
    const sb1 = t.create("stompboxCompressor", {})
    const sb2 = t.create("stompboxDelay", {})
    const sb3 = t.create("stompboxFlanger", {})
    const conn1to2 = t.create("desktopAudioCable", {
      fromSocket: sb1.fields.audioOutput.location,
      toSocket: sb2.fields.audioInput.location,
    })
    const conn2to3 = t.create("desktopAudioCable", {
      fromSocket: sb2.fields.audioOutput.location,
      toSocket: sb3.fields.audioInput.location,
    })

    // call for an order of the above entities to validate the order of returned
    // modifications
    const validateEntityOrder = (label: string, entities: NexusEntity[]) => {
      const { modifications, uuidMap } =
        buildModificationsForCloneLinkedEntities(...entities)

      // we need to make sure:
      // * sb1 and sb2 are created before conn1to2
      // * sb2 and sb3 are created before conn2to3
      let sb1created = false
      let sb2created = false
      let sb3created = false
      modifications.forEach((mod) => {
        const create = mod.modification.value as Create
        const id = mustUnpackEntity(create.entity).id

        if (id == uuidMap.get(sb1.id)) {
          sb1created = true
        } else if (id == uuidMap.get(sb2.id)) {
          sb2created = true
        } else if (id == uuidMap.get(sb3.id)) {
          sb3created = true
        } else if (id == uuidMap.get(conn1to2.id)) {
          expect(sb1created, `order ${label}: sb1 already created`).toBeTruthy()
          expect(sb2created, `order ${label}: sb2 already created`).toBeTruthy()
        } else if (id == uuidMap.get(conn2to3.id)) {
          expect(sb2created, `order ${label}: sb2 already created`).toBeTruthy()
          expect(sb3created, `order ${label}: sb3 already created`).toBeTruthy()
        }
      })
    }

    const entities = [sb1, sb2, sb3, conn1to2, conn2to3]
    getPermutations(entities.length).forEach((permutation) => {
      validateEntityOrder(
        JSON.stringify(permutation),
        permutation.map((i) => entities[i]),
      )
    })
  })
})

/** Get all permutations, own impl bcs js has NO stdlib */
const getPermutations = (noElements: number): number[][] => {
  const permute = (elements: number[]): number[][] => {
    if (elements.length == 1) {
      return [elements]
    } else {
      return elements.flatMap((i) =>
        permute(elements.filter((j) => j != i)).map(
          (perm) => [i, ...perm] as number[],
        ),
      )
    }
  }
  return permute(
    Array(noElements)
      .fill(0)
      .map((_, i) => i),
  )
}

export const getOrCreateDefaultGrooveLocation = (t: SafeTransactionBuilder) => {
  const config = t.entities.ofTypes("config").getOne()
  return (
    config?.fields.defaultGroove.value ??
    t.entities.ofTypes("groove").getOne()?.location ??
    t.create("groove", {
      displayName: "Default Groove",
      durationTicks: 1920,
      impact: 0.2,
      functionIndex: 1,
    }).location
  )
}
