/**
 * Drum beat example UI.
 *
 * Two states:
 * 1. Idle: title + a single big "Insert Gakki Drums" button.
 * 2. Live: 16-step pattern editor whose every cell click writes a transaction
 *    against the project, plus "Generate beat" / "Clear" controls.
 */

import type { AuthenticatedClient, SyncedDocument } from "@audiotool/nexus"
import {
  insertGakkiDrums,
  attachDrumController,
  findGakkiDevice,
  createBasicRockBeat,
  createFasterRockBeat,
  STEPS_PER_PATTERN,
  type DrumController,
  type DrumInstrument,
  type DrumPattern,
} from "../sdk"
import { el, button, status, liveIndicator } from "./elements"
import { clear as clearChildren } from "./elements"

// GM drum kit slug; resolved by `client.presets.getDrums(...)` inside
// `insertGakkiDrums`.
const JAZZ_DRUM_SLUG = "jazz-kit" as const
// Visible button label.
const JAZZ_DRUM_LABEL = "Jazz Drum Kit"
// Stable marker name written into the project so this example can find the
// device it created on a subsequent session.
const EXAMPLE_DEVICE_NAME = "Example #1"

const INSTRUMENT_LABELS: Record<DrumInstrument, string> = {
  hihat: "Hi-Hat",
  snare: "Snare",
  kick: "Kick",
}
const ROW_ORDER: DrumInstrument[] = ["hihat", "snare", "kick"]

export function renderDrumExample(
  client: AuthenticatedClient,
  doc: SyncedDocument
): HTMLElement {
  const container = el("div", { className: "example has-live" }, [
    liveIndicator(),
    el("span", { className: "example-badge" }, ["Example 1"]),
    el("h3", {}, ["Write Drum Beats"]),
  ])

  const body = el("div", { className: "drum-body" })
  container.appendChild(body)

  // If a device with our marker name already exists in the project (e.g.
  // because the page was reloaded), attach to it and jump straight to the
  // live editor instead of asking the user to insert again.
  const existing = findGakkiDevice(doc, EXAMPLE_DEVICE_NAME)
  if (existing) {
    try {
      const controller = attachDrumController(doc, existing)
      renderLiveState(client, doc, body, controller)
      return container
    } catch (err) {
      console.warn("Could not attach to existing drum device:", err)
    }
  }

  renderIdleState(client, doc, body)

  return container
}

function renderIdleState(
  client: AuthenticatedClient,
  doc: SyncedDocument,
  body: HTMLElement
) {
  clearChildren(body)

  const insertButton = button(
    `Insert ${JAZZ_DRUM_LABEL}`,
    async () => {
      insertButton.disabled = true
      insertButton.textContent = "Loading preset..."
      try {
        const controller = await insertGakkiDrums(client, doc, {
          drumKit: JAZZ_DRUM_SLUG,
          displayName: EXAMPLE_DEVICE_NAME,
        })
        renderLiveState(client, doc, body, controller)
      } catch (err) {
        insertButton.disabled = false
        insertButton.textContent = `Insert ${JAZZ_DRUM_LABEL}`
        body.appendChild(status(`Failed to insert: ${err}`, "error"))
      }
    },
    "primary big"
  )

  body.appendChild(el("div", { className: "drum-insert" }, [insertButton]))
}

function renderLiveState(
  client: AuthenticatedClient,
  doc: SyncedDocument,
  body: HTMLElement,
  controller: DrumController
) {
  clearChildren(body)

  const grid = renderGrid(controller)
  body.appendChild(grid)

  const refreshGrid = () => updateGridUI(grid, controller.getPattern())
  refreshGrid()

  // The "Generate" button cycles between a basic and a faster variant so
  // the user can toggle back and forth while listening.
  let nextVariant: "basic" | "faster" = "basic"
  const generateBtn = button("Generate beat", async () => {
    generateBtn.disabled = true
    try {
      if (nextVariant === "basic") {
        await controller.setPattern(createBasicRockBeat())
        generateBtn.textContent = "Generate faster beat"
        nextVariant = "faster"
      } else {
        await controller.setPattern(createFasterRockBeat())
        generateBtn.textContent = "Generate beat"
        nextVariant = "basic"
      }
      refreshGrid()
    } finally {
      generateBtn.disabled = false
    }
  }, "secondary")

  const buttonsRow = el("div", { className: "drum-actions" }, [
    generateBtn,
    button("Clear", async () => {
      await controller.clear()
      // A cleared grid should start back at the basic variant.
      nextVariant = "basic"
      generateBtn.textContent = "Generate beat"
      refreshGrid()
    }, "secondary"),
  ])

  body.appendChild(buttonsRow)

  // If the device is removed (e.g. the user deletes it in the DAW), fall
  // back to the idle state so they can insert a new one.
  controller.onRemoved(() => renderIdleState(client, doc, body))
}

function renderGrid(controller: DrumController): HTMLElement {
  const grid = el("div", { className: "drum-grid" })

  for (const inst of ROW_ORDER) {
    const stepsContainer = el("div", { className: "drum-steps" })

    for (let step = 0; step < STEPS_PER_PATTERN; step++) {
      const stepEl = el("div", { className: "drum-step" })
      if (step % 4 === 0) stepEl.classList.add("beat-marker")

      stepEl.addEventListener("click", async () => {
        if (stepEl.classList.contains("pending")) return
        const next = !stepEl.classList.contains("active")
        stepEl.classList.toggle("active", next)
        stepEl.classList.add("pending")
        try {
          await controller.setStep(inst, step, next)
        } catch (err) {
          stepEl.classList.toggle("active", !next)
          console.error("Failed to update drum step:", err)
        } finally {
          stepEl.classList.remove("pending")
        }
      })

      stepsContainer.appendChild(stepEl)
    }

    const row = el("div", { className: "drum-row" }, [
      el("span", { className: "drum-label" }, [INSTRUMENT_LABELS[inst]]),
      stepsContainer,
    ])
    grid.appendChild(row)
  }

  return grid
}

function updateGridUI(grid: HTMLElement, pattern: DrumPattern) {
  const rows = grid.querySelectorAll(".drum-row")
  rows.forEach((row, rowIndex) => {
    const inst = ROW_ORDER[rowIndex]
    const steps = row.querySelectorAll(".drum-step")
    steps.forEach((stepEl, stepIndex) => {
      stepEl.classList.toggle("active", pattern[inst][stepIndex])
    })
  })
}
