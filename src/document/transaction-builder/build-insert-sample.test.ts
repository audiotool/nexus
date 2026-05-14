import { Ticks } from "@utils/ticks"
import { describe, expect, it } from "vitest"
import {
  buildRegionConstructorForInsertSample,
  resolveSampleDurationTicks,
} from "./build-insert-sample"

/**
 * Build a synthetic sample whose real-time `durationSeconds` lines up
 * exactly with `bars` musical bars at the given bpm, so
 * `secondsToTicks(durationSeconds, bpm) === Ticks.Bars(bars)` with zero
 * rounding noise.
 */
const synthSample = (
  bars: number,
  bpm: number,
): { durationSeconds: number; bpm: number } => ({
  durationSeconds: (bars * 60 * 4) / bpm,
  bpm,
})

describe("buildRegionConstructorForInsertSample", () => {
  // ---------------------------------------------------------------------
  // A. Showroom scenario mirrors — one test per scenario A–H.
  // ---------------------------------------------------------------------
  describe("A. showroom scenarios", () => {
    it("scenario A: just insert (no options)", () => {
      expect(
        buildRegionConstructorForInsertSample(Ticks.Bars(4), undefined),
      ).toEqual({
        positionTicks: 0,
        durationTicks: Ticks.Bars(4),
        collectionOffsetTicks: 0,
        loopOffsetTicks: 0,
        loopDurationTicks: Ticks.Bars(4),
        isEnabled: true,
        colorIndex: 0,
      })
    })

    it("scenario B: full sample at 120 bpm", () => {
      expect(
        buildRegionConstructorForInsertSample(Ticks.Bars(4), {
          sample: { bpm: 120 },
        }),
      ).toEqual({
        positionTicks: 0,
        durationTicks: Ticks.Bars(4),
        collectionOffsetTicks: 0,
        loopOffsetTicks: 0,
        loopDurationTicks: Ticks.Bars(4),
        isEnabled: true,
        colorIndex: 0,
      })
    })

    it("scenario C: stretch to 3 bars", () => {
      expect(
        buildRegionConstructorForInsertSample(Ticks.Bars(3), {
          sample: { musicDurationTicks: Ticks.Bars(3) },
        }),
      ).toEqual({
        positionTicks: 0,
        durationTicks: Ticks.Bars(3),
        collectionOffsetTicks: 0,
        loopOffsetTicks: 0,
        loopDurationTicks: Ticks.Bars(3),
        isEnabled: true,
        colorIndex: 0,
      })
    })

    it("scenario D: 1-bar sample looped 4 times", () => {
      expect(
        buildRegionConstructorForInsertSample(Ticks.Bars(1), {
          sample: { musicDurationTicks: Ticks.Bars(1) },
          region: { durationTicks: Ticks.Bars(4) },
          loop: true,
        }),
      ).toEqual({
        positionTicks: 0,
        durationTicks: Ticks.Bars(4),
        collectionOffsetTicks: 0,
        loopOffsetTicks: 0,
        loopDurationTicks: Ticks.Bars(1),
        isEnabled: true,
        colorIndex: 0,
      })
    })

    it("scenario E: loop: true with no region duration is a no-op", () => {
      const result = buildRegionConstructorForInsertSample(Ticks.Bars(2), {
        sample: { bpm: 120 },
        loop: true,
      })
      // regionDuration === loopDuration ⇒ Region proto treats this as "no repeat".
      expect(result.durationTicks).toBe(result.loopDurationTicks)
      expect(result).toEqual({
        positionTicks: 0,
        durationTicks: Ticks.Bars(2),
        collectionOffsetTicks: 0,
        loopOffsetTicks: 0,
        loopDurationTicks: Ticks.Bars(2),
        isEnabled: true,
        colorIndex: 0,
      })
    })

    it("scenario F: project bpm, loop until bar 22", () => {
      expect(
        buildRegionConstructorForInsertSample(Ticks.Bars(4), {
          sample: { bpm: "project" },
          region: { durationTicks: Ticks.Bars(21) },
          loop: true,
        }),
      ).toEqual({
        positionTicks: 0,
        durationTicks: Ticks.Bars(21),
        collectionOffsetTicks: 0,
        loopOffsetTicks: 0,
        loopDurationTicks: Ticks.Bars(4),
        isEnabled: true,
        colorIndex: 0,
      })
    })

    it("scenario G: 120 bpm at bar 2, loop until bar 7", () => {
      expect(
        buildRegionConstructorForInsertSample(Ticks.Bars(1), {
          sample: { bpm: 120 },
          region: {
            positionTicks: Ticks.Bars(1),
            durationTicks: Ticks.Bars(5),
          },
          loop: true,
        }),
      ).toEqual({
        positionTicks: Ticks.Bars(1),
        durationTicks: Ticks.Bars(5),
        collectionOffsetTicks: 0,
        loopOffsetTicks: 0,
        loopDurationTicks: Ticks.Bars(1),
        isEnabled: true,
        colorIndex: 0,
      })
    })

    it("scenario H: loop bars 2-4 of a 4-bar sample at region bars 3-6", () => {
      expect(
        buildRegionConstructorForInsertSample(Ticks.Bars(4), {
          sample: { bpm: 125 },
          region: {
            positionTicks: Ticks.Bars(2),
            durationTicks: Ticks.Bars(3),
          },
          loop: {
            startTicks: Ticks.Bars(1),
            durationTicks: Ticks.Bars(2),
          },
        }),
      ).toEqual({
        positionTicks: Ticks.Bars(2),
        durationTicks: Ticks.Bars(3),
        collectionOffsetTicks: Ticks.Bars(1),
        loopOffsetTicks: 0,
        loopDurationTicks: Ticks.Bars(2),
        isEnabled: true,
        colorIndex: 0,
      })
    })
  })

  // ---------------------------------------------------------------------
  // B. Playback offset (sample.offsetTicks).
  // ---------------------------------------------------------------------
  describe("B. playback offset", () => {
    it("sample.offsetTicks with no loop and no region duration", () => {
      const result = buildRegionConstructorForInsertSample(Ticks.Bars(4), {
        sample: { offsetTicks: Ticks.Bars(2) },
      })
      expect(result).toEqual({
        positionTicks: 0,
        durationTicks: Ticks.Bars(2), // sampleDuration - playbackOffset
        collectionOffsetTicks: Ticks.Bars(2),
        loopOffsetTicks: 0,
        loopDurationTicks: Ticks.Bars(2),
        isEnabled: true,
        colorIndex: 0,
      })
    })

    it("sample.offsetTicks combined with loop: true", () => {
      const result = buildRegionConstructorForInsertSample(Ticks.Bars(4), {
        sample: { offsetTicks: Ticks.Bars(2) },
        loop: true,
      })
      expect(result.collectionOffsetTicks).toBe(Ticks.Bars(2))
      expect(result.loopOffsetTicks).toBe(0)
      expect(result.loopDurationTicks).toBe(Ticks.Bars(2)) // 4 - 2
    })

    it("sample.offsetTicks combined with explicit loop sub-range", () => {
      const result = buildRegionConstructorForInsertSample(Ticks.Bars(4), {
        sample: { offsetTicks: Ticks.Bars(1) },
        loop: {
          startTicks: Ticks.Bars(2),
          durationTicks: Ticks.Bars(1),
        },
      })
      expect(result.collectionOffsetTicks).toBe(Ticks.Bars(2))
      expect(result.loopOffsetTicks).toBe(Ticks.Bars(1))
      expect(result.loopDurationTicks).toBe(Ticks.Bars(1))
    })

    it("throws when sample.offsetTicks is past loop.startTicks", () => {
      expect(() =>
        buildRegionConstructorForInsertSample(Ticks.Bars(4), {
          sample: { offsetTicks: Ticks.Bars(3) },
          loop: { startTicks: Ticks.Bars(1) },
        }),
      ).toThrowError(/sample.offsetTicks .* must be <= loop.startTicks/i)
    })
  })

  // ---------------------------------------------------------------------
  // C. Loop defaults and shapes.
  // ---------------------------------------------------------------------
  describe("C. loop shapes", () => {
    it("loop omitted on full-sample region: loopDuration === regionDuration", () => {
      const result = buildRegionConstructorForInsertSample(
        Ticks.Bars(2),
        undefined,
      )
      expect(result.loopDurationTicks).toBe(result.durationTicks)
    })

    it("loop: true with region longer than sample caps loop at sampleDuration", () => {
      const result = buildRegionConstructorForInsertSample(Ticks.Bars(2), {
        region: { durationTicks: Ticks.Bars(8) },
        loop: true,
      })
      expect(result.durationTicks).toBe(Ticks.Bars(8))
      expect(result.loopDurationTicks).toBe(Ticks.Bars(2))
    })

    it("loop object with only startTicks defaults loop duration to end of sample", () => {
      const result = buildRegionConstructorForInsertSample(Ticks.Bars(4), {
        loop: { startTicks: Ticks.Bars(1) },
      })
      expect(result.collectionOffsetTicks).toBe(Ticks.Bars(1))
      expect(result.loopOffsetTicks).toBe(0)
      expect(result.loopDurationTicks).toBe(Ticks.Bars(3))
    })

    it("loop object with only durationTicks leaves the start at 0", () => {
      const result = buildRegionConstructorForInsertSample(Ticks.Bars(4), {
        loop: { durationTicks: Ticks.Bars(2) },
      })
      expect(result.collectionOffsetTicks).toBe(0)
      expect(result.loopOffsetTicks).toBe(0)
      expect(result.loopDurationTicks).toBe(Ticks.Bars(2))
    })
  })

  // ---------------------------------------------------------------------
  // D. Edge cases.
  // ---------------------------------------------------------------------
  describe("D. edge cases", () => {
    it("throws on negative region.positionTicks", () => {
      expect(() =>
        buildRegionConstructorForInsertSample(Ticks.Bars(2), {
          region: { positionTicks: -1 },
        }),
      ).toThrowError(/region.positionTicks must be >= 0/i)
    })

    it("throws on negative region.durationTicks", () => {
      expect(() =>
        buildRegionConstructorForInsertSample(Ticks.Bars(2), {
          region: { durationTicks: -1 },
        }),
      ).toThrowError(/region.durationTicks must be >= 0/i)
    })

    it("throws when sample.offsetTicks exceeds the sample's musical duration", () => {
      expect(() =>
        buildRegionConstructorForInsertSample(Ticks.Bars(2), {
          sample: { offsetTicks: Ticks.Bars(4) },
        }),
      ).toThrowError(/sample.offsetTicks .* must be <= sample duration/i)
    })
  })
})

describe("resolveSampleDurationTicks", () => {
  it("throws when no bpm is available anywhere", () => {
    const sample = { durationSeconds: 2 }
    expect(() =>
      resolveSampleDurationTicks(sample, undefined, undefined),
    ).toThrowError(/cannot resolve bpm/i)
  })

  it("falls back to sample.bpm when options bpm is omitted", () => {
    const sample = synthSample(2, 120)
    expect(resolveSampleDurationTicks(sample, undefined, undefined)).toBe(
      Ticks.Bars(2),
    )
  })

  it("options.sample.bpm number overrides the sample's authored bpm", () => {
    // Sample authored at 120 bpm, but force 140 — duration in ticks
    // should reflect 140.
    const sample = synthSample(2, 120)
    // 2 bars at 120 = 4 seconds. At 140 bpm:
    // round(4 * 140/60 * Ticks.Beat) = round(35840) = 35840 ticks.
    expect(
      resolveSampleDurationTicks(sample, { sample: { bpm: 140 } }, undefined),
    ).toBe(35840)
  })

  it('options.sample.bpm = "project" wins over sample.bpm', () => {
    const sample = synthSample(2, 120)
    // 2 bars at 120 = 4 seconds. At 130 bpm:
    // round(4 * 130/60 * Ticks.Beat) = round(33280) = 33280.
    expect(
      resolveSampleDurationTicks(sample, { sample: { bpm: "project" } }, 130),
    ).toBe(33280)
  })

  it('options.sample.bpm = "project" throws if projectBpm is missing', () => {
    const sample = synthSample(2, 120)
    expect(() =>
      resolveSampleDurationTicks(
        sample,
        { sample: { bpm: "project" } },
        undefined,
      ),
    ).toThrowError(/sample.bpm = "project" requires a project bpm/i)
  })

  it("musicDurationTicks bypasses bpm entirely — no throw when bpm is missing", () => {
    const sample = { durationSeconds: 99 }
    expect(
      resolveSampleDurationTicks(
        sample,
        { sample: { musicDurationTicks: Ticks.Bars(2) } },
        undefined,
      ),
    ).toBe(Ticks.Bars(2))
  })
})
