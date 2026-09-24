/**
 * Types for the SDK showcase examples.
 * Kept simple and readable - no fancy TypeScript tricks.
 */

import type { ObservableValue } from "../../../../dist/utils"

/** Information about the current project */
export type ProjectStats = {
  notes: ObservableValue<number>
  cables: ObservableValue<number>
  mixerChannels: ObservableValue<number>
  all: ObservableValue<number>
}

/** A simple drum beat pattern - 16 steps for 3 instruments */
export type DrumPattern = {
  kick: boolean[]
  snare: boolean[]
  hihat: boolean[]
}

/** A melody note - simplified representation */
export type MelodyNote = {
  pitch: number
  startTicks: number
  durationTicks: number
  velocity: number
}

/** A preset melody that can be imported */
export type PresetMelody = {
  name: string
  description: string
  notes: MelodyNote[]
  durationTicks: number
  /** Tag used to filter the gakki GM instrument catalog when building the
   *  instrument picker for this melody (e.g. `"synth"`, `"bass"`). */
  instrumentTag: string
  /** Extra per-melody stretch factor applied on top of the global melody
   *  stretch. Used to slow individual melodies down further -- e.g. the
   *  bass line needs more breathing room than the synth hook. Defaults to 1. */
  extraStretch?: number
}

/** Result of the AI generation - sample info to insert */
export type GeneratedSample = {
  sampleName: string
  durationMs: number
}

/**
 * Generate a value for `orderAmongTracks`.
 *
 * `orderAmongTracks` must be unique across all NoteTracks, AudioTracks,
 * PatternTracks, and AutomationTracks in the document. We pick a random
 * float; with the range below the chance of collision is vanishingly small
 * for showroom-sized projects.
 */
export function randomTrackOrder(): number {
  return Math.random() * 1_000_000
}
