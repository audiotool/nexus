/**
 * Melody import example UI.
 *
 * Per row the user first picks a GM instrument from a short list built
 * from `client.presets.gmInstruments` (filtered by the melody's tag).
 * On insert we create a gakki with that preset. While the row is live,
 * the dropdown stays in sync with the device's `presetName`: changing the
 * dropdown swaps the preset, and if the preset is swapped externally
 * (e.g. from the DAW) the dropdown updates to match -- or shows
 * "something else" when the new preset isn't one of our options.
 */

import type { AuthenticatedClient, SyncedDocument } from "@audiotool/nexus"
import type { GmInstrument, GmInstrumentSlug } from "@audiotool/nexus/api"
import {
  PRESET_MELODIES,
  writeMelody,
  notesToPreview,
  type MelodyController,
  type PresetMelody,
} from "../sdk"
import { el, button, status } from "./elements"

const INSTRUMENT_OPTIONS_PER_TAG = 4
const OTHER_OPTION_VALUE = "__other__"
const OTHER_OPTION_LABEL = "something else"

export function renderMelodyExample(
  client: AuthenticatedClient,
  doc: SyncedDocument
): HTMLElement {
  const container = el("div", { className: "example" }, [
    el("span", { className: "example-badge" }, ["Example 2"]),
    el("h3", {}, ["Import MIDI Melodies"]),
    el("p", {}, [
      "Pick an instrument, then insert the melody. You can swap the " +
      "instrument here or in the DAW -- this panel stays in sync.",
    ]),
  ])

  const melodyList = el("div", { className: "melody-list" })
  const statusContainer = el("div")

  for (const melody of PRESET_MELODIES) {
    const choices = pickInstrumentChoices(
      client.presets.gmInstruments,
      melody.instrumentTag
    )
    if (choices.length === 0) {
      statusContainer.appendChild(
        status(
          `No GM instruments tagged "${melody.instrumentTag}" available`,
          "error"
        )
      )
      continue
    }
    melodyList.appendChild(
      renderMelodyRow(client, doc, melody, choices, statusContainer)
    )
  }

  container.appendChild(melodyList)
  container.appendChild(statusContainer)

  return container
}

function pickInstrumentChoices(
  instruments: readonly GmInstrument[],
  tag: string
): GmInstrument[] {
  return instruments
    .filter((i) => i.tags.includes(tag))
    .slice(0, INSTRUMENT_OPTIONS_PER_TAG)
}

function renderMelodyRow(
  client: AuthenticatedClient,
  doc: SyncedDocument,
  melody: PresetMelody,
  choices: GmInstrument[],
  statusContainer: HTMLElement
): HTMLElement {
  const item = el("div", { className: "melody-item" }, [
    el("div", { className: "melody-info" }, [
      el("div", { className: "name" }, [melody.name]),
      el("div", { className: "preview" }, [
        `${melody.description} • ${notesToPreview(melody.notes)}`,
      ]),
    ]),
  ])

  const select = el("select", { className: "melody-instrument" })
  for (const choice of choices) {
    const opt = el("option", { value: choice.slug }, [choice.displayName])
    select.appendChild(opt)
  }
  // Hidden fallback entry: only becomes selected when the device's
  // current preset is not one of our four options.
  const otherOption = el("option", {
    value: OTHER_OPTION_VALUE,
    disabled: "disabled",
    hidden: "hidden",
  }, [OTHER_OPTION_LABEL])
  select.appendChild(otherOption)

  const actionSlot = el("div", { className: "melody-action" })
  item.appendChild(el("div", { className: "melody-controls" }, [
    select,
    actionSlot,
  ]))

  let controller: MelodyController | null = null

  const setSelectToInstrument = (instrument: GmInstrument | null) => {
    if (instrument && choices.some((c) => c.slug === instrument.slug)) {
      select.value = instrument.slug
    } else {
      select.value = OTHER_OPTION_VALUE
    }
  }

  const showInsertButton = () => {
    const insertBtn = button("Insert", async () => {
      const chosen = select.value
      if (chosen === OTHER_OPTION_VALUE) return

      insertBtn.disabled = true
      insertBtn.textContent = "..."
      statusContainer.innerHTML = ""

      try {
        const c = await writeMelody(client, doc, melody, chosen as GmInstrumentSlug)
        controller = c
        setSelectToInstrument(c.getInstrument())
        c.onInstrumentChange((instrument) => setSelectToInstrument(instrument))
        c.onRemoved(() => {
          controller = null
          showInsertButton()
        })
        statusContainer.appendChild(
          status(`Added "${melody.name}" with ${c.noteCount} notes`, "success")
        )
        showRemoveButton()
      } catch (err) {
        insertBtn.disabled = false
        insertBtn.textContent = "Insert"
        statusContainer.appendChild(status(`Error: ${err}`, "error"))
      }
    }, "secondary")

    actionSlot.replaceChildren(insertBtn)
  }

  const showRemoveButton = () => {
    const removeBtn = button("Remove", async () => {
      if (!controller) return
      removeBtn.disabled = true
      removeBtn.textContent = "..."
      statusContainer.innerHTML = ""

      try {
        await controller.remove()
        // `onRemoved` (wired in the Insert handler) swaps the slot back
        // to an Insert button for us.
      } catch (err) {
        removeBtn.disabled = false
        removeBtn.textContent = "Remove"
        statusContainer.appendChild(status(`Error: ${err}`, "error"))
      }
    }, "secondary")

    actionSlot.replaceChildren(removeBtn)
  }

  select.addEventListener("change", async () => {
    if (!controller) return
    const chosen = select.value
    if (chosen === OTHER_OPTION_VALUE) return
    try {
      await controller.setInstrument(chosen as GmInstrumentSlug)
    } catch (err) {
      statusContainer.innerHTML = ""
      statusContainer.appendChild(
        status(`Failed to swap instrument: ${err}`, "error")
      )
    }
  })

  showInsertButton()
  return item
}
