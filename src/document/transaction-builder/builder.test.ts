import { Modification } from "@gen/document/v1/document_service_pb"

import { throw_ } from "@utils/lang"
import { beforeEach, describe, expect, it } from "vitest"
import type { NexusEntity } from "../entity"

import { Any } from "@bufbuild/protobuf"
import { anyEntityToTypeKey, mustUnpackEntity } from "@document/entity-utils"
import { StompboxCrusher } from "@gen/document/v1/entity/stompbox_crusher/v1/stompbox_crusher_pb"
import * as docpreset from "@gen/document/v1/preset/v1/preset_pb"
import { Preset } from "@gen/preset/v1/preset_pb"

import { NexusPreset } from "@api/preset-utils"
import { packedEntity } from "@document/entity-utils"
import {
  nexusDocumentState,
  type NexusDocumentState,
} from "../document-state/state"
import type { PrimitiveField } from "../fields"
import { EntityQuery } from "../query/entity"
import {
  CallAfterSendError,
  transactionBuilder,
  type TransactionBuilder,
} from "./builder"
import { createDefaultEntityMessage } from "./create-default-entity"
import { type DevicePresetEntityType } from "./prepare-preset"

type TestContext = {
  builder: TransactionBuilder
  appliedModifications: Modification[]
  entities: NexusDocumentState
}

describe("transaction builder", () => {
  describe("throw after send", () => {
    beforeEach<TestContext>((ctx) => {
      ctx.builder = transactionBuilder({
        finish: () => {},
        applyModification: () => {},
        query: new EntityQuery(),
      })
      ctx.builder.send()
    })

    it<TestContext>("should throw for create", (ctx) => {
      expect(() => ctx.builder.create("stompboxCrusher", {})).toThrow()
    })

    it<TestContext>("should throw for clone", (ctx) => {
      expect(() => ctx.builder.create("stompboxCrusher", {})).toThrowError(
        CallAfterSendError,
      )
    })

    it<TestContext>("should throw for cloneLinked", (ctx) => {
      expect(() => ctx.builder.cloneLinked()).toThrowError(CallAfterSendError)
    })

    it<TestContext>("should throw for update", (ctx) => {
      expect(() =>
        ctx.builder.update(null as unknown as PrimitiveField<number>, 22),
      ).toThrowError(CallAfterSendError)
    })

    it<TestContext>("should throw for tryUpdate", (ctx) => {
      expect(() =>
        ctx.builder.tryUpdate(null as unknown as PrimitiveField<number>, 22),
      ).toThrowError(CallAfterSendError)
    })

    it<TestContext>("should throw for remove", (ctx) => {
      expect(() => ctx.builder.remove("")).toThrowError(CallAfterSendError)
    })

    it<TestContext>("should throw for removeWithDependencies", (ctx) => {
      expect(() => ctx.builder.removeWithDependencies("")).toThrowError(
        CallAfterSendError,
      )
    })

    it<TestContext>("should throw for applyPresetTo", (ctx) => {
      expect(() =>
        ctx.builder.applyPresetTo(
          null as unknown as NexusEntity<DevicePresetEntityType>,
          null as unknown as NexusPreset,
        ),
      ).toThrowError(CallAfterSendError)
    })

    it<TestContext>("should throw for createDeviceFromPreset", (ctx) => {
      expect(() =>
        ctx.builder.createDeviceFromPreset(null as unknown as NexusPreset),
      ).toThrowError(CallAfterSendError)
    })

    it<TestContext>("should throw for createPresetFor", (ctx) => {
      expect(() =>
        ctx.builder.createPresetFor(
          null as unknown as NexusEntity<DevicePresetEntityType>,
        ),
      ).toThrowError(CallAfterSendError)
    })

    it<TestContext>("should throw for send", (ctx) => {
      expect(() => ctx.builder.send()).toThrowError(CallAfterSendError)
    })
  })

  describe("methods", () => {
    beforeEach<TestContext>((ctx) => {
      ctx.appliedModifications = []
      ctx.entities = nexusDocumentState()
      ctx.builder = transactionBuilder({
        finish: () => {},
        applyModification: (mod) => {
          // the transaction builder expects the updates to immediately be applied
          // to the passed entity query. We just create a mocked entity when the applied
          // modification is a create modification.
          ctx.appliedModifications.push(mod)
          ctx.entities.applyModification(mod)
        },
        query: new EntityQuery({
          documentState: ctx.entities,
        }),
      })
    })
    describe("create", () => {
      it<TestContext>("should apply correct modification", (ctx) => {
        ctx.builder.create("stompboxCrusher", {})
        expect(ctx.appliedModifications.map(extractCreate)).toHaveLength(1)
      })

      it<TestContext>("should return the newly created entity", (ctx) => {
        const entity = ctx.builder.create("stompboxCrusher", {})
        const create =
          ctx.appliedModifications
            .map(extractCreate)
            .filter((x) => x !== undefined)[0] ?? throw_()

        expect(entity).toMatchObject({
          entityType: create.entityType,
          id: create.entityId,
        })
      })

      it<TestContext>("should create the correct entity", (context) => {
        const crusher = context.builder.create("stompboxCrusher", {})
        expect(context.appliedModifications).toMatchObject([
          new Modification({
            modification: {
              case: "create",
              value: {
                entity: Any.pack(
                  new StompboxCrusher({
                    id: crusher.id,
                    audioInput: {},
                    audioOutput: {},
                    displayName: "Crusher",
                    preGain: 1,
                    downsamplingFactor: 0,
                    postGain: 1,
                    bits: 8,
                    mix: 1,
                    isActive: true,
                    presetName: "",
                  }),
                ),
              },
            },
          }),
        ])
      })

      it<TestContext>("should be able to handle nexus locations", (context) => {
        const crusher = context.builder.create("stompboxCrusher", {})
        expect(
          context.builder.create("desktopAudioCable", {
            fromSocket: crusher.fields.audioOutput.location,
            toSocket: crusher.fields.audioInput.location,
          }),
        ).toBeDefined()
      })

      it<TestContext>("should have correct target type for set nexus location", (context) => {
        const crusher = context.builder.create("stompboxCrusher", {})
        expect(
          context.builder.create("desktopAudioCable", {
            fromSocket: crusher.fields.audioOutput.location,
            toSocket: crusher.fields.audioInput.location,
          }).fields.fromSocket.value.entityType,
        ).toBe("stompboxCrusher")
      })
    })

    describe("createDeviceFromPreset", () => {
      it<TestContext>("should create an entity of the preset's type and stamp its preset name", (ctx) => {
        const presetName = "presets/test-crusher"
        const target = createDefaultEntityMessage("stompboxCrusher")
        target.preGain = 0.25
        target.bits = 4

        const preset: NexusPreset<"stompboxCrusher"> = {
          meta: new Preset({ name: presetName }),
          data: new docpreset.Preset({
            target: packedEntity("stompboxCrusher", target),
            relatives: [],
          }),
          entityType: "stompboxCrusher",
          _presetName: presetName,
        }

        const device = ctx.builder.createDeviceFromPreset(preset)

        expect(device.entityType).toBe("stompboxCrusher")
        expect(device.fields.preGain.value).toBeCloseTo(0.25)
        expect(device.fields.bits.value).toBe(4)
        expect(device.fields.presetName.value).toBe(presetName)

        // first modification is the create, rest are the preset application updates
        const [firstMod, ...rest] = ctx.appliedModifications
        expect(firstMod?.modification.case).toBe("create")
        expect(rest.length).toBeGreaterThan(0)
      })
    })

    describe("clone", () => {
      it("should create the correct modifications", () => {})
    })
    describe("cloneLinked", () => {
      it("should create the correct modifications", () => {})
    })
    describe("update", () => {
      it("should create the correct modifications", () => {})
    })
    describe("tryUpdate", () => {
      it("should create the correct modifications", () => {})
      it("should propagate the error", () => {})
    })
    describe("remove", () => {
      it("should create the correct modifications", () => {})
    })
    describe("removeWithDependencies", () => {
      it("should create the correct modifications", () => {})
    })
  })

  const extractCreate = (
    mod: Modification,
  ): { entityType: string; entityId: string } | undefined => {
    if (mod.modification.case !== "create") {
      return undefined
    }

    return {
      entityType: anyEntityToTypeKey(mod.modification.value.entity) ?? throw_(),
      entityId: mustUnpackEntity(mod.modification.value.entity).id,
    }
  }
})
