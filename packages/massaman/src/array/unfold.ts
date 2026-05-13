/**
 * Builds an array from a seed value using an iterator function.
 *
 * The iterator receives the current seed and returns either a `[value, nextSeed]`
 * tuple to continue, or `false` to stop.
 *
 * Dual of `reduce` — reduce collapses a list into a value, unfold expands
 * a value into a list.
 *
 * **Termination is the caller's responsibility.** If `fn` never returns
 * `false`, `unfold` will run until memory is exhausted. For bounded
 * generation, encode a counter or limit into the seed.
 *
 * @example
 * ```ts
 * unfold((n) => (n > 0 ? [n, n - 1] : false), 5)
 * // [5, 4, 3, 2, 1]
 * ```
 */
export function unfold<T, R>(fn: (seed: T) => [R, T] | false, seed: T): R[] {
  const result: R[] = []
  // oxlint-disable-next-line functional/no-let -- iterative impl avoids stack overflow on large outputs
  let current = seed
  // oxlint-disable-next-line functional/no-let -- iterative impl avoids stack overflow on large outputs
  let pair = fn(current)
  while (pair !== false) {
    result.push(pair[0])
    current = pair[1]
    pair = fn(current)
  }
  return result
}
