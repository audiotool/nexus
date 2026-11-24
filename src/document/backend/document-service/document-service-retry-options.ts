import { Code, ConnectError } from "@connectrpc/connect"
import type { RetryingPromiseClientOptions } from "@utils/grpc/retrying-client"

/** Retries network failures and timeouts. The ping uses a timeout to detect a document
 * server that stopped answering, so a timed out call must be retried, not returned.
 */
export const isUnavailableOrTimedOut = (error: Error): boolean =>
  error instanceof ConnectError &&
  (error.code === Code.Unavailable ||
    error.code === Code.Unknown ||
    error.code === Code.DeadlineExceeded)

/** Short backoff, because the document can't sync while the connection is down. */
export const DOCUMENT_SERVICE_RETRY_OPTIONS = {
  retryErrorPredicate: isUnavailableOrTimedOut,
  initialBackoffMs: 1_000,
  maximumBackoffMs: 2_000,
} as const satisfies RetryingPromiseClientOptions
