import { match } from 'ts-pattern'

import type { Result, ResultError, ResultValue } from './types.js'

/**
 * Continues a successful result with another fallible operation.
 * Preserves failures without calling `next`. Callback exceptions are not caught.
 *
 * @param result - The result to continue
 * @param next - A function returning the next result
 * @returns The next result, or the original failure, with both error types preserved
 *
 * @example
 * ```ts
 * andThen(ok('42'), (value) => ok(Number(value))) // Ok(42)
 * andThen(err('invalid'), (value) => ok(value))   // original Err
 * ```
 */
export function andThen<R extends Result<unknown>, N extends Result<unknown>>(
  result: R,
  next: (value: ResultValue<R>) => N
): Result<ResultValue<N>, ResultError<R> | ResultError<N>>
export function andThen<T, U, E extends Error, F extends Error>(
  result: Result<T, E>,
  next: (value: T) => Result<U, F>
): Result<U, E | F> {
  return match(result)
    .with({ ok: true }, ({ value }) => next(value))
    .otherwise((failure) => failure)
}
