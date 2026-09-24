/**
 * Live project statistics that update in real-time.
 *
 * This file shows how to use `doc.events.onCreate("*", ...)` to react to
 * every entity being created (or removed) in the document, and keep a
 * running tally without re-querying.
 *
 * The cleanup function returned from each `onCreate` callback is invoked
 * automatically when that entity is later removed, which makes it trivial
 * to keep counts in sync.
 *
 * IMPORTANT: `createLiveStats(doc)` MUST be called before `doc.start()`,
 * because `start()` dispatches an `onCreate` event for every entity that
 * already exists in the project.
 */

import type { SyncedDocument } from "@audiotool/nexus"
import type { PrimitiveField } from "@audiotool/nexus/document"
import type { Terminable } from "@audiotool/nexus/utils"
import type { ProjectStats } from "./types"

const DEVICE_TYPES = new Set([
  "tonematrix",
  "heisenberg",
  "bassline",
  "beatbox8",
  "beatbox9",
  "machiniste",
  "pulverisateur",
  "gakki",
  "audioDevice",
])

const REGION_TYPES = new Set(["noteRegion", "audioRegion", "patternRegion"])
const CABLE_TYPES = new Set(["desktopAudioCable", "desktopNoteCable"])

const TRACK_LABELS: Record<string, string> = {
  noteTrack: "Note Track",
  audioTrack: "Audio Track",
  patternTrack: "Pattern Track",
}

export type LiveStats = {
  /** Get a snapshot of the current stats. */
  snapshot(): ProjectStats
  /** Subscribe to changes; called once immediately with the current snapshot. */
  subscribe(callback: (stats: ProjectStats) => void): () => void
}

/**
 * Build a live, self-updating view of the project's entity counts.
 *
 * Call this BEFORE `doc.start()`.
 */
export function createLiveStats(doc: SyncedDocument): LiveStats {
  let mixerChannels = 0
  let cables = 0
  let notes = 0
  let devices = 0
  let regions = 0
  let totalEntities = 0

  const deviceNamesById = new Map<string, string>()
  const trackNamesById = new Map<string, string>()

  const subscribers = new Set<(stats: ProjectStats) => void>()

  const snapshot = (): ProjectStats => ({
    mixerChannels,
    cables,
    notes,
    devices,
    regions,
    totalEntities,
    deviceNames: [...deviceNamesById.values()],
    trackNames: [...trackNamesById.values()],
  })

  const notify = () => {
    const s = snapshot()
    subscribers.forEach((cb) => cb(s))
  }

  doc.events.onCreate("*", (entity) => {
    const type = entity.entityType as string
    let displayNameSub: Terminable | undefined
    totalEntities += 1

    if (type === "mixerChannel") {
      mixerChannels += 1
    } else if (CABLE_TYPES.has(type)) {
      cables += 1
    } else if (type === "note") {
      notes += 1
    } else if (DEVICE_TYPES.has(type)) {
      devices += 1
      // Subscribe to the device's displayName so renames in the DAW
      // flow through to our UI live. The Terminable is closed in the
      // remove cleanup below.
      displayNameSub = subscribeDisplayName(doc, entity, (name) => {
        deviceNamesById.set(entity.id, name || type)
        notify()
      })
    } else if (REGION_TYPES.has(type)) {
      regions += 1
    } else if (type in TRACK_LABELS) {
      trackNamesById.set(entity.id, TRACK_LABELS[type])
    }

    notify()

    // Returned function runs when this entity is later removed.
    return () => {
      totalEntities -= 1
      if (type === "mixerChannel") {
        mixerChannels -= 1
      } else if (CABLE_TYPES.has(type)) {
        cables -= 1
      } else if (type === "note") {
        notes -= 1
      } else if (DEVICE_TYPES.has(type)) {
        devices -= 1
        deviceNamesById.delete(entity.id)
        displayNameSub?.terminate()
      } else if (REGION_TYPES.has(type)) {
        regions -= 1
      } else if (type in TRACK_LABELS) {
        trackNamesById.delete(entity.id)
      }
      notify()
    }
  })

  return {
    snapshot,
    subscribe(callback) {
      subscribers.add(callback)
      callback(snapshot())
      return () => {
        subscribers.delete(callback)
      }
    },
  }
}

/**
 * If the entity has a mutable `displayName` field, subscribe to its updates
 * (the callback fires immediately with the current value too).
 *
 * Returns `undefined` if the entity doesn't have a displayName field, in
 * which case the caller should fall back to the entity type as the label.
 */
function subscribeDisplayName(
  doc: SyncedDocument,
  entity: { fields: Record<string, unknown> },
  onChange: (name: string) => void
): Terminable | undefined {
  const field = entity.fields.displayName as
    | PrimitiveField<string, "mut">
    | undefined
  if (!field || typeof field.value !== "string") {
    onChange("")
    return undefined
  }
  return doc.events.onUpdate(field, (value) => onChange(value))
}
