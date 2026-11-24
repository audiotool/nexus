import { Any } from "@bufbuild/protobuf"
import { Code, ConnectError, createRouterTransport } from "@connectrpc/connect"
import { AuthService } from "@gen/auth/v1/auth_service_connect"
import { OperationService } from "@gen/longrunning/v1/operation_connect"
import { Operation, Status } from "@gen/longrunning/v1/operation_pb"
import {
  PluginConvertInfo,
  PluginValidationInfo,
} from "@gen/plugin/event/v1/plugin_event_pb"
import {
  PluginAsset,
  PluginAssetTakedownReason,
} from "@gen/plugin/v1/plugin_asset_pb"
import { PluginAssetService } from "@gen/plugin/v1/plugin_asset_service_connect"
import { FmxPlugin, PluginMetadata } from "@gen/plugin/v1/plugin_metadata_pb"
import {
  Plugin,
  PluginTakedownReason,
  PluginType,
  PluginVisibility,
} from "@gen/plugin/v1/plugin_pb"
import { PluginService } from "@gen/plugin/v1/plugin_service_connect"
import type {
  ListPluginsRequest,
  UpdatePluginRequest,
} from "@gen/plugin/v1/plugin_service_pb"
import {
  ValidationError,
  ValidationReport,
  Violation,
} from "@gen/pluginvalidator/v1/plugin_validator_report_pb"
import { describe, expect, it, vi } from "vitest"
import type { KeepaliveTransport } from "../transport/types"
import { NexusDocument } from "@document/document"
import { createPluginUtil } from "./plugin-api"
import { computeFmxContentSha256 } from "./plugins/fmx-content-sha256"

const ok = async <T>(result: Promise<T | Error>) => {
  const value = await result
  if (value instanceof Error) {
    throw value
  }
  return value
}

const failure = async (result: Promise<unknown>) => {
  const value = await result
  expect(value).toBeInstanceOf(Error)
  return (value as Error).message
}

const PLUGIN = "plugins/vocoder"
const ASSET = "pluginAssets/vocoder-v2"
const OLD_ASSET = "pluginAssets/vocoder-v1"

const fmxFile = (params: unknown[]) =>
  JSON.stringify({
    version: "1.1.1",
    name: "Vocoder",
    type: "vst_effect",
    html: "",
    wasm: "",
    metadata: { params },
  })

const carrier = {
  id: 0,
  name: "Carrier",
  min: 0,
  max: 4,
  default: 1,
  step: 1,
  stepped: true,
  choices: ["Voice", "Chord", "Noise", "Ext In", "Notes"],
}
const gain = { id: 7, name: "Gain", min: -24, max: 24, default: 0, label: "dB" }

const asset = (name: string, overrides: Partial<PluginAsset> = {}) =>
  new PluginAsset({
    name,
    plugin: PLUGIN,
    metadataUrl: `https://cdn/${name}/metadata.binpb`,
    ...overrides,
  })

const setup = (
  props: {
    plugins?: Plugin[]
    assets?: PluginAsset[]
    files?: Record<string, string | Uint8Array<ArrayBuffer>>
    listPlugins?: (request: ListPluginsRequest) => {
      plugins: Plugin[]
      nextPageToken?: string
    }
    userName?: string
  } = {},
) => {
  const plugins = props.plugins ?? [
    new Plugin({ name: PLUGIN, displayName: "Vocoder", currentAsset: ASSET }),
  ]
  const assets = props.assets ?? [asset(ASSET), asset(OLD_ASSET)]
  const metadataFor = (name: string) =>
    new Uint8Array(
      new PluginMetadata({
        metadata: {
          case: "fmx",
          value: new FmxPlugin({
            fmxFileUrl: `https://cdn/${name}/plugin.fmx`,
          }),
        },
      }).toBinary(),
    )
  const files: Record<string, string | Uint8Array<ArrayBuffer>> =
    props.files ?? {
      [`https://cdn/${ASSET}/metadata.binpb`]: metadataFor(ASSET),
      [`https://cdn/${ASSET}/plugin.fmx`]: fmxFile([carrier, gain]),
      [`https://cdn/${OLD_ASSET}/metadata.binpb`]: metadataFor(OLD_ASSET),
      [`https://cdn/${OLD_ASSET}/plugin.fmx`]: fmxFile([carrier]),
    }

  const listRequests: ListPluginsRequest[] = []
  let whoamiCalls = 0
  const transport = createRouterTransport(({ service }) => {
    service(AuthService, {
      getWhoami: () => {
        whoamiCalls += 1
        return { whoami: { userName: props.userName ?? "" } }
      },
    })
    service(PluginService, {
      getPlugin: (request) => {
        const plugin = plugins.find((p) => p.name === request.name)
        if (plugin === undefined) {
          throw new ConnectError("no such plugin", Code.NotFound)
        }
        return { plugin }
      },
      listPlugins: (request) => {
        listRequests.push(request)
        return props.listPlugins?.(request) ?? { plugins, nextPageToken: "" }
      },
    })
    service(PluginAssetService, {
      getPluginAsset: (request) => {
        const pluginAsset = assets.find((a) => a.name === request.name)
        if (pluginAsset === undefined) {
          throw new ConnectError("no such asset", Code.NotFound)
        }
        return { pluginAsset }
      },
    })
  }) as KeepaliveTransport

  const fetch = vi.fn((input: RequestInfo | URL) => {
    const file = files[String(input)]
    return Promise.resolve(
      file === undefined
        ? new Response("not found", { status: 404 })
        : new Response(file),
    )
  })

  return {
    api: createPluginUtil(transport, fetch),
    fetch,
    listRequests,
    whoamiCalls: () => whoamiCalls,
  }
}

describe("PluginsAPI.get", () => {
  it("loads the current asset of a plugin and its parameters", async () => {
    const { api } = setup()
    const plugin = await ok(api.get(PLUGIN))
    expect(plugin).toMatchObject({
      name: PLUGIN,
      assetName: ASSET,
      displayName: "Vocoder",
      type: "effect",
    })
    expect(plugin.parameters.map((p) => p.name)).toEqual(["Carrier", "Gain"])
  })

  it("loads a specific asset", async () => {
    const { api } = setup()
    const plugin = await ok(api.get(OLD_ASSET))
    expect(plugin.name).toBe(PLUGIN)
    expect(plugin.assetName).toBe(OLD_ASSET)
    expect(plugin.parameters.map((p) => p.name)).toEqual(["Carrier"])
  })

  it("sets iconUrl only if the plugin has an icon", async () => {
    const withIcon = setup({
      plugins: [
        new Plugin({
          name: PLUGIN,
          currentAsset: ASSET,
          imageUrl: "https://cdn/icon.png",
        }),
      ],
    })
    expect((await ok(withIcon.api.get(PLUGIN))).iconUrl).toBe(
      "https://cdn/icon.png",
    )
    expect("iconUrl" in (await setup().api.get(PLUGIN))).toBe(false)
  })

  it("puts the normalized defaults into the parameter slots", async () => {
    const { api } = setup()
    const defaults = (await ok(api.get(PLUGIN))).defaultParameters()
    expect(defaults).toHaveLength(1024)
    expect(defaults[0]).toBe(0.25)
    expect(defaults[7]).toBe(0.5)
    expect(defaults.filter((v) => v !== 0)).toHaveLength(2)
  })

  it("finds parameters by name or id, and returns undefined for unknown ones", async () => {
    const plugin = await ok(setup().api.get(PLUGIN))
    expect(plugin.parameter("Gain")?.id).toBe(7)
    expect(plugin.parameter(7)?.name).toBe("Gain")
    expect(plugin.parameter("Cutoff")).toBeUndefined()
    expect(plugin.parameter(3)).toBeUndefined()
  })

  it("converts parameter values", async () => {
    const plugin = await ok(setup().api.get(PLUGIN))
    const carrierParameter = plugin.parameter("Carrier")
    expect(carrierParameter?.normalize("chord")).toBe(0.25)
    expect(carrierParameter?.normalize(2)).toBe(0.5)
    expect(carrierParameter?.format(Math.fround(0.25))).toBe("Chord")
    expect(carrierParameter?.denormalize(Math.fround(0.75))).toBe(3)
    expect(carrierParameter?.normalize("Piano")).toBeUndefined()

    const gainParameter = plugin.parameter("Gain")
    expect(gainParameter?.normalize(100)).toBe(1)
    expect(gainParameter?.normalize("-12 dB")).toBe(0.25)
    expect(gainParameter?.normalize("loud")).toBeUndefined()
    expect(gainParameter?.format(0.75)).toBe("12.00 dB")
  })

  it("loads the version an fmx device runs", async () => {
    const nexus = new NexusDocument()
    await nexus.takeTransactions()
    const device = await nexus.modify((t) =>
      t.create("fmxDevice", { pluginAssetName: OLD_ASSET }),
    )
    const plugin = await ok(setup().api.get(device))
    expect(plugin.assetName).toBe(OLD_ASSET)
    expect(plugin.parameters.map((p) => p.name)).toEqual(["Carrier"])
  })

  it("downloads the file again after a failed download", async () => {
    const { api, fetch } = setup()
    fetch.mockImplementationOnce(() =>
      Promise.resolve(
        new Response(
          new ReadableStream({
            start: (controller) => controller.error(new Error("reset")),
          }),
        ),
      ),
    )
    expect(await failure(api.get(PLUGIN))).toMatch(/could not download/)
    expect((await ok(api.get(PLUGIN))).parameters).toHaveLength(2)
  })

  it("downloads the file of a version only once while it's in use", async () => {
    const { api, fetch } = setup()
    const [first, second] = await Promise.all([
      ok(api.get(PLUGIN)),
      ok(api.get(PLUGIN)),
    ])
    const third = await ok(api.get(ASSET))
    expect(fetch).toHaveBeenCalledTimes(2)
    expect(second.parameters).toBe(first.parameters)
    expect(third.parameters).toBe(first.parameters)
  })

  it("loads the plugin's current metadata even if the file is cached", async () => {
    const plugin = new Plugin({
      name: PLUGIN,
      displayName: "Vocoder",
      currentAsset: ASSET,
    })
    const { api } = setup({ plugins: [plugin] })
    await ok(api.get(PLUGIN))
    plugin.displayName = "Vocoder 2"
    expect((await ok(api.get(PLUGIN))).displayName).toBe("Vocoder 2")
  })

  it("throws for a plugin without a current asset", async () => {
    const { api } = setup({
      plugins: [new Plugin({ name: PLUGIN, currentAsset: "" })],
    })
    expect(await failure(api.get(PLUGIN))).toMatch(/has no file yet/)
  })

  it("throws for a taken-down asset", async () => {
    const { api } = setup({
      assets: [
        asset(ASSET, {
          metadataUrl: "",
          takedownReason: PluginAssetTakedownReason.COPYRIGHT,
        }),
      ],
    })
    expect(await failure(api.get(ASSET))).toMatch(/is unavailable/)
  })

  it("throws for an asset that has no file yet", async () => {
    const { api } = setup({ assets: [asset(ASSET, { metadataUrl: "" })] })
    expect(await failure(api.get(ASSET))).toMatch(/has no file yet/)
  })

  it("throws for a plugin that doesn't exist", async () => {
    expect(await failure(setup().api.get("plugins/missing"))).toMatch(
      /could not get NXS plugin/,
    )
  })

  it("throws if a file can't be downloaded", async () => {
    const { api } = setup({ files: {} })
    expect(await failure(api.get(PLUGIN))).toMatch(/could not download/)
  })

  it("throws for local plugins and unknown names without calling the backend", async () => {
    const { api, fetch } = setup()
    expect(await failure(api.get("localPluginAssets/abc"))).toMatch(
      /loaded locally/,
    )
    expect(await failure(api.get("abc"))).toMatch(/expected a name like/)
    expect(fetch).not.toHaveBeenCalled()
  })
})

describe("PluginsAPI.search", () => {
  const plugin = (name: string, overrides: Partial<Plugin> = {}) =>
    new Plugin({ name, displayName: name, currentAsset: "x", ...overrides })

  it("only lists usable plugins, most favorited first", async () => {
    const { api, listRequests } = setup()
    await ok(api.search())
    expect(listRequests[0]).toMatchObject({
      filter: "(plugin.current_asset != '')",
      orderBy: "plugin.num_favorites DESC",
    })
  })

  it("filters by type and owner on the backend", async () => {
    const { api, listRequests } = setup()
    await ok(api.search({ type: "instrument", owner: "users/me" }))
    expect(listRequests[0].filter).toBe(
      "(plugin.owner_name == 'users/me') && (plugin.type == 'PLUGIN_TYPE_INSTRUMENT')",
    )
  })

  it("searches your own plugins with owner: me", async () => {
    const { api, listRequests, whoamiCalls } = setup({
      userName: "users/silas",
    })
    await ok(api.search({ owner: "me" }))
    await ok(api.search({ owner: "me" }))
    expect(listRequests[0].filter).toBe("(plugin.owner_name == 'users/silas')")
    expect(whoamiCalls()).toBe(1)
  })

  it("returns an Error for owner: me when you aren't logged in", async () => {
    expect(await failure(setup().api.search({ owner: "me" }))).toMatch(
      /logged in/,
    )
  })

  it("quotes the owner in the filter", async () => {
    const { api, listRequests } = setup()
    await ok(api.search({ owner: "users/o'brien" }))
    expect(listRequests[0].filter).toBe(
      "(plugin.owner_name == 'users/o\\'brien')",
    )
  })

  it("skips deleted and taken down plugins", async () => {
    const { api } = setup({
      listPlugins: () => ({
        plugins: [
          plugin("plugins/a"),
          plugin("plugins/b", { takedownReason: PluginTakedownReason.BY_USER }),
          plugin("plugins/c", {
            takedownReason: PluginTakedownReason.COPYRIGHT,
          }),
        ],
      }),
    })
    const found = await ok(api.search({ owner: "users/silas" }))
    expect(found.map((p) => p.name)).toEqual(["plugins/a"])
  })

  it("returns the plugins in the same shape as get", async () => {
    const { api } = setup({
      listPlugins: () => ({
        plugins: [
          plugin("plugins/a", {
            imageUrl: "https://cdn/icon.png",
            type: PluginType.INSTRUMENT,
            visibility: PluginVisibility.PUBLIC,
            ownerName: "users/silas",
            numFavorites: 3,
          }),
          plugin("plugins/b", { currentAsset: "" }),
        ],
      }),
    })
    const [withEverything, withoutFile] = await ok(api.search())
    expect(withEverything).toMatchObject({
      name: "plugins/a",
      iconUrl: "https://cdn/icon.png",
      type: "instrument",
      visibility: "public",
      ownerName: "users/silas",
      currentAssetName: "x",
      numFavorites: 3,
    })
    expect(withoutFile.visibility).toBe("unlisted")
    expect("iconUrl" in withoutFile).toBe(false)
    expect("type" in withoutFile).toBe(false)
    expect("currentAssetName" in withoutFile).toBe(false)
  })

  it("matches every query word in the name, description, or tags", async () => {
    const { api } = setup({
      listPlugins: () => ({
        plugins: [
          plugin("Vocoder", { description: "makes a synth talk" }),
          plugin("Talkbox", { tags: ["vocals"] }),
          plugin("Reverb"),
        ],
      }),
    })
    const names = async (query: string) =>
      (await ok(api.search({ query }))).map((p) => p.displayName)
    expect(await names("TALK")).toEqual(["Vocoder", "Talkbox"])
    expect(await names("synth talk")).toEqual(["Vocoder"])
    expect(await names("vocal")).toEqual(["Talkbox"])
  })

  it("pages until it has enough matches", async () => {
    const pages = [
      { plugins: [plugin("a1"), plugin("b1")], nextPageToken: "2" },
      { plugins: [plugin("a2"), plugin("b2")], nextPageToken: "3" },
      { plugins: [plugin("a3")], nextPageToken: "" },
    ]
    const { api, listRequests } = setup({
      listPlugins: (request) => pages[Number(request.pageToken || "1") - 1],
    })
    const found = await ok(api.search({ query: "a", limit: 2 }))
    expect(found.map((p) => p.name)).toEqual(["a1", "a2"])
    expect(listRequests).toHaveLength(2)
  })
})

describe("PluginsAPI.upload", () => {
  const UPLOAD_URL = "https://upload/new"

  const setupUpload = (
    props: {
      violations?: Violation[]
      reusedAsset?: string
      reusedAssetPlugin?: string
      uploadStatus?: number
      pendingChecks?: number
      onUpload?: () => void
      onCreatePlugin?: () => void
    } = {},
  ) => {
    const plugins = new Map([
      [
        PLUGIN,
        new Plugin({
          name: PLUGIN,
          displayName: "Vocoder",
          currentAsset: OLD_ASSET,
        }),
      ],
    ])
    const assets = new Map([[OLD_ASSET, asset(OLD_ASSET)]])
    const files: Record<string, string | Uint8Array<ArrayBuffer>> = {}
    const addFiles = (name: string, fmx: string | Uint8Array<ArrayBuffer>) => {
      files[`https://cdn/${name}/metadata.binpb`] = new Uint8Array(
        new PluginMetadata({
          metadata: {
            case: "fmx",
            value: new FmxPlugin({
              fmxFileUrl: `https://cdn/${name}/plugin.fmx`,
            }),
          },
        }).toBinary(),
      )
      files[`https://cdn/${name}/plugin.fmx`] = fmx
    }
    addFiles(OLD_ASSET, fmxFile([carrier]))

    const created: Plugin[] = []
    const updates: UpdatePluginRequest[] = []
    const deleted: string[] = []
    const cancelled: string[] = []
    const uploads: RequestInit[] = []
    let pendingChecks = props.pendingChecks ?? 0
    let finishedOperation = new Operation()

    const transport = createRouterTransport(({ service }) => {
      service(PluginService, {
        getPlugin: (request) => ({ plugin: plugins.get(request.name) }),
        createPlugin: (request) => {
          props.onCreatePlugin?.()
          const plugin = new Plugin({ ...request.plugin, name: "plugins/new" })
          created.push(plugin)
          plugins.set(plugin.name, plugin)
          return { plugin }
        },
        updatePlugin: (request) => {
          const current = assets.get(request.plugin?.currentAsset ?? "")
          if (current?.plugin !== request.plugin?.name) {
            throw new ConnectError(
              "current asset must be a processed asset of the plugin",
              Code.FailedPrecondition,
            )
          }
          updates.push(request)
          return { plugin: request.plugin }
        },
        deletePlugin: (request) => {
          deleted.push(request.name)
          return {}
        },
      })
      service(PluginAssetService, {
        getPluginAsset: (request) => ({
          pluginAsset: assets.get(request.name),
        }),
        createPluginAsset: (request) => ({
          pluginAsset: new PluginAsset({
            name: "pluginAssets/new",
            plugin: request.plugin,
          }),
          uploadEndpoint: { uploadUrl: UPLOAD_URL, headers: { "x-sig": "1" } },
        }),
        cancelPluginAssetUpload: (request) => {
          cancelled.push(request.name)
          return {}
        },
        uploadPluginAssetFinished: (request) => {
          if (props.violations !== undefined) {
            finishedOperation = new Operation({
              name: "operations/1",
              done: true,
              metadata: Any.pack(
                new PluginConvertInfo({
                  report: new ValidationReport({
                    violations: props.violations,
                  }),
                }),
              ),
              result: {
                case: "error",
                value: new Status({ message: "invalid" }),
              },
            })
          } else {
            const name = props.reusedAsset ?? request.name
            const uploadedAsset = asset(name, {
              plugin: props.reusedAssetPlugin ?? created[0]?.name ?? PLUGIN,
            })
            assets.set(name, uploadedAsset)
            addFiles(name, uploads[0].body as Uint8Array<ArrayBuffer>)
            finishedOperation = new Operation({
              name: "operations/1",
              done: true,
              result: { case: "response", value: Any.pack(uploadedAsset) },
            })
          }
          return pendingChecks > 0
            ? new Operation({ name: "operations/1" })
            : finishedOperation
        },
      })
      service(OperationService, {
        getOperation: () => {
          pendingChecks -= 1
          return {
            operation:
              pendingChecks > 0
                ? new Operation({ name: "operations/1" })
                : finishedOperation,
          }
        },
      })
    }) as KeepaliveTransport

    const fetch = vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
      if (String(input) === UPLOAD_URL) {
        uploads.push(init ?? {})
        props.onUpload?.()
        return Promise.resolve(
          new Response(null, { status: props.uploadStatus ?? 200 }),
        )
      }
      const file = files[String(input)]
      return Promise.resolve(
        file === undefined
          ? new Response("not found", { status: 404 })
          : new Response(file),
      )
    })

    return {
      api: createPluginUtil(transport, fetch, 0),
      created,
      updates,
      deleted,
      cancelled,
      uploads,
    }
  }

  const file = new TextEncoder().encode(fmxFile([carrier, gain]))

  it("creates an unlisted plugin named like the file, and makes the file current", async () => {
    const { api, created, updates, uploads, deleted } = setupUpload()
    const plugin = await ok(api.upload({ file }))

    expect(created).toHaveLength(1)
    expect(created[0]).toMatchObject({
      displayName: "Vocoder",
      visibility: PluginVisibility.UNLISTED,
    })
    expect(uploads[0]).toMatchObject({
      method: "PUT",
      headers: { "x-sig": "1" },
    })
    expect(updates[0].updateMask?.paths).toEqual(["current_asset"])
    expect(updates[0].plugin?.currentAsset).toBe("pluginAssets/new")
    expect(plugin).toMatchObject({
      name: "plugins/new",
      assetName: "pluginAssets/new",
      type: "effect",
    })
    expect(plugin.parameters.map((p) => p.name)).toEqual(["Carrier", "Gain"])
    expect(deleted).toEqual([])
  })

  it("uploads a new version of an existing plugin, and updates the given fields", async () => {
    const { api, created, updates } = setupUpload()
    const plugin = await ok(
      api.upload({
        file: new Blob([file]),
        plugin: PLUGIN,
        displayName: "Vocoder 2",
        visibility: "public",
      }),
    )

    expect(created).toEqual([])
    expect(updates[0].updateMask?.paths).toEqual([
      "current_asset",
      "display_name",
      "visibility",
    ])
    expect(updates[0].plugin).toMatchObject({
      name: PLUGIN,
      currentAsset: "pluginAssets/new",
      displayName: "Vocoder 2",
      visibility: PluginVisibility.PUBLIC,
    })
    expect(plugin.assetName).toBe("pluginAssets/new")
  })

  it("waits until the backend has checked the file", async () => {
    const { api } = setupUpload({ pendingChecks: 3 })
    expect((await ok(api.upload({ file }))).assetName).toBe("pluginAssets/new")
  })

  it("returns the existing version if the same file was uploaded before", async () => {
    const { api, updates } = setupUpload({
      reusedAsset: "pluginAssets/earlier",
    })
    const plugin = await ok(api.upload({ file, plugin: PLUGIN }))
    expect(plugin.assetName).toBe("pluginAssets/earlier")
    expect(updates[0].plugin?.currentAsset).toBe("pluginAssets/earlier")
  })

  it("throws with the broken rules, and deletes the new plugin", async () => {
    const { api, deleted, updates } = setupUpload({
      violations: [
        new Violation({
          field: "metadata.params[0]",
          description: "needs a name",
        }),
        new Violation({ description: "the wasm module is missing" }),
      ],
    })
    expect(await failure(api.upload({ file }))).toMatch(
      [
        "the backend rejected the .fmx file, it breaks 2 plugin rule(s):",
        "- metadata.params[0]: needs a name",
        "- the wasm module is missing",
      ].join("\n"),
    )
    expect(deleted).toEqual(["plugins/new"])
    expect(updates).toEqual([])
  })

  it("cancels the upload if the file can't be uploaded", async () => {
    const { api, cancelled, deleted } = setupUpload({ uploadStatus: 403 })
    expect(await failure(api.upload({ file, plugin: PLUGIN }))).toMatch(
      "uploading the .fmx file failed",
    )
    expect(cancelled).toEqual(["pluginAssets/new"])
    expect(deleted).toEqual([])
  })

  it("throws for a file that isn't an .fmx file, without calling the backend", async () => {
    const { api, created, uploads } = setupUpload()
    expect(
      await failure(api.upload({ file: new TextEncoder().encode("not json") })),
    ).toMatch("not a valid .fmx file")
    expect(created).toEqual([])
    expect(uploads).toEqual([])
  })

  it("explains that a file can't be used by two plugins", async () => {
    const { api, deleted } = setupUpload({
      reusedAsset: "pluginAssets/earlier",
      reusedAssetPlugin: "plugins/other",
    })
    expect(await failure(api.upload({ file }))).toMatch(
      /already uploaded this file to NXS plugin plugins\/other/,
    )
    expect(deleted).toEqual(["plugins/new"])
  })

  it("stops when the signal is aborted, and removes the new plugin", async () => {
    const controller = new AbortController()
    const { api, cancelled, deleted, updates } = setupUpload({
      onUpload: () => controller.abort(),
    })
    expect(await failure(api.upload({ file }, controller.signal))).toBe(
      "cancelled",
    )
    expect(cancelled).toEqual(["pluginAssets/new"])
    expect(deleted).toEqual(["plugins/new"])
    expect(updates).toEqual([])
  })

  it("removes a plugin the backend created while the signal was aborted", async () => {
    const controller = new AbortController()
    const { api, deleted, uploads } = setupUpload({
      onCreatePlugin: () => controller.abort(),
    })
    expect(await failure(api.upload({ file }, controller.signal))).toBe(
      "cancelled",
    )
    expect(deleted).toEqual(["plugins/new"])
    expect(uploads).toEqual([])
  })

  it("does nothing if the signal is already aborted", async () => {
    const { api, created, uploads } = setupUpload()
    expect(await failure(api.upload({ file }, AbortSignal.abort()))).toBe(
      "cancelled",
    )
    expect(created).toEqual([])
    expect(uploads).toEqual([])
  })
})

describe("PluginsAPI.validate", () => {
  const UPLOAD_URL = "https://upload/new"
  const file = new TextEncoder().encode(fmxFile([carrier, gain]))

  const setupValidate = (
    props: {
      ownedAsset?: string
      violations?: Violation[]
      error?: ValidationError
    } = {},
  ) => {
    const validated: string[] = []
    const uploads: RequestInit[] = []
    const transport = createRouterTransport(({ service }) => {
      service(PluginService, {
        validatePlugin: (request) => {
          validated.push(request.sha256)
          return props.ownedAsset !== undefined
            ? { pluginAsset: props.ownedAsset }
            : { uploadEndpoint: { uploadUrl: UPLOAD_URL, headers: {} } }
        },
        submitPluginToValidator: () =>
          new Operation({
            name: "operations/validate",
            done: true,
            metadata: Any.pack(
              new PluginValidationInfo({
                report: new ValidationReport({
                  violations: props.violations ?? [],
                  error: props.error ?? ValidationError.NONE,
                }),
              }),
            ),
            result: { case: "response", value: new Any() },
          }),
      })
    }) as KeepaliveTransport
    const fetch = vi.fn((_input: RequestInfo | URL, init?: RequestInit) => {
      uploads.push(init ?? {})
      return Promise.resolve(new Response(null, { status: 200 }))
    })
    return { api: createPluginUtil(transport, fetch, 0), validated, uploads }
  }

  it("returns valid for a file the backend accepts", async () => {
    const { api, validated, uploads } = setupValidate()
    expect(await ok(api.validate(file))).toEqual({
      valid: true,
      violations: [],
    })
    expect(validated).toEqual([await computeFmxContentSha256(file)])
    expect(uploads).toHaveLength(1)
  })

  it("returns the rules a file breaks", async () => {
    const { api } = setupValidate({
      violations: [
        new Violation({
          field: "metadata.params[0].default",
          description: "must be in [-60, 12], got 13",
        }),
      ],
    })
    expect(await ok(api.validate(file))).toEqual({
      valid: false,
      violations: [
        {
          field: "metadata.params[0].default",
          description: "must be in [-60, 12], got 13",
        },
      ],
    })
  })

  it("doesn't upload a file you uploaded before", async () => {
    const { api, uploads } = setupValidate({ ownedAsset: "pluginAssets/old" })
    expect(await ok(api.validate(file))).toEqual({
      valid: true,
      violations: [],
      uploadedAs: "pluginAssets/old",
    })
    expect(uploads).toEqual([])
  })

  it("returns an Error if the validator fails", async () => {
    const { api } = setupValidate({
      error: ValidationError.SHA256_MISMATCHED,
    })
    expect(await failure(api.validate(file))).toMatch(/SHA256_MISMATCHED/)
  })
})
