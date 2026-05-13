/**
 * Creates an ascending comparator from an accessor function.
 *
 * @example
 * ```ts
 * users.sort(ascend(u => u.name))
 * ```
 */
export function ascend<T>(fn: (value: T) => number | string): (a: T, b: T) => number {
  return (a: T, b: T) => {
    const aa = fn(a)
    const bb = fn(b)
    if (aa < bb) {
      return -1
    }
    if (aa > bb) {
      return 1
    }
    return 0
  }
}

/**
 * Creates a descending comparator from an accessor function.
 *
 * @example
 * ```ts
 * users.sort(descend(u => u.age))
 * ```
 */
export function descend<T>(fn: (value: T) => number | string): (a: T, b: T) => number {
  return (a: T, b: T) => {
    const aa = fn(a)
    const bb = fn(b)
    if (aa > bb) {
      return -1
    }
    if (aa < bb) {
      return 1
    }
    return 0
  }
}

/**
 * Sorts an array using multiple comparators in priority order.
 *
 * The first comparator has highest priority. When it returns 0 (tie),
 * the next comparator is used, and so on.
 *
 * @example
 * ```ts
 * sortWith(users, [
 *   ascend(u => u.department),
 *   descend(u => u.age),
 * ])
 * ```
 */
export function sortWith<T>(
  array: readonly T[],
  comparators: ReadonlyArray<(a: T, b: T) => number>
): T[] {
  return [...array].toSorted((a, b) => {
    for (const cmp of comparators) {
      const result = cmp(a, b)
      if (result !== 0) {
        return result
      }
    }
    return 0
  })
}
