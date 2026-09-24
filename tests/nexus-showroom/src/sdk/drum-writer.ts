/**
 * Insert a Gakki drum kit into an Audiotool project and edit its pattern live.
 *
 * The interesting bits:
 * - `client.presets.getDrums("jazz-kit")` fetches a GM drum kit by slug,
 *   using the typed catalog exposed by the preset utility.
 * - Inside `doc.modify`, `t.applyPresetTo(gakki, preset)` loads the preset
 *   onto the just-created device.
 * - `setStep` / `setPattern` send a transaction for every change, so toggling
 *   a step in the showroom UI surfaces immediately in the DAW.
 * - `findGakkiDevice` / `attachDrumController` make the example resumable:
 *   on reload we look for a device with our marker name and attach to it
 *   instead of creating a duplicate.
 * - `controller.onRemoved` lets the UI react when the device is deleted
 *   (e.g. the user removes it from the DAW).
 */

import type { AuthenticatedClient, SyncedDocument } from "@audiotool/nexus"
import type { GmDrumSlug } from "@audiotool/nexus/api"
import type { NexusEntity } from "@audiotool/nexus/document"
import type { Terminable } from "@audiotool/nexus/utils"
import { Ticks } from "@audiotool/nexus/utils"
import type { DrumPattern } from "./types"
import { randomTrackOrder } from "./types"

// One step = one 16th note (`SemiQuaver`). 16 steps therefore fill exactly
// one 4/4 bar, which is what feels natural on a step sequencer.
const TICKS_PER_STEP = Ticks.SemiQuaver
export const STEPS_PER_PATTERN = 16

const DRUM_PITCHES = {
  kick: 36,
  snare: 38,
  hihat: 42,
} as const

export const DRUM_INSTRUMENTS = ["kick", "snare", "hihat"] as const
export type DrumInstrument = (typeof DRUM_INSTRUMENTS)[number]

const INSTRUMENT_BY_PITCH: Record<number, DrumInstrument> = {
  [DRUM_PITCHES.kick]: "kick",
  [DRUM_PITCHES.snare]: "snare",
  [DRUM_PITCHES.hihat]: "hihat",
}

/** A handle to an inserted Gakki kit; mutate the project by calling these. */
export type DrumController = {
  /** Toggle a single (instrument, step) cell. */
  setStep(instrument: DrumInstrument, step: number, on: boolean): Promise<void>
  /** Replace the whole pattern (only diffs are sent). */
  setPattern(pattern: DrumPattern): Promise<void>
  /** Clear all steps. */
  clear(): Promise<void>
  /** Load the canned basic rock beat. */
  loadBasicBeat(): Promise<void>
  /** Snapshot of the current pattern. */
  getPattern(): DrumPattern
  /** Subscribe to the underlying device being removed from the document. */
  onRemoved(callback: () => void): Terminable
  /** The Gakki device id (for status messages). */
  deviceId: string
}

export type InsertGakkiDrumsOptions = {
  /** General MIDI drum kit slug, e.g. "jazz-kit". Resolved through
   *  `client.presets.getDrums(...)`. */
  drumKit: GmDrumSlug
  /** Display name for the device + region + mixer channel. Used as a marker
   *  to find the device again on a later session. */
  displayName: string
}

/**
 * Find an existing Gakki device whose display name ends with `" - ${marker}"`
 * (or matches `marker` exactly, for projects created before we started
 * prefixing the preset name).
 */
export function findGakkiDevice(
  doc: SyncedDocument,
  marker: string,
): NexusEntity<"gakki"> | null {
  const suffix = ` - ${marker}`
  const matches = doc.queryEntities
    .ofTypes("gakki")
    .get()
    .filter((e) => {
      const name = e.fields.displayName.value
      return name === marker || name.endsWith(suffix)
    })
  return matches[0] ?? null
}

/**
 * Build a controller around an already-existing Gakki device, reading its
 * current notes back into a pattern.
 *
 * Throws if the device's note track / region cannot be located (which would
 * indicate the project has been edited in unexpected ways).
 */
export function attachDrumController(
  doc: SyncedDocument,
  gakki: NexusEntity<"gakki">,
): DrumController {
  const noteTrack = doc.queryEntities
    .ofTypes("noteTrack")
    .get()
    .find((t) => t.fields.player.value.equals(gakki.location))
  if (!noteTrack) {
    throw new Error("Could not find a note track attached to the device")
  }

  const noteRegion = doc.queryEntities
    .ofTypes("noteRegion")
    .get()
    .find((r) => r.fields.track.value.equals(noteTrack.location))
  if (!noteRegion) {
    throw new Error("Could not find a note region attached to the device")
  }

  const collectionLocation = noteRegion.fields.collection.value

  const pattern = createEmptyPattern()
  const noteIds = createEmptyNoteIds()

  const existingNotes = doc.queryEntities
    .ofTypes("note")
    .get()
    .filter((n) => n.fields.collection.value.equals(collectionLocation))

  for (const note of existingNotes) {
    const inst = INSTRUMENT_BY_PITCH[note.fields.pitch.value]
    const step = note.fields.positionTicks.value / TICKS_PER_STEP
    if (
      inst &&
      Number.isInteger(step) &&
      step >= 0 &&
      step < STEPS_PER_PATTERN
    ) {
      pattern[inst][step] = true
      noteIds[inst][step] = note.id
    }
  }

  return buildController(doc, gakki, collectionLocation, pattern, noteIds)
}

export async function insertGakkiDrums(
  client: AuthenticatedClient,
  doc: SyncedDocument,
  opts: InsertGakkiDrumsOptions,
): Promise<DrumController> {
  const preset = await client.presets.getDrums(opts.drumKit)

  let gakki!: NexusEntity<"gakki">
  let collectionLocation!: NexusEntity<"noteCollection">["location"]

  await doc.modify((t) => {
    gakki = t.create("gakki", {})
    // Apply preset first; the preset typically writes its own displayName,
    // so we override it afterwards so the device name carries both the
    // preset name (e.g. "Jazz Drum Kit") and our stable marker suffix.
    t.applyPresetTo(gakki, preset)
    t.update(
      gakki.fields.displayName,
      `${preset.meta.displayName} - ${opts.displayName}`,
    )

    const noteTrack = t.create("noteTrack", {
      player: gakki.location,
      orderAmongTracks: randomTrackOrder(),
    })

    const noteCollection = t.create("noteCollection", {})
    collectionLocation = noteCollection.location

    const patternDuration = STEPS_PER_PATTERN * TICKS_PER_STEP
    // Region spans two bars so the drums keep playing under the 2-bar
    // melodies; `loopDurationTicks` stays at one bar so the pattern
    // repeats once for the second bar.
    t.create("noteRegion", {
      track: noteTrack.location,
      collection: noteCollection.location,
      region: {
        positionTicks: 0,
        durationTicks: patternDuration * 2,
        loopDurationTicks: patternDuration,
        displayName: opts.displayName,
      },
    })

    const mixerChannel = t.create("mixerChannel", {
      displayParameters: {
        displayName: opts.displayName,
        colorIndex: 3,
      },
    })

    t.create("desktopAudioCable", {
      fromSocket: gakki.fields.audioOutput.location,
      toSocket: mixerChannel.fields.audioInput.location,
    })
  })

  return buildController(
    doc,
    gakki,
    collectionLocation,
    createEmptyPattern(),
    createEmptyNoteIds(),
  )
}

function buildController(
  doc: SyncedDocument,
  gakki: NexusEntity<"gakki">,
  collectionLocation: NexusEntity<"noteCollection">["location"],
  pattern: DrumPattern,
  noteIds: Record<DrumInstrument, (string | null)[]>,
): DrumController {
  const setPattern = async (next: DrumPattern): Promise<void> => {
    await doc.modify((t) => {
      for (const inst of DRUM_INSTRUMENTS) {
        for (let step = 0; step < STEPS_PER_PATTERN; step++) {
          const should = next[inst][step]
          const has = pattern[inst][step]
          if (should === has) continue

          if (should) {
            const note = t.create("note", {
              collection: collectionLocation,
              positionTicks: step * TICKS_PER_STEP,
              durationTicks: TICKS_PER_STEP,
              pitch: DRUM_PITCHES[inst],
              velocity: 0.8,
            })
            noteIds[inst][step] = note.id
          } else {
            const id = noteIds[inst][step]
            if (id) {
              t.remove(id)
              noteIds[inst][step] = null
            }
          }
          pattern[inst][step] = should
        }
      }
    })
  }

  const setStep = (inst: DrumInstrument, step: number, on: boolean) => {
    const next = clonePattern(pattern)
    next[inst][step] = on
    return setPattern(next)
  }

  return {
    deviceId: gakki.id,
    getPattern: () => clonePattern(pattern),
    setStep,
    setPattern,
    clear: () => setPattern(createEmptyPattern()),
    loadBasicBeat: () => setPattern(createBasicRockBeat()),
    onRemoved: (callback) => doc.events.onRemove(gakki, () => callback()),
  }
}

export function createEmptyPattern(): DrumPattern {
  return {
    kick: Array(STEPS_PER_PATTERN).fill(false),
    snare: Array(STEPS_PER_PATTERN).fill(false),
    hihat: Array(STEPS_PER_PATTERN).fill(false),
  }
}

export function createBasicRockBeat(): DrumPattern {
  return {
    // Kick on every quarter note.
    kick:  [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
    // Snare on the backbeat (2 and 4).
    snare: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
    // Hi-hat on every 8th note.
    hihat: [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false],
  }
}

/**
 * Busier variant of {@link createBasicRockBeat}: same kick and hi-hat, but
 * the snare moves off the backbeat (steps 5 and 13) and instead hits the
 * "and" of every beat (steps 3, 7, 11, 15 -- 1-indexed).
 */
export function createFasterRockBeat(): DrumPattern {
  return {
    kick:  [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
    snare: [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false],
    hihat: [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false],
  }
}

function createEmptyNoteIds(): Record<DrumInstrument, (string | null)[]> {
  return {
    kick: Array(STEPS_PER_PATTERN).fill(null),
    snare: Array(STEPS_PER_PATTERN).fill(null),
    hihat: Array(STEPS_PER_PATTERN).fill(null),
  }
}

function clonePattern(p: DrumPattern): DrumPattern {
  return {
    kick: [...p.kick],
    snare: [...p.snare],
    hihat: [...p.hihat],
  }
}
