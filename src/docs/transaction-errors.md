---
title: Transaction Errors
---

To keep the document coherent, modifications you apply to the document pass a set of validation rules. If a validation rule is violated, an exception is thrown. Don't try to recover from these exception; let the application crash, and try to fix the bug - the internals of the package will likely be in an inconsistent state.

Validation errors can occur whenever you modify the document through the `t` {@link document.TransactionBuilder} object. They are thrown _before_ they live your client, while a modification method of `t` executes.

## Cheat sheet

A list of errors you might encounter while working with the package.

### Value Out of Range

    value 2 out of range [0, 1] (path: <uuid>.feedback_factor)

**Cause**: Number fields must have values within their defined range, if a range is defined.

**Example**:

The field {@link entities.StompboxDelay.feedbackFactor} has a validity range between 0 and 1.

<details>
<summary>In Code</summary>

Violating Example

```typescript
await nexus.modify((t) => {
  const delay = t.create("stompboxDelay", {})
  t.update(delay.fields.feedbackFactor, 2.0) // Error: value 2 out of range [0, 1] (path: d6bf7352-29aa-4b72-a70d-f9e80f592320.feedback_factor)
})
```

Correct Example

```typescript
await nexus.modify((t) => {
  const delay = t.create("stompboxDelay", {})
  t.update(delay.fields.feedbackFactor, 0.75) // ✅ Within range [0, 0.8]
})
```

</details>

---

### Update Immutable

    TS error: Argument of type 'PrimitiveField<NexusLocation, "immut">' is not assignable to parameter of type 'PrimitiveField<NexusLocation, "mut">'.

**Cause**: Fields marked as immutable cannot be updated after creation.

**Example**:

The pointer field {@link entities.Note.collection} is marked as immutable (`"immut"`).

TypeScript should reject code that attempts to mutate an immutable field, so this error is unlikely
to happen during runtime.

<details>
<summary>In Code</summary>

Violating Example

```typescript
await nexus.modify((t) => {
  const collection = t.create("noteCollection", {})
  const collection2 = t.create("noteCollection", {})
  const note = t.create("note", {
    // immut field
    collection: collection.location,
  })
  // TS error: Argument of type 'PrimitiveField<NexusLocation, "immut">' is not assignable to parameter of type 'PrimitiveField<NexusLocation, "mut">'.
  t.update(note.fields.collection, collection2.location)
})
```

Correct Example

To change only the pointer of an entity that has an immutable pointer, you can
clone that entity and remove it. Look at {@link document.TransactionBuilder.clone}
and {@link document.TransactionBuilder.cloneLinked} for more advanced use cases.

```typescript
await nexus.modify((t) => {
  const collection = t.create("noteCollection", {})
  const collection2 = t.create("noteCollection", {})
  const note = t.create("note", {
    collection: collection.location,
  })

  const clone = t.clone(note, {
    collection: collection2.location,
  })
  t.remove(note)
})
```

</details>

---

### Required Pointer Field Not Set

    required pointer on <uuid>.from_socket 'type: <...>.AudioConnection'

**Cause**: A pointer field marked with "required" must be set on creation and can't ever be unset.

**Example:**

{@link entities.DesktopAudioCable.fromSocket} is marked as required.

<details>
  <summary>In Code</summary>

Violating Example:

Creation:

```ts
const chorus = t.create("stompboxChorus", {})
const delay = t.create("stompboxDelay", {})

const con = t.create("desktopAudioCable", {
  fromSocket: chorus.fields.audioOutput.location,
  // TS error: Property 'toSocket' is missing in type '{ fromSocket: NexusLocation; }' but required in type 'DesktopAudioCableConstructor'.
})
t.update(con.fields.fromSocket, {})
```

Update:

```ts
const chorus = t.create("stompboxChorus", {})
const delay = t.create("stompboxDelay", {})

const con = t.create("desktopAudioCable", {
  fromSocket: chorus.fields.audioOutput.location,
  toSocket: delay.fields.audioInput.location,
})
// Resets the pointer. Exception is thrown.
t.update(con.fields.fromSocket, new NexusLocation())
```

Correct Example:

Depends on the situation. In the above example, the audio cable can be removed if it shouldn't
connect two things, and recreated from scratch once it's needed again.

</details>

---

### Location Points to Wrong Target Types

    pointer type mismatch from: <uuid>.to_socket 'type: <...>DesktopAudioCable' (TargetType: AudioInput) to: <uuid> (is: [AutomatableParameter])

**Cause**: Location fields can only point to locations with the same target type.

**Example**:

- {@link entities.DesktopAudioCable.fromSocket} "targets" `AudioOutput`
- {@link entities.StompboxChorus.audioOutput} "is" `AudioOutput`

<details>
<summary>In Code</summary>

Violating Example

```typescript
await nexus.modify((t) => {
  const delay = t.create("stompboxDelay", {})
  const tonematrix = t.create("tonematrix", {})

  // Error: trying to connect audio output to notes input
  t.create("desktopAudioCable", {
    fromSocket: delay.fields.audioOutput.location,
    toSocket: tonematrix.fields.notesInput.location, // Wrong target type!
  })
})
```

Correct Example

```typescript
await nexus.modify((t) => {
  const delay = t.create("stompboxDelay", {})
  const reverb = t.create("stompboxReverb", {})

  // ✅ Connect audio output to audio input
  t.create("desktopAudioCable", {
    fromSocket: delay.fields.audioOutput.location,
    toSocket: reverb.fields.audioInput.location,
  })
})
```

</details>

---

### Multiple Instances of Singleton Entities

    duplicate of unique entity type <...>.Config

**Cause**: At most one instance of certain entities can exist in the document.

Singleton entities are:

- `config`
- `mixerMaster`
- `mixerAuxDelay`
- `mixerAuxReverb`
- `tempoAutomationTrack`

<details>
<summary>In Code</summary>

Violating Example

```typescript
await nexus.modify((t) => {
  const g = t.create("groove", {})
  t.create("config", { defaultGroove: g.location })
  t.create("config", { defaultGroove: g.location })
})
```

Correct Example

```typescript
const mixerMaster = await nexus.modify((t) => {
  // Check if mixer already exists
  const existingMixer = t.entities.ofTypes("mixerMaster").getOne()

  if (existingMixer === undefined) {
    return t.create("mixerMaster", {})
  }

  // Use the existing one
  return existingMixer
})
```

</details>

---

### Duplicate `order_among_tracks` value

    duplicate order_among_tracks value

**Cause**: All tracks must have unique `orderAmongTracks` values.

Links to relevant fields:

- {@link entities.AudioTrack.orderAmongTracks}
- {@link entities.NoteTrack.orderAmongTracks}
- {@link entities.AutomationTrack.orderAmongTracks}
- {@link entities.PatternTrack.orderAmongTracks}

Other ordering that must be unique:

- {@link entities.MixerStripDisplayParameters.orderAmongStrips}, which is used by:
  - {@link entities.MixerChannel}
  - {@link entities.MixerGroup}
  - {@link entities.MixerAux}
  - {@link entities.MixerDelayAux}
  - {@link entities.MixerReverbAux}
- {@link entities.CentroidChannel.orderAmongChannels} among all channels belonging to the same centroid
- {@link entities.RasselbockPattern.effectOrder} a list of floats ordering the rasselbock effects

<details>
<summary>In Code</summary>

Violating Example

```typescript
await nexus.modify((t) => {
  t.create("noteTrack", { orderAmongTracks: 0 })
  t.create("noteTrack", { orderAmongTracks: 0 }) // Error: duplicate order
})
```

Correct Example

```typescript
await nexus.modify((t) => {
  // Find the next available order
  const existingOrders = t.entities
    .ofTypes("noteTrack", "audioTrack", "automationTrack", "patternTrack")
    .get()
    .map((track) => track.fields.orderAmongTracks.value)

  const nextOrder = Math.max(0, ...existingOrders) + 1

  t.create("noteTrack", { orderAmongTracks: nextOrder })
})
```

</details>

---

### Unique Automation Event Positions

    duplicate tick value of event in automation collection (collection: <uuid>)

**Cause**: Automation events in the same collection must have unique tick positions.

Field: {@link entities.AutomationEvent.positionTicks}

<details>
<summary>In Code</summary>

Violating Example

```typescript
await nexus.modify((t) => {
  const collection = t.create("automationCollection", {})

  t.create("automationEvent", {
    collection: collection.location,
    tick: 1000,
    value: 0.5,
  })

  // Error: duplicate tick position
  t.create("automationEvent", {
    collection: collection.location,
    tick: 1000, // Same tick!
    value: 0.8,
  })
})
```

Correct Example

```typescript
await nexus.modify((t) => {
  const collection = t.create("automationCollection", {})

  t.create("automationEvent", {
    collection: collection.location,
    tick: 1000,
    value: 0.5,
  })

  t.create("automationEvent", {
    collection: collection.location,
    tick: 2000, // Different tick
    value: 0.8,
  })
})
```

</details>

---

### Multiple Audio Connections To Same Socket

    multiple pointers to field accepting at most one (field: <uuid>.decay)

**Cause**: Each audio input can only have one connection pointing to it.

<details>
<summary>In Code</summary>

Violating Example

```typescript
await nexus.modify((t) => {
  const chorus = t.create("stompboxChorus", {})
  const delay = t.create("stompboxDelay", {})
  const reverb = t.create("stompboxReverb", {})

  // First connection is fine
  const c1 = t.create("desktopAudioCable", {
    fromSocket: chorus.fields.audioOutput.location,
    toSocket: delay.fields.audioInput.location,
  })

  t.remove(c1)

  // Error: delay input already has a connection
  t.create("desktopAudioCable", {
    fromSocket: reverb.fields.audioOutput.location,
    toSocket: delay.fields.audioInput.location, // Already connected!
  })
})
```

Correct Example

```typescript
await nexus.modify((t) => {
  const chorus = t.create("stompboxChorus", {})
  const delay = t.create("stompboxDelay", {})
  const reverb = t.create("stompboxReverb", {})

  // First connection is fine
  const c1 = t.create("desktopAudioCable", {
    fromSocket: chorus.fields.audioOutput.location,
    toSocket: delay.fields.audioInput.location,
  })

  // we could just delete the cable we create above (c1), but  here's a more generic way
  // to make sure nothing points to the from/to socket we want to point to
  t.entities
    .ofTypes("desktopAudioCable")
    .pointingTo.locations(
      delay.fields.audioInput.location,
      reverb.fields.audioOutput.location,
    )
    .get()
    .forEach((e) => t.remove(e))

  t.create("desktopAudioCable", {
    fromSocket: reverb.fields.audioOutput.location,
    toSocket: delay.fields.audioInput.location,
  })
})
```

</details>

---

### Update of removed entity

    could not find entity: <uuid>

**Cause**: A transaction must only reference entities that exist. You might be updating an entity that was already removed.

<details>
<summary>In Code</summary>

Violating Example

```ts
await nexus.modify((t) => {
  const chorus = t.create("stompboxChorus", {})
  t.remove(chorus)
  t.update(chorus.fields.depthFactor, 0.2)
})
```

Correct Example

```ts
await nexus.modify((t) => {
  const chorus = t.create("stompboxChorus", {})
  t.update(chorus.fields.depthFactor, 0.2)
  t.remove(chorus)
})
```

</details>

See "tips on handling transaction errors" below for more considerations for this error.

---

### Pointer to removed entity

    pointer to non existing entity <uuid> (declared at: <uuid>.entity 'type: <...>.NoteTrack)

**Cause**: Every pointer must be either empty or point to an existing entity.

<details>
<summary>In Code</summary>

Violating Example

```ts
await nexus.modify((t) => {
  const bl = t.create("bassline", {})
  t.remove(bl)
  t.create("noteTrack", {
    player: bl.location,
  })
})
```

Correct Example

```ts
await nexus.modify((t) => {
  const bl = t.create("bassline", {})
  // t.remove(chorus)
  t.create("noteTrack", {
    player: bl.location,
  })
})
```

</details>

---

### Removal of pointed-to entity

    entity is referenced: <uuid>

**Cause**: All pointers must be valid. An entity that is pointed to can't be removed.

Tip: Look at {@link document.TransactionBuilder.removeWithDependencies} to delete referenced entities more easily.

<details>
<summary>In Code</summary>

Violating Example

```ts
await nexus.modify((t) => {
  const bl = t.create("bassline", {})
  t.create("noteTrack", {
    player: bl.location,
  })
  t.remove(bl) // bl is referenced by note track
})
```

Correct Example

```ts
await nexus.modify((t) => {
  const bl = t.create("bassline", {})
  t.create("noteTrack", {
    player: bl.location,
  })
  // this will remove the note track first, after deleting all entities pointing to the note track,
  // and so on.
  t.removeWithDependencies(bl)
})
```

</details>

---

## Tips on Handling Transaction Errors

### Don't try/catch

The system isn't designed to recover from transaction errors. If you `catch` transaction errors,
the internal state of the document might be inconsistent. As a result, transaction errors should be treated as fatal errors, and the application should crash.

See the list of transaction errors to mitigate errors before they happen.

### Use `tryUpdate()` for user input

Users won't know if the value they enter is valid. You can use `tryUpdate` to safely test
if a value is in its validity range.

```typescript
await nexus.modify((t) => {
  const delay = t.entities.ofTypes("stompboxDelay").getOne()
  if (!delay) return

  // Safe update with validation
  const error = t.tryUpdate(delay.fields.feedback, userInputValue)
  if (error) {
    console.warn("Invalid feedback value:", error)
    // Show error to user or use a default value
    t.update(delay.fields.feedback, 0.5)
  }
})
```

### Check for existence before updating

Remember that the document can change at any point if the transaction lock isn't held.

As a result, the following can fail in scenarios where something/someone deletes the delay
between the transaction locks:

```ts
const delay = await nexus.modify((t) => t.create("stompboxDelay", {}))

// transaction lock released; delay could be removed

// so this could result in an exception
nexus.modify((t) => t.update(delay.fields.feedback, 0.5))
```

The code should expect the document to change in arbitrary ways between transaction locks.
This means for the code above, make a quick existence check _while holding the transaction lock_:

```ts
nexus.modify((t) => {
  // only apply if existing
  if (t.entities.has(delay)) {
    t.update(delay.fields.feedback, 0.5)
  }
})
```

### Check for existence before creating

For singleton types, especially when working online, test if the entity you
need is already there before you create it:

```typescript
await nexus.modify((t) => {
  // Check constraints before attempting creation
  const existingMixer = t.entities.ofTypes("mixerMaster").getOne()
  if (existingMixer) {
    return existingMixer // Use existing instead of creating
  }

  return t.create("mixerMaster", {})
})
```

Tip: The `??` operator in js can make this fairly concise. Let's say you need a config
entity; a config entity must point to a groove. Then you can do:

```ts
await nexus.modify((t) => {
  const config =
    t.entities.ofTypes("config").getOne() ??
    t.create("config", {
      defaultGroove: (
        t.entities.ofTypes("groove").getOne() ?? t.create("groove", {})
      ).location,
    })
})
```
