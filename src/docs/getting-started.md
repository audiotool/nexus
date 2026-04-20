---
title: Getting Started
---

Here's a guide on how to get started using [vite](https://vite.dev/):

1. Install [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
1. Scaffold your project: [`npm create vite@latest`](https://vite.dev/guide/#scaffolding-your-first-vite-project)
1. Follow vite's setup wizard. If you don't know what to choose, select `vanilla` / `typescript`

Go into your directory, call `npm install`, and then:

```sh
npm install @audiotool/nexus
```

For the authorization described in the next step to work, we first configure the local dev server to run on `127.0.0.1:5173`
rather than `localhost`.

In `vite.config.ts`, add the following lines (create the file if it doesn't exist):

```ts
import { defineConfig } from "vite"

export default defineConfig({
  server: {
    host: "127.0.0.1",
    port: 5173,
  },
})
```

After this, you can run the dev server by calling:

```bash
npm run dev
```

It should show something like:

```text
  ➜  Local:   http://127.0.0.1:5173/
  ➜  press h + enter to show help
```

Open the link and you should see your app!

## Authorizing your app

The app will modify a project on some user's behalf. To do that, we first have to let a user grant us access to their account.

To do this, first register your app on [https://developer.audiotool.com/applications](https://developer.audiotool.com/applications). Create an app there, and enter the following details:

- Name/Description/Website: as you please
- Redirect URIs: `http://127.0.0.1:5173/`
- Scopes: `project:write`

Then initialize Audiotool with your app credentials using {@link index.audiotool | audiotool}:

```ts
import { audiotool } from "@audiotool/nexus"

const at = await audiotool({
  clientId: "<client-id of your app>", // hardcode this — it's not a secret
  redirectUrl: "http://127.0.0.1:5173/",
  scope: "project:write",
})

if (at.status === "authenticated") {
  console.debug("Logged in!!")
} else if (at.status === "unauthenticated") {
  if (at.error) {
    console.error("Auth error:", at.error)
  }
  console.debug("Not logged in.")
}
```

The first time you run this, this will print "Not logged in.". We now need to create a button that logs the user in. When they press it, they will be forwarded to accounts.audiotool.com, come back, and the function above will now say "Logged in!!".

We'll create a button that says "Login" or "Logout" depending on whether the user is logged in:

```ts
if (at.status === "authenticated") {
  const button = document.createElement("button")
  button.innerHTML = "Logout"
  button.addEventListener("click", () => at.logout())
  document.body.appendChild(button)
} else if (at.status === "unauthenticated") {
  const button = document.createElement("button")
  button.innerHTML = "Login"
  button.addEventListener("click", () => at.login())
  document.body.appendChild(button)
}
```

Read more on this process at [Login](./login.md).

## Using `at`

When `at.status === "authenticated"`, the `at` object has capabilities to interact with Audiotool.

```ts
import { audiotool } from "@audiotool/nexus"

const at = await audiotool({
  clientId: "<client-id of your app>", // hardcode this — it's not a secret
  redirectUrl: "http://127.0.0.1:5173/",
  scope: "project:write",
})

if (at.status !== "authenticated") {
  console.log("User not logged in - stopping.")
  throw await new Promise(() => {})
}

// get username
console.log(`Logged in as ${at.userName}`)
// list projects
console.log("projects:", await at.projects.listProjects({}))
// sync to a document
const nexus = await at.open("https://beta.audiotool.com/studio?project=....")
await nexus.start()
// list tone matrices
console.debug(
  "number of tonematrixes in the project:",
  nexus.queryEntities.ofTypes("tonematrix").get().length,
)
// stop syncing before throwing away
await nexus.stop()
```

## Setting up the project

We can now start modifying a project from beta.audiotool.com. To keep things simple, we're just going to open one of your own projects: We assume that you, the developer, have granted your app access to your own account. If you deploy your app, and another user logs in, they won't have access to your project. In that case, you could let the user paste their project URL into your app, or create a project for them via the [API](./api.md).

Go to beta.audiotool.com, create a new project, copy the URL, and paste it to the method {@link index.AudiotoolClient.open | open}:

```ts
const nexus = await at.open("https://beta.audiotool.com/studio?project=<project-id>")
```

The returned object, `nexus`, represents the project you just opened. It contains the entire project state, and offers methods to modify that state.

## Reacting to changes

The `nexus` object is synced in real time with the DAW you have open. You can be notified on changes created by your or the DAW by subscribing to events.

For example, you can subscribe to the creation of a `"tonematrix"` as follows:

```ts
// setup some event listeners
nexus.events.onCreate("tonematrix", (tm) => {
  console.debug("tonematrix created with id", tm.id)
  return () => console.debug("tonematrix removed with id", tm.id)
})
```

or subscribe to the `mix` knob of a stompbox delay being turned as follows:

```ts
nexus.events.onCreate("stompboxDelay", (delay) => {
  nexus.events.onUpdate(delay.fields.mix, (g) => {
    console.debug("stompbox delay mix factor value set to", g)
  })
})
```

Once you set up all event subscriptions, you can start syncing with the existing project state by calling:

```ts
await nexus.start()
```

After this is done, if you go back to your project with the tab open, you can create a tonematrix or stompbox delay and should see a log in your console.

## Modifying the document

To modify the document, you can call `nexus.modify(t => {})`. The object `t` is of type {@link document.TransactionBuilder | TransactionBuilder}
which has various utility functions to modify the document. You can read more on the structure of a document and how to modify it in [Overview](./overview.md).

In the example below, we create a tonematrix and place it on the desktop:

```ts
// modify the document
await nexus.modify((t) => {
  // create a tonematrix
  const tm = t.create("tonematrix", {
    positionX: 0,
    positionY: 1000,
  })

  // update the position of the tonematrix
  t.update(tm.fields.positionX, 1000)
})
```

## Terminating the document

Starting the syncing process by calling {@link index.SyncedDocument.start} results in a background loop being started
that continuously brings the local document state in sync with the backend.

That loop will continue running even if you dereference the document entirely.

To stop the syncing loop, call {@link index.SyncedDocument.stop}:

```ts
await nexus.stop()
```

This will:

- wait for all pending `modify` and `createTransaction` calls to finish
- wait for the created transactions to flush to the backend
- put the document into an "immutable" state in which you can only use {@link index.SyncedDocument.queryEntities}, nothing else

This means, after you call this method:

- you can still traverse and analyze the document using {@link index.SyncedDocument.queryEntities}
- {@link index.SyncedDocument.modify} and {@link index.SyncedDocument.createTransaction} will result in an exception
- event callbacks attached to {@link index.SyncedDocument.events} will never trigger anymore

After this, you can safely throw the document away.

## Complete example

Putting all of this together:

```ts
import { audiotool } from "@audiotool/nexus"

const at = await audiotool({
  clientId: "<client-id of your app>", // hardcode this — it's not a secret
  redirectUrl: "http://127.0.0.1:5173/",
  scope: "project:write",
})

// Create a login/logout button based on status
if (at.status === "authenticated") {
  const button = document.createElement("button")
  button.innerHTML = "Logout"
  button.addEventListener("click", () => at.logout())
  document.body.appendChild(button)
} else if (at.status === "unauthenticated") {
  const button = document.createElement("button")
  button.innerHTML = "Login"
  button.addEventListener("click", () => at.login())
  document.body.appendChild(button)
  console.log("User not logged in - stopping.")
  throw await new Promise(() => {})
}

// at IS the client when authenticated
console.log(`Logged in as ${at.userName}`)

// open project
const nexus = await at.open("https://beta.audiotool.com/studio?project=<project-id>")

// create event listeners
nexus.events.onCreate("tonematrix", (tm) => {
  console.debug("tonematrix created with id", tm.id)
  return () => console.debug("tonematrix removed with id", tm.id)
})

nexus.events.onCreate("stompboxDelay", (delay) => {
  nexus.events.onUpdate(delay.fields.mix, (g) => {
    console.debug("stompbox delay mix factor value set to", g)
  })
})

await nexus.start()

// modify document
await nexus.modify((t) => {
  const tm = t.create("tonematrix", {
    positionX: 0,
    positionY: 1000,
  })

  t.update(tm.fields.positionX, 1000)
})

// stop syncing if you want, do this before throwing nexus away
await nexus.stop()
console.debug("syncing stopped!")
```

Example output if creating a stompbox delay, updating it's mix knob, and removing the tonematrix:

```txt
Logged in!!
tonematrix created with id 20e249b7-e3c0-42c6-a17d-4a8d2c42eb58
stompbox delay mix factor value set to 0.20000000298023224
stompbox delay mix factor value set to 0.20426186919212344
stompbox delay mix factor value set to 0.4748902916908264
stompbox delay mix factor value set to 0.4791521430015564
tonematrix removed with id 20e249b7-e3c0-42c6-a17d-4a8d2c42eb58
syncing stopped!
```

## Next Steps

Now that you've built an app, dive in at [Overview](./overview.md).
