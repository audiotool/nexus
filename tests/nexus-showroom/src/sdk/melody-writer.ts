/**
 * Import melodies into an Audiotool project.
 *
 * Each preset melody is tagged (e.g. `"synth"`, `"bass"`) so the UI can
 * offer a picker built from `client.presets.gmInstruments`. `writeMelody`
 * creates a gakki sampler, applies the chosen GM instrument preset, and
 * returns a {@link MelodyController} that lets the caller:
 *
 * - swap the instrument on the fly (`setInstrument`),
 * - react to the preset being swapped externally via
 *   {@link MelodyController.onInstrumentChange} (which watches the
 *   device's `presetName` field), and
 * - react to the device being removed (`onRemoved`).
 */

import type { AuthenticatedClient, SyncedDocument } from "@audiotool/nexus"
import type { GmInstrument, GmInstrumentSlug } from "@audiotool/nexus/api"
import type { NexusEntity } from "@audiotool/nexus/document"
import type { Terminable } from "@audiotool/nexus/utils"
import type { MelodyNote, PresetMelody } from "./types"
import { randomTrackOrder } from "./types"

/**
 * The raw `PRESET_MELODIES` data was authored at a brisk tempo where one
 * 16th note is 240 ticks. Multiplying by this factor stretches every note
 * (and the region) so the melodies play back at a more musical pace.
 */
const MELODY_STRETCH = 4

export const PRESET_MELODIES: PresetMelody[] = [
  {
    name: "Melodic Hook",
    description: "Catchy 2-bar melody",
    instrumentTag: "synth",
    durationTicks: 7680,
    notes: [
      { pitch: 69, startTicks: 0, durationTicks: 480, velocity: 0.8 },
      { pitch: 72, startTicks: 480, durationTicks: 240, velocity: 0.6 },
      { pitch: 74, startTicks: 720, durationTicks: 240, velocity: 0.6 },
      { pitch: 76, startTicks: 960, durationTicks: 960, velocity: 0.85 },
      { pitch: 74, startTicks: 1920, durationTicks: 480, velocity: 0.7 },
      { pitch: 72, startTicks: 2400, durationTicks: 480, velocity: 0.65 },
      { pitch: 69, startTicks: 2880, durationTicks: 960, velocity: 0.7 },

      { pitch: 64, startTicks: 3840, durationTicks: 480, velocity: 0.75 },
      { pitch: 67, startTicks: 4320, durationTicks: 240, velocity: 0.6 },
      { pitch: 69, startTicks: 4560, durationTicks: 240, velocity: 0.6 },
      { pitch: 72, startTicks: 4800, durationTicks: 720, velocity: 0.8 },
      { pitch: 71, startTicks: 5520, durationTicks: 240, velocity: 0.65 },
      { pitch: 69, startTicks: 5760, durationTicks: 1920, velocity: 0.7 },
    ],
  },
  {
    name: "Bass Line",
    description: "Funky bass pattern",
    instrumentTag: "bass",
    // Bass feels better at half the synth-hook pace, so stretch it one
    // more factor of 2 on top of the shared `MELODY_STRETCH`.
    extraStretch: 2,
    durationTicks: 3840,
    notes: [
      { pitch: 40, startTicks: 0, durationTicks: 360, velocity: 0.9 },
      { pitch: 40, startTicks: 480, durationTicks: 120, velocity: 0.5 },
      { pitch: 43, startTicks: 720, durationTicks: 240, velocity: 0.7 },
      { pitch: 45, startTicks: 960, durationTicks: 360, velocity: 0.85 },
      { pitch: 40, startTicks: 1440, durationTicks: 120, velocity: 0.6 },
      { pitch: 40, startTicks: 1680, durationTicks: 240, velocity: 0.8 },
      { pitch: 40, startTicks: 1920, durationTicks: 360, velocity: 0.9 },
      { pitch: 40, startTicks: 2400, durationTicks: 120, velocity: 0.5 },
      { pitch: 47, startTicks: 2640, durationTicks: 240, velocity: 0.7 },
      { pitch: 45, startTicks: 2880, durationTicks: 480, velocity: 0.85 },
      { pitch: 43, startTicks: 3360, durationTicks: 480, velocity: 0.8 },
    ],
  },
]

/** Handle to an inserted melody. */
export type MelodyController = {
  deviceId: string
  noteCount: number
  /** Current GM instrument applied to the device, or `null` if the device's
   *  `presetName` no longer matches a known GM instrument (e.g. the user
   *  swapped in a non-GM preset from the DAW). */
  getInstrument(): GmInstrument | null
  /** Swap the GM instrument applied to the device. */
  setInstrument(slug: GmInstrumentSlug): Promise<void>
  /** Fires whenever the device's `presetName` changes -- from our own
   *  `setInstrument` call, or from the DAW. Called with the matching GM
   *  instrument, or `null` if the new preset isn't in the GM catalog. */
  onInstrumentChange(callback: (instrument: GmInstrument | null) => void): Terminable
  /** Remove the gakki device and everything we created with it. */
  remove(): Promise<void>
  /** Subscribe to the device being removed (by us, or by the DAW). */
  onRemoved(callback: () => void): Terminable
}

export async function writeMelody(
  client: AuthenticatedClient,
  doc: SyncedDocument,
  melody: PresetMelody,
  instrument: GmInstrumentSlug
): Promise<MelodyController> {
  const preset = await client.presets.getInstrument(instrument)

  let gakki!: NexusEntity<"gakki">

  await doc.modify((t) => {
    gakki = t.create("gakki", {})
    // Apply the instrument preset first (it may overwrite displayName),
    // then stamp our own name on top so the region / device are labeled
    // by the melody rather than the preset.
    t.applyPresetTo(gakki, preset)
    t.update(gakki.fields.displayName, `Showroom - ${melody.name}`)

    const noteTrack = t.create("noteTrack", {
      player: gakki.location,
      orderAmongTracks: randomTrackOrder(),
    })

    const noteCollection = t.create("noteCollection", {})

    const stretch = MELODY_STRETCH * (melody.extraStretch ?? 1)
    const stretchedDuration = melody.durationTicks * stretch

    t.create("noteRegion", {
      track: noteTrack.location,
      collection: noteCollection.location,
      region: {
        positionTicks: 0,
        durationTicks: stretchedDuration,
        loopDurationTicks: stretchedDuration,
        displayName: melody.name,
      },
    })

    for (const note of melody.notes) {
      t.create("note", {
        collection: noteCollection.location,
        positionTicks: note.startTicks * stretch,
        durationTicks: note.durationTicks * stretch,
        pitch: note.pitch,
        velocity: note.velocity,
      })
    }

    const mixerChannel = t.create("mixerChannel", {
      displayParameters: {
        displayName: melody.name,
        colorIndex: 7,
      },
    })

    t.create("desktopAudioCable", {
      fromSocket: gakki.fields.audioOutput.location,
      toSocket: mixerChannel.fields.audioInput.location,
    })
  })

  const instrumentByPresetName = new Map<string, GmInstrument>(
    client.presets.gmInstruments.map((i) => [i.id, i])
  )
  const lookupInstrument = (presetName: string): GmInstrument | null =>
    instrumentByPresetName.get(presetName) ?? null

  return {
    deviceId: gakki.id,
    noteCount: melody.notes.length,
    getInstrument: () => lookupInstrument(gakki.fields.presetName.value),
    setInstrument: async (slug) => {
      const nextPreset = await client.presets.getInstrument(slug)
      await doc.modify((t) => {
        t.applyPresetTo(gakki, nextPreset)
        // applyPresetTo rewrites displayName; restore our marker so the
        // device stays labeled by the melody.
        t.update(gakki.fields.displayName, `Showroom - ${melody.name}`)
      })
    },
    onInstrumentChange: (callback) =>
      doc.events.onUpdate(gakki.fields.presetName, (presetName) =>
        callback(lookupInstrument(presetName))
      ),
    remove: () =>
      doc.modify((t) => {
        t.removeWithDependencies(gakki.id)
      }),
    onRemoved: (callback) =>
      doc.events.onRemove(gakki, () => callback()),
  }
}

export function notesToPreview(notes: MelodyNote[]): string {
  const pitchNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
  const first4 = notes.slice(0, 4)
  return first4.map((n) => {
    const name = pitchNames[n.pitch % 12]
    const octave = Math.floor(n.pitch / 12) - 1
    return `${name}${octave}`
  }).join(" → ") + (notes.length > 4 ? " ..." : "")
}
