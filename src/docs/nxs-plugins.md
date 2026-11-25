---
title: Controlling plugins
---

NXS plugins are instruments and effects that users upload to Audiotool. A plugin is a `.fmx` file. It contains a WebAssembly DSP module that the audio engine runs, and an HTML interface that the DAW shows on the device. The DAW shows these devices as "NXS Plugin".

In a project, every plugin runs in an {@link entities.FmxDevice}. The device stores:

- {@link entities.FmxDevice.pluginAssetName}: which plugin file it runs, `pluginAssets/{uuid}`. It can't be changed after the device is created.
- {@link entities.FmxDevice.parameters}: 1024 parameter slots, each a normalized value between 0 and 1. A plugin uses only the slots of the parameters it declares.
- {@link entities.FmxDevice.pluginState}: the plugin's own state, as raw bytes.

The device doesn't know the names of the parameters, or how a normalized value maps to the value the user sees. That's stored in the plugin file. {@link api.PluginsAPI} loads it for you.

## Find a plugin

Search for plugins with `client.plugins.search`. It returns the most favorited plugins first, without their parameters ({@link api.NexusPluginInfo}):

```ts
const plugins = await client.plugins.search({
  query: "vocoder",
  type: "effect",
})
if (plugins instanceof Error) {
  throw plugins
}
for (const plugin of plugins) {
  console.log(plugin.name, plugin.displayName)
}
```

Then load the plugin with its parameters:

```ts
const vocoder = await client.plugins.get(plugins[0].name)
if (vocoder instanceof Error) {
  throw vocoder
}
console.log(vocoder.parameters.map((p) => p.name))
```

Like the other API calls, `search`, `get`, `upload` and `validate` don't throw. If something goes wrong, they return an `Error`, so check the result with `instanceof Error`.

`get` accepts:

- `plugins/{uuid}`: the plugin. You get the parameters of its current version.
- `pluginAssets/{uuid}`: one specific version of a plugin.
- an {@link entities.FmxDevice} in a project: the version the device runs.

`get` downloads the plugin file only once while you use the plugin. If you call `get` again for the same version, or for many devices that use the same version, it reuses the file. Once you no longer use the plugin, the file can be garbage collected.

## Create a device

{@link document.TransactionBuilder.createDeviceFromPlugin} creates a device that runs the plugin. The device gets the plugin's name, and the default value of every parameter:

```ts
const device = await nexus.modify((t) =>
  t.createDeviceFromPlugin(vocoder, { positionX: 200, positionY: 100 }),
)
```

The device isn't connected to anything. Connect it with cables, like any other device:

```ts
await nexus.modify((t) => {
  const synth = t.create("heisenberg", {})
  const vocoderDevice = t.createDeviceFromPlugin(vocoder)
  t.create("desktopAudioCable", {
    fromSocket: synth.fields.audioOutput.location,
    toSocket: vocoderDevice.fields.audioInput.location,
  })
})
```

The device always has all of its sockets: {@link entities.FmxDevice.audioInput}, {@link entities.FmxDevice.sideChainInput}, {@link entities.FmxDevice.notesInput} and {@link entities.FmxDevice.audioOutput}. Notes only reach plugins that accept notes. That's always the case for instruments.

## Set parameters

Look up a parameter by its name, and write the normalized value into its slot. The `id` of a parameter is its slot. `normalize` converts a value in the parameter's own units, or the name of a choice:

```ts
const carrier = vocoder.parameter("Carrier")
const formant = vocoder.parameter("Formant")
if (carrier === undefined || formant === undefined) {
  throw new Error("this isn't the vocoder we expected")
}
const chord = carrier.normalize("Chord")
if (chord === undefined) {
  throw new Error("the vocoder has no Chord carrier")
}

await nexus.modify((t) => {
  t.update(device.fields.parameters.array[carrier.id], chord)
  t.update(device.fields.parameters.array[formant.id], formant.normalize(-3))
})
```

`parameter` returns `undefined` if the plugin has no parameter with that name or id. `normalize` returns `undefined` for a string that isn't one of the choices, or that can't be read as a number. Plugins can change between versions, so check both.

For a parameter with choices, pass the name of the choice as a string, even if it looks like a number. For example, the choices of the Vocoder's "Bands" parameter are `"8"`, `"12"`, `"16"`, `"24"` and `"32"`, so use `bands.normalize("16")`. A number is always read in the parameter's own units. For a choice parameter, that's the position of the choice, counted from `minimum`.

Each parameter also has its metadata: `minimum`, `maximum`, `defaultValue`, `step`, `curve`, `choices` and `label`. See {@link api.NexusPluginParameter}.

## Read devices in a project

To read the parameters of a device that's already in a project, pass the device to `get`. It loads the plugin version the device runs:

```ts
for (const device of nexus.queryEntities.ofTypes("fmxDevice").get()) {
  const plugin = await client.plugins.get(device)
  if (plugin instanceof Error) {
    console.warn(plugin.message) // for example a plugin that was never uploaded
    continue
  }
  for (const parameter of plugin.parameters) {
    const value = device.fields.parameters.array[parameter.id].value
    console.log(`${parameter.name}: ${parameter.format(value)}`) // for example "Carrier: Chord"
  }
}
```

`format` returns the value as the DAW shows it. `denormalize` returns it as a number in the parameter's own units.

## Upload a plugin

Upload an `.fmx` file with `client.plugins.upload`. It creates a new plugin, named like the file, and returns it with its parameters. You can use it in a project right away:

```ts
import { readFile } from "node:fs/promises"

const plugin = await client.plugins.upload({
  file: await readFile("my-reverb.fmx"),
})
if (plugin instanceof Error) {
  throw plugin
}

await nexus.modify((t) => {
  t.createDeviceFromPlugin(plugin)
})
```

In a browser, pass the `File` from a file input or a drop event. `file` also accepts a `Blob`, an `ArrayBuffer` or a `Uint8Array`.

A new plugin is unlisted: only people who know its name can find it. Set the name, description, tags and visibility when you upload:

```ts
const plugin = await client.plugins.upload({
  file,
  displayName: "My Reverb",
  description: "A big, dark reverb",
  tags: ["reverb", "ambient"],
  visibility: "public",
})
```

### Upload a new version

A plugin has versions. Every upload is one version, with its own name `pluginAssets/{uuid}`. The plugin itself has the name `plugins/{uuid}`, which stays the same across versions.

To upload a new version of one of your plugins, pass the plugin's name as `plugin`:

```ts
// the first upload creates the plugin
const plugin = await client.plugins.upload({
  file: await readFile("my-reverb.fmx"),
})
if (plugin instanceof Error) {
  throw plugin
}
console.log(plugin.name) // plugins/{uuid}: keep it to upload new versions
console.log(plugin.assetName) // pluginAssets/{uuid}: version 1

// later, after you changed the plugin
const updated = await client.plugins.upload({
  file: await readFile("my-reverb.fmx"),
  plugin: plugin.name,
})
if (updated instanceof Error) {
  throw updated
}
console.log(updated.name) // the same plugins/{uuid}
console.log(updated.assetName) // a new pluginAssets/{uuid}: version 2
```

The new version becomes the plugin's current version, so `client.plugins.get(plugin.name)` and new devices use it. Devices that are already in projects keep the version they were created with.

If you don't have the plugin's name anymore, find your plugins with `search`:

```ts
const mine = await client.plugins.search({ owner: "me" })
if (mine instanceof Error) {
  throw mine
}
const reverb = mine.find((p) => p.displayName === "My Reverb")
```

If you change the name, description, tags or visibility in the same call, those are updated too. Fields you leave out stay as they are.

### Rejected files

`upload` waits until the backend has checked the file. If the file breaks a plugin rule, `upload` returns an `Error` that lists the rules:

```ts
const plugin = await client.plugins.upload({ file })
if (plugin instanceof Error) {
  console.error(plugin.message)
  // the backend rejected the .fmx file, it breaks 1 plugin rule(s):
  // - metadata.params[0].default: must be in [-60, 12], got 13
}
```

If you upload a file that you uploaded before, the backend doesn't store it twice. You get back the version you uploaded earlier. A file can only belong to one plugin, so uploading it to a second plugin returns an `Error`. The backend compares only the DSP module, the interface and the parameters of the file. Changing its name doesn't make it a different file.

### Check a file without uploading it

While you develop a plugin, check it with `client.plugins.validate`. The backend checks the file against the same rules as `upload`, but doesn't create a plugin or a version:

```ts
const result = await client.plugins.validate(await readFile("my-reverb.fmx"))
if (result instanceof Error) {
  throw result // for example no connection
}
for (const violation of result.violations) {
  console.log(`${violation.field}: ${violation.description}`)
}
console.log(result.valid ? "ready to upload" : "fix the rules above")
```

If you uploaded the same file before, the backend doesn't check it again. Then `valid` is `true`, and `uploadedAs` is the name of the version you uploaded.

## Limits

- Devices whose {@link entities.FmxDevice.pluginAssetName} starts with `localPluginAssets/` run a plugin file that was loaded in a studio tab and not uploaded. Only that tab can run it, and `client.plugins.get` can't load it.
- NXS plugins can't be used in presets yet.
- {@link api.PluginsAPI} doesn't upload plugin icons. For that and other plugin management, use the raw services `client.pluginServices` ({@link api.PluginService}) and `client.pluginAssets` ({@link api.PluginAssetService}).
