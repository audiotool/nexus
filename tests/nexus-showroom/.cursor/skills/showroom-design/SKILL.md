---
name: showroom-design
description: Design and UX guidelines for the Nexus Showroom website. Use when adding, modifying, or styling examples in tests/nexus-showroom, editing index.html, src/ui/, or src/sdk/, or when the user mentions the showroom, showcase, demo UI, examples layout, or screenshots of the Nexus SDK.
---

# Nexus Showroom Guidelines

The Nexus Showroom is a **feature showcase** for the Audiotool Nexus SDK. It is **not** a creative tool. Its primary audience is developers and stakeholders looking at screenshots and short demos of what the SDK can do.

Keep every change aligned with the rules below.

## Core Principles

1. **Showcase, not tool.** Each example illustrates one SDK capability. Do not add general-purpose editing features, chrome, or affordances that belong in a DAW.
2. **Screenshot-first.** The page must look good as a stack of self-contained screenshots. A reader should be able to crop a single example and have it stand on its own.
3. **Simple and calm.** No moving backgrounds, no decorative animation, no gradients that span the page. The background is plain white (`--color-bg: #ffffff`). Motion is reserved for feedback on user action (button hover, value flash, live indicator).
4. **Readable code over clever code.** The SDK layer is read by users learning the SDK. Prefer explicit types, small functions, and no meta-programming.

## Layout

The showroom is a single scrollable column, roughly 800px wide (`.container { max-width: 800px }`).

Structure, top to bottom:

1. Header (title + one-line subtitle)
2. User bar
3. Project selector *or* (once a project is open) stats + examples

Examples are rendered as a **vertical list** (`renderDrumExample`, `renderMelodyExample`, `renderSampleUploadExample` in `src/main.ts`). Order matters — simplest first, most complex last.

### Spacing Between Examples

Examples must feel **clearly separated** so a screenshot of one does not accidentally include the next. Enforce this via `.example { margin-bottom: 64px; padding: 32px }` in `index.html`. If you add a new example, keep the same vertical rhythm; do not pack them tighter.

Each example is a white card with a 1px border and rounded corners. Do not nest examples inside shared frames or tabs.

### Anatomy of an Example

An example card contains, in order:

1. A small **badge** (`.example-badge`) with a pastel background identifying the feature area.
2. An `<h3>` title.
3. A one-sentence muted `<p>` description.
4. The interactive UI (sequencer grid, melody list, textarea, etc.).
5. A primary action button (e.g. "Insert into project").
6. A status line for success/error feedback (`.status`).

Keep interactive UI minimal: the goal is to show *that* the SDK can do X, not to let the user tweak every parameter of X.

## Visual Style

Use the CSS variables already defined in `index.html`:

- Text: `--color-text` (near-black) on `--color-bg` (white).
- Muted text: `--color-text-muted` for descriptions and secondary labels.
- Accents: pastel palette (`--pastel-coral`, `--pastel-peach`, `--pastel-sky`, `--pastel-lavender`, `--pastel-mint`, `--pastel-cream`, `--pastel-yellow`). One pastel per example badge; reuse existing assignments rather than inventing new colors.
- Primary button: `--accent` (coral). One primary action per example.
- Font: Inter, already loaded. Do not add more font families.

Do not add:

- Full-page gradients, patterns, parallax, or animated backgrounds.
- Decorative emoji or icons inside example cards. Text labels are enough.
- Dark mode, theme switcher, or any UI control that is not directly demonstrating the SDK.
- Shadows beyond the subtle ones already present on `.live-indicator`.

## Adding a New Example

1. Add SDK-layer code under `src/sdk/` — a small, readable module that calls the SDK to do one thing. Export a function, not a class, when possible.
2. Re-export it from `src/sdk/index.ts`.
3. Add a UI-layer renderer under `src/ui/` named `example-<feature>.ts`, exporting a `renderXxxExample(doc, ...)` function that returns an `HTMLElement`.
4. Re-export from `src/ui/index.ts`.
5. Mount it in `src/main.ts` after the existing examples, via `app.appendChild(renderXxxExample(...))`.
6. Pick an unused pastel for its badge and add a `.example:nth-child(N) .example-badge { background: var(--pastel-xxx) }` rule matching its position.

Keep the new example visually consistent with the existing ones (`example-drums.ts`, `example-melody.ts`, `example-sample-upload.ts`). When in doubt, match their structure line-for-line.

## Code Layer Separation

- `src/sdk/` — pure SDK usage, no DOM access. Demonstrates how a developer would use `@audiotool/nexus`.
- `src/ui/` — DOM building, styling, event wiring. May call into `src/sdk/` but the SDK layer must not import from `src/ui/`.
- `src/main.ts` — wiring only (auth, project open, mounting examples). No business logic.

If you find yourself reaching for DOM APIs in `src/sdk/`, that code belongs in `src/ui/` instead.

## Anti-Patterns

- Tabs, accordions, or modals that hide examples. Everything must be visible by scrolling.
- "Settings" panels, preferences, or persistent user state beyond what the SDK itself stores.
- Drag-and-drop, keyboard shortcuts, or undo/redo — these are DAW features, not showcase features.
- Animated backgrounds, particles, blurred orbs, or any ambient motion.
- Breaking the single-column layout with side panels or multi-column grids at the page level. Grids are fine *inside* an example (e.g. the drum step grid).
