import type { DocumentService } from "@gen/document/v1/document_service_connect"
import type { RetryingClient } from "@utils/grpc/retrying-client"
import { asyncInterval } from "@utils/lang"
import { Notifier, type Observable } from "@utils/observable-notifier"
import {
  ValueNotifier,
  type ObservableValue,
} from "@utils/observable-notifier-value"

/** A ping notifier continuously pings the backend to check if the connection is still alive. */
export type PingNotifier = {
  /** emits a true/false value every time a successful/failed ping is received. */
  pingCallResults: Observable<boolean>
  /** true while ping call is not retrying */
  connectionOk: ObservableValue<boolean>
  /** current ping to server, in milliseconds. Currently doesn't update if no ping response is received */
  pingMs: ObservableValue<number>
  /** Immediately terminates the ping loop. */
  terminate: () => void
}

export const createPingNotifier = (
  documentService: Pick<RetryingClient<typeof DocumentService>, "ping">,
  projectName: string,
  opts?: {
    pingIntervalMs?: number
    clientId?: string
  },
): PingNotifier => {
  // create notifiers
  const pingCallResults = new Notifier<boolean>()
  const lastPingMs = new ValueNotifier(0)

  const connectionOk = new ValueNotifier(true)
  pingCallResults.subscribe((ok) => {
    connectionOk.setValue(ok)
  })

  const loop = asyncInterval(
    async (signal) => {
      const currentTime = Date.now()
      const response = await documentService.ping(
        {
          clientId: opts?.clientId ?? "undefined",
          projectName, // required by backend
          lastPingMs: Math.floor(lastPingMs.getValue()),
        },
        {
          onRetry: () => pingCallResults.notify(false),
          signal,
        },
      )
      if (signal.aborted) {
        return
      }

      // the ping method will retry in case of recoverable errors. If not, it will
      // return an error - which we throw, to stop the world.
      if (response instanceof Error) {
        throw response
      }
      pingCallResults.notify(true)
      lastPingMs.setValue(Date.now() - currentTime)
    },
    opts?.pingIntervalMs ?? 1000,
    { immediateTrigger: true },
  )

  return {
    pingCallResults,
    connectionOk,
    pingMs: lastPingMs,
    terminate: () => {
      pingCallResults.terminate()
      loop.terminate()
      connectionOk.terminate()
      lastPingMs.terminate()
    },
  }
}
