import { createRegistry, type Any } from "@bufbuild/protobuf"
import {
  SampleConvertDoneErrorType,
  SampleConvertInfo,
} from "@gen/sample/v1/sample_event_pb"
import type { Sample } from "@gen/sample/v1/sample_pb"
import type { SampleService } from "@gen/sample/v1/sample_service_connect"
import type { ListenResponse } from "@gen/sample/v1/sample_service_pb"
import type { RetryingClient } from "@utils/grpc/retrying-client"
import { sleep } from "@utils/lang"

/**
 * Multiplexes calls to the server-streaming `SampleService.Listen` RPC so
 * concurrent waiters for different sample IDs share a single stream.
 *
 * `SampleService.Listen` accepts any number of sample names per call, so naive
 * one-call-per-waiter usage burns connections and re-sends history. The
 * listener keeps a single open stream over the union of all waiting sample
 * IDs and restarts it whenever the set changes.
 *
 * Sample upload events are kept on the server for up to 24 hours, so this
 * should only be called for samples whose upload has been initiated recently.
 * Otherwise the returned promise will never resolve.
 */
export type SampleDataListener = {
  /**
   * Wait for the conversion of a single sample to complete.
   *
   * Resolves with the {@link Sample} once processing finishes, or with an
   * {@link Error} if the operation failed, the conversion errored, or
   * `signal` was aborted.
   *
   * Each `sampleId` may only be awaited once concurrently. Calling again with
   * the same id while a previous call is still pending returns an Error.
   */
  listenForSample(
    sampleId: string,
    signal?: AbortSignal,
  ): Promise<Sample | Error>
}

/**
 * Create a {@link SampleDataListener} backed by the given sample service
 * client.
 *
 * @param sampleService - retrying client for {@link SampleService}
 * @param recoverSleepMs - delay before reconnecting after a stream error
 */
export const createSampleDataListener = (
  sampleService: Pick<RetryingClient<typeof SampleService>, "listen">,
  recoverSleepMs: number = 5000,
): SampleDataListener => {
  // Maps sample id -> resolver of the promise returned by `listenForSample`.
  // Membership of this map drives which sample names the underlying `listen`
  // stream is subscribed to.
  const resolvers = new Map<string, (result: Sample | Error) => void>()

  // The `listen` RPC is server-streaming and we can subscribe to many sample
  // names at once. Whenever `resolvers` changes we abort the current stream
  // (via this controller) and start a new one over the new set of names.
  let abortController = new AbortController()

  // Aborts the current `listen` call and starts a new one covering every
  // sample currently in `resolvers`. No-op if `resolvers` is empty.
  const restartListen = async (): Promise<void> => {
    abortController.abort()
    abortController = new AbortController()
    const thisAbortController = abortController

    if (resolvers.size === 0) {
      return
    }

    const iter = sampleService
      .listen(
        { names: [...resolvers.keys()] },
        { signal: thisAbortController.signal },
      )
      [Symbol.asyncIterator]()

    while (true) {
      if (thisAbortController.signal.aborted) {
        return
      }

      let next: IteratorResult<ListenResponse>
      try {
        next = await iter.next()
      } catch (error) {
        if (thisAbortController.signal.aborted) {
          return
        }
        if (resolvers.size === 0) {
          return
        }
        console.warn(
          `sampleService.listen iterator error, retrying in ${recoverSleepMs}ms`,
          error,
        )
        await sleep(recoverSleepMs)
        void restartListen()
        return
      }

      if (next.done ?? false) {
        if (resolvers.size === 0) {
          return
        }
        console.warn(
          `sampleService.listen iterator done, retrying in ${recoverSleepMs}ms`,
        )
        await sleep(recoverSleepMs)
        void restartListen()
        return
      }

      const operation = next.value.operation
      if (operation === undefined) {
        console.warn("received empty sampleService.listen operation, ignoring")
        continue
      }

      const convertInfo = parseSampleConvertInfo(operation.metadata)
      if (convertInfo === undefined || convertInfo.sample === undefined) {
        console.warn(
          "received sampleService.listen operation without valid SampleConvertInfo, ignoring",
        )
        continue
      }

      const sampleName = convertInfo.sample.name
      const resolve = resolvers.get(sampleName)
      if (resolve === undefined) {
        // Event for a sample we're not (or no longer) waiting on; ignore.
        continue
      }

      // Wait for the operation to be marked done before resolving.
      if (!operation.done) {
        continue
      }

      if (operation.result.case === "error") {
        resolve(
          new Error(`Operation error: ${operation.result.value.message}`),
        )
        resolvers.delete(sampleName)
        if (resolvers.size === 0) {
          return
        }
        continue
      }

      if (
        convertInfo.error !== SampleConvertDoneErrorType.NONE &&
        convertInfo.error !== SampleConvertDoneErrorType.UNSPECIFIED
      ) {
        resolve(
          new Error(
            `SampleConvertDone event with error: ${SampleConvertDoneErrorType[convertInfo.error] ?? convertInfo.error}`,
          ),
        )
        resolvers.delete(sampleName)
        if (resolvers.size === 0) {
          return
        }
        continue
      }

      resolve(convertInfo.sample)
      resolvers.delete(sampleName)
      if (resolvers.size === 0) {
        return
      }
    }
  }

  return {
    listenForSample: async (sampleId, signal) => {
      if (resolvers.has(sampleId)) {
        return new Error(
          `listenForSample called multiple times for sampleId: ${sampleId}`,
        )
      }
      if (signal?.aborted) {
        return new Error("Aborted")
      }

      const { promise, resolve } = Promise.withResolvers<Sample | Error>()
      resolvers.set(sampleId, resolve)

      signal?.addEventListener(
        "abort",
        () => {
          if (!resolvers.has(sampleId)) return
          resolvers.delete(sampleId)
          void restartListen()
          resolve(new Error("Aborted"))
        },
        { once: true },
      )

      void restartListen()
      return promise
    },
  }
}

const sampleConvertInfoRegistry = createRegistry(SampleConvertInfo)

/** Parse a {@link SampleConvertInfo} from an `Any` payload. */
const parseSampleConvertInfo = (
  metadata: Any | undefined,
): SampleConvertInfo | undefined => {
  if (metadata === undefined) {
    return undefined
  }
  if (!metadata.is(SampleConvertInfo)) {
    return undefined
  }
  return metadata.unpack(sampleConvertInfoRegistry) as
    | SampleConvertInfo
    | undefined
}
