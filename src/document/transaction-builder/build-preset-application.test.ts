import { packedEntity } from "@document/entity-utils"
import { Preset } from "@gen/document/v1/preset/v1/preset_pb"
import { throw_ } from "@utils/lang"
import { describe, expect, it } from "vitest"
import { NexusDocument } from "../document"
import type { NexusEntity } from "../entity"
import { NexusLocation } from "../location"
import { createPointerFromNexusPath } from "../schema/converters"
import {
  buildCreateModification,
  buildDeleteModification,
  buildUpdateModification,
} from "./build-modifications"
import { buildModificationsForPresetApplication } from "./build-preset-application"
import { createDefaultEntityMessage } from "./create-default-entity"
import type { PreparedPreset } from "./prepare-preset"

// this is an e2e test, each function is tested in separate files
describe("build modifications for preset application", () => {
  it("should generate the correct modifications", async () => {
    const nexus = await setupNexus()
    // document is: bb9, with some patterns pointing to it
    const { bb9, bb9Patterns } = await createBb9(nexus)

    // We apply a preset that's also a bb9 and has some patterns pointing to it as well.
    // The preset has all values set to default (identical to `bb9`), except for the clap gain value.
    const preset = createBb9Preset()

    expect(
      buildModificationsForPresetApplication(
        nexus.queryEntitiesWithoutLock,
        preset,
        bb9,
        "",
      ),
    ).toMatchObject([
      // delete existing patterns
      ...bb9Patterns.map((pattern) => buildDeleteModification(pattern.id)),

      // build new patterns
      ...preset.preset.relatives.map((entity) =>
        buildCreateModification(entity),
      ),
      // update main entity: update the clap
      buildUpdateModification(
        NexusLocation.fromSchemaPath(bb9.id, "/beatbox9/clap/gain"),
        "float",
        0.5,
      ),
    ])
  })
})

const setupNexus = async (): Promise<NexusDocument> => {
  const nexus = new NexusDocument()
  await nexus.takeTransactions()
  return nexus
}

const createBb9 = async (
  nexus: NexusDocument,
): Promise<{
  bb9: NexusEntity<"beatbox9">
  bb9Patterns: NexusEntity<"beatbox9Pattern">[]
}> => {
  const t = await nexus.createTransaction()
  const bb9 = t.create("beatbox9", {})
  const bb9Pattern = t.create("beatbox9Pattern", {
    slot: bb9.fields.patternSlots.array[0].location,
  })
  t.send()
  return {
    bb9,
    bb9Patterns: [bb9Pattern],
  }
}

const createBb9Preset = (): PreparedPreset => {
  const bb9 = createDefaultEntityMessage("beatbox9")
  const bb9Pattern = createDefaultEntityMessage("beatbox9Pattern")

  // update clap
  {
    const clap = bb9.clap ?? throw_()
    clap.gain = 0.5
  }
  // update pointere from pattern to beatbox9
  {
    bb9Pattern.slot = createPointerFromNexusPath(
      bb9Pattern.id,
      "/beatbox9/patternSlots/[3]",
    )
  }

  return {
    preset: new Preset({
      target: packedEntity("beatbox9", bb9),
      relatives: [packedEntity("beatbox9Pattern", bb9Pattern)],
    }),
    entitiesToRemovePointingToMain: ["beatbox9Pattern"],
  }
}
