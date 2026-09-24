/**
 * Project stats display component.
 *
 * Subscribes to a `LiveStats` source so that numbers update in real-time
 * as entities are created or removed in the document, with a small
 * tween-and-flash animation on every change.
 */

import type { ProjectStats } from "../sdk"
import { el, liveIndicator } from "./elements"

const TWEEN_MS = 450

export function renderStatsSection(
  liveStats: ProjectStats,
  dawUrl: string,
): HTMLElement {
  const header = el("div", { className: "stats-header" }, [
    el("h2", {}, ["Project Overview"]),
    liveIndicator(),
  ])

  const container = el("div", { className: "stats-section" }, [header])

  if (dawUrl) {
    const dawLink = el(
      "a",
      {
        className: "daw-link",
        href: dawUrl,
        target: "_blank",
      },
      ["Open in Audiotool DAW →"],
    )
    container.appendChild(dawLink)
  }

  const mixerStat = createStat("Mixer Channels")
  const cablesStat = createStat("Cables")
  const notesStat = createStat("Notes")
  const totalStat = createStat("Total Entities")

  const statsGrid = el("div", { className: "stats-grid" }, [
    mixerStat.element,
    cablesStat.element,
    notesStat.element,
    totalStat.element,
  ])
  container.appendChild(statsGrid)

  const entityList = el("div", { className: "entity-list" }, [])
  container.appendChild(entityList)

  liveStats.mixerChannels.subscribe((value) => {
    mixerStat.update(value)
  })
  liveStats.cables.subscribe((value) => {
    cablesStat.update(value)
  })
  liveStats.notes.subscribe((value) => {
    notesStat.update(value)
  })

  liveStats.all.subscribe((value) => {
    totalStat.update(value)
  })

  return container
}

type StatHandle = {
  element: HTMLElement
  update: (next: number) => void
}

function createStat(label: string): StatHandle {
  const valueEl = el("div", { className: "value" }, ["0"])
  const element = el("div", { className: "stat-item" }, [
    valueEl,
    el("div", { className: "label" }, [label]),
  ])

  let current = 0
  let raf = 0

  const update = (next: number) => {
    if (next === current) return

    if (raf) cancelAnimationFrame(raf)

    const from = current
    const to = next
    const start = performance.now()

    valueEl.classList.remove("flash")
    // Force reflow so the animation can re-trigger on rapid updates.
    void valueEl.offsetWidth
    valueEl.classList.add("flash")
    valueEl.classList.toggle("flash-up", to > from)
    valueEl.classList.toggle("flash-down", to < from)

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / TWEEN_MS)
      const eased = 1 - Math.pow(1 - t, 3)
      const value = Math.round(from + (to - from) * eased)
      valueEl.textContent = value.toString()
      if (t < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        raf = 0
        current = to
      }
    }
    raf = requestAnimationFrame(tick)
  }

  return { element, update }
}

function renderEntityTags(container: HTMLElement, deviceNames: string[]) {
  const desired = deviceNames.slice(0, 25)
  const existing = Array.from(container.children) as HTMLElement[]

  for (let i = 0; i < desired.length; i++) {
    const name = desired[i]
    let tag = existing[i]
    if (!tag) {
      tag = el("span", { className: "entity-tag enter" }, [name])
      container.appendChild(tag)
      requestAnimationFrame(() => tag.classList.remove("enter"))
    } else if (tag.textContent !== name) {
      tag.textContent = name
      pulseTag(tag)
    }
  }

  for (let i = desired.length; i < existing.length; i++) {
    existing[i].remove()
  }
}

function pulseTag(tag: HTMLElement) {
  tag.classList.remove("pulse")
  // Force reflow so the animation re-triggers on rapid renames.
  void tag.offsetWidth
  tag.classList.add("pulse")
}
