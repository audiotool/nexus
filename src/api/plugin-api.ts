import { proto3 } from "@bufbuild/protobuf"
import { NexusEntity } from "@document/entity"
import { AuthService } from "@gen/auth/v1/auth_service_connect"
import { OperationService } from "@gen/longrunning/v1/operation_connect"
import {
  PluginAsset,
  PluginAssetTakedownReason,
} from "@gen/plugin/v1/plugin_asset_pb"
import { PluginAssetService } from "@gen/plugin/v1/plugin_asset_service_connect"
import { PluginMetadata } from "@gen/plugin/v1/plugin_metadata_pb"
import {
  Plugin,
  PluginTakedownReason,
  PluginType,
  PluginVisibility,
} from "@gen/plugin/v1/plugin_pb"
import { PluginService } from "@gen/plugin/v1/plugin_service_connect"
import {
  neverThrowingFetch,
  type NeverThrowingFetch,
} from "@utils/fetch/never-throwing-fetch"
import { createRetryingPromiseClient } from "@utils/grpc/retrying-client"
import type { KeepaliveTransport } from "../transport/types"
import {
  createDefaultNormalizedParameters,
  denormalizeFmxParameterValue,
  FMX_PARAMETER_SLOT_COUNT,
  formatFmxParameterValue,
  normalizeFmxParameterValue,
  parseFmxDocument,
  parseFmxParameterValue,
  quantizeFmxNormalizedValue,
  type FmxParameter,
  type FmxPluginType,
} from "./plugins/fmx-parameters"
import { createPluginUploader } from "./plugins/plugin-upload"

/**
 * A parameter of an NXS plugin, with functions to convert between the
 * parameter's own units and the normalized values stored in
 * {@link entities.FmxDevice.parameters}.
 */
export type NexusPluginParameter = FmxParameter & {
  /**
   * The normalized value [0, 1] to store in the device for `value`.
   *
   * Pass a number in the parameter's own units (it's clamped to the range), or
   * a string: the name of a choice (case-insensitive), or a number as text.
   * For a parameter with choices, pass the choice's name even if it looks like
   * a number: a number is read as the position of the choice, counted from
   * `minimum`.
   *
   * Returns `undefined` for a string that matches no choice and isn't a number.
   */
  normalize: {
    (value: number): number
    (value: string): number | undefined
  }
  /** The value in the parameter's own units, for a normalized value read from the device. */
  denormalize: (normalized: number) => number
  /** The value as the DAW shows it, for example `"3.00 dB"` or the name of a choice. */
  format: (normalized: number) => string
}

/** The type of a plugin: an effect or an instrument. */
export type NexusPluginType = "effect" | "instrument"

/** Whether other users can find a plugin. Unlisted plugins can still be used by anyone who has their name. */
export type NexusPluginVisibility = "public" | "unlisted"

/** An NXS plugin as listed by {@link PluginsAPI.search}, without its parameters. */
export type NexusPluginInfo = {
  /** The plugin, `plugins/{uuid}`. Pass it to {@link PluginsAPI.get} to load the parameters. */
  name: string
  displayName: string
  description: string
  tags: string[]
  /** The URL of the plugin's icon image. Not set if the plugin has no icon. */
  iconUrl?: string
  /** Not set if the plugin has no file yet. */
  type?: NexusPluginType
  /** The user who uploaded the plugin, `users/{name}`. */
  ownerName: string
  visibility: NexusPluginVisibility
  /** The current version, `pluginAssets/{uuid}`. Not set if the plugin has no file yet. */
  currentAssetName?: string
  numFavorites: number
  numUsages: number
  /** The plugin as returned by the backend. */
  meta: Plugin
}

/** An NXS plugin, with the parameters of one version (asset) of it. */
export type NexusPlugin = Omit<NexusPluginInfo, "type"> & {
  /** The version these parameters belong to, `pluginAssets/{uuid}`. */
  assetName: string
  /** The type the plugin file declares. */
  type: NexusPluginType
  /** The parameters the plugin declares. Each `id` is a slot of {@link entities.FmxDevice.parameters}. */
  parameters: readonly NexusPluginParameter[]
  /** Finds a parameter by its name or id. Returns `undefined` if the plugin has no such parameter. */
  parameter: (nameOrId: string | number) => NexusPluginParameter | undefined
  /** The normalized default values of all parameter slots, for a new device. */
  defaultParameters: () => number[] & { length: 1024 }
  /** The plugin asset as returned by the backend. */
  asset: PluginAsset
}

/** Options for {@link PluginsAPI.search}. */
export type PluginSearchOptions = {
  /** Words that must all appear in the name, description, or tags. Case-insensitive. */
  query?: string
  /** Only plugins of this type. */
  type?: NexusPluginType
  /**
   * Only plugins of this user, `users/{name}`, or `"me"` for your own plugins.
   * Includes plugins that have no file yet.
   */
  owner?: string
  /** The maximum number of plugins to return. Default 50. */
  limit?: number
}

/** Options for {@link PluginsAPI.upload}. */
export type PluginUploadOptions = {
  /** The `.fmx` file. */
  file: File | Blob | ArrayBuffer | Uint8Array
  /**
   * Upload a new version of this plugin of yours, `plugins/{uuid}`. Without it,
   * a new plugin is created.
   */
  plugin?: string
  /** The name of the plugin. Default for a new plugin: the name in the `.fmx` file. */
  displayName?: string
  description?: string
  tags?: string[]
  /**
   * Default for a new plugin: `"unlisted"`. An existing plugin keeps its
   * visibility if this isn't set.
   */
  visibility?: NexusPluginVisibility
}

/** The result of {@link PluginsAPI.validate}. */
export type NexusPluginValidation = {
  /** Whether the backend would accept the file. */
  valid: boolean
  /** The plugin rules the file breaks. Empty if the file is valid. */
  violations: readonly { field: string; description: string }[]
  /** The version you already uploaded with the same content, `pluginAssets/{uuid}`. */
  uploadedAs?: string
}

/**
 * A wrapper for the plugin API that's more convenient to use than the raw
 * plugin services.
 *
 * Nothing here throws. The functions that call the backend return an `Error`
 * if something goes wrong.
 *
 * @example Create a device for a plugin and set a parameter
 * ```ts
 * const vocoder = await client.plugins.get("plugins/01f345db-d130-46c9-b728-aa5dc4ce2915")
 * if (vocoder instanceof Error) {
 *   throw vocoder
 * }
 * const carrier = vocoder.parameter("Carrier")
 * await nexus.modify((t) => {
 *   const device = t.createDeviceFromPlugin(vocoder)
 *   if (carrier !== undefined) {
 *     t.update(device.fields.parameters.array[carrier.id], carrier.normalize(1))
 *   }
 * })
 * ```
 *
 * See [NXS plugins](../docs/nxs-plugins.md) for more information.
 */
export type PluginsAPI = {
  /**
   * Loads a plugin and its parameters.
   *
   * Pass `plugins/{uuid}` to get the current version of the plugin, or
   * `pluginAssets/{uuid}` to get a specific version. Pass an
   * {@link entities.FmxDevice} to get the version the device runs.
   *
   * The parameters of a version never change, so loading the same version
   * again doesn't download its file again while you still use it.
   */
  get: (
    plugin: string | NexusEntity<"fmxDevice">,
  ) => Promise<NexusPlugin | Error>
  /**
   * Searches plugins, most favorited first. Without `owner`, only plugins that
   * can be used in a project are returned.
   *
   * Load the parameters of a result with {@link PluginsAPI.get}.
   */
  search: (options?: PluginSearchOptions) => Promise<NexusPluginInfo[] | Error>
  /**
   * Uploads an `.fmx` file, and makes it the current version of the plugin.
   * Returns the plugin with the parameters of the uploaded file, ready for
   * {@link document.TransactionBuilder.createDeviceFromPlugin}.
   *
   * Waits until the backend has checked the file. Returns an `Error` if the
   * file is rejected. The error lists the rules the file breaks.
   *
   * If you uploaded the same file before, the backend reuses that version
   * instead of creating a new one.
   *
   * @param signal - Stops the upload, and returns an `Error` with the message
   * `"cancelled"`. A new plugin that was created for the upload is removed
   * again. Has no effect once the upload makes the new version current.
   *
   * @example
   * ```ts
   * const file = await readFile("my-plugin.fmx")
   * const plugin = await client.plugins.upload({ file, visibility: "public" })
   * if (plugin instanceof Error) {
   *   console.error(plugin.message)
   * }
   * ```
   */
  upload: (
    options: PluginUploadOptions,
    signal?: AbortSignal,
  ) => Promise<NexusPlugin | Error>
  /**
   * Checks whether the backend would accept an `.fmx` file, without uploading
   * it as a plugin. Useful while you develop a plugin.
   *
   * Returns an `Error` only if the check itself fails. A file that breaks
   * rules returns `valid: false`, with the rules in `violations`.
   *
   * If you uploaded the same file before, it isn't checked again: `valid` is
   * `true`, and `uploadedAs` is the version you uploaded.
   *
   * @param signal - Stops the check, and returns an `Error` with the message
   * `"cancelled"`.
   */
  validate: (
    file: PluginUploadOptions["file"],
    signal?: AbortSignal,
  ) => Promise<NexusPluginValidation | Error>
}

const UPLOAD_POLL_MS = 1_000
const SEARCH_PAGE_SIZE = 100
const DEFAULT_SEARCH_LIMIT = 50

const fromFmxPluginType = (type: FmxPluginType): NexusPluginType => {
  switch (type) {
    case "vst_effect":
      return "effect"
    case "vst_instrument":
      return "instrument"
    default: {
      const unhandled: never = type
      throw new Error(`unknown plugin type ${String(unhandled)}`)
    }
  }
}

const fromBackendPluginType = (
  type: PluginType,
): NexusPluginType | undefined => {
  switch (type) {
    case PluginType.EFFECT:
      return "effect"
    case PluginType.INSTRUMENT:
      return "instrument"
    case PluginType.UNSPECIFIED:
      return undefined
    default: {
      const unhandled: never = type
      throw new Error(`unknown plugin type ${String(unhandled)}`)
    }
  }
}

const toBackendPluginType = (type: NexusPluginType): PluginType => {
  switch (type) {
    case "effect":
      return PluginType.EFFECT
    case "instrument":
      return PluginType.INSTRUMENT
    default: {
      const unhandled: never = type
      throw new Error(`unknown plugin type ${String(unhandled)}`)
    }
  }
}

const createPluginInfo = (meta: Plugin): NexusPluginInfo => {
  const type = fromBackendPluginType(meta.type)
  return {
    name: meta.name,
    displayName: meta.displayName,
    description: meta.description,
    tags: meta.tags,
    ...(meta.imageUrl !== "" ? { iconUrl: meta.imageUrl } : {}),
    ...(type !== undefined ? { type } : {}),
    ownerName: meta.ownerName,
    visibility:
      meta.visibility === PluginVisibility.PUBLIC ? "public" : "unlisted",
    ...(meta.currentAsset !== ""
      ? { currentAssetName: meta.currentAsset }
      : {}),
    numFavorites: meta.numFavorites,
    numUsages: meta.numUsages,
    meta,
  }
}

const matchesQuery = (plugin: Plugin, query: string) => {
  const searchableText = [
    plugin.displayName,
    plugin.description,
    ...plugin.tags,
  ]
    .join(" ")
    .toLowerCase()
  return query
    .toLowerCase()
    .split(" ")
    .filter((word) => word.length > 0)
    .every((word) => searchableText.includes(word))
}

const quoteCel = (value: string) =>
  `'${value.replaceAll("\\", "\\\\").replaceAll("'", "\\'")}'`

const createSearchFilter = (
  options: PluginSearchOptions,
  ownerName: string | undefined,
) => {
  const expressions: string[] = []
  if (ownerName !== undefined) {
    expressions.push(`(plugin.owner_name == ${quoteCel(ownerName)})`)
  } else {
    // Only the owner can use a plugin before it has a current asset.
    expressions.push(`(plugin.current_asset != '')`)
  }
  if (options.type !== undefined) {
    const typeName = proto3
      .getEnumType(PluginType)
      .findNumber(toBackendPluginType(options.type))
    expressions.push(`(plugin.type == '${typeName?.name}')`)
  }
  return expressions.join(" && ")
}

const createNexusParameter = (
  parameter: FmxParameter,
): NexusPluginParameter => {
  const normalize = (value: number | string): number | undefined => {
    if (typeof value === "string") {
      return parseFmxParameterValue(parameter, value)
    }
    const low = Math.min(parameter.minimum, parameter.maximum)
    const high = Math.max(parameter.minimum, parameter.maximum)
    const clamped = Math.min(Math.max(value, low), high)
    return quantizeFmxNormalizedValue(
      parameter,
      normalizeFmxParameterValue(parameter, clamped),
    )
  }
  return {
    ...parameter,
    normalize: normalize as NexusPluginParameter["normalize"],
    denormalize: (normalized) =>
      denormalizeFmxParameterValue(parameter, normalized),
    format: (normalized) => formatFmxParameterValue(parameter, normalized),
  }
}

/** The parameters of one plugin file. Plugins loaded from the file hold it, which keeps it cached. */
type PluginFile = {
  type: NexusPluginType
  parameters: readonly NexusPluginParameter[]
  fmxParameters: readonly FmxParameter[]
}

/** @internal */
export const createPluginUtil = (
  transport: KeepaliveTransport,
  fetch: NeverThrowingFetch = neverThrowingFetch,
  uploadPollMs: number = UPLOAD_POLL_MS,
): PluginsAPI => {
  const plugins = createRetryingPromiseClient(PluginService, transport)
  const pluginAssets = createRetryingPromiseClient(
    PluginAssetService,
    transport,
  )
  const operations = createRetryingPromiseClient(OperationService, transport)
  const auth = createRetryingPromiseClient(AuthService, transport)

  const files = new Map<string, WeakRef<PluginFile>>()
  const loadingFiles = new Map<string, Promise<PluginFile | Error>>()
  const forgetFile = new FinalizationRegistry<string>((assetName) => {
    if (files.get(assetName)?.deref() === undefined) {
      files.delete(assetName)
    }
  })

  let myUserName: string | undefined

  const fetchBytes = async (url: string): Promise<Uint8Array | Error> => {
    const response = await fetch(url, { credentials: "omit" })
    if (response instanceof Error) {
      return response
    }
    if (!response.ok) {
      return new Error(`fetching ${url} failed with status ${response.status}`)
    }
    try {
      return new Uint8Array(await response.arrayBuffer())
    } catch (error) {
      return new Error(`fetching ${url} failed`, { cause: error })
    }
  }

  const getPlugin = async (name: string): Promise<Plugin | Error> => {
    const response = await plugins.getPlugin({ name })
    if (response instanceof Error) {
      return new Error(`could not get NXS plugin ${name}`, { cause: response })
    }
    return response.plugin ?? new Error(`NXS plugin ${name} was not found`)
  }

  const getPluginAsset = async (name: string): Promise<PluginAsset | Error> => {
    const response = await pluginAssets.getPluginAsset({ name })
    if (response instanceof Error) {
      return new Error(`could not get NXS plugin asset ${name}`, {
        cause: response,
      })
    }
    return (
      response.pluginAsset ??
      new Error(`NXS plugin asset ${name} was not found`)
    )
  }

  const downloadFile = async (
    asset: PluginAsset,
  ): Promise<PluginFile | Error> => {
    const metadataBytes = await fetchBytes(asset.metadataUrl)
    if (metadataBytes instanceof Error) {
      return new Error(`could not download NXS plugin asset ${asset.name}`, {
        cause: metadataBytes,
      })
    }
    let metadata: PluginMetadata
    try {
      metadata = PluginMetadata.fromBinary(metadataBytes)
    } catch (error) {
      return new Error(`NXS plugin asset ${asset.name} has invalid metadata`, {
        cause: error,
      })
    }
    if (metadata.metadata.case !== "fmx") {
      return new Error(`NXS plugin asset ${asset.name} is not an fmx plugin`)
    }
    const fmxBytes = await fetchBytes(metadata.metadata.value.fmxFileUrl)
    if (fmxBytes instanceof Error) {
      return new Error(`could not download NXS plugin asset ${asset.name}`, {
        cause: fmxBytes,
      })
    }
    const document = parseFmxDocument(fmxBytes)
    if (document instanceof Error) {
      return new Error(`could not read NXS plugin asset ${asset.name}`, {
        cause: document,
      })
    }
    return {
      type: fromFmxPluginType(document.pluginType),
      parameters: document.parameters.map(createNexusParameter),
      fmxParameters: document.parameters,
    }
  }

  const loadFile = async (asset: PluginAsset): Promise<PluginFile | Error> => {
    // Assets deleted by their owner stay usable by the projects that use
    // them. Moderation takedowns clear `metadataUrl`.
    if (asset.metadataUrl === "") {
      return new Error(
        asset.takedownReason === PluginAssetTakedownReason.UNSPECIFIED
          ? `NXS plugin asset ${asset.name} has no file yet`
          : `NXS plugin asset ${asset.name} is unavailable`,
      )
    }
    const cached = files.get(asset.name)?.deref()
    if (cached !== undefined) {
      return cached
    }
    const loading = loadingFiles.get(asset.name)
    if (loading !== undefined) {
      return loading
    }
    const download = downloadFile(asset)
    loadingFiles.set(asset.name, download)
    const file = await download.finally(() => loadingFiles.delete(asset.name))
    if (!(file instanceof Error)) {
      files.set(asset.name, new WeakRef(file))
      forgetFile.register(file, asset.name)
    }
    return file
  }

  const get = async (
    plugin: string | NexusEntity<"fmxDevice">,
  ): Promise<NexusPlugin | Error> => {
    const name =
      plugin instanceof NexusEntity
        ? plugin.fields.pluginAssetName.value
        : plugin
    let meta: Plugin | Error
    let asset: PluginAsset | Error
    if (name.startsWith("pluginAssets/")) {
      asset = await getPluginAsset(name)
      if (asset instanceof Error) {
        return asset
      }
      meta = await getPlugin(asset.plugin)
    } else if (name.startsWith("plugins/")) {
      meta = await getPlugin(name)
      if (meta instanceof Error) {
        return meta
      }
      if (meta.currentAsset === "") {
        return new Error(`NXS plugin ${name} has no file yet`)
      }
      asset = await getPluginAsset(meta.currentAsset)
    } else if (name.startsWith("localPluginAssets/")) {
      return new Error(
        `${name} is a plugin that was loaded locally in the studio and not uploaded. Only the studio that loaded it can use it.`,
      )
    } else {
      return new Error(
        `expected a name like plugins/{uuid} or pluginAssets/{uuid}, got: ${name}`,
      )
    }
    if (meta instanceof Error) {
      return meta
    }
    if (asset instanceof Error) {
      return asset
    }

    const file = await loadFile(asset)
    if (file instanceof Error) {
      return file
    }
    return {
      ...createPluginInfo(meta),
      assetName: asset.name,
      type: file.type,
      parameters: file.parameters,
      parameter: (nameOrId) =>
        file.parameters.find((p) =>
          typeof nameOrId === "number"
            ? p.id === nameOrId
            : p.name === nameOrId,
        ),
      defaultParameters: () =>
        createDefaultNormalizedParameters(
          file.fmxParameters,
          FMX_PARAMETER_SLOT_COUNT,
        ) as number[] & { length: typeof FMX_PARAMETER_SLOT_COUNT },
      asset,
    }
  }

  const resolveOwner = async (
    owner: string | undefined,
  ): Promise<string | undefined | Error> => {
    if (owner !== "me") {
      return owner
    }
    if (myUserName !== undefined) {
      return myUserName
    }
    const response = await auth.getWhoami({})
    if (response instanceof Error) {
      return new Error("could not find out who you are", { cause: response })
    }
    const userName = response.whoami?.userName ?? ""
    if (userName === "") {
      return new Error("you need to be logged in to search your own plugins")
    }
    myUserName = userName
    return userName
  }

  const search = async (
    options: PluginSearchOptions = {},
  ): Promise<NexusPluginInfo[] | Error> => {
    const ownerName = await resolveOwner(options.owner)
    if (ownerName instanceof Error) {
      return ownerName
    }
    const limit = options.limit ?? DEFAULT_SEARCH_LIMIT
    const filter = createSearchFilter(options, ownerName)
    const found: Plugin[] = []
    let pageToken = ""
    do {
      const response = await plugins.listPlugins({
        filter,
        orderBy: "plugin.num_favorites DESC",
        pageSize: SEARCH_PAGE_SIZE,
        pageToken,
      })
      if (response instanceof Error) {
        return new Error("could not search NXS plugins", { cause: response })
      }
      found.push(
        ...response.plugins.filter(
          (plugin) =>
            // The backend lists deleted and taken down plugins to their owner.
            plugin.takedownReason === PluginTakedownReason.UNSPECIFIED &&
            (options.query === undefined ||
              matchesQuery(plugin, options.query)),
        ),
      )
      pageToken = response.nextPageToken
    } while (pageToken !== "" && found.length < limit)
    return found.slice(0, limit).map(createPluginInfo)
  }

  const { upload, validate } = createPluginUploader({
    plugins,
    pluginAssets,
    operations,
    fetch,
    pollMs: uploadPollMs,
    get,
  })

  return { get, search, upload, validate }
}
