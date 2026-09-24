> for a **short while** until the next SDK version is published

famous last words.

We're scrambling to prepare for the launch of the whole Audiotool platform in 2 weeks, and as important as the SDK is, even more important is to have a DAW to connect to ;)

The next release focuses on making it more intuitive to use **samples**.

# Making the API nicer to use

We decided to not expose the raw API anymore - instead we now have the following utility methods:

- `at.samples.download(sample, { format: "mp3" })` -> get a blob of the sample file!
- `at.samples.upload(sampleFile, { displayName: "my uploaded sample" })` -> upload a sample!
- `at.samples.get("samples/xzy")` -> fetch metadata of a sample! Can also be `at.samples.get(sampleEntity)`.
- `at.samples.search("trumpet")` -> search for trumpet samples

Easy. No more wrangling GCP headers & fetching upload endpoints & sifting through different nested sample objects & getting CDN asset URLS. Download, upload, get, and search.

## Making sample insertion easier

If you get a sample with

```ts
const sample = at.samples.get("samples/xzy")
```

You can now insert that sample into the timeline in an **audible way** simply by calling:

```ts
nexus.modify((t) => {
  t.insertSample(sample)
})
```

That's it! No more entity relationship wrangling - the list of entities required to understand to just _get something audible_ was **way** to long, and included: AudioRegion, AudioDevice, DesktopAudioCable, MixerChannel, AutomationCollection, AutomationEvent, Sample..... :wastebasket: :man_playing_handball:

This `insertSample` method can actually do much more. The second parameter let's you e.g.:

Attach to an existing audio device, or audio track:

```ts
t.insertSample(sample, { attachTo: track | device })
```

Set the sample's source bpm to sync it up with the metronome:

```ts
t.insertSample(sample, { sample: { bpm: 120 } })
```

precisely position and loop the region.

```ts
t.insertSample(sample, { sample: {bpm: 120 }, region: { positonTicks: Ticks.Bars(2), durationTicks: Ticks.Bars(3) }, loop: { positionTicks: Ticks.Bars(1), durationTicks: Ticks.Bars(2) }}
```

and more. Read more about it here:

We're also working on creating an "example showroom" to make it easier to get started.

It's not quite there yet, but here's a sneak peek already:

Release song: https://open.spotify.com/track/1BWNXJRjolxlDZXIJ93BZ6?si=2147856cb463447e
