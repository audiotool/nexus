/** Defines the tick resolution. One semibreve = one whole note note in a 4/4 bar. */
const TICKS_PER_SEMIBREVE = 15360

/**
 * A few constants to work with ticks.
 *
 *
 * A "tick" is the finest resolution something can be scheduled in on the timeline.
 * Ticks are independent of tempo.
 *
 * Example:
 *
 * In a 4/4 bar, there are 4 beats, so one bar is 4 * {@link Beat} = 15360 ticks = {@link SemiBreve}.
 *
 * For conversion from/to seconds see:
 * * {@link secondsToTicks}
 * * {@link ticksToSeconds}
 */
export const Ticks = {
  /** How many ticks pass in "1 whole note" or 4x1/4th notes in a 4/4th beat, independent of tempo. */
  SemiBreve: TICKS_PER_SEMIBREVE,
  /** How many ticks pass in 1 quarter note in a 4/4th bar, independent of tempo. */
  Beat: 3840,
  /** How many ticks pass in 1/16th note in a 4/4th bar, independent of tempo. */
  SemiQuaver: 960,
  /**
   * Number of ticks in `n` bars at the given time signature.
   *
   * `signature` is a string of the form `"X/Y"` where `X` is the number of
   * beats per bar and `Y` is the note value of one beat (4 = quarter note,
   * 8 = eighth note, etc.). Defaults to `"4/4"`.
   *
   * Examples:
   * - `Ticks.Bars(3)`        → 3 bars in 4/4 = `3 * SemiBreve` = 46080
   * - `Ticks.Bars(2, "3/4")` → 2 bars in 3/4 = `2 * 3 * Beat`  = 23040
   * - `Ticks.Bars(2, "6/8")` → 2 bars in 6/8 = `2 * 6 * (SemiBreve / 8)` = 23040
   */
  Bars(n: number, signature: string = "4/4"): number {
    const parts = signature.split("/")
    if (parts.length !== 2) {
      throw new Error(`Invalid time signature: "${signature}" (expected "X/Y")`)
    }
    const numerator = Number(parts[0])
    const denominator = Number(parts[1])
    if (
      !Number.isFinite(numerator) ||
      !Number.isFinite(denominator) ||
      numerator <= 0 ||
      denominator <= 0
    ) {
      throw new Error(`Invalid time signature: "${signature}" (expected "X/Y")`)
    }
    return n * numerator * (TICKS_PER_SEMIBREVE / denominator)
  },
} as const

/** Converts seconds to ticks at a given bpm. See {@link Ticks} for more info. */
export const secondsToTicks = (seconds: number, bpm: number) => {
  const beatsPerSecond = bpm / 60
  const beatsPerSample = seconds * beatsPerSecond
  return Math.round(beatsPerSample * Ticks.Beat)
}

/** Converts ticks to seconds at a given bpm. See {@link Ticks} for more info. */
export const ticksToSeconds = (ticks: number, bpm: number) => {
  const beatsPerSecond = bpm / 60
  const beats = ticks / Ticks.Beat
  return beats / beatsPerSecond
}
