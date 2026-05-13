/**
 * Removes consecutively repeated elements from an array using strict
 * equality (`===`).
 *
 * Only adjacent duplicates are removed — non-adjacent duplicates are kept.
 * Use {@link uniq} from es-toolkit to remove all duplicates regardless of position.
 *
 * Quirks (inherent to `===`):
 * - `NaN !== NaN`, so adjacent `NaN`s are *not* collapsed.
 * - `-0 === 0`, so adjacent `-0` and `0` *are* collapsed.
 * - Object/array elements compare by reference, not structure.
 *
 * @example
 * ```ts
 * dropRepeats([1, 1, 2, 3, 3, 2, 1])
 * // [1, 2, 3, 2, 1]
 * ```
 */
export function dropRepeats<T>(array: readonly T[]): T[] {
  return array.reduce<T[]>((acc, item, index) => {
    if (index === 0 || item !== array[index - 1]) {
      acc.push(item)
    }
    return acc
  }, [])
}
