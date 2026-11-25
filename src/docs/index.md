---
title: Audiotool Nexus SDK
---

A JS/TS package to interact with multiplayer projects of the [Audiotool DAW](https://new.audiotool.com) in real time. Read more at [Nexus apps](https://developer.audiotool.com/sdk).

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

[Join our Discord Server](https://developer.audiotool.com/discord) to receive updates, submit bug reports, ask questions, show what you've done!

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

Create an app on [audiotool.com/apps](https://www.audiotool.com/apps) (open **Yours**, then press **Create app**) with redirect URI `http://127.0.0.1:5173/` and the Projects scope set to **Write**. Its card then shows the client ID.

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

- [Concepts](./overview.md): entities, transactions, events and queries
- [Getting Started](./getting-started.md): an in-depth tutorial for beginners
- [Calling the API](./api.md): other Audiotool APIs
- [Authentication](./login.md): set up your app for others to use

### API Reference

- **{@link index}** - Core functions and types
- **{@link document}** - Document manipulation
- **{@link entities}** - All available audio entities
- **{@link utils}** - Helper functions and classes
- **{@link api}** - Types from the API

Common use cases are in [Concepts](./overview.md#common-use-cases).

---

Ready? Start with our [Getting Started](./getting-started.md) guide!
