import { match } from 'ts-pattern'

import type { Result, ResultError, ResultValue } from './types.js'

/**
 * Recovers from a failed result with another fallible operation.
 * Preserves successes without calling `recover`. Callback exceptions are not caught.
 *
 * @param result - The result to recover
 * @param recover - A function returning a recovery result
 * @returns The original success or the recovery result, with the recovery error type
 *
 * @example
 * ```ts
 * orElse(err('missing'), () => ok('guest')) // Ok('guest')
 * orElse(ok('Zac'), () => ok('guest'))      // original Ok
 * ```
 */
export function orElse<R extends Result<unknown>, N extends Result<unknown>>(
  result: R,
  recover: (error: ResultError<R>) => N
): Result<ResultValue<R> | ResultValue<N>, ResultError<N>>
export function orElse<T, U, E extends Error, F extends Error>(
  result: Result<T, E>,
  recover: (error: E) => Result<U, F>
): Result<T | U, F> {
  return match(result)
    .with({ ok: false }, ({ error }) => recover(error))
    .otherwise((success) => success)
}
