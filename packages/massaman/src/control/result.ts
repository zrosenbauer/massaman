import { isNil } from 'es-toolkit/predicate'

import type { Err, Ok, Result } from './types.js'

/**
 * Minimal error coercion used internally by `err()`. Kept local to avoid
 * pulling the full conversion module into the `massaman/control` bundle.
 * For richer stringification (Maps, Sets, Errors with own props, circular
 * refs), import `toError` from `massaman/conversion`.
 */
function coerceError(thrown: unknown): Error {
  if (thrown instanceof Error) {
    return thrown
  }
  if (typeof thrown === 'string') {
    return new Error(thrown)
  }
  try {
    const message = JSON.stringify(thrown) ?? String(thrown)
    return new Error(message, { cause: thrown })
  } catch {
    return new Error(String(thrown), { cause: thrown })
  }
}

/**
 * Creates a success result wrapping the given value.
 *
 * @param value - The success value
 * @returns An `Ok` result containing the value
 *
 * @example
 * ```ts
 * const result = ok(42)
 * // { ok: true, value: 42 }
 * ```
 */
export function ok<T>(value: T): Ok<T> {
  return { ok: true, value, error: null }
}

/**
 * Creates a failure result wrapping the given error.
 *
 * @param error - The error value
 * @returns An `Err` result containing the error
 *
 * @example
 * ```ts
 * const result = err(new Error('fail'))
 * // { ok: false, error: Error('fail') }
 * ```
 */
export function err(error: unknown): Err {
  return { ok: false, value: null, error: coerceError(error) }
}

/**
 * Type guard that narrows a `Result` to `Ok`.
 *
 * @param result - The result to check
 * @returns `true` if the result is `Ok`
 *
 * @example
 * ```ts
 * const result = attempt(() => JSON.parse('{}'))
 * if (isOk(result)) {
 *   console.log(result.value)
 * }
 * ```
 */
export function isOk<T>(result: Result<T>): result is Ok<T> {
  return result.ok === true
}

/**
 * Type guard that narrows a `Result` to `Err`.
 *
 * @param result - The result to check
 * @returns `true` if the result is `Err`
 *
 * @example
 * ```ts
 * const result = attempt(() => JSON.parse('bad'))
 * if (isErr(result)) {
 *   console.error(result.error)
 * }
 * ```
 */
export function isErr<T>(result: Result<T>): result is Err {
  return result.ok === false
}

/**
 * Extract the value from an `Ok` result, or throw on `Err`.
 *
 * When called without a message, throws the original error.
 * When called with a message, throws a new Error with that message
 * and the original error as `cause` (like Rust's `expect`).
 *
 * @param result - The result to unwrap
 * @param message - Optional custom error message (Rust `expect` behavior)
 * @returns The unwrapped value
 *
 * @example
 * ```ts
 * const value = unwrap(ok(42))           // 42
 * unwrap(err('fail'))                    // throws Error('fail')
 * unwrap(err('fail'), 'config required') // throws Error('config required', { cause: Error('fail') })
 * ```
 */
export function unwrap<T>(result: Result<T>, message?: string): T {
  if (result.ok) {
    return result.value
  }
  if (!isNil(message)) {
    throw new Error(message, { cause: result.error })
  }
  throw result.error
}
