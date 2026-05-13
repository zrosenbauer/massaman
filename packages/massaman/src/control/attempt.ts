import { err, ok } from './result.js'
import type { Result } from './types.js'

/**
 * Executes a synchronous function and wraps the outcome in a `Result`.
 * Returns `Ok` with the return value on success, `Err` with the thrown value on failure.
 *
 * @param fn - The function to execute
 * @returns A `Result` containing either the value or the error
 *
 * @example
 * ```ts
 * const result = attempt(() => JSON.parse('{"a":1}'))
 * if (isOk(result)) {
 *   console.log(result.value) // { a: 1 }
 * }
 * ```
 */
export function attempt<T>(fn: () => T): Result<T> {
  try {
    return ok(fn())
  } catch (error) {
    return err(error)
  }
}

/**
 * Executes an asynchronous function and wraps the outcome in a `Result`.
 * Returns `Ok` with the resolved value on success, `Err` with the rejection reason on failure.
 *
 * @param fn - The async function to execute
 * @returns A promise resolving to a `Result` containing either the value or the error
 *
 * @example
 * ```ts
 * const result = await attemptAsync(() => fetch('/api/data'))
 * if (isErr(result)) {
 *   console.error(result.error)
 * }
 * ```
 */
export async function attemptAsync<T>(fn: () => Promise<T>): Promise<Result<T>> {
  try {
    return ok(await fn())
  } catch (error) {
    return err(error)
  }
}
