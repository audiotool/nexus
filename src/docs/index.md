---
title: Audiotool Nexus SDK
---

A JS/TS package to interact with multiplayer projects of the [Audiotool DAW](https://new.audiotool.com) in real time. Read more at [Overview](./overview.md).

---

Known supported platforms:

- Chrome
- Firefox
- [Node.js](https://nodejs.org/)\*
- [Bun](https://bun.com/)\*
- [Deno](https://deno.com/)\*

\* The Auth2 [Login](./login.md) flow will be a bit more work for these platforms. We're working on making that easier.

> [!NOTE]
> The Nexus Platform and this package are under heavy development, and as a result might still break when we make changes
> to the backend.

[Join our Discord Server](https://discord.gg/5Cde4Zvret) to receive updates, submit bug reports, ask questions, show what you've done!

## Quick Start

### Installation

Install the package from npm like this:

```bash
npm install @audiotool/nexus
```

### Authentication

Create an application on [developer.audiotool.com/applications](https://developer.audiotool.com/applications) and enter details below:

```typescript
import { getLoginStatus } from "@audiotool/nexus"

// check if current tab is logged in for some user
const status = await getLoginStatus({
  clientId: "<client-id of your app>",
  redirectUrl: "http://127.0.0.1:5173/",
  scope: "project:write",
})

// if user isn't logged in, create a login button and wait
if (!status.loggedIn) {
  const button = document.createElement("button")
  button.innerHTML = "Login"
  button.addEventListener("click", () => status.login())
  document.body.appendChild(button)
  await new Promise(() => {}) // wait forever
}
```

For more detailed instructions on authorization, see [Getting Started](./getting-started.md) or [Managing User Login](./login.md).

### Basic Usage

```typescript
import { createAudiotoolClient } from "@audiotool/nexus"

// Create an audiotool client authorized with the current user
const client = await createAudiotoolClient({
  authorization: status,
})

// Connect to an existing project you created on beta.audiotool.com
const nexus = await client.createSyncedDocument({
  mode: "online",
  // Open the project, copy the URL, paste here
  project: "https://beta.audiotool.com/studio?project=your-project-id",
})

// Set up event listeners
nexus.events.onCreate("tonematrix", (tm) => {
  console.log("New tonematrix created!", tm.fields.patternIndex.value)
})

// Start syncing
await nexus.start()

// Create a tonematrix
await nexus.modify((t) =>
  t.create("tonematrix", {
    displayName: "My first device!",
    positionX: 100,
    positionY: 200,
  }),
)

// stop the syncing process
await nexus.stop()
```

## Documentation

- [Overview](./overview.md) - to see what this is all about
- [Getting Started](./getting-started.md) - an in-depth getting started for beginners
- [API](./api.md) - other audiotool APis
- [Login](./login.md) - setup your app for others to use

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

```

```
