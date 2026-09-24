# Nexus Showroom

An interactive showcase demonstrating the capabilities of the Audiotool Nexus SDK.

## Overview

This project provides four examples showing different SDK features:

1. **Drum Beat Writer** - Create drum patterns using a step sequencer, then insert them into your project using a Gakki soundfont device
2. **Melody Importer** - Import preset MIDI melodies into your project using a Heisenberg synthesizer
3. **Uploading and downloading samples** - Upload a local file, get it back as a SampleMeta, and download the audio Blob or insert it on the timeline
4. **Inserting a sample into the timeline** - Drop pre-uploaded samples on the timeline using different `t.insertSample(...)` options

## Running

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Then open http://127.0.0.1:5173 in your browser.

## Code Structure

The code is intentionally separated into two layers:

### SDK Layer (`src/sdk/`)

Clean, readable code showing how to use the Nexus SDK:

- `types.ts` - Simple type definitions
- `project-stats.ts` - Querying document entities
- `drum-writer.ts` - Creating devices and writing drum notes
- `melody-writer.ts` - Importing melodic content
- `sample-upload-scenarios.ts` - Uploading audio files via `client.samples` and inserting them onto the timeline

### UI Layer (`src/ui/`)

UI components that render the interface:

- `elements.ts` - DOM helpers
- `login.ts` - Login button
- `user-bar.ts` - User info display
- `project-selector.ts` - Project selection UI
- `stats-display.ts` - Project statistics
- `example-*.ts` - Example-specific UI

## Deployment (GitHub Pages)

The showroom is automatically deployed to GitHub Pages on every push to `main`
by [`.github/workflows/deploy-showroom.yml`](../../.github/workflows/deploy-showroom.yml).
The live site is served at:

    https://audiotool.github.io/nexus-sdk/

The workflow builds the SDK first (`npm run build` at the repo root), then
builds the showroom with `SHOWROOM_BASE_PATH=/nexus-sdk/` so all asset URLs are
prefixed correctly. The OAuth `redirectUrl` is derived from
`window.location.origin + import.meta.env.BASE_URL`, so the same build works in
both local dev and on Pages without any code changes.

### One-time setup

1. In the repo settings under **Pages**, set the **Source** to
   **GitHub Actions**.
2. Make sure the OAuth client (`CLIENT_ID` in `src/main.ts`) has
   `https://audiotool.github.io/nexus-sdk/` registered as an allowed redirect
   URL in addition to `http://127.0.0.1:5173/`.

### Manual deploy

Trigger the `Deploy Nexus Showroom to GitHub Pages` workflow from the **Actions**
tab via *Run workflow*.

## Design Philosophy

This showcase prioritizes:

- **Readability** - No fancy JavaScript tricks, simple types
- **Separation** - SDK code is separate from UI code
- **Screenshots** - Examples are spaced apart for easy screenshotting
- **Simplicity** - Clean white background with pastel accents
