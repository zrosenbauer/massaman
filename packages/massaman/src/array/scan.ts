/**
 * Like `reduce` but returns an array of all intermediate accumulator values.
 *
 * The result array starts with the initial value and ends with the final
 * accumulator, so its length is `array.length + 1`.
 *
 * @example
 * ```ts
 * scan([1, 2, 3, 4], (acc, n) => acc + n, 0)
 * // [0, 1, 3, 6, 10]
 * ```
 */
export function scan<T, R>(
  array: readonly T[],
  fn: (accumulator: R, value: T, index: number) => R,
  initial: R
): R[] {
  return array.reduce<R[]>(
    (result, item, index) => {
      const prev = result[result.length - 1]
      result.push(fn(prev, item, index))
      return result
    },
    [initial]
  )
}
