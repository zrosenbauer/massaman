import { isErr, isOk } from './result.js'
import type { Result, ResultError, ResultValue } from './types.js'

/**
 * Separates every success value and error into two arrays, preserving group order.
 * Returns plain data, not a Result, and never normalizes or discards existing errors.
 *
 * @param results - The results to partition, without mutating the input
 * @returns Success values and original errors; empty input produces two empty arrays
 *
 * @example
 * ```ts
 * partitionResults([ok(1), err('bad'), ok(3)])
 * // { values: [1, 3], errors: [Error('bad')] }
 * ```
 */
export function partitionResults<R extends Result<unknown>>(
  results: readonly R[]
): { values: ResultValue<R>[]; errors: ResultError<R>[] }
export function partitionResults<T, E extends Error>(
  results: readonly Result<T, E>[]
): { values: T[]; errors: E[] } {
  return {
    values: results.filter(isOk).map(({ value }) => value),
    errors: results.filter(isErr).map(({ error }) => error),
  }
}
