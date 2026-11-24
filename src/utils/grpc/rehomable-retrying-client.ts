import type { ServiceType } from "@bufbuild/protobuf"
import { sleep } from "@utils/lang"
import {
  ValueNotifier,
  type ObservableValue,
} from "@utils/observable-notifier-value"
import type { KeepaliveTransport } from "../../transport/types"
import {
  createRetryingPromiseClient,
  type RetryingClient,
  type RetryingPromiseClientOptions,
} from "./retrying-client"

/**
 * A retrying client whose underlying transport can be swapped at runtime
 * for one pointing at a freshly-assigned backend (a "re-home").
 *
 * It's a drop-in replacement for {@link RetryingClient}: all methods on the
 * underlying service are forwarded to the current client at call-site
 * dispatch time. Once {@link RehomableRetryingClient.rehome} updates the
 * underlying client, any subsequently-dispatched call will hit the new backend.
 *
 * In-flight semantics: a call that is already dispatched against the old
 * client when a re-home runs is NOT moved to the new client; it will
 * complete (or fail) against the old one. Callers that care detect the
 * re-homeable failure themselves, call `rehome`, and issue a fresh
 * call which then lands on the new client.
 *
 * Deduping: concurrent `rehome` calls share a single in-flight re-home promise.
 *
 * Backoff: the backend can hand out a backend that can't serve the project
 * (e.g. if there's a stale lock lease). Callers then re-home again right away. The first
 * {@link REHOME_ATTEMPTS_WITHOUT_BACKOFF} consecutive re-homes run immediately,
 * every following one waits {@link REHOME_BACKOFF_MS} first. Callers end the
 * streak via `resetRehomeBackoff` once the backend answers successfully.
 */
export type RehomableRetryingClient<S extends ServiceType> =
  RetryingClient<S> & {
    /**
     * Re-home to a freshly-assigned backend by fetching a new base URL,
     * then rebuilding the underlying transport and client against it. If the
     * URL didn't change, the current client is kept.
     *
     * Returns `undefined` on success, or an `Error` if the new base URL or transport
     * could not be obtained. Never throws for expected failure modes: callers decide
     * whether a failed re-home is fatal.
     *
     * Concurrent callers share the same in-flight re-home.
     */
    rehome: () => Promise<Error | undefined>
    /**
     * Call when the current backend answered successfully, so the next
     * `rehome` runs immediately again.
     */
    resetRehomeBackoff: () => void
    /** True while a re-home is in progress. */
    rehoming: ObservableValue<boolean>
  }

/** Consecutive re-homes that run immediately, before {@link REHOME_BACKOFF_MS} kicks in. */
export const REHOME_ATTEMPTS_WITHOUT_BACKOFF = 2

/** Wait before each re-home after the first {@link REHOME_ATTEMPTS_WITHOUT_BACKOFF} consecutive ones. */
export const REHOME_BACKOFF_MS = 1_000

const REHOMABLE_CLIENT_METHOD_NAMES = [
  "rehome",
  "rehoming",
  "resetRehomeBackoff",
]

/**
 * Build a rehomable retrying client. It starts out wrapping a client built
 * against `initialBaseUrl`. After a successful re-home, subsequent method dispatches
 * go through a client built against the URL returned by `getNextBaseUrl`.
 */
export const createRehomableRetryingClient = async <S extends ServiceType>({
  service,
  initialBaseUrl,
  getNextBaseUrl,
  createTransport,
  retryOptions,
}: {
  service: S
  initialBaseUrl: string
  /** Called for every re-home. The error is returned as is by `rehome`. */
  getNextBaseUrl: () => Promise<string | Error>
  createTransport: (baseUrl: string) => Promise<KeepaliveTransport>
  retryOptions?: RetryingPromiseClientOptions
}): Promise<RehomableRetryingClient<S>> => {
  for (const name of Object.keys(service.methods)) {
    if (REHOMABLE_CLIENT_METHOD_NAMES.includes(name)) {
      throw new Error(
        `trying to construct a rehomable retrying client with a method named ${name}, can't`,
      )
    }
  }

  const buildClient = async (baseUrl: string): Promise<RetryingClient<S>> =>
    createRetryingPromiseClient(
      service,
      await createTransport(baseUrl),
      retryOptions,
    )

  let currentBaseUrl = initialBaseUrl
  let currentClient = await buildClient(initialBaseUrl)
  const rehoming = new ValueNotifier(false)
  let inFlight: Promise<Error | undefined> | undefined
  let consecutiveRehomes = 0

  const runRehome = async (): Promise<Error | undefined> => {
    if (consecutiveRehomes >= REHOME_ATTEMPTS_WITHOUT_BACKOFF) {
      await sleep(REHOME_BACKOFF_MS)
    }
    consecutiveRehomes++
    const next = await getNextBaseUrl()
    if (next instanceof Error) {
      return next
    }
    if (next !== currentBaseUrl) {
      try {
        currentClient = await buildClient(next)
      } catch (error) {
        return new Error("failed to create transport while re-homing", {
          cause: error,
        })
      }
      currentBaseUrl = next
    }
    return undefined
  }

  const rehome = (): Promise<Error | undefined> => {
    if (inFlight !== undefined) {
      return inFlight
    }
    rehoming.setValue(true)
    inFlight = runRehome().finally(() => {
      inFlight = undefined
      rehoming.setValue(false)
    })
    return inFlight
  }

  // Forward every method on the service to whichever client is current at
  // dispatch time. We iterate at runtime so new methods added to the service
  // are forwarded without code changes here.
  const forwarded = {} as Record<string, unknown>
  for (const name of Object.keys(service.methods)) {
    forwarded[name] = (...args: unknown[]) =>
      (
        currentClient as unknown as Record<
          string,
          (...args: unknown[]) => unknown
        >
      )[name](...args)
  }

  return {
    ...(forwarded as RetryingClient<S>),
    rehome,
    resetRehomeBackoff: () => {
      consecutiveRehomes = 0
    },
    rehoming,
  }
}
