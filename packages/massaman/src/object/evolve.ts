/* oxlint-disable security/detect-object-injection -- keys sourced from Object.keys(spec), not user input */

/**
 * Applies a spec of transformation functions to matching keys of an object,
 * returning a new object. Keys not in the spec are copied as-is.
 *
 * @example
 * ```ts
 * evolve({ name: '  Alice  ', age: 29, role: 'admin' }, {
 *   name: (s) => s.trim(),
 *   age: (n) => n + 1,
 * })
 * // { name: 'Alice', age: 30, role: 'admin' }
 * ```
 */
export function evolve<T extends Record<string, unknown>>(
  obj: T,
  spec: { [K in keyof T]?: (value: T[K]) => T[K] }
): T {
  const result = { ...obj }
  for (const key of Object.keys(spec) as Array<keyof T>) {
    const transform = spec[key]
    if (transform != null && key in result) {
      result[key] = transform(result[key])
    }
  }
  return result
}
