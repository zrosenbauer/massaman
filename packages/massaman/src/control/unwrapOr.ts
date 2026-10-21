import { match } from 'ts-pattern'

import type { Result, ResultValue } from './types.js'

/**
 * Extracts a success value or returns a fallback for a failure.
 * The fallback is evaluated before the call, even when the result succeeds.
 *
 * @param result - The result to unwrap
 * @param fallback - The value to return on failure; function values are not invoked
 * @returns The success value or fallback, without throwing on failure
 *
 * @example
 * ```ts
 * unwrapOr(ok(42), 0)      // 42
 * unwrapOr(err('oops'), 0) // 0
 * ```
 */
export function unwrapOr<R extends Result<unknown>, U>(result: R, fallback: U): ResultValue<R> | U
export function unwrapOr<T, U, E extends Error>(result: Result<T, E>, fallback: U): T | U {
  return match(result)
    .with({ ok: true }, ({ value }) => value)
    .otherwise(() => fallback)
}
