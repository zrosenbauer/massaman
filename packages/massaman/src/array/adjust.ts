/**
 * Applies a function to the element at the given index, returning a new array.
 *
 * The original array is not modified. If the index is out of bounds, the
 * array is returned unchanged.
 *
 * @example
 * ```ts
 * adjust([1, 2, 3], 1, (n) => n * 10)
 * // [1, 20, 3]
 * ```
 */
export function adjust<T>(array: readonly T[], index: number, fn: (value: T) => T): T[] {
  const result = [...array]
  if (index >= 0 && index < array.length) {
    // oxlint-disable-next-line security/detect-object-injection -- Numeric array index parameter, not user-controlled key
    result[index] = fn(result[index])
  }
  return result
}
