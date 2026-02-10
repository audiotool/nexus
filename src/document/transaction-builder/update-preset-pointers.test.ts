import { mustUnpackEntityAs, packedEntity } from "@document/entity-utils"
import { Preset } from "@gen/document/v1/preset/v1/preset_pb"
import { describe, expect, it } from "vitest"
import { createPointerFromNexusPath } from "../schema/converters"
import { createDefaultEntityMessage } from "./create-default-entity"
import { updatePresetPointers } from "./update-preset-pointers"

describe("updatePresetPointers", () => {
  it("should update pointers to target entity", () => {
    const bb9 = createDefaultEntityMessage("beatbox9")
    const bb9Pattern = createDefaultEntityMessage("beatbox9Pattern")

    bb9.id = "hello"

    bb9Pattern.slot = createPointerFromNexusPath(
      bb9.id,
      "/beatbox9/patternSlots/[3]",
    )

    const preset = new Preset({
      target: packedEntity("beatbox9", bb9),
      relatives: [packedEntity("beatbox9Pattern", bb9Pattern)],
    })

    const updatedPreset = updatePresetPointers(preset, "world")

    expect(
      mustUnpackEntityAs("beatbox9Pattern", updatedPreset.relatives[0]).slot
        ?.entityId,
    ).toBe("world")
  })

  it("should not touch empty pointers", () => {
    const bb9 = createDefaultEntityMessage("beatbox9")
    const bb9Pattern = createDefaultEntityMessage("beatbox9Pattern")

    bb9.id = "hello"

    bb9Pattern.slot = createPointerFromNexusPath(
      bb9.id,
      "/beatbox9/patternSlots/[3]",
    )

    const preset = new Preset({
      target: packedEntity("beatbox9", bb9),
      relatives: [packedEntity("beatbox9Pattern", bb9Pattern)],
    })

    const updatedPreset = updatePresetPointers(preset, "world")

    expect(
      mustUnpackEntityAs("beatbox9Pattern", updatedPreset.relatives[0]).groove
        ?.entityId,
    ).toBe("")
  })

  it("should update ids of secondary entities", () => {
    const bb9 = createDefaultEntityMessage("beatbox9")
    const bb9Pattern = createDefaultEntityMessage("beatbox9Pattern")

    bb9Pattern.slot = createPointerFromNexusPath(
      bb9.id,
      "/beatbox9/patternSlots/[3]",
    )

    const currentId = bb9Pattern.id

    const preset = new Preset({
      target: packedEntity("beatbox9", bb9),
      relatives: [packedEntity("beatbox9Pattern", bb9Pattern)],
    })

    const updatedPreset = updatePresetPointers(preset, "world")

    expect(
      mustUnpackEntityAs("beatbox9Pattern", updatedPreset.relatives[0]).id,
    ).not.toBe(currentId)
  })

  it("should update pointers to secondary entities in target entity", () => {
    // in the previous test, we checked that the uuid was upadted in the target entity
    // here we test that the link to the relative matches the one in the target entity
    const machiniste = createDefaultEntityMessage("machiniste")
    const sample = createDefaultEntityMessage("sample")

    machiniste.channels[0].sample = createPointerFromNexusPath(
      sample.id,
      "/sample",
    )
    const preset = new Preset({
      target: packedEntity("machiniste", machiniste),
      relatives: [packedEntity("sample", sample)],
    })

    // update the preset - note that this mutates the `machiniste` and `sample` entity messages
    const updatedPreset = updatePresetPointers(preset, "")

    // the sample id has updated according to previous test; this makes sure it's also
    // updated in the target message
    const updatedMachiniste = mustUnpackEntityAs(
      "machiniste",
      updatedPreset.target,
    )
    const updatedSample = mustUnpackEntityAs(
      "sample",
      updatedPreset.relatives[0],
    )
    expect(updatedMachiniste.channels[0].sample?.entityId).toBe(
      updatedSample.id,
    )
  })

  it("should update pointers to secondary entities in secondary entity", () => {
    const machiniste = createDefaultEntityMessage("machiniste")
    const pattern = createDefaultEntityMessage("machinistePattern")
    const groove = createDefaultEntityMessage("groove")

    pattern.groove = createPointerFromNexusPath(groove.id, "/groove")
    const preset = new Preset({
      target: packedEntity("machiniste", machiniste),
      relatives: [
        packedEntity("groove", groove),
        packedEntity("machinistePattern", pattern),
      ],
    })

    // update the preset - note that this mutates the `pattern` and `groove` entity messages
    const updatedPreset = updatePresetPointers(preset, "")
    const updatedPattern = mustUnpackEntityAs(
      "machinistePattern",
      updatedPreset.relatives[1],
    )
    const updatedGroove = mustUnpackEntityAs(
      "groove",
      updatedPreset.relatives[0],
    )

    // the groove id has updated according to previous test; this makes sure it's also
    // updated in other secondary messages
    expect(updatedPattern.groove?.entityId).toBe(updatedGroove.id)
  })
})
