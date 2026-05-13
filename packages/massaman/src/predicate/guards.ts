/**
 * Checks if a value is an array.
 *
 * @example
 * ```ts
 * isArray([1, 2]) // true
 * isArray('hello') // false
 * ```
 */
export const isArray = Array.isArray

/**
 * Checks if a value is a non-null object.
 *
 * Returns `true` for plain objects, arrays, class instances, etc.
 * Returns `false` for `null`, primitives, and functions.
 *
 * @example
 * ```ts
 * isObject({}) // true
 * isObject(null) // false
 * ```
 */
export function isObject(value: unknown): value is object {
  return value !== null && typeof value === 'object'
}

/**
 * Checks if a value is empty.
 *
 * - Strings: `''`
 * - Arrays: `length === 0`
 * - Maps/Sets: `size === 0`
 * - Objects: no own enumerable keys
 *
 * @example
 * ```ts
 * isEmpty('') // true
 * isEmpty([]) // true
 * isEmpty({}) // true
 * isEmpty(new Map()) // true
 * ```
 */
export function isEmpty(value: string | object): boolean {
  if (typeof value === 'string' || Array.isArray(value)) {
    return value.length === 0
  }
  if (value instanceof Map || value instanceof Set) {
    return value.size === 0
  }
  return Object.keys(value).length === 0
}

/**
 * Checks if a value is not empty. Complement of {@link isEmpty}.
 *
 * @example
 * ```ts
 * isNotEmpty('hello') // true
 * isNotEmpty([]) // false
 * ```
 */
export function isNotEmpty(value: string | object): boolean {
  return !isEmpty(value)
}

/**
 * Checks if a value is a finite number.
 *
 * @example
 * ```ts
 * isFiniteNumber(42) // true
 * isFiniteNumber(Infinity) // false
 * ```
 */
export const isFiniteNumber: (value: unknown) => boolean = Number.isFinite

/**
 * Checks if a value is an integer.
 *
 * @example
 * ```ts
 * isInteger(42) // true
 * isInteger(4.2) // false
 * ```
 */
export const isInteger: (value: unknown) => boolean = Number.isInteger

/**
 * Checks if a value is NaN.
 *
 * @example
 * ```ts
 * isNaN(NaN) // true
 * isNaN(42) // false
 * ```
 */
export const isNaN: (value: unknown) => boolean = Number.isNaN
