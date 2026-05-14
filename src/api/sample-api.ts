import { NexusEntity } from "@document/entity"
import {
  Sample,
  SampleClearance,
  SampleType,
  SampleUsage,
} from "@gen/sample/v1/sample_pb"
import { SampleService } from "@gen/sample/v1/sample_service_connect"
import { extractUuid } from "@utils/extract-uuid"
import { neverThrowingFetch } from "@utils/fetch/never-throwing-fetch"
import { createRetryingPromiseClient } from "@utils/grpc/retrying-client"
import type { KeepaliveTransport } from "../transport/types"
import { createSampleDataListener } from "./samples/sample-data-listener"

/**
 * The type of sample - either a one-shot sound or a looping pattern.
 */
export type SampleKind = "one-shot" | "loop"

/**
 * Controls the visibility and discoverability of a sample.
 * - `"public"`: Sample appears in search results and listings.
 * - `"unlisted"`: Sample can be accessed via direct link but is hidden from search.
 */
export type SampleVisibility = "public" | "unlisted"

/**
 * The audio format to download.
 * - `"flac"`: Lossless FLAC format (recommended - same quality as WAV, smaller size)
 * - `"wav"`: Uncompressed WAV format (use if FLAC decoding not available)
 * - `"mp3"`: Compressed MP3 format
 * - `"preview"`: Low-quality MP3 preview
 */
export type SampleFormat = "flac" | "wav" | "mp3" | "preview"

/**
 * Resolution (number of peak values) for waveform visualization data.
 * Higher values give a more detailed curve.
 */
export type WaveformResolution = 3840 | 1920 | 480

/**
 * Channel selection for waveform visualization data.
 * - `"both"`: combined left + right (mono summary)
 * - `"left"` / `"right"`: per-channel curve for stereo samples
 */
export type WaveformChannel = "both" | "left" | "right"

/**
 * Options for {@link SampleMeta.getWaveformUrl}.
 */
export type WaveformUrlOptions = {
  /**
   * Resolution (number of peak values).
   * @default 1920
   */
  resolution?: WaveformResolution

  /**
   * Channel selection.
   * @default "both"
   */
  channel?: WaveformChannel
}

/**
 * Metadata available immediately after creating a sample, before the file upload
 * and server-side processing complete. This contains all user-provided fields
 * plus server-assigned identifiers.
 *
 * Note: Download URLs are not available at this stage - use {@link SampleMeta}
 * after `upload.ready` resolves.
 */
export type SamplePending = {
  /** Unique identifier in the form `samples/{uuid}`. */
  readonly name: string

  /** Human-readable name for the sample. */
  readonly displayName: string

  /** Optional description of the sample. */
  readonly description: string

  /** Owner identifier in the form `users/{uuid}`. */
  readonly ownerName: string

  /** Whether the authenticated user has favorited this sample. */
  readonly favoritedByUser: boolean

  /** Number of users who have favorited this sample. */
  readonly numFavorites: number

  /** Number of times this sample has been used in projects. */
  readonly numUsages: number

  /** Beats per minute (0 if not set). */
  readonly bpm: number

  /** Whether this is a one-shot or loop sample. */
  readonly kind: SampleKind

  /** Visibility setting for the sample. */
  readonly visibility: SampleVisibility

  /** Tags for categorization and search. */
  readonly tags: readonly string[]

  /** Timestamp when this sample was created. */
  readonly createTime: Date | undefined

  /** Timestamp when this sample was last updated. */
  readonly updateTime: Date | undefined
}

/**
 * Complete sample metadata available after server-side processing completes.
 * Extends {@link SamplePending} with download URLs for various audio formats.
 *
 * You can pass this directly to {@link document.TransactionBuilder.insertSample}, or
 * pass a plain object with `name`, `durationSeconds`, and optional `bpm`.
 */
export type SampleMeta = SamplePending & {
  /** Duration of the sample in seconds. */
  readonly durationSeconds: number

  /** URL to download the sample in MP3 format. */
  readonly mp3Url: string

  /** URL to download the sample in WAV format. */
  readonly wavUrl: string

  /** URL to download the sample in FLAC format. */
  readonly flacUrl: string

  /** URL to download a low-quality MP3 preview. */
  readonly previewMp3Url: string

  /**
   * Build a URL to fetch waveform visualization data.
   *
   * The URL returns gzipped JSON containing an array of non-negative peak
   * values (one per time bin). Pick a {@link WaveformResolution} and a
   * {@link WaveformChannel}; both default to a sensible middle ground
   * (`1920` peaks, `"both"` channels).
   *
   * @example
   * ```typescript
   * // Default: 1920-peak combined-channel curve
   * const url = sample.getWaveformUrl()
   *
   * // Detailed left-channel curve
   * const url = sample.getWaveformUrl({ resolution: 3840, channel: "left" })
   * ```
   */
  readonly getWaveformUrl: (options?: WaveformUrlOptions) => string
}

/**
 * Handle returned by {@link SamplesAPI.upload}. Contains the sample metadata
 * available immediately, plus promises that resolve as the upload progresses.
 */
export type SampleUpload = SamplePending & {
  /**
   * Resolves once the audio file has finished uploading to storage and the
   * server has acknowledged the upload. This is the important one: after it
   * resolves the bytes are safely on the server and the user can close the
   * tab. Server-side processing (transcoding, waveform generation) may still
   * be in progress.
   *
   * Returns an Error if the upload fails or is cancelled via the AbortSignal.
   */
  readonly uploaded: Promise<void | Error>

  /**
   * Resolves when server-side processing completes and the sample is ready to
   * be downloaded immediately, with full {@link SampleMeta} including
   * transcoded download URLs.
   *
   * Awaiting this is optional - inserting an unready sample into a project
   * still works, the DAW will just wait before downloading until this promise resolves.
   *
   * Returns an Error if the upload fails, processing fails, or the operation
   * is cancelled via the AbortSignal.
   */
  readonly ready: Promise<SampleMeta | Error>
}

/**
 * Options for uploading a sample.
 */
export type SampleUploadOptions = {
  /**
   * The audio file to upload. Accepts:
   * - `File` - from file input or drag-and-drop
   * - `Blob` - raw binary data with MIME type
   * - `ArrayBuffer` - raw bytes (will be sent as application/octet-stream)
   *
   * Supported formats: MP3, WAV, FLAC, OGG
   */
  file: File | Blob | ArrayBuffer

  /**
   * Human-readable name displayed in the UI.
   * This is the only required field.
   */
  displayName: string

  /**
   * Optional description of the sample.
   * @default ""
   */
  description?: string

  /**
   * Beats per minute. Set to 0 or omit for samples without a tempo.
   * @default 0
   */
  bpm?: number

  /**
   * Whether this is a one-shot sound or a looping pattern.
   * @default "one-shot"
   */
  kind?: SampleKind

  /**
   * Visibility setting for the sample.
   * @default "unlisted"
   */
  visibility?: SampleVisibility

  /**
   * Tags for categorization and search. Must have at least one tag.
   * @default ["sample"]
   */
  tags?: string[]

  /**
   * If true, prompts the user with a confirmation dialog when they try to
   * close the tab while the upload is in progress. Only works in browsers.
   *
   * @default false
   */
  preventTabClose?: boolean
}

/**
 * Options for listing samples.
 */
export type SampleListOptions = {
  /**
   * CEL filter expression. Supported fields:
   * - `sample.name`, `sample.display_name`, `sample.description`
   * - `sample.owner_name`, `sample.num_favorites`, `sample.num_usages`
   * - `sample.bpm`, `sample.sample_type`, `sample.play_duration`
   * - `sample.create_time`, `sample.update_time`
   * - `sample.clearance`, `sample.tags`, `sample.favorited_by_user`
   */
  filter?: string

  /**
   * Full-text search query. Supports boolean operators:
   * - `"kick & drum"` - matches both keywords
   * - `"guitar & (jazz | funk)"` - guitar with jazz or funk
   * - `"!bass & guitar"` - guitar but not bass
   */
  textSearch?: string

  /**
   * Sort order. Supported fields match filter fields.
   * @example "sample.create_time desc"
   */
  orderBy?: string

  /**
   * Maximum number of results to return.
   * @default 20
   */
  pageSize?: number

  /**
   * Token from a previous response to fetch the next page.
   */
  pageToken?: string
}

/**
 * Result of listing samples, including pagination info.
 */
export type SampleListResult = {
  /** The samples matching the query. */
  samples: SampleMeta[]

  /**
   * Token to fetch the next page, or empty string if this is the last page.
   * Pass this as `pageToken` in the next request.
   */
  nextPageToken: string
}

/**
 * High-level API for working with samples. Handles the complexity of uploads,
 * downloads, and metadata management.
 *
 * @example Upload a sample
 * ```typescript
 * const upload = await at.samples.upload({
 *   file: audioFile,
 *   displayName: "My Kick Drum",
 * }, signal)
 *
 * // Metadata available immediately
 * console.log("Created:", upload.name)
 *
 * // Wait until the sample is ready to play with download URLs
 * const sample = await upload.ready
 * if (!(sample instanceof Error)) {
 *   console.log("Download URL:", sample.wavUrl)
 * }
 * ```
 *
 * @example Download a sample
 * ```typescript
 * const file = await at.samples.download("samples/abc-123", { format: "wav" })
 * if (!(file instanceof Error)) {
 *   // Use the audio file
 * }
 * ```
 *
 * @example List and search samples
 * ```typescript
 * const result = await at.samples.list({
 *   textSearch: "kick drum",
 *   pageSize: 10,
 * })
 * for (const sample of result.samples) {
 *   console.log(sample.displayName)
 * }
 * ```
 */
export type SamplesAPI = {
  /**
   * Upload a new sample. Returns immediately with pending metadata and a promise
   * that resolves when processing completes.
   *
   * The upload flow:
   * 1. Creates sample metadata on the server
   * 2. Uploads the audio file to cloud storage
   * 3. Signals the server to begin processing
   * 4. Waits for transcoding to complete
   *
   * **Important:** If you stop uploading a file without proper cleanup, your user
   * will have their rate limit reduced by 1 slot until the upload is cancelled
   * automatically, which happens only within 24 hours.
   *
   * Make sure that you either wait for an upload to complete, or cancel the upload.
   *
   * **In browsers:** Pass `preventTabClose: true` to prompt the user with a
   * confirmation dialog if they try to close the tab while the upload is in
   * progress.
   *
   * **In Node.js/Bun/Deno:** There's no automatic cleanup mechanism. You should
   * handle process signals yourself:
   *
   * ```typescript
   * const controller = new AbortController()
   * process.on("SIGINT", () => controller.abort())
   * process.on("SIGTERM", () => controller.abort())
   *
   * const upload = await at.samples.upload({
   *   file: audioBuffer,
   *   displayName: "My Sample",
   * }, controller.signal)
   * ```
   *
   * @param options - Upload options including the file and metadata
   * @param signal - Optional AbortSignal to cancel the upload
   * @returns Sample metadata with `uploaded` and `ready` promises
   *
   * @example Simple upload (browser)
   * ```typescript
   * const upload = await at.samples.upload({
   *   file: audioFile,
   *   displayName: "My Sample",
   * })
   * if (upload instanceof Error) throw upload
   *
   * // Wait until bytes are safely on the server.
   * const err = await upload.uploaded
   * if (err instanceof Error) throw err
   * ```
   *
   * You can insert a sample into a document before `upload.ready` resolves by
   * decoding local audio duration and passing a plain object to
   * {@link document.TransactionBuilder.insertSample}. If that object omits `bpm`, the
   * project BPM from `config` is used (fallback `120` if no `config` exists).
   *
   * @example Insert before upload processing completes (browser)
   * ```typescript
   * async function readLocalDurationSeconds(file: Blob): Promise<number> {
   *   const context = new AudioContext()
   *   try {
   *     const decoded = await context.decodeAudioData(await file.arrayBuffer())
   *     return decoded.duration
   *   } finally {
   *     await context.close()
   *   }
   * }
   *
   * const upload = await at.samples.upload({ file, displayName: "My Sample", bpm: 120 })
   * if (upload instanceof Error) throw upload
   *
   * const durationSeconds = await readLocalDurationSeconds(file)
   * await nexus.modify(t => {
   *   t.insertSample({
   *     name: upload.name,
   *     durationSeconds,
   *     // bpm optional
   *   })
   * })
   * ```
   *
   * @example Prevent accidental tab close (browser)
   * ```typescript
   * const upload = await at.samples.upload({
   *   file: audioFile,
   *   displayName: "My Sample",
   *   preventTabClose: true,  // User will be prompted before leaving
   * })
   * await upload.uploaded
   * ```
   */
  upload: (
    options: SampleUploadOptions,
    signal?: AbortSignal,
  ) => Promise<SampleUpload | Error>

  /**
   * Download a sample's audio file.
   *
   * If the sample is still processing, this will wait until it's ready.
   *
   * @param sample - Sample reference (name, UUID, or sample object)
   * @param options - Download options
   * @param signal - Optional AbortSignal to cancel the download
   * @returns The audio file as a Blob, or an Error
   *
   * @example
   * ```typescript
   * const blob = await at.samples.download(sample, { format: "wav" })
   * if (!(blob instanceof Error)) {
   *   const url = URL.createObjectURL(blob)
   *   audio.src = url
   * }
   * ```
   */
  download: (
    sample: string | SampleMeta,
    options?: {
      /**
       * Audio format to download.
       * @default "flac"
       */
      format?: SampleFormat
    },
    signal?: AbortSignal,
  ) => Promise<Blob | Error>

  /**
   * Get metadata for a single sample.
   *
   * @param sample - Sample reference (name, UUID, or sample object)
   * @param signal - Optional AbortSignal
   * @returns The sample metadata, or an Error if not found
   */
  get: (
    sample: string | SampleMeta | NexusEntity<"sample">,
    signal?: AbortSignal,
  ) => Promise<SampleMeta | Error>

  /**
   * List samples with optional filtering and pagination.
   *
   * @param options - List options including filters and pagination
   * @param signal - Optional AbortSignal
   * @returns List result with samples and pagination token
   *
   * @example Paginated listing
   * ```typescript
   * let result = await at.samples.list({ pageSize: 20 })
   * while (result.samples.length > 0) {
   *   for (const sample of result.samples) {
   *     console.log(sample.displayName)
   *   }
   *   if (!result.nextPageToken) break
   *   result = await at.samples.list({ pageToken: result.nextPageToken })
   * }
   * ```
   */
  list: (
    options?: SampleListOptions,
    signal?: AbortSignal,
  ) => Promise<SampleListResult | Error>

  /**
   * Delete a sample.
   *
   * A sample can only be deleted if:
   * - The user owns the sample
   * - The sample is not currently used in any project
   *
   * @param sample - Sample reference (name, UUID, or sample object)
   * @param signal - Optional AbortSignal
   * @returns void on success, or an Error
   */
  delete: (
    sample: string | SampleMeta,
    signal?: AbortSignal,
  ) => Promise<void | Error>
}

const kindToProto: Record<SampleKind, SampleType> = {
  "one-shot": SampleType.ONE_SHOT,
  loop: SampleType.LOOP,
}

const protoToKind: Record<SampleType, SampleKind> = {
  [SampleType.UNSPECIFIED]: "one-shot",
  [SampleType.ONE_SHOT]: "one-shot",
  [SampleType.LOOP]: "loop",
}

const visibilityToProto: Record<SampleVisibility, SampleUsage> = {
  public: SampleUsage.PUBLIC,
  unlisted: SampleUsage.UNLISTED,
}

const protoToVisibility: Record<SampleUsage, SampleVisibility> = {
  [SampleUsage.UNSPECIFIED]: "unlisted",
  [SampleUsage.PUBLIC]: "public",
  [SampleUsage.UNLISTED]: "unlisted",
}

const resolveSampleName = (
  sample: string | SampleMeta | NexusEntity<"sample">,
): string => {
  if (sample instanceof NexusEntity) {
    return sample.fields.sampleName.value
  }
  if (typeof sample === "string") {
    const uuid = extractUuid(sample)
    if (uuid instanceof Error) {
      return sample.startsWith("samples/") ? sample : `samples/${sample}`
    }
    return `samples/${uuid}`
  }
  return sample.name
}

const protoToSamplePending = (sample: Sample): SamplePending => ({
  name: sample.name,
  displayName: sample.displayName,
  description: sample.description,
  ownerName: sample.ownerName,
  favoritedByUser: sample.favoritedByUser,
  numFavorites: sample.numFavorites,
  numUsages: sample.numUsages,
  bpm: sample.bpm,
  kind: protoToKind[sample.sampleType],
  visibility: protoToVisibility[sample.usage],
  tags: sample.tags,
  createTime: sample.createTime?.toDate(),
  updateTime: sample.updateTime?.toDate(),
})

// The server returns a single waveform URL whose filename is `3840_both.json.gz`.
// All other resolution/channel variants live at sibling URLs with the filename
// swapped, so we derive them lazily on demand.
const DEFAULT_WAVEFORM_FILENAME = "3840_both.json.gz"

const buildGetWaveformUrl =
  (baseUrl: string) =>
  (options?: WaveformUrlOptions): string => {
    if (baseUrl === "") return ""
    const resolution = options?.resolution ?? 1920
    const channel = options?.channel ?? "both"
    const filename = `${resolution}_${channel}.json.gz`
    return baseUrl.replace(DEFAULT_WAVEFORM_FILENAME, filename)
  }

const protoToSampleMeta = (sample: Sample): SampleMeta => ({
  ...protoToSamplePending(sample),
  durationSeconds: sample.playDuration
    ? Number(sample.playDuration.seconds) +
      sample.playDuration.nanos / 1_000_000_000
    : 0,
  mp3Url: sample.mp3Url,
  wavUrl: sample.wavUrl,
  flacUrl: sample.flacUrl,
  previewMp3Url: sample.previewMp3Url,
  getWaveformUrl: buildGetWaveformUrl(sample.waveformUrl),
})

export const createSampleUtil = (transport: KeepaliveTransport): SamplesAPI => {
  const client = createRetryingPromiseClient(SampleService, transport)
  // Single shared listener so concurrent uploads multiplex over one stream.
  const dataListener = createSampleDataListener(client)

  const get: SamplesAPI["get"] = async (sample, signal) => {
    const name = resolveSampleName(sample)
    const response = await client.getSample({ name }, { signal })
    if (response instanceof Error) {
      return response
    }
    if (!response.sample) {
      return new Error(`Sample not found: ${name}`)
    }
    return protoToSampleMeta(response.sample)
  }

  const list: SamplesAPI["list"] = async (options, signal) => {
    const response = await client.listSamples(
      {
        filter: options?.filter ?? "",
        textSearch: options?.textSearch ?? "",
        orderBy: options?.orderBy ?? "",
        pageSize: options?.pageSize ?? 20,
        pageToken: options?.pageToken ?? "",
      },
      { signal },
    )
    if (response instanceof Error) {
      return response
    }
    return {
      samples: response.samples.map(protoToSampleMeta),
      nextPageToken: response.nextPageToken,
    }
  }

  const deleteSample: SamplesAPI["delete"] = async (sample, signal) => {
    const name = resolveSampleName(sample)
    const response = await client.deleteSample({ name }, { signal })
    if (response instanceof Error) {
      return response
    }
    return undefined
  }

  const download: SamplesAPI["download"] = async (sample, options, signal) => {
    const format = options?.format ?? "flac"

    const meta = await get(sample, signal)
    if (meta instanceof Error) {
      return meta
    }

    const urlMap: Record<SampleFormat, string> = {
      wav: meta.wavUrl,
      mp3: meta.mp3Url,
      flac: meta.flacUrl,
      preview: meta.previewMp3Url,
    }

    const url = urlMap[format]
    if (!url) {
      return new Error(
        `Sample ${meta.name} does not have a ${format} URL available yet`,
      )
    }

    const response = await neverThrowingFetch(url, { signal })
    if (response instanceof Error) {
      return response
    }
    if (!response.ok) {
      return new Error(`Failed to download sample: ${response.statusText}`)
    }

    try {
      return await response.blob()
    } catch (error) {
      return new Error("Failed to read sample data", { cause: error })
    }
  }

  const upload: SamplesAPI["upload"] = async (options, signal) => {
    const file =
      options.file instanceof ArrayBuffer
        ? new Blob([options.file], { type: "application/octet-stream" })
        : options.file

    const sampleProto = new Sample({
      displayName: options.displayName,
      description: options.description ?? "",
      bpm: options.bpm ?? 0,
      sampleType: kindToProto[options.kind ?? "one-shot"],
      usage: visibilityToProto[options.visibility ?? "unlisted"],
      tags: options.tags ?? ["sample"],
      clearance: SampleClearance.UNSAFE,
    })

    const createResponse = await client.createSample(
      { sample: sampleProto },
      { signal },
    )
    if (createResponse instanceof Error) {
      return createResponse
    }

    const { sample: createdSample, uploadEndpoint } = createResponse
    if (!createdSample) {
      return new Error("Server did not return sample metadata")
    }
    if (!uploadEndpoint) {
      return new Error("Server did not return upload endpoint")
    }

    const pending = protoToSamplePending(createdSample)

    const internalController = new AbortController()
    const internalSignal = internalController.signal

    if (signal) {
      signal.addEventListener("abort", () => internalController.abort(), {
        once: true,
      })
    }

    let isComplete = false

    const beforeUnloadHandler = (e: BeforeUnloadEvent) => {
      if (!isComplete && options.preventTabClose) {
        e.preventDefault()
        e.returnValue = ""
        return ""
      }
    }

    const isBrowser =
      typeof window !== "undefined" && typeof document !== "undefined"

    if (isBrowser && options.preventTabClose) {
      window.addEventListener("beforeunload", beforeUnloadHandler)
    }

    const removeListeners = () => {
      if (isBrowser && options.preventTabClose) {
        window.removeEventListener("beforeunload", beforeUnloadHandler)
      }
    }

    let resolveUploaded: (result: void | Error) => void = () => {}
    const uploaded = new Promise<void | Error>((resolve) => {
      resolveUploaded = resolve
    })
    let uploadedSettled = false
    const settleUploaded = (result: void | Error) => {
      if (uploadedSettled) return
      uploadedSettled = true
      resolveUploaded(result)
    }

    const ready = (async (): Promise<SampleMeta | Error> => {
      try {
        const uploadResponse = await neverThrowingFetch(
          uploadEndpoint.uploadUrl,
          {
            method: "PUT",
            headers: uploadEndpoint.headers,
            body: file,
            signal: internalSignal,
          },
        )
        if (uploadResponse instanceof Error) {
          await client.cancelSampleUpload(
            { name: createdSample.name },
            { signal: internalSignal },
          )
          settleUploaded(uploadResponse)
          return uploadResponse
        }
        if (!uploadResponse.ok) {
          await client.cancelSampleUpload(
            { name: createdSample.name },
            { signal: internalSignal },
          )
          const err = new Error(`Upload failed: ${uploadResponse.statusText}`)
          settleUploaded(err)
          return err
        }

        const finishResponse = await client.uploadSampleFinished(
          { name: createdSample.name },
          { signal: internalSignal },
        )
        if (finishResponse instanceof Error) {
          settleUploaded(finishResponse)
          return finishResponse
        }

        settleUploaded(undefined)

        if (finishResponse.done) {
          if (finishResponse.result.case === "error") {
            return new Error(
              `Processing failed: ${finishResponse.result.value.message}`,
            )
          }
          const finalSample = await get(createdSample.name, internalSignal)
          return finalSample
        }

        const listenResult = await dataListener.listenForSample(
          createdSample.name,
          internalSignal,
        )
        if (listenResult instanceof Error) {
          return new Error(`Processing failed: ${listenResult.message}`, {
            cause: listenResult,
          })
        }
        return protoToSampleMeta(listenResult)
      } catch (error) {
        const err =
          error instanceof Error
            ? error
            : new Error("Sample upload failed", { cause: error })
        settleUploaded(err)
        return err
      } finally {
        // Safety net: ensure `uploaded` always settles, even on unexpected exit.
        settleUploaded(
          new Error("Sample upload ended without resolving `uploaded`"),
        )
        isComplete = true
        removeListeners()
      }
    })()

    return {
      ...pending,
      uploaded,
      ready,
    }
  }

  return {
    upload,
    download,
    get,
    list,
    delete: deleteSample,
  }
}
