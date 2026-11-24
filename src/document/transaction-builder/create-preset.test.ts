import {
  entityMessageToTypeKey,
  mustUnpackEntity,
} from "@document/entity-utils"
import { TinySamplerSampleLayer } from "@gen/document/v1/entity/tiny_sampler/v1/tiny_sampler_pb"
import { beforeEach, describe, expect, it } from "vitest"
import type { TransactionBuilder } from "."
import { onlyTransactionBuilder } from "./builder-test-utils"
import { updatePresetPointers } from "./update-preset-pointers"

type TestContext = {
  builder: TransactionBuilder
}

describe("createDevicePreset", () => {
  beforeEach<TestContext>((context) => {
    context.builder = onlyTransactionBuilder()
  })

  it<TestContext>("deduplicates relatives shared across multiple direct relatives", (context) => {
    const groove = context.builder.create("groove", {})
    const tonematrix = context.builder.create("tonematrix", {})
    context.builder.create("tonematrixPattern", {
      slot: tonematrix.fields.patternSlots.array[0].location,
      groove: groove.location,
    })
    context.builder.create("tonematrixPattern", {
      slot: tonematrix.fields.patternSlots.array[1].location,
      groove: groove.location,
    })

    const preset = context.builder.createPresetFor(tonematrix)
    const relativeIds = preset.relatives.map(
      (relative) => mustUnpackEntity(relative).id,
    )

    expect(preset.relatives).toHaveLength(3)
    expect(new Set(relativeIds).size).toBe(relativeIds.length)
    expect(() => updatePresetPointers(preset, tonematrix.id)).not.toThrow()
  })

  it<TestContext>("deduplicates rasselbock pattern relatives that share a groove", (context) => {
    const groove = context.builder.create("groove", {})
    const rasselbock = context.builder.create("rasselbock", {})
    context.builder.create("rasselbockPattern", {
      slot: rasselbock.fields.patternSlots.array[0].location,
      groove: groove.location,
    })
    context.builder.create("rasselbockPattern", {
      slot: rasselbock.fields.patternSlots.array[1].location,
      groove: groove.location,
    })

    const preset = context.builder.createPresetFor(rasselbock)
    const relativeIds = preset.relatives.map(
      (relative) => mustUnpackEntity(relative).id,
    )

    expect(preset.relatives).toHaveLength(3)
    expect(new Set(relativeIds).size).toBe(relativeIds.length)
    expect(() => updatePresetPointers(preset, rasselbock.id)).not.toThrow()
  })

  it<TestContext>("excludes patterns of other machinistes sharing the same groove", (context) => {
    const groove = context.builder.create("groove", {})
    const machiniste = context.builder.create("machiniste", {})
    const otherMachiniste = context.builder.create("machiniste", {})
    context.builder.create("machinistePattern", {
      slot: machiniste.fields.patternSlots.array[0].location,
      groove: groove.location,
    })
    context.builder.create("machinistePattern", {
      slot: otherMachiniste.fields.patternSlots.array[0].location,
      groove: groove.location,
    })

    const preset = context.builder.createPresetFor(machiniste)

    expect(preset.relatives).toHaveLength(2)
    expect(() => updatePresetPointers(preset, machiniste.id)).not.toThrow()
  })

  it<TestContext>("excludes layers of other tiny samplers sharing the same sample", (context) => {
    const audioSample = context.builder.create("sample", {
      sampleName: "samples/9d4669fc-d3a2-5353-9aac-e728e847a6fa",
    })
    const tinySampler = context.builder.create("tinySampler", {})
    const otherTinySampler = context.builder.create("tinySampler", {})
    context.builder.create("tinySamplerSampleLayer", {
      tinySamplerSample: context.builder.create("tinySamplerSample", {
        tinySampler: tinySampler.location,
        midiKey: 60,
      }).location,
      sample: audioSample.location,
    })
    context.builder.create("tinySamplerSampleLayer", {
      tinySamplerSample: context.builder.create("tinySamplerSample", {
        tinySampler: otherTinySampler.location,
        midiKey: 60,
      }).location,
      sample: audioSample.location,
    })

    const preset = context.builder.createPresetFor(tinySampler)

    expect(preset.relatives).toHaveLength(3)
    expect(() => updatePresetPointers(preset, tinySampler.id)).not.toThrow()
  })

  it<TestContext>("includes microTuningOctave when bassline uses custom micro tuning", (context) => {
    const microTuningOctave = context.builder.create("microTuningOctave", {})
    const bassline = context.builder.create("bassline", {
      microTuning: microTuningOctave.location,
    })

    const preset = context.builder.createPresetFor(bassline)

    expect(preset.relatives).toHaveLength(1)
    expect(() => updatePresetPointers(preset, bassline.id)).not.toThrow()
  })

  it<TestContext>("includes microTuningOctave when helmholtz uses custom micro tuning", (context) => {
    const microTuningOctave = context.builder.create("microTuningOctave", {})
    const helmholtz = context.builder.create("helmholtz", {
      microTuning: microTuningOctave.location,
    })

    const preset = context.builder.createPresetFor(helmholtz)

    expect(preset.relatives).toHaveLength(1)
    expect(() => updatePresetPointers(preset, helmholtz.id)).not.toThrow()
  })

  it<TestContext>("includes tiny sampler key, layer, audio sample, and micro tuning relatives", (context) => {
    const microTuningOctave = context.builder.create("microTuningOctave", {})
    const tinySampler = context.builder.create("tinySampler", {
      microTuning: microTuningOctave.location,
    })
    const keySample = context.builder.create("tinySamplerSample", {
      tinySampler: tinySampler.location,
      midiKey: 60,
    })
    const audioSample = context.builder.create("sample", {
      sampleName: "samples/9d4669fc-d3a2-5353-9aac-e728e847a6fa",
    })
    context.builder.create("tinySamplerSampleLayer", {
      tinySamplerSample: keySample.location,
      sample: audioSample.location,
    })

    const preset = context.builder.createPresetFor(tinySampler)
    const unpackedRelatives = preset.relatives.map((relative) =>
      mustUnpackEntity(relative),
    )
    const relativeIds = unpackedRelatives.map((relative) => relative.id)
    const layer = unpackedRelatives.find(
      (relative): relative is TinySamplerSampleLayer =>
        relative instanceof TinySamplerSampleLayer,
    )

    expect(preset.relatives).toHaveLength(4)
    expect(new Set(relativeIds).size).toBe(relativeIds.length)
    expect(new Set(unpackedRelatives.map(entityMessageToTypeKey))).toEqual(
      new Set([
        "microTuningOctave",
        "sample",
        "tinySamplerSample",
        "tinySamplerSampleLayer",
      ]),
    )
    expect(relativeIds).toContain(layer?.sample?.entityId)
    expect(() => updatePresetPointers(preset, tinySampler.id)).not.toThrow()
  })
})
