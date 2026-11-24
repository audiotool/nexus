import { FieldMask } from "@bufbuild/protobuf"
import { OperationService } from "@gen/longrunning/v1/operation_connect"
import type { Operation } from "@gen/longrunning/v1/operation_pb"
import {
  PluginConvertInfo,
  PluginValidationInfo,
} from "@gen/plugin/event/v1/plugin_event_pb"
import { PluginAsset } from "@gen/plugin/v1/plugin_asset_pb"
import { PluginAssetService } from "@gen/plugin/v1/plugin_asset_service_connect"
import type { PluginUploadEndpoint } from "@gen/plugin/v1/plugin_asset_service_pb"
import { Plugin, PluginVisibility } from "@gen/plugin/v1/plugin_pb"
import { PluginService } from "@gen/plugin/v1/plugin_service_connect"
import { PluginValidationType } from "@gen/plugin/v1/plugin_service_pb"
import {
  ValidationError,
  type Violation,
} from "@gen/pluginvalidator/v1/plugin_validator_report_pb"
import type { NeverThrowingFetch } from "@utils/fetch/never-throwing-fetch"
import type { RetryingClient } from "@utils/grpc/retrying-client"
import { sleep } from "@utils/lang"
import type {
  NexusPlugin,
  NexusPluginValidation,
  NexusPluginVisibility,
  PluginUploadOptions,
} from "../plugin-api"
import { computeFmxContentSha256 } from "./fmx-content-sha256"
import { parseFmxDocument } from "./fmx-parameters"

const OPERATION_TIMEOUT_MS = 120_000
/** Rule violations listed in the error of a rejected upload. The rest are only counted. */
const LISTED_VIOLATION_COUNT = 20

/** @internal */
export const toBackendVisibility = (
  visibility: NexusPluginVisibility,
): PluginVisibility => {
  switch (visibility) {
    case "public":
      return PluginVisibility.PUBLIC
    case "unlisted":
      return PluginVisibility.UNLISTED
    default: {
      const unhandled: never = visibility
      throw new Error(`unknown visibility ${String(unhandled)}`)
    }
  }
}

const toBytes = async (
  file: PluginUploadOptions["file"],
): Promise<Uint8Array<ArrayBuffer>> => {
  if (file instanceof ArrayBuffer) {
    return new Uint8Array(file)
  }
  if (file instanceof Uint8Array) {
    return new Uint8Array(file)
  }
  return new Uint8Array(await file.arrayBuffer())
}

const cancelled = () => new Error("cancelled")

const isAborted = (signal: AbortSignal | undefined) => signal?.aborted === true

const describeRejection = (violations: Violation[], message: string) => {
  if (violations.length === 0) {
    return `the backend rejected the .fmx file: ${message}`
  }
  const listed = violations
    .slice(0, LISTED_VIOLATION_COUNT)
    .map(({ field, description }) =>
      field === "" ? `- ${description}` : `- ${field}: ${description}`,
    )
  const unlisted = violations.length - listed.length
  return [
    `the backend rejected the .fmx file, it breaks ${violations.length} plugin rule(s):`,
    ...listed,
    ...(unlisted > 0 ? [`and ${unlisted} more`] : []),
  ].join("\n")
}

/** @internal */
export const createPluginUploader = ({
  plugins,
  pluginAssets,
  operations,
  fetch,
  pollMs,
  get,
}: {
  plugins: RetryingClient<typeof PluginService>
  pluginAssets: RetryingClient<typeof PluginAssetService>
  operations: RetryingClient<typeof OperationService>
  fetch: NeverThrowingFetch
  pollMs: number
  get: (name: string) => Promise<NexusPlugin | Error>
}) => {
  const waitForOperation = async (
    started: Operation,
    signal: AbortSignal | undefined,
  ): Promise<Operation | Error> => {
    const deadline = Date.now() + OPERATION_TIMEOUT_MS
    let operation = started
    while (!operation.done) {
      if (Date.now() > deadline) {
        return new Error("the backend took too long to check the .fmx file")
      }
      await sleep(pollMs, signal)
      if (isAborted(signal)) {
        return cancelled()
      }
      const response = await operations.getOperation(
        { name: operation.name },
        { signal },
      )
      if (response instanceof Error) {
        return new Error("could not check the progress of the backend", {
          cause: response,
        })
      }
      if (response.operation === undefined) {
        return new Error("the backend returned no progress")
      }
      operation = response.operation
    }
    return operation
  }

  const put = async (
    endpoint: PluginUploadEndpoint,
    bytes: Uint8Array<ArrayBuffer>,
    signal: AbortSignal | undefined,
  ): Promise<undefined | Error> => {
    const response = await fetch(endpoint.uploadUrl, {
      method: "PUT",
      headers: endpoint.headers,
      body: bytes,
      credentials: "omit",
      signal,
    })
    if (isAborted(signal)) {
      return cancelled()
    }
    if (response instanceof Error) {
      return new Error("uploading the .fmx file failed", { cause: response })
    }
    if (!response.ok) {
      return new Error(
        `uploading the .fmx file failed with status ${response.status}`,
      )
    }
    return undefined
  }

  const createPlugin = async (
    props: Pick<Plugin, "displayName" | "description" | "tags">,
  ): Promise<string | Error> => {
    const response = await plugins.createPlugin({
      // The backend rejects an unspecified visibility, and ignores any other
      // value on creation.
      plugin: new Plugin({ ...props, visibility: PluginVisibility.UNLISTED }),
    })
    if (response instanceof Error) {
      return new Error("could not create the NXS plugin", { cause: response })
    }
    if (response.plugin === undefined || response.plugin.name === "") {
      return new Error("the backend returned no plugin")
    }
    return response.plugin.name
  }

  /** Uploads the file as an asset of `plugin`, and returns the asset's name. */
  const uploadAsset = async (
    plugin: string,
    bytes: Uint8Array<ArrayBuffer>,
    signal: AbortSignal | undefined,
  ): Promise<string | Error> => {
    // Not aborted, so that an asset the backend created can be cancelled.
    const created = await pluginAssets.createPluginAsset({ plugin })
    if (created instanceof Error) {
      return new Error(`could not upload a file to NXS plugin ${plugin}`, {
        cause: created,
      })
    }
    const name = created.pluginAsset?.name ?? ""
    if (name === "" || created.uploadEndpoint === undefined) {
      return new Error("the backend returned no upload endpoint")
    }
    const uploaded = await put(created.uploadEndpoint, bytes, signal)
    if (uploaded instanceof Error) {
      await pluginAssets.cancelPluginAssetUpload({ name })
      return uploaded
    }
    const started = await pluginAssets.uploadPluginAssetFinished(
      { name },
      { signal },
    )
    if (started instanceof Error) {
      return new Error("could not finish the upload", { cause: started })
    }
    // The backend processes the file even if the caller stops waiting.
    const operation = await waitForOperation(started, signal)
    if (operation instanceof Error) {
      return operation
    }
    switch (operation.result.case) {
      case "error": {
        const info = new PluginConvertInfo()
        const violations =
          operation.metadata?.unpackTo(info) === true
            ? (info.report?.violations ?? [])
            : []
        return new Error(
          describeRejection(violations, operation.result.value.message),
        )
      }
      case "response": {
        // If the same file was uploaded before, this is the existing asset.
        const asset = new PluginAsset()
        if (!operation.result.value.unpackTo(asset) || asset.name === "") {
          return new Error("the backend returned no plugin asset")
        }
        return asset.name
      }
      case undefined:
        return new Error("the upload finished without a result")
      default: {
        const unhandled: never = operation.result
        return new Error(`unknown upload result ${String(unhandled)}`)
      }
    }
  }

  const makeCurrent = async (
    pluginName: string,
    assetName: string,
    options: PluginUploadOptions,
    isNewPlugin: boolean,
  ): Promise<undefined | Error> => {
    const { displayName, description, tags, visibility } = options
    const paths = [
      "current_asset",
      ...(!isNewPlugin && displayName !== undefined ? ["display_name"] : []),
      ...(!isNewPlugin && description !== undefined ? ["description"] : []),
      ...(!isNewPlugin && tags !== undefined ? ["tags"] : []),
      ...(visibility !== undefined ? ["visibility"] : []),
    ]
    const updated = await plugins.updatePlugin({
      plugin: new Plugin({
        name: pluginName,
        currentAsset: assetName,
        displayName,
        description,
        tags,
        visibility:
          visibility === undefined
            ? undefined
            : toBackendVisibility(visibility),
      }),
      updateMask: new FieldMask({ paths }),
    })
    return updated instanceof Error
      ? new Error(
          `could not make the uploaded file the current version of NXS plugin ${pluginName}`,
          { cause: updated },
        )
      : undefined
  }

  /**
   * The backend reuses a file you uploaded before, even for another plugin,
   * but only lets a plugin use its own files.
   */
  const explainForeignAsset = async (
    pluginName: string,
    assetName: string,
    error: Error,
  ): Promise<Error> => {
    const response = await pluginAssets.getPluginAsset({ name: assetName })
    const owner =
      response instanceof Error ? undefined : response.pluginAsset?.plugin
    if (owner === undefined || owner === "" || owner === pluginName) {
      return error
    }
    return new Error(
      `you already uploaded this file to NXS plugin ${owner}, and a file can only belong to one plugin. Only a change to the DSP module, the interface, or the parameters makes it a different file.`,
      { cause: error },
    )
  }

  const uploadPlugin = async (
    options: PluginUploadOptions,
    signal: AbortSignal | undefined,
  ): Promise<NexusPlugin | Error> => {
    if (isAborted(signal)) {
      return cancelled()
    }
    const bytes = await toBytes(options.file)
    const document = parseFmxDocument(bytes)
    if (document instanceof Error) {
      return new Error("not a valid .fmx file", { cause: document })
    }

    const isNewPlugin = options.plugin === undefined
    const pluginName =
      options.plugin ??
      // Not aborted, so that a plugin the backend created can be deleted.
      (await createPlugin({
        displayName: options.displayName ?? document.name,
        description: options.description ?? "",
        tags: options.tags ?? [],
      }))
    if (pluginName instanceof Error) {
      return pluginName
    }

    const fail = async (error: Error) => {
      if (isNewPlugin) {
        await plugins.deletePlugin({ name: pluginName })
      }
      return error
    }
    if (isAborted(signal)) {
      return fail(cancelled())
    }
    const assetName = await uploadAsset(pluginName, bytes, signal)
    if (assetName instanceof Error) {
      return fail(assetName)
    }
    if (isAborted(signal)) {
      return fail(cancelled())
    }
    const updated = await makeCurrent(
      pluginName,
      assetName,
      options,
      isNewPlugin,
    )
    if (updated instanceof Error) {
      return fail(await explainForeignAsset(pluginName, assetName, updated))
    }
    return get(assetName)
  }

  const validateFile = async (
    file: PluginUploadOptions["file"],
    signal: AbortSignal | undefined,
  ): Promise<NexusPluginValidation | Error> => {
    if (isAborted(signal)) {
      return cancelled()
    }
    const bytes = await toBytes(file)
    const sha256 = await computeFmxContentSha256(bytes)
    const checked = await plugins.validatePlugin(
      { sha256, validationType: PluginValidationType.VALIDATE_PLUGIN },
      { signal },
    )
    if (checked instanceof Error) {
      return new Error("could not validate the .fmx file", { cause: checked })
    }
    // A file that became an asset was valid when it was uploaded.
    if (checked.pluginAsset !== "") {
      return { valid: true, violations: [], uploadedAs: checked.pluginAsset }
    }
    if (checked.uploadEndpoint === undefined) {
      return new Error("the backend returned no upload endpoint")
    }
    const uploaded = await put(checked.uploadEndpoint, bytes, signal)
    if (uploaded instanceof Error) {
      return uploaded
    }
    const started = await plugins.submitPluginToValidator(
      { sha256 },
      { signal },
    )
    if (started instanceof Error) {
      return new Error("could not validate the .fmx file", { cause: started })
    }
    const operation = await waitForOperation(started, signal)
    if (operation instanceof Error) {
      return operation
    }
    if (operation.result.case === "error") {
      return new Error(
        `could not validate the .fmx file: ${operation.result.value.message}`,
      )
    }
    const info = new PluginValidationInfo()
    if (operation.metadata?.unpackTo(info) !== true || !info.report) {
      return new Error("the backend returned no validation report")
    }
    const { report } = info
    if (
      report.error !== ValidationError.NONE &&
      report.error !== ValidationError.UNSPECIFIED
    ) {
      return new Error(
        `could not validate the .fmx file: ${ValidationError[report.error]}`,
      )
    }
    return {
      valid: report.violations.length === 0,
      violations: report.violations.map(({ field, description }) => ({
        field,
        description,
      })),
    }
  }

  const orCancelled = <T>(
    result: T | Error,
    signal: AbortSignal | undefined,
  ): T | Error =>
    result instanceof Error && isAborted(signal) ? cancelled() : result

  return {
    upload: async (options: PluginUploadOptions, signal?: AbortSignal) =>
      orCancelled(await uploadPlugin(options, signal), signal),
    validate: async (file: PluginUploadOptions["file"], signal?: AbortSignal) =>
      orCancelled(await validateFile(file, signal), signal),
  }
}
