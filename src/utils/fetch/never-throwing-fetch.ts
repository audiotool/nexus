export type NeverThrowingFetch = (
  ...params: Parameters<typeof fetch>
) => Promise<Response | Error>

/**
 * Wraps {@link fetch} such that if errors are throw, they're returned instead.
 *
 * Allows fetching things without `try/catch` blocks.
 */
export const neverThrowingFetch = async (
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response | Error> => {
  try {
    return await fetch(input, init)
  } catch (error) {
    return new Error(`error during fetch`, { cause: error })
  }
}
