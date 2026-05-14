import type { NexusEntity } from "@document/entity"
import { NexusLocation } from "@document/location"
import type { Modification } from "@gen/document/v1/document_service_pb"
import type { RegionConstructor } from "@gen/document/v1/entity/region/v1/region_nexus"
import { secondsToTicks } from "@utils/ticks"
import { buildModificationForNewEntity } from "./build-new-entity"

/**
 * Options for inserting a sample into the timeline.
 *
 * Grouped by concern:
 * - `sample`: how the sample's audio maps to musical time (tempo, stretch,
 *   playback offset within the sample).
 * - `region`: where the resulting region sits on the project timeline.
 * - `loop`: whether and how the region repeats inside itself.
 * - `attachTo` / `displayName`: target track/device and naming.
 */
export type InsertSampleOptions = {
  /** How the sample's audio maps to musical time. */
  sample?: {
    /**
     * Bpm used to convert the sample's real-time duration into ticks.
     *
     * - `number`: Force this bpm, overriding any bpm authored on the sample.
     *   With a matching value, the sample plays in sync with the project metronome.
     * - `"project"`: Use the project's current bpm at insertion time,
     *   ignoring any bpm authored on the sample. Note: this does NOT make
     *   the sample tempo-independent. If the project tempo changes after
     *   insertion, the sample still stretches accordingly — there is no
     *   true "native speed" mode at Audiotool.
     * - `undefined`: Use the sample's authored bpm if present, else fall
     *   back to project bpm.
     *
     * Ignored if `musicDurationTicks` is provided.
     *
     * @throws If bpm cannot be resolved (no override, no sample bpm, no project
     *         bpm via {@link Config}).
     */
    bpm?: number | "project"

    /**
     * Force the sample's musical duration to this many ticks, regardless
     * of its real-time length. When set, `bpm` is ignored. Useful when you
     * know exactly how many bars the sample should occupy on the timeline.
     */
    musicDurationTicks?: number

    /**
     * Offset into the sample's musical time where playback begins at the
     * region's start. Independent of `loop.startTicks`. Use this when you
     * want the very first instant of the region to play a sample-internal
     * tick that differs from `loop.startTicks`. @default 0
     */
    offsetTicks?: number
  }

  /** Where the resulting region sits on the project timeline. */
  region?: {
    /** Region start on the project timeline. @default 0 */
    positionTicks?: number

    /**
     * Region length on the project timeline. If shorter than the sample's
     * musical duration, the sample is clipped. If longer and `loop` is set,
     * the loop content repeats to fill the remainder.
     * @default the sample's musical duration (or `sample.musicDurationTicks`
     * when set).
     */
    durationTicks?: number
  }

  /**
   * Loop configuration.
   *
   * - `undefined` / `false`: no loop intent — region clips or runs once.
   * - `true`: marker indicating "fill the rest of the region by repeating
   *   the sample". Has no audible effect when `region.durationTicks` equals
   *   the sample's musical duration (the default).
   * - object: loop a specific sub-range of the sample. `startTicks` also
   *   shifts where the sample begins playing at region start (unless
   *   `sample.offsetTicks` is set explicitly).
   */
  loop?:
    | {
        /**
         * Where the loop starts inside the sample, relative to the sample's
         * start. Also the sample-internal tick that plays at the region's
         * start (when `sample.offsetTicks` is not set). @default 0
         */
        startTicks?: number
        /** Length of the loop content. @default to the end of the sample. */
        durationTicks?: number
      }
    | boolean

  /**
   * Where to insert the sample:
   * - `NexusEntity<"audioTrack">`: Insert into this existing audio track
   * - `NexusEntity<"audioDevice">`: Create a new track on this device
   * - `undefined`: Create a new AudioDevice and AudioTrack.
   */
  attachTo?: NexusEntity<"audioTrack"> | NexusEntity<"audioDevice">

  /**
   * Display name for the region and the audio device, if created.
   * @default sample's displayName if available
   */
  displayName?: string
}

export const buildInsertSampleModifications = (
  sample: {
    durationSeconds: number
    bpm?: number
    displayName?: string
    name: string
  },
  projectParams: {
    bpm?: number
    nextTrackOrder: number
    nextMixerChannelOrder: number
  },
  options?: InsertSampleOptions,
): { modifications: Modification[]; regionId: string } => {
  const modifications: Modification[] = []
  const displayName =
    options?.displayName ??
    sample.displayName ??
    "Sample inserted via Nexus SDK"

  const sampleDurationTicks = resolveSampleDurationTicks(
    sample,
    options,
    projectParams.bpm,
  )
  const regionParams = buildRegionConstructorForInsertSample(
    sampleDurationTicks,
    options,
  )

  const [trackId, trackModifications] = setupAudioTrack(
    options?.attachTo,
    displayName,
    projectParams.nextTrackOrder,
    projectParams.nextMixerChannelOrder,
  )
  modifications.push(...trackModifications)

  const [regionId, regionModifications] = setupAudioRegion(
    sample.name,
    regionParams,
    sampleDurationTicks,
    trackId,
  )
  modifications.push(...regionModifications)

  return { modifications, regionId }
}

const setupAudioTrack = (
  attachTo: NexusEntity<"audioTrack"> | NexusEntity<"audioDevice"> | undefined,
  displayName: string,
  nextTrackOrder: number,
  nextMixerChannelOrder: number,
): [string, Modification[]] => {
  const createDevice = (): [deviceId: string, Modification] => {
    const { modification, entityId } = buildModificationForNewEntity(
      "audioDevice",
      {
        displayName,
      },
    )
    return [entityId, modification]
  }

  const createTrack = (deviceId: string): [string, Modification] => {
    const { modification, entityId } = buildModificationForNewEntity(
      "audioTrack",
      {
        player: new NexusLocation(deviceId, "audioTrack"),
        orderAmongTracks: nextTrackOrder,
      },
    )
    return [entityId, modification]
  }

  const wireUpDeviceToMixer = (deviceId: string): Modification[] => {
    const { modification: channelModification, entityId: channelId } =
      buildModificationForNewEntity("mixerChannel", {
        displayParameters: {
          displayName,
          orderAmongStrips: nextMixerChannelOrder,
        },
      })

    const { modification: cableModification } = buildModificationForNewEntity(
      "desktopAudioCable",
      {
        fromSocket: NexusLocation.fromSchemaPath(
          deviceId,
          "/audioDevice/audioOutput",
        ),
        toSocket: NexusLocation.fromSchemaPath(
          channelId,
          "/mixerChannel/audioInput",
        ),
      },
    )

    return [channelModification, cableModification]
  }

  if (attachTo === undefined) {
    const [deviceId, deviceModification] = createDevice()
    const [trackId, trackModification] = createTrack(deviceId)
    const channelMods = wireUpDeviceToMixer(deviceId)
    return [trackId, [deviceModification, trackModification, ...channelMods]]
  }
  if (attachTo.entityType === "audioDevice") {
    const [trackId, trackModification] = createTrack(attachTo.id)
    return [trackId, [trackModification]]
  }
  if (attachTo.entityType === "audioTrack") {
    return [attachTo.id, []]
  }

  throw new Error("Invalid attachTo type")
}

const setupAudioRegion = (
  sampleName: string,
  regionParams: RegionConstructor,
  sampleTargetDurationTicks: number,
  trackId: string,
): [string, Modification[]] => {
  // create sample entity
  const { modification: sampleModification, entityId: sampleId } =
    buildModificationForNewEntity("sample", {
      sampleName,
    })

  // create automation collection entity
  const { modification: collectionModification, entityId: collectionId } =
    buildModificationForNewEntity("automationCollection", {})

  // create automation event entities
  const { modification: event0Modification } = buildModificationForNewEntity(
    "automationEvent",
    {
      collection: new NexusLocation(collectionId, "automationCollection"),
      positionTicks: 0,
      value: 0,
      interpolation: 2,
    },
  )
  const { modification: event1Modification } = buildModificationForNewEntity(
    "automationEvent",
    {
      collection: new NexusLocation(collectionId, "automationCollection"),
      positionTicks: sampleTargetDurationTicks,
      value: 1,
    },
  )

  // create audio region entity
  const { modification: regionModification, entityId: regionId } =
    buildModificationForNewEntity("audioRegion", {
      track: new NexusLocation(trackId, "audioTrack"),
      sample: new NexusLocation(sampleId, "sample"),
      playbackAutomationCollection: new NexusLocation(
        collectionId,
        "automationCollection",
      ),
      region: regionParams,
    })

  return [
    regionId,
    [
      sampleModification,
      collectionModification,
      event0Modification,
      event1Modification,
      regionModification,
    ],
  ]
}

/**
 * Compute the {@link RegionConstructor} for an `insertSample` call.
 *
 * This is the pure tick-math half of `TransactionBuilder.insertSample`. It
 * takes the sample's already-resolved musical duration in ticks plus the
 * {@link InsertSampleOptions} and returns a fully-formed region constructor.
 *
 * The caller is responsible for:
 * - Resolving `sampleDurationTicks` (e.g., via {@link resolveSampleDurationTicks}).
 * - Threading `displayName` separately — this function does not set it.
 * - Creating the surrounding `AudioDevice` / `AudioTrack` / `Sample` /
 *   `AutomationCollection` entities.
 *
 * See `sample-api.md` and the `insert sample implementation` plan for the
 * full resolution rules this function encodes.
 *
 * @throws If any of the loop / region / offset values would yield a negative
 *         tick value, or if the loop sub-range disagrees with `sample.offsetTicks`.
 */
export const buildRegionConstructorForInsertSample = (
  sampleDurationTicks: number,
  options: InsertSampleOptions | undefined,
): RegionConstructor => {
  // 1. Playback offset inside the sample.
  const playbackOffsetTicks = resolvePlaybackOffsetTicks(
    options,
    sampleDurationTicks,
  )

  // 2. Region position and duration.
  const regionPositionTicks = options?.region?.positionTicks ?? 0
  if (regionPositionTicks < 0) {
    throw new Error(
      `insertSample: region.positionTicks must be >= 0, got ${regionPositionTicks}`,
    )
  }
  const regionDurationTicks =
    options?.region?.durationTicks ??
    Math.max(0, sampleDurationTicks - playbackOffsetTicks)
  if (regionDurationTicks < 0) {
    throw new Error(
      `insertSample: region.durationTicks must be >= 0, got ${regionDurationTicks}`,
    )
  }

  // 3. Loop fields.
  const loopOpt = options?.loop
  let collectionOffsetTicks: number
  let loopOffsetTicks: number
  let loopDurationTicks: number

  if (loopOpt === undefined || loopOpt === false) {
    // No loop intent: region clips or runs once. Using
    // loopDurationTicks === regionDurationTicks ensures the
    // `loopDuration >= regionDuration - loopOffset` rule fires, so no repeat.
    loopOffsetTicks = 0
    collectionOffsetTicks = playbackOffsetTicks
    loopDurationTicks = regionDurationTicks
  } else if (loopOpt === true) {
    // Loop the full sample tail, starting at playbackOffsetTicks.
    loopOffsetTicks = 0
    collectionOffsetTicks = playbackOffsetTicks
    loopDurationTicks = Math.max(0, sampleDurationTicks - playbackOffsetTicks)
  } else {
    // Loop a specific sub-range of the sample.
    const loopStart = loopOpt.startTicks ?? 0
    collectionOffsetTicks = loopStart
    loopOffsetTicks = loopStart - playbackOffsetTicks
    if (loopOffsetTicks < 0) {
      throw new Error(
        `insertSample: sample.offsetTicks (${playbackOffsetTicks}) must be <= loop.startTicks (${loopStart})`,
      )
    }
    loopDurationTicks =
      loopOpt.durationTicks ?? Math.max(0, sampleDurationTicks - loopStart)
  }

  return {
    positionTicks: regionPositionTicks,
    durationTicks: regionDurationTicks,
    collectionOffsetTicks,
    loopOffsetTicks,
    loopDurationTicks,
    isEnabled: true,
    colorIndex: 0,
  }
}

// -- Private helpers -------------------------------------------------------

/**
 * Resolve the bpm used to convert the sample's real-time duration into ticks.
 *
 * Only called when `musicDurationTicks` is NOT set — otherwise bpm is
 * irrelevant. Throws only if `projectBpm` is actually needed but missing,
 * matching the "lazy throw" policy (Q2 → b).
 */
const resolveSourceBpm = (
  sampleBpm: number | undefined,
  optionsBpm: number | "project" | undefined,
  projectBpm: number | undefined,
): number => {
  if (typeof optionsBpm === "number") {
    return optionsBpm
  }
  if (optionsBpm === "project") {
    if (projectBpm === undefined) {
      throw new Error(
        `insertSample: sample.bpm = "project" requires a project bpm, but no Config entity with tempoBpm is available`,
      )
    }
    return projectBpm
  }
  if (sampleBpm !== undefined && sampleBpm > 0) {
    return sampleBpm
  }
  if (projectBpm !== undefined) {
    return projectBpm
  }
  throw new Error(
    `insertSample: cannot resolve bpm — no sample.bpm override, no bpm on the sample, and no project bpm available`,
  )
}

/**
 * Resolve the sample's musical duration in ticks (rule 1 in the plan).
 *
 * Either:
 * - `options.sample.musicDurationTicks` is set, in which case it bypasses
 *   bpm entirely and is returned as-is, or
 * - we resolve a source bpm (option override → `sample.bpm` → project bpm)
 *   and convert `sample.durationSeconds` to ticks.
 *
 * @throws If bpm is needed but cannot be resolved.
 */
export const resolveSampleDurationTicks = (
  sample: { durationSeconds: number; bpm?: number },
  options: InsertSampleOptions | undefined,
  projectBpm: number | undefined,
): number => {
  const stretch = options?.sample?.musicDurationTicks
  if (stretch !== undefined) {
    return stretch
  }
  const sourceBpm = resolveSourceBpm(
    sample.bpm,
    options?.sample?.bpm,
    projectBpm,
  )
  return secondsToTicks(sample.durationSeconds, sourceBpm)
}

/**
 * Resolve `playbackOffsetTicks` (rule 2 in the plan): the sample-internal
 * tick that plays at the very first instant of the region.
 */
const resolvePlaybackOffsetTicks = (
  options: InsertSampleOptions | undefined,
  sampleDurationTicks: number,
): number => {
  const explicit = options?.sample?.offsetTicks
  if (explicit !== undefined) {
    if (explicit < 0) {
      throw new Error(
        `insertSample: sample.offsetTicks must be >= 0, got ${explicit}`,
      )
    }
    if (explicit > sampleDurationTicks) {
      throw new Error(
        `insertSample: sample.offsetTicks (${explicit}) must be <= sample duration (${sampleDurationTicks})`,
      )
    }
    return explicit
  }
  const loopOpt = options?.loop
  if (
    loopOpt &&
    typeof loopOpt === "object" &&
    loopOpt.startTicks !== undefined
  ) {
    return loopOpt.startTicks
  }
  return 0
}
