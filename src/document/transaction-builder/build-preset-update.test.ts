import type { SafeTransactionBuilder } from "@document/transaction-builder"

import { Pointer } from "@gen/document/v1/pointer_pb"
import { throw_ } from "@utils/lang"
import { beforeEach, describe, expect, it } from "vitest"
import { NexusLocation } from "../location"
import { buildUpdateModification } from "./build-modifications"
import { buildPresetUpdateModifications } from "./build-preset-update"
import { onlyTransactionBuilder } from "./builder-test-utils"
import { createDefaultEntityMessage } from "./create-default-entity"

type TestContext = {
  t: SafeTransactionBuilder
}

describe("buildPresetUpdateModifications", () => {
  beforeEach<TestContext>((context) => {
    context.t = onlyTransactionBuilder()
  })
  describe("update target entity", () => {
    describe("stompboxDelay", () => {
      it<TestContext>("should not update fields if they don't change", (context) => {
        const stompboxDelay = context.t.create("stompboxDelay", {})

        // both `stompboxDelay` and `updateWith` are created with default fields, so no update
        // message should be generated
        const updateWith = createDefaultEntityMessage("stompboxDelay")

        const modifications = buildPresetUpdateModifications(
          stompboxDelay,
          updateWith,
        )
        expect(modifications.length).toBe(0)
      })

      it<TestContext>("should update a single primitive field if it changes", (context) => {
        const stompboxDelay = context.t.create("stompboxDelay", {})

        // only one field is different, so we expect 1 update
        const updateWith = createDefaultEntityMessage("stompboxDelay")
        updateWith.feedbackFactor = 0.6

        const modifications = buildPresetUpdateModifications(
          stompboxDelay,
          updateWith,
        )
        expect(modifications.length).toBe(1)
      })
    })

    describe("beatbox89", () => {
      it<TestContext>("should not update fields if they don't change", (context) => {
        const bb9Entity = context.t.create("beatbox9", {})

        // both are default, so no updates needed
        const bb9Message = createDefaultEntityMessage("beatbox9")

        const modifications = buildPresetUpdateModifications(
          bb9Entity,
          bb9Message,
        )

        expect(modifications.length).toBe(0)
      })

      it<TestContext>("should update a top-level primitive field if it changes", (context) => {
        const bb9Message = context.t.create("beatbox9", {})

        // 1 field updated, so we expect 1 update
        const updateWith = createDefaultEntityMessage("beatbox9")
        updateWith.accentAmount = 0.6

        const modifications = buildPresetUpdateModifications(
          bb9Message,
          updateWith,
        )

        expect(modifications).toMatchObject([
          buildUpdateModification(
            NexusLocation.fromSchemaPath(
              bb9Message.id,
              "/beatbox9/accentAmount",
            ),
            "float",
            Math.fround(0.6),
          ),
        ])
      })

      it<TestContext>("should update a field in a submessage", (context) => {
        const bb9Entity = context.t.create("beatbox9", {})

        const bb9Message = createDefaultEntityMessage("beatbox9")
        // 1 field update, so we expect one update
        {
          const bassdrum = bb9Message.bassdrum ?? throw_()
          bassdrum.attack = 0.2
        }
        const updateWith = bb9Message

        const modifications = buildPresetUpdateModifications(
          bb9Entity,
          updateWith,
        )

        expect(modifications).toMatchObject([
          buildUpdateModification(
            NexusLocation.fromSchemaPath(
              bb9Entity.id,
              "/beatbox9/bassdrum/attack",
            ),
            "float",
            Math.fround(0.2),
          ),
        ])
      })

      it<TestContext>("should update field in a submessage in an array", (context) => {
        const bb9Entity = context.t.create("beatbox9", {})

        const bb9Message = createDefaultEntityMessage("beatbox9")
        // 1 field update, so we expect one update
        const tomLow = bb9Message.tomLow ?? throw_()
        tomLow.gain = 0.2

        const updateWith = bb9Message

        const modifications = buildPresetUpdateModifications(
          bb9Entity,
          updateWith,
        )

        expect(modifications).toMatchObject([
          buildUpdateModification(
            NexusLocation.fromSchemaPath(bb9Entity.id, "/beatbox9/tomLow/gain"),
            "float",
            Math.fround(0.2),
          ),
        ])
      })
    })

    describe("heisenberg", () => {
      it<TestContext>("should update pointers", (context) => {
        const heisenberg = context.t.create("heisenberg", {})

        const updateWith = createDefaultEntityMessage("heisenberg")
        // we update a pointer message, but we don't expect it to be updated
        updateWith.microTuning = new Pointer({
          entityId: "hello",
          fieldIndex: [1, 2, 3, 4],
        })

        const modifications = buildPresetUpdateModifications(
          heisenberg,
          updateWith,
        )

        expect(modifications).toMatchObject([
          buildUpdateModification(
            NexusLocation.fromSchemaPath(
              heisenberg.id,
              "/heisenberg/microTuning",
            ),
            "pointer",
            new Pointer({ entityId: "hello", fieldIndex: [1, 2, 3, 4] }),
          ),
        ])
      })
    })
  })

  describe("presetName", () => {
    it<TestContext>("should stamp presetName onto the top-level entity when passed", (context) => {
      const stompboxDelay = context.t.create("stompboxDelay", {})
      const updateWith = createDefaultEntityMessage("stompboxDelay")

      const modifications = buildPresetUpdateModifications(
        stompboxDelay,
        updateWith,
        "presets/abc-123",
      )

      expect(modifications).toMatchObject([
        buildUpdateModification(
          NexusLocation.fromSchemaPath(
            stompboxDelay.id,
            "/stompboxDelay/presetName",
          ),
          "string",
          "presets/abc-123",
        ),
      ])
    })

    it<TestContext>("should emit no modification when presetName already matches", (context) => {
      const stompboxDelay = context.t.create("stompboxDelay", {})
      const updateWith = createDefaultEntityMessage("stompboxDelay")

      // stamp once
      buildPresetUpdateModifications(
        stompboxDelay,
        updateWith,
        "presets/abc-123",
      ).forEach((mod) => context.t._addModification(mod))

      // stamping again with the same value should be a no-op
      const modifications = buildPresetUpdateModifications(
        stompboxDelay,
        updateWith,
        "presets/abc-123",
      )
      expect(modifications.length).toBe(0)
    })

    it<TestContext>("should leave presetName untouched when no presetName is passed", (context) => {
      const stompboxDelay = context.t.create("stompboxDelay", {})
      const updateWith = createDefaultEntityMessage("stompboxDelay")

      const modifications = buildPresetUpdateModifications(
        stompboxDelay,
        updateWith,
      )

      expect(modifications.length).toBe(0)
    })
  })

  describe("workspace fields", () => {
    it<TestContext>("should skip positionX, positionY and displayName when applying a preset", (context) => {
      // existing device has been moved and renamed by the user
      const stompboxDelay = context.t.create("stompboxDelay", {
        positionX: 100,
        positionY: 200,
        displayName: "my cool delay",
      })

      // preset carries the default (0, 0, "Delay")
      const updateWith = createDefaultEntityMessage("stompboxDelay")

      const modifications = buildPresetUpdateModifications(
        stompboxDelay,
        updateWith,
        "presets/abc-123",
      )

      // only the presetName stamp should be emitted; positionX/Y/displayName
      // remain untouched
      expect(modifications).toMatchObject([
        buildUpdateModification(
          NexusLocation.fromSchemaPath(
            stompboxDelay.id,
            "/stompboxDelay/presetName",
          ),
          "string",
          "presets/abc-123",
        ),
      ])
    })

    it<TestContext>("should still update positionX, positionY, displayName when no preset is being applied", (context) => {
      // no presetName -> plain update, workspace fields are fair game
      const stompboxDelay = context.t.create("stompboxDelay", {
        positionX: 100,
      })
      const updateWith = createDefaultEntityMessage("stompboxDelay")

      const modifications = buildPresetUpdateModifications(
        stompboxDelay,
        updateWith,
      )

      expect(modifications).toMatchObject([
        buildUpdateModification(
          NexusLocation.fromSchemaPath(
            stompboxDelay.id,
            "/stompboxDelay/positionX",
          ),
          "int32",
          0,
        ),
      ])
    })
  })
})
