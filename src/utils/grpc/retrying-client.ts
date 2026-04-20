import {
  MethodKind,
  type MethodInfoUnary,
  type PartialMessage,
  type ServiceType,
} from "@bufbuild/protobuf"
import {
  Code,
  ConnectError,
  createClient,
  type CallOptions,
  type Client,
} from "@connectrpc/connect"
import { sleep } from "@utils/lang"
import type { ValueNotifier } from "@utils/observable-notifier-value"
import type { AnyMessage } from "node_modules/@bufbuild/protobuf/dist/cjs"
import {
  packKeepaliveOptions,
  type KeepaliveTransport,
} from "../../transport/types"

export type RetryOptions = CallOptions & {
  /** pass a value notifier that will turn to false if something goes wrong, and back to true
   * if things are good.
   */
  callIsOk?: ValueNotifier<boolean>
  /** log if a retry happens. */
  logIfRetrying?: boolean
  /** pass `keepalive` to fetch to finish the request even if the page unloads. */
  keepalive?: boolean

  /** called whenever a retry happens. The passed in error will always match the error predicate passed to the client.*/
  onRetry?: (error: Error) => void
}

/**
 * RetryingClient is a gRPC client like {@link Client} that supports unary and server-streaming
 * methods. Methods will produce a promise for the response message, or an asynchronous iterable of response messages.
 *
 * It differs from {@link Client} in the following ways:
 * * Unary calls never throw. If an exception occurs, the exception will be returned as an Error. No `try/catch` required.
 * * When creating a client, an error predicate can be passed that will determine if a call should be retried. If an error fulfills the predicate,
 *   the underlying network call will be retried, and the calling promise will block until the call succeeds or a different error is thrown.
 * * Unary calls allow passing in a boolean {@link ValueNotifier} that will be turned to false while a failure occurs that causes the call to retry, and true once the call succeeds again.
 */
export type RetryingClient<T extends ServiceType> = {
  [P in keyof T["methods"]]: T["methods"][P] extends MethodInfoUnary<
    infer I,
    infer O
  >
    ? (request: PartialMessage<I>, options?: RetryOptions) => Promise<O | Error>
    : Client<T>[P]
}

export type RetryingPromiseClientOptions = {
  /**
   * Predicate an error thrown during a call attempt has to fulfill if the call should be retried.
   * Defaults to retrying on `ConnectError` with codes `Code.Unavailable` and `Code.Unknown`.
   */
  retryErrorPredicate?: (error: Error) => boolean
  /**
   * Default backoff time in case of reconnects. Defaults to 1000.
   */
  backoffMs?: number
  /**
   * Whether retries should be logged by default, defaults to true. Can be overwritten for each
   * method call.
   */
  logIfRetrying?: boolean
}

export const createRetryingPromiseClient = <S extends ServiceType>(
  service: S,
  transport: KeepaliveTransport,
  options?: RetryingPromiseClientOptions,
): RetryingClient<S> => {
  const backoffMs = options?.backoffMs ?? 2000
  const logIfRetrying = options?.logIfRetrying ?? true

  // we retry if the error matches this function
  const retryErrorPredicate =
    options?.retryErrorPredicate ??
    ((error) => {
      if (error instanceof ConnectError) {
        return error.code === Code.Unavailable || error.code === Code.Unknown
      }
      return false
    })

  // the way we construct this thing is by creating a default promise client...
  const promiseClient = createClient(service, transport)

  // and moving each method over into this object, which we cast to the RetryingPromiseType at the end.
  const retryingClient = {} as Record<string, unknown>

  // go through each method in the service, and if it's a unary method, we wrap it in a retrying function.
  Object.entries(service.methods).forEach(([methodName, method]) => {
    // if it's not unary, just keep as is.
    if (method.kind !== MethodKind.Unary) {
      retryingClient[methodName] = promiseClient[methodName]
      return
    }

    const promiseMethod = promiseClient[methodName]

    retryingClient[methodName] = async (
      request: unknown,
      options?: RetryOptions,
    ): Promise<Error | unknown> => {
      options = packKeepaliveOptions(options)

      while (true) {
        try {
          const value = await promiseMethod(
            request as AsyncIterable<AnyMessage>,
            options,
          )
          options?.callIsOk?.setValue(true)
          return value
        } catch (error) {
          options?.callIsOk?.setValue(false)

          if (!(error instanceof Error && retryErrorPredicate(error))) {
            return new Error(`${service.typeName}.${methodName} threw error`, {
              cause: error,
            })
          }

          options?.onRetry?.(error)

          if (options?.logIfRetrying ?? logIfRetrying) {
            console.warn(
              `${service.typeName}.${methodName} call failed, retrying in ${backoffMs} ms. Error:`,
              error,
            )
          }

          // sleep backoffMs with some random offset to avoid simultaneous reconnections
          await sleep(
            backoffMs + Math.random() * backoffMs * 0.1,
            // pass in signal for earlier return in case of abort
            options?.signal,
          )

          // return error immediately in case of abort to avoid fetching again
          if (options?.signal?.aborted ?? false) {
            return new Error(`${service.typeName}.${methodName} was aborted`, {
              cause: error,
            })
          }

          continue
        }
      }
    }
  })

  return retryingClient as RetryingClient<S>
}
