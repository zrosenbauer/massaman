/**
 * Returns a function that applies a transform only when a predicate passes,
 * otherwise returns the value unchanged.
 *
 * @example
 * ```ts
 * const trimIfString = when(isString, (s: string) => s.trim())
 * trimIfString('  hello  ') // 'hello'
 * ```
 */
export function when<T>(predicate: (value: T) => boolean, fn: (value: T) => T): (value: T) => T {
  return (value: T) => {
    if (predicate(value)) {
      return fn(value)
    }
    return value
  }
}

/**
 * Returns a function that applies a transform only when a predicate fails,
 * otherwise returns the value unchanged.
 *
 * Complement of {@link when}.
 *
 * @example
 * ```ts
 * const ensureArray = unless(Array.isArray, (v) => [v])
 * ensureArray(42) // [42]
 * ensureArray([1]) // [1]
 * ```
 */
export function unless<T>(predicate: (value: T) => boolean, fn: (value: T) => T): (value: T) => T {
  return (value: T) => {
    if (predicate(value)) {
      return value
    }
    return fn(value)
  }
}

/**
 * Returns a function that branches between two functions based on a predicate.
 *
 * @example
 * ```ts
 * const format = ifElse(
 *   (n: number) => n > 0,
 *   (n) => `+${n}`,
 *   (n) => `${n}`,
 * )
 * format(5)  // '+5'
 * format(-3) // '-3'
 * ```
 */
export function ifElse<T, R>(
  predicate: (value: T) => boolean,
  onTrue: (value: T) => R,
  onFalse: (value: T) => R
): (value: T) => R {
  return (value: T) => {
    if (predicate(value)) {
      return onTrue(value)
    }
    return onFalse(value)
  }
}
