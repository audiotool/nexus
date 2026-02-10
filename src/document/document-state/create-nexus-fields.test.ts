import type { EntityTypeKey } from "@document/entity-utils"
import { DesktopAudioCable } from "@gen/document/v1/entity/desktop_audio_cable/v1/desktop_audio_cable_pb"
import { TinyGain } from "@gen/document/v1/entity/tiny_gain/v1/tiny_gain_pb"
import { throw_ } from "@utils/lang"
import { describe, expect, it } from "vitest"
import type { NexusEntity } from "../entity"
import { NexusLocation } from "../location"
import { createNexusFields } from "./create-nexus-fields"

describe("create nexus fields", () => {
  it("should let fields be created with uninitialized empty fields", () => {
    expect(() =>
      createNexusFields(
        () => throw_("shouldn't happen"),
        "tinyGain",
        new TinyGain({}),
        new NexusLocation("id", "tinyGain", []),
      ),
    ).not.toThrow()
  })

  it("should initialize pointer fields correctly", () => {
    const fields = createNexusFields(
      () => "expected-type" as EntityTypeKey,
      "desktopAudioCable",
      new DesktopAudioCable({
        fromSocket: {
          entityId: "foo",
          fieldIndex: [1, 2, 3],
        },
        toSocket: {
          entityId: "bar",
          fieldIndex: [4, 5, 6],
        },
      }),
      new NexusLocation("id", "desktopAudioCable", []),
    ) as NexusEntity<"desktopAudioCable">["fields"]

    expect(fields.fromSocket.value.entityType).toBe("expected-type")
  })

  it("should initialize empty pointer fields correctly", () => {
    const fields = createNexusFields(
      () => "expected-type" as EntityTypeKey,
      "desktopAudioCable",
      new DesktopAudioCable({
        fromSocket: {
          entityId: "foo",
        },
        toSocket: {},
      }),
      new NexusLocation("id", "desktopAudioCable", []),
    ) as NexusEntity<"desktopAudioCable">["fields"]

    expect(fields.toSocket.value).toMatchObject(new NexusLocation())
  })
})
