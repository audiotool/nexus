/**
 * Get statistics about an open project.
 * This file demonstrates querying the document for entity information.
 */

import type { SyncedDocument } from "@audiotool/nexus"
import type { EntityTypeKey } from "../../../../dist/document/entity-utils"
import { ValueNotifier } from "../../../../dist/utils"
import type { ProjectStats } from "./types"

/** Collect statistics about the current project */
export const subscribeToProjectStats = (
  nexus: SyncedDocument,
): ProjectStats => {
  const notes = new ValueNotifier<number>(0)
  const cables = new ValueNotifier<number>(0)
  const mixerChannels = new ValueNotifier<number>(0)
  const all = new ValueNotifier<number>(0)

  // increment notifier
  const increment = (notifier: ValueNotifier<number>) => {
    notifier.setValue(notifier.getValue() + 1)
  }
  // decrement notifier
  const decrement = (notifier: ValueNotifier<number>) => {
    notifier.setValue(notifier.getValue() - 1)
  }

  // count all
  nexus.events.onCreate("*", () => {
    increment(all)
    return () => decrement(all)
  })

  // count notes
  nexus.events.onCreate("note", () => {
    increment(notes)
    return () => decrement(notes)
  })

  // count cables
  const cableTypes: EntityTypeKey[] = ["desktopAudioCable", "desktopNoteCable"]
  cableTypes.forEach((type) => {
    nexus.events.onCreate(type, () => {
      increment(cables)
      return () => decrement(cables)
    })
  })

  // count mixer channels
  const mixerChannelTypes: EntityTypeKey[] = [
    "mixerChannel",
    "mixerReverbAux",
    "mixerGroup",
    "mixerMaster",
    "mixerDelayAux",
  ]
  mixerChannelTypes.forEach((type) => {
    nexus.events.onCreate(type, () => {
      increment(mixerChannels)
      return () => decrement(mixerChannels)
    })
  })

  return {
    notes,
    cables,
    mixerChannels,
    all,
  }
}
