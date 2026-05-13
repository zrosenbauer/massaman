import { isError, isMap, isNil, isPrimitive, isSet, isString } from 'es-toolkit/predicate'

/**
 * Coerces an unknown thrown value into a proper `Error` instance.
 *
 * Handles the common cases where libraries throw non-`Error` values
 * (e.g. plain API response bodies, arrays, Maps) that would otherwise
 * serialize as `[object Object]` in error messages.
 *
 * @param thrown - The caught value from a `catch` block.
 * @returns An `Error` with a meaningful `.message`. If `thrown` is
 *   already an `Error`, it is returned as-is. The original value is
 *   preserved as `.cause` for debugging.
 *
 * @example
 * ```ts
 * try {
 *   await riskyCall()
 * } catch (thrown) {
 *   const error = toError(thrown)
 *   console.error(error.message)
 * }
 * ```
 */
export function toError(thrown: unknown): Error {
  if (isError(thrown)) {
    return thrown
  }
  if (isString(thrown)) {
    return new Error(thrown)
  }
  return new Error(stringify(thrown), { cause: thrown })
}

/**
 * Produces a human-readable string from any unknown value.
 *
 * Uses `JSON.stringify` for structured types (plain objects, arrays)
 * so the message contains actual content instead of `[object Object]`.
 * Maps and Sets are converted to their array representation first.
 * Falls back to `String()` for primitives or when serialization fails
 * (e.g. circular references).
 *
 * @param value - The value to stringify.
 * @returns A meaningful string representation.
 *
 * @example
 * ```ts
 * stringify({ status: 400 })          // '{"status":400}'
 * stringify(new Map([['k', 'v']]))    // '[["k","v"]]'
 * stringify(null)                     // 'null'
 * stringify(42)                       // '42'
 * ```
 */
export function stringify(value: unknown): string {
  if (isNil(value) || isPrimitive(value)) {
    return String(value)
  }
  try {
    return JSON.stringify(toSerializable(value))
  } catch {
    return String(value)
  }
}

// ---------------------------------------------------------------------------
// private helpers
// ---------------------------------------------------------------------------

/**
 * Convert types that `JSON.stringify` handles poorly into
 * serializable equivalents, recursively walking objects and arrays.
 *
 * - `Map` -> array of `[key, value]` entries (recursed)
 * - `Set` -> array of values (recursed)
 * - `Error` -> plain object with `name`, `message`, `stack`, and enumerable props
 * - Arrays and plain objects are recursed
 * - Uses a `WeakSet` to detect and break circular references
 */
function toSerializable(value: unknown, seen: WeakSet<object> = new WeakSet()): unknown {
  if (isNil(value) || isPrimitive(value)) {
    return value
  }

  const obj = value as object
  if (seen.has(obj)) {
    return '[Circular]'
  }
  seen.add(obj)

  if (isError(value)) {
    const errorObj: Record<string, unknown> = {
      name: value.name,
      message: value.message,
      stack: value.stack,
    }
    for (const key of Object.keys(value)) {
      // oxlint-disable-next-line security/detect-object-injection -- safe: key from Object.keys
      errorObj[key] = toSerializable((value as unknown as Record<string, unknown>)[key], seen)
    }
    return errorObj
  }

  if (isMap(value)) {
    return Array.from(value.entries()).map(([k, v]) => [
      toSerializable(k, seen),
      toSerializable(v, seen),
    ])
  }

  if (isSet(value)) {
    return Array.from(value).map((v) => toSerializable(v, seen))
  }

  if (Array.isArray(value)) {
    return value.map((v) => toSerializable(v, seen))
  }

  const result: Record<string, unknown> = {}
  for (const key of Object.keys(value as Record<string, unknown>)) {
    // oxlint-disable-next-line security/detect-object-injection -- safe: key from Object.keys
    result[key] = toSerializable((value as Record<string, unknown>)[key], seen)
  }
  return result
}

/**
 * Converts a value to a number.
 *
 * Thin wrapper over `Number(value)` — kept as a stable surface so callers
 * don't depend directly on the global constructor's semantics (which have
 * shifted in the past, e.g. `Number(BigInt)`, and may again).
 *
 * @example
 * ```ts
 * toNumber('42') // 42
 * toNumber(null) // 0
 * ```
 */
export function toNumber(value: unknown): number {
  return Number(value)
}

/**
 * Converts a value to a string.
 *
 * Thin wrapper over `String(value)` — kept as a stable surface against
 * future global-constructor changes.
 *
 * @example
 * ```ts
 * toString(42) // '42'
 * toString(null) // 'null'
 * ```
 */
export function toString(value: unknown): string {
  return String(value)
}

/**
 * Converts a value to an integer by calling {@link toNumber} and truncating.
 *
 * @example
 * ```ts
 * toInteger('4.9') // 4
 * toInteger(null) // 0
 * ```
 */
export function toInteger(value: unknown): number {
  return Math.trunc(toNumber(value))
}

/**
 * Converts a value to a finite number.
 *
 * Returns `0` for non-finite results (`NaN`, `Infinity`, `-Infinity`).
 *
 * @example
 * ```ts
 * toFinite('3.14') // 3.14
 * toFinite(Infinity) // 0
 * ```
 */
export function toFinite(value: unknown): number {
  const n = Number(value)
  if (Number.isFinite(n)) {
    return n
  }
  return 0
}

/**
 * Converts a value to an array.
 *
 * - Arrays are returned as-is.
 * - Iterables (strings, Sets, Maps) are spread into an array.
 * - `null` / `undefined` return `[]`.
 * - All other values are wrapped in a single-element array.
 *
 * @example
 * ```ts
 * toArray(new Set([1, 2])) // [1, 2]
 * toArray('abc') // ['a', 'b', 'c']
 * toArray(null) // []
 * toArray(42) // [42]
 * ```
 */
export function toArray<T>(value: Iterable<T> | T | null | undefined): T[] {
  if (value == null) {
    return []
  }
  if (Array.isArray(value)) {
    return value as T[]
  }
  if (typeof (value as unknown as Record<symbol, unknown>)[Symbol.iterator] === 'function') {
    return Array.from(value as Iterable<T>)
  }
  return [value as T]
}

/**
 * Converts a value to a boolean.
 *
 * Thin wrapper over `Boolean(value)` — kept as a stable surface against
 * future global-constructor changes.
 *
 * @example
 * ```ts
 * toBoolean(1) // true
 * toBoolean(0) // false
 * toBoolean('') // false
 * ```
 */
export function toBoolean(value: unknown): boolean {
  return Boolean(value)
}
