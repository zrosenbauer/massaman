/**
 * Like `reduce` but stops early when the predicate returns `false`.
 *
 * The predicate receives the current accumulator and element. When it
 * returns `false`, the current accumulator is returned without processing
 * the remaining elements.
 *
 * @example
 * ```ts
 * // Sum until we hit a negative number
 * reduceWhile(
 *   [1, 2, 3, -1, 5],
 *   (acc, n) => n >= 0,
 *   (acc, n) => acc + n,
 *   0,
 * )
 * // 6
 * ```
 */
export function reduceWhile<T, R>(
  array: readonly T[],
  predicate: (accumulator: R, value: T) => boolean,
  fn: (accumulator: R, value: T, index: number) => R,
  initial: R
): R {
  // oxlint-disable-next-line functional/no-let -- iterative impl avoids stack overflow on large arrays
  let acc = initial
  // oxlint-disable-next-line functional/no-let -- iterative impl avoids stack overflow on large arrays
  for (let index = 0; index < array.length; index += 1) {
    // oxlint-disable-next-line security/detect-object-injection -- Locally computed numeric array index
    const value = array[index]
    if (!predicate(acc, value)) {
      return acc
    }
    acc = fn(acc, value, index)
  }
  return acc
}
