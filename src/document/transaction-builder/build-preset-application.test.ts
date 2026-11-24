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
import {
  PRESET_TARGET_RELATIVE_TYPES,
  type PreparedPreset,
} from "./prepare-preset"

// this is an e2e test, each function is tested in separate files
describe("build modifications for preset application", () => {
  it("should generate the correct modifications for a beatbox 9 preset application", async () => {
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

  it("should generate the correct modifications for a tiny sampler preset application", async () => {
    const nexus = await setupNexus()
    // document is: tiny sampler, with a key sample whose layer has a sample and
    // an automation track with a region and an event
    const tinySampler = await createTinySampler(nexus)

    // We apply a preset that's also a tiny sampler with a key sample, layer and sample.
    // The preset has all values set to default (identical to `tinySampler`), except for the gain factor.
    const preset = createTinySamplerPreset()

    expect(
      buildModificationsForPresetApplication(
        nexus.queryEntitiesWithoutLock,
        preset,
        tinySampler.tinySampler,
        "",
      ),
    ).toMatchObject([
      // delete existing key sample, with everything pointing to it
      buildDeleteModification(tinySampler.automationRegion.id),
      buildDeleteModification(tinySampler.automationTrack.id),
      buildDeleteModification(tinySampler.layer.id),
      buildDeleteModification(tinySampler.keySample.id),

      // delete what the removed entities left behind
      buildDeleteModification(tinySampler.automationEvent.id),
      buildDeleteModification(tinySampler.automationCollection.id),
      buildDeleteModification(tinySampler.sample.id),

      // build new key sample, layer and sample
      ...preset.preset.relatives.map((entity) =>
        buildCreateModification(entity),
      ),

      // update main entity: update the gain factor
      buildUpdateModification(
        NexusLocation.fromSchemaPath(
          tinySampler.tinySampler.id,
          "/tinySampler/gainFactor",
        ),
        "float",
        0.5,
      ),
    ])
  })

  it("should keep a sample another sampler layer still uses", async () => {
    const nexus = await setupNexus()
    const tinySampler = await createTinySampler(nexus)

    // a layer on another sampler points at the same sample
    const t = await nexus.createTransaction()
    const otherSampler = t.create("tinySampler", {})
    t.create("tinySamplerSampleLayer", {
      tinySamplerSample: t.create("tinySamplerSample", {
        tinySampler: otherSampler.location,
        midiKey: 60,
      }).location,
      sample: tinySampler.sample.location,
    })
    t.send()

    const preset = createTinySamplerPreset()

    expect(
      buildModificationsForPresetApplication(
        nexus.queryEntitiesWithoutLock,
        preset,
        tinySampler.tinySampler,
        "",
      ),
    ).toMatchObject([
      // delete existing key sample, with everything pointing to it
      buildDeleteModification(tinySampler.automationRegion.id),
      buildDeleteModification(tinySampler.automationTrack.id),
      buildDeleteModification(tinySampler.layer.id),
      buildDeleteModification(tinySampler.keySample.id),

      // the shared sample stays; the collection is still exclusive to the
      // removed region
      buildDeleteModification(tinySampler.automationEvent.id),
      buildDeleteModification(tinySampler.automationCollection.id),

      // build new key sample, layer and sample
      ...preset.preset.relatives.map((entity) =>
        buildCreateModification(entity),
      ),

      // update main entity: update the gain factor
      buildUpdateModification(
        NexusLocation.fromSchemaPath(
          tinySampler.tinySampler.id,
          "/tinySampler/gainFactor",
        ),
        "float",
        0.5,
      ),
    ])
  })

  it("should keep an automation collection and its events another automation region still uses", async () => {
    const nexus = await setupNexus()
    const tinySampler = await createTinySampler(nexus)

    // a region on another track points at the same collection
    const t = await nexus.createTransaction()
    const otherSampler = t.create("tinySampler", {})
    t.create("automationRegion", {
      track: t.create("automationTrack", {
        automatedParameter: otherSampler.fields.gainFactor.location,
      }).location,
      collection: tinySampler.automationCollection.location,
      region: { positionTicks: 480, durationTicks: 480 },
    })
    t.send()

    const preset = createTinySamplerPreset()

    expect(
      buildModificationsForPresetApplication(
        nexus.queryEntitiesWithoutLock,
        preset,
        tinySampler.tinySampler,
        "",
      ),
    ).toMatchObject([
      // delete existing key sample, with everything pointing to it
      buildDeleteModification(tinySampler.automationRegion.id),
      buildDeleteModification(tinySampler.automationTrack.id),
      buildDeleteModification(tinySampler.layer.id),
      buildDeleteModification(tinySampler.keySample.id),

      // the shared collection and its events stay; the sample is still exclusive to the removed layer
      buildDeleteModification(tinySampler.sample.id),

      // build new key sample, layer and sample
      ...preset.preset.relatives.map((entity) =>
        buildCreateModification(entity),
      ),

      // update main entity: update the gain factor
      buildUpdateModification(
        NexusLocation.fromSchemaPath(
          tinySampler.tinySampler.id,
          "/tinySampler/gainFactor",
        ),
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

const createTinySampler = async (
  nexus: NexusDocument,
): Promise<{
  tinySampler: NexusEntity<"tinySampler">
  keySample: NexusEntity<"tinySamplerSample">
  layer: NexusEntity<"tinySamplerSampleLayer">
  sample: NexusEntity<"sample">
  automationTrack: NexusEntity<"automationTrack">
  automationCollection: NexusEntity<"automationCollection">
  automationEvent: NexusEntity<"automationEvent">
  automationRegion: NexusEntity<"automationRegion">
}> => {
  const t = await nexus.createTransaction()
  const tinySampler = t.create("tinySampler", {})
  const keySample = t.create("tinySamplerSample", {
    tinySampler: tinySampler.location,
    midiKey: 48,
  })
  const sample = t.create("sample", {
    sampleName: "samples/1c0b1c8e-5b6f-5d0a-9c56-1d3a4b6e7f80",
  })
  const layer = t.create("tinySamplerSampleLayer", {
    tinySamplerSample: keySample.location,
    sample: sample.location,
  })
  const automationTrack = t.create("automationTrack", {
    automatedParameter:
      layer.fields.levelEnvelope.fields.attackTimeNormalized.location,
  })
  const automationCollection = t.create("automationCollection", {})
  const automationEvent = t.create("automationEvent", {
    collection: automationCollection.location,
    positionTicks: 0,
    value: 0.5,
  })
  const automationRegion = t.create("automationRegion", {
    track: automationTrack.location,
    collection: automationCollection.location,
    region: { positionTicks: 0, durationTicks: 480 },
  })
  t.send()
  return {
    tinySampler,
    keySample,
    layer,
    sample,
    automationTrack,
    automationCollection,
    automationEvent,
    automationRegion,
  }
}

const createTinySamplerPreset = (): PreparedPreset => {
  const tinySampler = createDefaultEntityMessage("tinySampler")
  const keySample = createDefaultEntityMessage("tinySamplerSample")
  const sample = createDefaultEntityMessage("sample")
  const layer = createDefaultEntityMessage("tinySamplerSampleLayer")

  // update gain factor
  tinySampler.gainFactor = 0.5

  // update pointers from key sample to tiny sampler, and from layer to key sample and sample
  {
    keySample.tinySampler = createPointerFromNexusPath(
      tinySampler.id,
      "/tinySampler",
    )
    layer.tinySamplerSample = createPointerFromNexusPath(
      keySample.id,
      "/tinySamplerSample",
    )
    layer.sample = createPointerFromNexusPath(sample.id, "/sample")
  }

  return {
    preset: new Preset({
      target: packedEntity("tinySampler", tinySampler),
      relatives: [
        packedEntity("sample", sample),
        packedEntity("tinySamplerSample", keySample),
        packedEntity("tinySamplerSampleLayer", layer),
      ],
    }),
    entitiesToRemovePointingToMain: [
      ...PRESET_TARGET_RELATIVE_TYPES.tinySampler,
    ],
  }
}
