import type { PartialMessage } from "@bufbuild/protobuf"

import type { Bassline } from "@gen/document/v1/entity/bassline/v1/bassline_pb"
import { isValidUUID } from "@utils/is-valid-uuid"
import { describe, expect, it } from "vitest"
import { createDefaultEntityMessage } from "./create-default-entity"

describe("Create entity", () => {
  it("Create default entity", () => {
    {
      const entity = createDefaultEntityMessage("audioDevice")

      expect(entity.gain).toBeCloseTo(0.70794)
      expect(entity.panning).toBe(0)
      expect(entity.isActive).toBe(true)
    }

    {
      // boolean, float
      const entity = createDefaultEntityMessage("bassline")
      expect(entity).toMatchObject({
        tuneSemitones: 0.0,
        cutoffFrequencyHz: 220,
        filterResonance: 1.0,
        filterEnvelopeModulationDepth: 0.10000000149011612,
        waveformIndex: 1,
        isActive: true,
      } satisfies PartialMessage<Bassline>)
      // floating point error
      expect(entity.gain).toBeCloseTo(0.70794)

      expect(isValidUUID(entity.id)).toBeTruthy()
    }
  })
})
