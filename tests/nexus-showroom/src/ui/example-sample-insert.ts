/**
 * Sample insert scenarios example UI (Example 4).
 *
 * Layout:
 *
 * Scenario cards — each uses a pre-uploaded sample (looked up via
 * `client.samples.get`) and follows the pattern: play preview, show the
 * call, then insert. A sticky status line at the bottom of the card
 * reports the outcome of each insert action.
 *
 * Some scenarios (`I`, `J`) need the user to point at an existing entity
 * from the project — those rows render a dropdown of audio devices /
 * audio tracks that stays in sync with the document via
 * `doc.events.onCreate(...)` / `onUpdate(displayName)`.
 */

import type { AuthenticatedClient, SyncedDocument } from "@audiotool/nexus"
import type { NexusEntity } from "@audiotool/nexus/document"
import type { Scenario } from "../sdk"
import { SCENARIOS, removeScenarioRegion, removeScenarioTrack } from "../sdk"
import { button, el, status } from "./elements"
import { highlightTs } from "./highlight"

export function renderSampleInsertExample(
  client: AuthenticatedClient,
  doc: SyncedDocument,
): HTMLElement {
  const container = el("div", { className: "example" }, [
    el("span", { className: "example-badge" }, ["Example 4"]),
    el("h3", {}, ["Inserting a sample into the timeline"]),
    el("p", {}, [
      "Each scenario drops a pre-uploaded sample on the timeline with a " +
        "different combination of `t.insertSample(...)` options.",
    ]),
    renderScenarioList(client, doc),
  ])

  const statusContainer = el("div", { className: "scenario-status" })
  container.appendChild(statusContainer)
  const setStatus = (
    message: string,
    kind: "info" | "success" | "error",
  ): void => {
    statusContainer.innerHTML = ""
    statusContainer.appendChild(status(message, kind))
  }
  container.addEventListener("scenario:status" as never, ((
    ev: CustomEvent<{ message: string; kind: "info" | "success" | "error" }>,
  ) => {
    setStatus(ev.detail.message, ev.detail.kind)
  }) as EventListener)

  return container
}

// -- Status reporting -----------------------------------------------------

function reportStatus(
  source: HTMLElement,
  message: string,
  kind: "info" | "success" | "error",
): void {
  source.dispatchEvent(
    new CustomEvent("scenario:status", {
      detail: { message, kind },
      bubbles: true,
    }),
  )
}

// -- Scenario list --------------------------------------------------------

function renderScenarioList(
  client: AuthenticatedClient,
  doc: SyncedDocument,
): HTMLElement {
  const list = el("div", { className: "scenario-list" })
  for (const scenario of SCENARIOS) {
    list.appendChild(renderScenarioRow({ scenario, client, doc }))
  }
  return list
}

type ScenarioRowOpts = {
  scenario: Scenario
  client: AuthenticatedClient
  doc: SyncedDocument
}

function renderScenarioRow(opts: ScenarioRowOpts): HTMLElement {
  const { scenario, client, doc } = opts
  const trackName = `Nexus Showroom: Insert Sample Scenario ${scenario.id}`

  const card = el("div", { className: "scenario-row" })

  card.appendChild(
    el("div", { className: "scenario-head" }, [
      el("span", { className: "scenario-id" }, [scenario.id]),
      el("h4", { className: "scenario-title" }, [scenario.title]),
    ]),
  )
  card.appendChild(
    el("p", { className: "scenario-desc" }, [scenario.description]),
  )

  const audio = new Audio(
    `${import.meta.env.BASE_URL}samples/${scenario.presetId}.mp3`,
  )
  audio.preload = "metadata"
  const playBtn = button("Play sample", () => togglePlay(audio), "secondary")
  playBtn.classList.add("scenario-run")
  audio.addEventListener("play", () => (playBtn.textContent = "Pause"))
  audio.addEventListener("pause", () => (playBtn.textContent = "Play sample"))
  audio.addEventListener("ended", () => (playBtn.textContent = "Play sample"))

  // Target picker (only for attach-* scenarios).
  let targetSelector: TargetSelector<"audioDevice" | "audioTrack"> | null = null
  if (scenario.kind === "attach-device") {
    targetSelector = createDeviceSelector(doc)
    card.appendChild(targetSelector.container)
  } else if (scenario.kind === "attach-track") {
    targetSelector = createTrackSelector(doc)
    card.appendChild(targetSelector.container)
  }

  // The action button toggles between Insert and Remove in-place.
  let liveCleanup: (() => Promise<void>) | null = null

  const actionBtn = button(
    `Insert scenario ${scenario.id}`,
    () => {},
    "primary",
  )
  actionBtn.classList.add("scenario-run")

  const setInsertMode = (): void => {
    actionBtn.textContent = `Insert scenario ${scenario.id}`
    actionBtn.onclick = runInsert
    liveCleanup = null
  }

  const setRemoveMode = (cleanup: () => Promise<void>): void => {
    liveCleanup = cleanup
    actionBtn.textContent = "Remove"
    actionBtn.onclick = runRemove
  }

  const runInsert = async (): Promise<void> => {
    actionBtn.disabled = true
    actionBtn.textContent = "Inserting..."
    reportStatus(
      card,
      `Scenario ${scenario.id}: fetching sample and inserting...`,
      "info",
    )
    try {
      let result
      switch (scenario.kind) {
        case "standalone":
          result = await scenario.run(client, doc, trackName)
          break
        case "attach-device": {
          const device = targetSelector?.getValue() as
            | NexusEntity<"audioDevice">
            | null
            | undefined
          if (!device) {
            throw new Error(
              "Pick an audio device first — run a previous scenario if " +
                "there aren't any yet.",
            )
          }
          result = await scenario.run(client, doc, device, trackName)
          break
        }
        case "attach-track": {
          const track = targetSelector?.getValue() as
            | NexusEntity<"audioTrack">
            | null
            | undefined
          if (!track) {
            throw new Error(
              "Pick an audio track first — run a previous scenario if " +
                "there aren't any yet.",
            )
          }
          result = await scenario.run(client, doc, track, trackName)
          break
        }
        default: {
          const _exhaustive: never = scenario
          throw new Error(`Unhandled scenario kind: ${_exhaustive}`)
        }
      }

      const regionName = result.region.fields.region.fields.displayName.value
      reportStatus(
        card,
        `Scenario ${scenario.id} ("${scenario.title}") inserted "${
          regionName || scenario.title
        }". Press Remove to undo.`,
        "success",
      )

      // Pick the cleanup function based on what the scenario produced.
      // Attach-track scenarios stack onto a user-picked track and must
      // leave that track in place; everything else owns the whole track.
      const cleanup =
        scenario.kind === "attach-track"
          ? () => removeScenarioRegion(doc, result.region)
          : () => removeScenarioTrack(doc, result.track)
      setRemoveMode(cleanup)
    } catch (err) {
      reportStatus(
        card,
        `Scenario ${scenario.id} failed: ${
          err instanceof Error ? err.message : String(err)
        }`,
        "error",
      )
      setInsertMode()
    } finally {
      actionBtn.disabled = false
    }
  }

  const runRemove = async (): Promise<void> => {
    if (!liveCleanup) return
    const cleanup = liveCleanup
    actionBtn.disabled = true
    actionBtn.textContent = "Removing..."
    try {
      await cleanup()
      reportStatus(card, `Removed scenario ${scenario.id}.`, "success")
      setInsertMode()
    } catch (err) {
      reportStatus(
        card,
        `Remove failed: ${err instanceof Error ? err.message : String(err)}`,
        "error",
      )
      // Restore remove mode so the user can retry.
      setRemoveMode(cleanup)
    } finally {
      actionBtn.disabled = false
    }
  }

  actionBtn.onclick = runInsert

  card.appendChild(
    el("div", { className: "scenario-actions" }, [playBtn, actionBtn]),
  )
  card.appendChild(renderCodeBlock(scenario.codeSnippet))

  return card
}

// -- Target selectors -----------------------------------------------------

type TargetSelector<K extends "audioDevice" | "audioTrack"> = {
  container: HTMLElement
  getValue: () => NexusEntity<K> | null
}

const PLACEHOLDER_VALUE = "__empty__"

/** Build a select with a live-updated list of `audioDevice` entities. */
function createDeviceSelector(
  doc: SyncedDocument,
): TargetSelector<"audioDevice"> {
  const select = el("select", {
    className: "scenario-target-select",
  }) as HTMLSelectElement

  const wrapper = el("label", { className: "scenario-target" }, [
    el("span", { className: "scenario-target-label" }, [
      "Target audio device:",
    ]),
    select,
  ])

  const items = new Map<
    string,
    { entity: NexusEntity<"audioDevice">; label: string }
  >()

  const rebuild = (): void => {
    const previous = select.value
    const sorted = [...items.entries()].sort((a, b) =>
      a[1].label.localeCompare(b[1].label),
    )

    select.replaceChildren()

    if (sorted.length === 0) {
      const empty = el(
        "option",
        { value: PLACEHOLDER_VALUE },
        ["No audio devices yet — run another scenario first"],
      ) as HTMLOptionElement
      empty.disabled = true
      empty.selected = true
      select.appendChild(empty)
      select.disabled = true
      return
    }

    select.disabled = false
    for (const [id, { label }] of sorted) {
      const opt = el("option", { value: id }, [label])
      select.appendChild(opt)
    }
    // Preserve previous selection where possible.
    if (items.has(previous)) {
      select.value = previous
    }
  }

  doc.events.onCreate("audioDevice", (device) => {
    const updateLabel = (name: string): void => {
      items.set(device.id, {
        entity: device,
        label: name?.trim() || "AudioDevice",
      })
      rebuild()
    }
    updateLabel(device.fields.displayName.value)
    const sub = doc.events.onUpdate(device.fields.displayName, updateLabel)
    return () => {
      sub.terminate()
      items.delete(device.id)
      rebuild()
    }
  })

  rebuild()

  return {
    container: wrapper,
    getValue: () => items.get(select.value)?.entity ?? null,
  }
}

/** Build a select with a live-updated list of `audioTrack` entities,
 *  labelled by their owning device's display name. */
function createTrackSelector(
  doc: SyncedDocument,
): TargetSelector<"audioTrack"> {
  const select = el("select", {
    className: "scenario-target-select",
  }) as HTMLSelectElement

  const wrapper = el("label", { className: "scenario-target" }, [
    el("span", { className: "scenario-target-label" }, [
      "Target audio track:",
    ]),
    select,
  ])

  const tracks = new Map<
    string,
    {
      entity: NexusEntity<"audioTrack">
      deviceId: string
      order: number
    }
  >()
  const deviceLabels = new Map<string, string>()

  const labelFor = (
    deviceId: string,
    indexAmongDevice: number,
    totalForDevice: number,
  ): string => {
    const deviceName = deviceLabels.get(deviceId) ?? "AudioDevice"
    return totalForDevice <= 1
      ? deviceName
      : `${deviceName} · track ${indexAmongDevice + 1}`
  }

  const rebuild = (): void => {
    const previous = select.value
    select.replaceChildren()

    if (tracks.size === 0) {
      const empty = el(
        "option",
        { value: PLACEHOLDER_VALUE },
        ["No audio tracks yet — run another scenario first"],
      ) as HTMLOptionElement
      empty.disabled = true
      empty.selected = true
      select.appendChild(empty)
      select.disabled = true
      return
    }

    select.disabled = false

    // Group tracks by device so we can disambiguate the labels.
    const byDevice = new Map<string, string[]>()
    const sortedIds = [...tracks.entries()]
      .sort((a, b) => a[1].order - b[1].order)
      .map(([id]) => id)
    for (const id of sortedIds) {
      const t = tracks.get(id)
      if (!t) continue
      const list = byDevice.get(t.deviceId) ?? []
      list.push(id)
      byDevice.set(t.deviceId, list)
    }

    for (const id of sortedIds) {
      const t = tracks.get(id)
      if (!t) continue
      const siblings = byDevice.get(t.deviceId) ?? [id]
      const indexAmongDevice = siblings.indexOf(id)
      const label = labelFor(t.deviceId, indexAmongDevice, siblings.length)
      const opt = el("option", { value: id }, [label])
      select.appendChild(opt)
    }

    if (tracks.has(previous)) {
      select.value = previous
    }
  }

  doc.events.onCreate("audioDevice", (device) => {
    const updateLabel = (name: string): void => {
      deviceLabels.set(device.id, name?.trim() || "AudioDevice")
      rebuild()
    }
    updateLabel(device.fields.displayName.value)
    const sub = doc.events.onUpdate(device.fields.displayName, updateLabel)
    return () => {
      sub.terminate()
      deviceLabels.delete(device.id)
      rebuild()
    }
  })

  doc.events.onCreate("audioTrack", (track) => {
    tracks.set(track.id, {
      entity: track,
      deviceId: track.fields.player.value.entityId,
      order: track.fields.orderAmongTracks.value,
    })
    rebuild()
    return () => {
      tracks.delete(track.id)
      rebuild()
    }
  })

  rebuild()

  return {
    container: wrapper,
    getValue: () => tracks.get(select.value)?.entity ?? null,
  }
}

// -- Shared helpers --------------------------------------------------------

function renderCodeBlock(snippet: string): HTMLElement {
  const codeInner = el("code", {
    className: "language-typescript",
  }) as HTMLElement
  codeInner.innerHTML = highlightTs(snippet)
  return el("pre", { className: "scenario-code" }, [codeInner])
}

function togglePlay(audio: HTMLAudioElement): void {
  if (audio.paused) {
    void audio.play()
  } else {
    audio.pause()
  }
}
