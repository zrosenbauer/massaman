import { match } from 'ts-pattern'

import { isErr, isOk, ok } from './result.js'
import type { Result, ResultError, ResultValue } from './types.js'

/**
 * Combines results into one success, or returns the first failure in input order.
 * Does not return partial successes or accumulate errors. Already-created results
 * have already executed their work; this helper only combines their outcomes.
 *
 * @param results - The results to collect, without mutating the input
 * @returns All success values in order, or the original first failure; empty input is Ok([])
 *
 * @example
 * ```ts
 * collectResults([ok(1), ok(2)])       // Ok([1, 2])
 * collectResults([ok(1), err('bad')])  // original Err
 * ```
 */
export function collectResults<R extends Result<unknown>>(
  results: readonly R[]
): Result<ResultValue<R>[], ResultError<R>>
export function collectResults<T, E extends Error>(
  results: readonly Result<T, E>[]
): Result<T[], E> {
  return match(results.find(isErr))
    .with(undefined, () => ok(results.filter(isOk).map(({ value }) => value)))
    .otherwise((failure) => failure)
}
