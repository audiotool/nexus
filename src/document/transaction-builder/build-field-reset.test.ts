import { Modification } from "@gen/document/v1/document_service_pb"
import { beforeEach, describe, expect, it } from "vitest"
import { NexusDocument } from "../document"
import { buildModificationForFieldReset } from "./build-field-reset"
import { audioSplitterDefaults } from "./defaults/audio-splitter"
import { noteSplitterDefaults } from "./defaults/note-splitter"
import { quantumDefaults } from "./defaults/quantum"
import { tinyGainDefaults } from "./defaults/tiny-gain"

type TestContext = {
  nexus: NexusDocument
}

describe("buildModificationForFieldReset", () => {
  beforeEach<TestContext>((context) => {
    context.nexus = new NexusDocument()
    context.nexus.takeTransactions()
  })

  it<TestContext>("returns undefined for when resetting a nexus-location field", async (ctx) => {
    const tx = await ctx.nexus.createTransaction()
    const devOut = tx.create("audioDevice", {})
    const devIn = tx.create("audioSplitter", {})
    const audioConn = tx.create("desktopAudioCable", {
      fromSocket: devOut.fields.audioOutput.location,
      toSocket: devIn.fields.audioInput.location,
    })
    const modification = buildModificationForFieldReset(
      audioConn.fields.fromSocket,
    )
    expect(modification).toEqual(undefined)
  })

  it<TestContext>("returns a modification for resetting a numeric primitive field to its default", async (ctx) => {
    const tx = await ctx.nexus.createTransaction()
    const tinyGain = tx.create("tinyGain", {
      gain: 0,
    })

    const modification = buildModificationForFieldReset(tinyGain.fields.gain)
    expect(modification).toMatchObject(
      new Modification({
        modification: {
          case: "update",
          value: {
            field: tinyGain.fields.gain.location.toPointerMessage(),
            value: { case: "float", value: tinyGainDefaults.gain },
          },
        },
      }),
    )
  })

  it<TestContext>("returns undefined for resetting a primitive field that is already at its default value", async (ctx) => {
    const tx = await ctx.nexus.createTransaction()
    const tinyGain = tx.create("tinyGain", {
      gain: tinyGainDefaults.gain,
    })

    const modification = buildModificationForFieldReset(tinyGain.fields.gain)
    expect(modification).toEqual(undefined)
  })

  describe("nested field structures", () => {
    describe("fields in subobjects", () => {
      it<TestContext>("returns a modification for resetting a nested field to its default", async (ctx) => {
        const tx = await ctx.nexus.createTransaction()
        const audioSplitter = tx.create("audioSplitter", {
          splitCoords: { x: 0.5, y: 0.5 },
        })

        const modification = buildModificationForFieldReset(
          audioSplitter.fields.splitCoords.fields.x,
        )
        expect(modification).toMatchObject(
          new Modification({
            modification: {
              case: "update",
              value: {
                field:
                  audioSplitter.fields.splitCoords.fields.x.location.toPointerMessage(),
                value: {
                  case: "float",
                  value: audioSplitterDefaults.splitCoords.x,
                },
              },
            },
          }),
        )
      })

      it<TestContext>("returns undefined for resetting a nested field that is already at its default value", async (ctx) => {
        const tx = await ctx.nexus.createTransaction()
        const audioSplitter = tx.create("audioSplitter", {
          splitCoords: {
            x: audioSplitterDefaults.splitCoords.x,
            y: audioSplitterDefaults.splitCoords.y,
          },
        })

        const modification = buildModificationForFieldReset(
          audioSplitter.fields.splitCoords.fields.x,
        )
        expect(modification).toEqual(undefined)
      })
    })

    describe("fields in arrays", () => {
      it<TestContext>("returns a modification for resetting a field in an array to its default", async (ctx) => {
        const tx = await ctx.nexus.createTransaction()
        const quantum = tx.create("quantum", {
          splitFrequencyHz: [200, 3000, 12000],
        })

        const modification = buildModificationForFieldReset(
          quantum.fields.splitFrequencyHz.array[0],
        )
        expect(modification).toMatchObject(
          new Modification({
            modification: {
              case: "update",
              value: {
                field:
                  quantum.fields.splitFrequencyHz.array[0].location.toPointerMessage(),
                value: {
                  case: "float",
                  value: quantumDefaults.splitFrequencyHz[0],
                },
              },
            },
          }),
        )
      })

      it<TestContext>("returns undefined for resetting a field in an array that is already at its default value", async (ctx) => {
        const tx = await ctx.nexus.createTransaction()
        const quantum = tx.create("quantum", {
          splitFrequencyHz: [
            quantumDefaults.splitFrequencyHz[0],
            quantumDefaults.splitFrequencyHz[1],
            quantumDefaults.splitFrequencyHz[2],
          ],
        })

        const modification = buildModificationForFieldReset(
          quantum.fields.splitFrequencyHz.array[0],
        )
        expect(modification).toEqual(undefined)
      })
    })

    describe("fields in objects in arrays", () => {
      it<TestContext>("returns a modification for resetting a field in an object in an array to its default", async (ctx) => {
        const tx = await ctx.nexus.createTransaction()
        const noteSplitter = tx.create("noteSplitter", {
          channels: [
            { velocityModulation: 0.5, isMuted: true },
            { velocityModulation: 0, isMuted: false },
            { velocityModulation: 0, isMuted: false },
          ],
        })

        const modification = buildModificationForFieldReset(
          noteSplitter.fields.channels.array[0].fields.velocityModulation,
        )
        expect(modification).toMatchObject(
          new Modification({
            modification: {
              case: "update",
              value: {
                field:
                  noteSplitter.fields.channels.array[0].fields.velocityModulation.location.toPointerMessage(),
                value: {
                  case: "float",
                  value: noteSplitterDefaults.channels[0].velocityModulation,
                },
              },
            },
          }),
        )
      })

      it<TestContext>("returns undefined for resetting a field in an object in an array that is already at its default value", async (ctx) => {
        const tx = await ctx.nexus.createTransaction()
        const noteSplitter = tx.create("noteSplitter", {
          channels: [
            {
              velocityModulation:
                noteSplitterDefaults.channels[0].velocityModulation,
              isMuted: noteSplitterDefaults.channels[0].isMuted,
            },
            { velocityModulation: 0, isMuted: false },
            { velocityModulation: 0, isMuted: false },
          ],
        })

        const modification = buildModificationForFieldReset(
          noteSplitter.fields.channels.array[0].fields.velocityModulation,
        )
        expect(modification).toEqual(undefined)
      })
    })
  })
})
