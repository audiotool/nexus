---
title: 📜 Changelog
---

> [!WARNING]
> The package should be considered "early alpha" and can change **significantly** between releases, even between minor version numbers.

To get more background on the changes we make, join our [Discord](https://discord.gg/5Cde4Zvret).

## 0.0.15:

- **Updated Consolidation Logic** - for a more robust experience modifying projects alongside other participants
- **Updated defaults** - newly created entities now match the DAW
- **New Goodies in {@link api.PresetUtil}**:
  - use `at.presets.getInstrument("marimba")` to get the marimba instrument
  - use `at.presets.getDrums("jazz-kit")` to get the jazz drum kit
  - use `at.presets.getInstrument(8)` to use instrument with GM Program number `8` (see [1])
  - use `at.presets.getDrums(8)` to get the Room Kit (available programs: 0, 8, 16, 24, 25, 32, 40, 48)
  - use `at.presets.gmInstruments` to get a list of all GM instruments, incl. `.displayName`, `.description`, and `.program` to get the GM number.
  - use `at.presets.gmDrums` to get a list of all GM drums, like the other one
  - usage:
  ```ts
  const preset = await at.presets.getInstrument("pan-flute")
  await nexus.modify((t) => {
    // all GM instruments are gakki devices
    const gakki = t.createDeviceFromPreset(preset)
  })
  ```

See a list of all available instruments at {@link api.GmInstrumentSlug}, drums at {@link api.GmDrumSlug}.

[1]: For background on GM program numbers, see [General MIDI on Wikipedia](https://en.wikipedia.org/wiki/General_MIDI). Many listings show programs as 1–128; in this SDK they are 0-indexed per MIDI 1.0.

## 0.0.13 & 0.0.14

### Breaking Changes

- **New authentication API** - `audiotool()` replaces `getLoginStatus()` and returns the client directly when authenticated
- **Flattened API** - Services are now directly on the client:
  - `client.api.projectService` → `client.projects`
  - `client.api.userService` → `client.users`
  - `client.api.sampleService` → `client.samples`
  - `client.api.projectRoleService` → `client.projectRoles`
  - `client.api.presets` → `client.presets`
  - `client.api.audioGraphService` → `client.audioGraph`
- **Renamed `createSyncedDocument` to `open`** - More intuitive: `client.open("...")`
- **`createAudiotoolClient()` signature changed** - Now takes `{auth, transport}` instead of `{authorization}`
- **Removed exports**: `getLoginStatus`, `LoggedInStatus`, `LoggedOutStatus`, `LoginStatus`, `AudiotoolAPI`, `createAudiotoolAPI`

### New Features

- New `@audiotool/nexus/node` export for Node.js/Bun/Deno server-side usage
- Fixed Vite browser builds - main entry no longer imports Node.js-specific code
- Added `createServerAuth()` for using browser OAuth tokens server-side
- Added `createPATAuth()` for PAT-based authentication
- Added `exportTokens()` to authenticated client for server-side token handoff

**Prompt for an agent:**

```markdown
Migrate my code from @audiotool/nexus 0.0.12 to 0.0.14. Apply these changes:

1. Replace `getLoginStatus({clientId, redirectUrl, scope})` with `audiotool({clientId, redirectUrl, scope})`.
   - `status.loggedIn` becomes `at.status === "authenticated"`
   - `!status.loggedIn` becomes `at.status === "unauthenticated"`
   - `status.login()` / `status.logout()` become `at.login()` / `at.logout()`
   - `status.getUserName()` becomes `at.userName` (sync, no await)

2. Remove `createAudiotoolClient({authorization: status})`. When `at.status === "authenticated"`,
   `at` IS the client — use it directly.

3. Replace `client.api.projectService` with `client.projects`,
   `client.api.userService` with `client.users`,
   `client.api.sampleService` with `client.samples`,
   `client.api.projectRoleService` with `client.projectRoles`,
   `client.api.presets` with `client.presets`,
   `client.api.audioGraphService` with `client.audioGraph`.

4. Replace `client.createSyncedDocument({project: url})` with `client.open(url)`.

5. For Node.js: add `import { createNodeTransport, createDiskWasmLoader } from "@audiotool/nexus/node"`
   and pass `transport: createNodeTransport(), wasm: createDiskWasmLoader()` to `createAudiotoolClient`.

6. Remove imports of: getLoginStatus, LoggedInStatus, LoggedOutStatus, LoginStatus,
   AudiotoolAPI, createAudiotoolAPI — these no longer exist.

7. The Beatbox 8 and Beatbox 9 drum machines now map MIDI notes to drum sounds
   following the General MIDI percussion standard (matching Gakki and MIDI files).
   If your code writes notes to bb8/bb9 pattern steps by MIDI key number, use this
   mapping (same for all three: bb8, bb9, Gakki):

   | Key | Note | Drum Sound         | Key | Note | Drum Sound     |
   | --- | ---- | ------------------ | --- | ---- | -------------- |
   | 35  | B0   | Acoustic Bass Drum | 59  | B2   | Ride Cymbal 2  |
   | 36  | C1   | Bass Drum 1        | 60  | C3   | Hi Bongo       |
   | 37  | C#1  | Side Stick         | 61  | C#3  | Low Bongo      |
   | 38  | D1   | Acoustic Snare     | 62  | D3   | Mute Hi Conga  |
   | 39  | Eb1  | Hand Clap          | 63  | Eb3  | Open Hi Conga  |
   | 40  | E1   | Electric Snare     | 64  | E3   | Low Conga      |
   | 41  | F1   | Low Floor Tom      | 65  | F3   | High Timbale   |
   | 42  | F#1  | Closed Hi Hat      | 66  | F#3  | Low Timbale    |
   | 43  | G1   | High Floor Tom     | 67  | G3   | High Agogo     |
   | 44  | Ab1  | Pedal Hi-Hat       | 68  | Ab3  | Low Agogo      |
   | 45  | A1   | Low Tom            | 69  | A3   | Cabasa         |
   | 46  | Bb1  | Open Hi-Hat        | 70  | Bb3  | Maracas        |
   | 47  | B1   | Low-Mid Tom        | 71  | B3   | Short Whistle  |
   | 48  | C2   | Hi Mid Tom         | 72  | C4   | Long Whistle   |
   | 49  | C#2  | Crash Cymbal 1     | 73  | C#4  | Short Guiro    |
   | 50  | D2   | High Tom           | 74  | D4   | Long Guiro     |
   | 51  | Eb2  | Ride Cymbal 1      | 75  | Eb4  | Claves         |
   | 52  | E2   | Chinese Cymbal     | 76  | E4   | Hi Wood Block  |
   | 53  | F2   | Ride Bell          | 77  | F4   | Low Wood Block |
   | 54  | F#2  | Tambourine         | 78  | F#4  | Mute Cuica     |
   | 55  | G2   | Splash Cymbal      | 79  | G4   | Open Cuica     |
   | 56  | Ab2  | Cowbell            | 80  | Ab4  | Mute Triangle  |
   | 57  | A2   | Crash Cymbal 2     | 81  | A4   | Open Triangle  |

   If your existing code used the old bb8/bb9 mapping (where notes were assigned
   to pads in a different order), update the note numbers to match the table
   above. The same note numbers now work across bb8, bb9, and Gakki, so any
   drum-writing helper you have can be unified.
```

## 0.0.12

- updated networking code to work better in node.js: Connection no longer hangs on creation, and termination after `nexus.stop()` is faster.

## 0.0.11

- {@link index.AudiotoolClient.createSyncedDocument} (now: `open`) changed it's signature: `mode: "online"` is no longer needed - the document is always
  online and synced:

  ```
  const client = ...
  const nexus = await client.createSyncedDocument({ project})
  ```

- new function {@link index.createOfflineDocument}, allowing you to create offline documents without any network calls:

  ```
  const nexus = createOfflineDocument()
  ```

## 0.0.10

- enable creating multiple synced documents at once
- enable stopping an old document from syncing so it can be thrown away: {@link index.SyncedDocument.stop}.
  This will flush all existing modifications to the backend, then prohibit from using anything
  in the document other than {@link index.SyncedDocument.queryEntities}.
- improved link formatting in docs

## 0.0.9

- fixed bug in project synchronization logic that resulted in exceptions in certain situations
- internal restructuring in preparation for open sourcing
- validator wasm got a perf boost, reducing load time of projects

## 0.0.8

Change README file shown on npm.

## v0.0.7

## Internal Changes

- improved load time of package drastically by fetching wasm from CDN when running the package in the browser
- added tests for bun, node.js, and browser, preparing for CI tests
- restructure repo preparing to open source

### Documentation

- wrote document [Overview](./overview.md), giving a high level introduction of the package's functionality, and absorbing previous pages "Transaction Management", "Queries and Navigation", "Events and Changes", and "Core Concepts"
- rename "API Wrappers" to "API", rewrote, absorbed "Presets"
- improved docs of various typescript elements

## API

A few exports were moved around, otherwise no change.

## v0.0.6

We're now on npm! 🥳

Install the package with:

```sh
npm install @audiotool/nexus
```

## API

- refactored and simplified authentication. [Managing User Login](./login.md)
- updated the API bindings to the newest version, some change slipped through the last time

### Documentation

- updated [Getting Started](./getting-started.md), [Managing User Login](./login.md), and the quick start example in the [index](./README.md)

## v0.0.5

This is a big update with lots of changes! Existing apps will sadly break, but we hope these updates will make writing nexus apps
more fun and easy to use!

Here's a summary:

- the ability to self host your app!
- the new gakki soundfontplayer & audio region repitching: {@link entities.Gakki}, {@link entities.AudioRegion | FOO}.
- a major revision of the entire API structure - hopefully the last one!

> [!NOTE]
> You must update your package to keep your app working, older versions won't work anymore.

The biggest changes in the API revision are:

- The `DesktopPlacement` message is gone. It's content (`x`/`y` position and `display_name`) is now directly inside the messages that `DesktopPlacement` used to point to: `t.create("tonematrix", {positionX: 2, positionY: 3, displayName: "foo"})`
- The `Stagebox` message is gone - the `MixerMaster` (formerly: `MixerOut`) contains the stagebox's `x/y` positions directly
- Mixer strips don't have to point to the `MixerMaster` (formerly: `MixerOut`) anymore:
  - Channels, Group and Aux strips don't have to be connected to the master anymore, they're implicitly connected
  - `MixerStripCable` renamed to `MixerStripGrouping`, and is used purely for grouping strips

These changes address the issue where API users:

- forget to add `DesktopPlacement` -> device not visible on the desktop
- forget to add `Stagebox` -> stagebox not visible on the desktop
- forget to add a `MixerStripCable` -> mixer strip not shown, nothing audible

Now you can forget all these things for good!

Further, the SDK itself got an update in documentation & package names:

- new top level package names: `api-types` -> `api`, `entity-types` -> `entities`
- removed `Type` suffix for entity names: `TonematrixType` -> `Tonematrix`
- removed entity messages from api exports, confusing
- grouped entities at {@link entities}
- created an overview of all entities, see [Entities Overview](./entities.md)

Other important changes:

<details>
<summary>Other important changes</summary>

- `PatternRegions` on the timeline no longer have to have a pointer to the pattern device - the device is only referenced through the `PatternTrack` itself; the pattern index through the `pattern_index` field in the region.
- `Beatbox8`, `Beatbox9`, `Machiniste`: pattern step duration is set to an enum rather than tick duration
- **Hundreds of fields got better documentation and names**, and dozens got more sensible validity ranges.
- `CentroidChannels` can now properly be ordered using `order_among_channels`, a float-based ordering similar to tracks
- `Rasselbock` effects are ordered similarly: in an array of `float`s
- `WaveshaperAnchor`s can no longer generate an invalid waveshaper - 1 anchor point is always implicitly present

</details>

## v0.0.4

### API

- expanded subscription capabilities for event manager, see {@link document.NexusEventManager}:
  - `nexus.events.onCreate("*", ...)` to subscribe to _any_ entity being created
  - `nexus.events.onRemove("*", ...)` to subscribe to _any_ entity being removed
  - ```ts
    nexus.events.onCreate("...", () => {
      return () => console.debug("removed")
    })
    ```
    to subscribe to the removal of an entity that was just created

- added better "presets" API wrapper to more easily access presets. See ~~Presets~~

### Documentation

- Added default values & validity ranges to the documentation of fields in the "constructor types", the second argument e.g. for `t.create("foo", {...})`.

  This means you can now hover the parameter to see it's validity range:

  ![hover-example](./images/hover-parameter.png)

- Document what pointer fields point to by linking to all locations. See e.g. {@link entities.DesktopAudioCable.fromSocket}
- Remove default from required pointers; confusing because required pointers' default values will result in a transaction error
- Fix incorrect example in ~~Core Concepts~~
- Add documentation pages:
  - ~~Events and Changes~~
  - ~~Presets~~

### Bug Fixes

- fix a bug in the validator that would cause the removal of certain entities to result in a transaction errors when it shouldn't have

## v0.0.3

### API

- Expose new `Ticks` constants & conversion methods to more easily work with time units

### Documentation

- add links to `EntityQuery` to `Queries and Navigation` docs, links to `TransactionBuilder` to `Transaction Management` docs

## v0.0.2

### API

- started versioning package so we can communicate changes here
- remove `setPAT` & `hasPAT` from `AudiotoolClient`. Instead, pass the PAT directly to `createAudiotoolClient`. They relied on `localStorage`, making them harder to run on platforms other than the web. Users should manage the PAT themselves, and pass in when creating the client. For websites, you could use e.g. [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).
- improve error message if calling `nexus.createTransaction()` before calling `nexus.start()`

### Documentation

- added instructions on how to get started with vite in [Getting Started](./getting-started.md)
- generate documentation on the target type of each entity (e.g. {@link entities.Heisenberg} "is" DesktopPlaceable, NoteTrackPlayer), which was missing. Added distinction between entity & objects.
- typos, wording, consistency

## v0.0.1

First release!
