---
title: Audiotool Nexus SDK
---

A JS/TS package to interact with multiplayer projects of the [Audiotool DAW](https://new.audiotool.com) in real time. Read more at [Overview](./overview.md).

---

Known supported platforms:

- Chrome
- Firefox
- [Node.js](https://nodejs.org/)
- [Bun](https://bun.com/)
- [Deno](https://deno.com/)

> [!NOTE]
> The Nexus Platform and this package are under heavy development, and as a result might still break when we make changes
> to the backend.

[Join our Discord Server](https://discord.gg/5Cde4Zvret) to receive updates, submit bug reports, ask questions, show what you've done!

## Quick Start

### Installation

```bash
npm install @audiotool/nexus
```

### Vite Config

OAuth redirects require `127.0.0.1`, not `localhost`. Configure your dev server in `vite.config.ts`:

```ts
import { defineConfig } from "vite"

export default defineConfig({
  server: {
    host: "127.0.0.1",
    port: 5173,
  },
})
```

### Setup & Usage

Register your app on [developer.audiotool.com/applications](https://developer.audiotool.com/applications) with redirect URI `http://127.0.0.1:5173/` and scope `project:write`.

Then in your `main.ts`:

```typescript
import { audiotool } from "@audiotool/nexus"

// Authenticate — redirectUrl must match your vite.config.ts host and the URI registered for your app
const at = await audiotool({
  clientId: "<client-id of your app>", // hardcode this — it's not a secret
  redirectUrl: "http://127.0.0.1:5173/",
  scope: "project:write",
})

if (at.status === "unauthenticated") {
  const button = document.createElement("button")
  button.textContent = "Login"
  button.onclick = () => at.login()
  document.body.appendChild(button)
  throw await new Promise(() => {}) // stop here until logged in
}

// Open a project — copy the URL from beta.audiotool.com
const nexus = await at.open("https://beta.audiotool.com/studio?project=your-project-id")

// Listen for changes
nexus.events.onCreate("tonematrix", (tm) => {
  console.log("New tonematrix created!", tm.fields.patternIndex.value)
})

// Start syncing with the backend
await nexus.start()

// Create a tonematrix
await nexus.modify((t) =>
  t.create("tonematrix", {
    displayName: "My first device!",
    positionX: 100,
    positionY: 200,
  }),
)

// Stop syncing when done
await nexus.stop()
```

For more detail, see [Getting Started](./getting-started.md) or [Authentication](./login.md).

### Node.js Usage

Authenticate users in the browser, export their tokens, and use them on the server:

**Browser side:**
```typescript
const at = await audiotool({...})

if (at.status === "authenticated") {
  const tokens = at.exportTokens()
  await fetch("/api/store-session", {
    method: "POST",
    body: JSON.stringify(tokens),
  })
}
```

**Server side (Node.js):**
```typescript
import { createAudiotoolClient, createServerAuth } from "@audiotool/nexus"
import { createNodeTransport, createDiskWasmLoader } from "@audiotool/nexus/node"

const client = await createAudiotoolClient({
  auth: createServerAuth({
    accessToken, refreshToken, expiresAt,
    clientId: "your-client-id",
  }),
  transport: createNodeTransport(),
  wasm: createDiskWasmLoader(),
})

const projects = await client.projects.listProjects({})
```

For personal scripts, see [PAT-based authentication](./login.md#pat-based-authentication).

## Documentation

- [Overview](./overview.md) - to see what this is all about
- [Getting Started](./getting-started.md) - an in-depth getting started for beginners
- [API](./api.md) - other audiotool APis
- [Authentication](./login.md) - setup your app for others to use

### API Reference

- **{@link index}** - Core functions and types
- **{@link document}** - Document manipulation
- **{@link entities}** - All available audio entities
- **{@link utils}** - Helper functions and classes
- **{@link api}** - Types from the API

## Common Use Cases

### Creating Audio Devices

```typescript
// Create a delay effect
const delay = t.create("stompboxDelay", {
  feedbackFactor: 0.3,
  mix: 0.3,
  stepLengthIndex: 2,
})

// Create audio connection
t.create("desktopAudioCable", {
  fromSocket: sourceDevice.fields.audioOutput.location,
  toSocket: delay.fields.audioInput.location,
})
```

### Working with Timeline

```typescript
// Create a note track
const noteTrack = t.create("noteTrack", {
  orderAmongTracks: 0,
  player: heisenberg.location,
})

// Add a note region
const noteRegion = t.create("noteRegion", {
  track: noteTrack.location,
  region: {
    positionTicks: Ticks.SemiBreve, // one whole note in a bar (4/4 time signature)
    durationTicks: Ticks.SemiBreve * 4,
  },
})
```

See {@link utils.Ticks} for constants representing musical time divisions.

### Querying Documents

```typescript
// Find all delay effects
const delays = nexus.queryEntities.ofTypes("stompboxDelay").get()

// Find connected devices
const connected = nexus.queryEntities.pointedToBy
  .types("desktopAudioCable")
  .get()
```

### Offline Mode

You can create an offline version of the document by calling {@link index.createOfflineDocument}. This will create a document instance
that isn't synced to the backend and can immediately be modified.

This is useful for writing integration tests for your app. Example:

```ts
import { createOfflineDocument } from "@audiotool/nexus"

const nexus = await createOfflineDocument()

nexus.events.onCreate("tonematrix", () => {
  console.debug("tonematrix created")
})

await nexus.modify((t) => {
  t.create("tonematrix", {})
})
```

In offline mode, you can turn off validation of the document by passing in a flag:

```ts
const nexus = await createOfflineDocument({ validated: false })
```

This will result in fewer transaction errors being created, which can help during integration tests.

---

Ready? Start with our [Getting Started](./getting-started.md) guide!
