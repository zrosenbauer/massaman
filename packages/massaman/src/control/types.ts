/**
 * Success result containing a value.
 *
 * @example
 * ```ts
 * const result: Ok<number> = { ok: true, value: 42 }
 * ```
 */
export interface Ok<T> {
  readonly ok: true
  readonly value: T
  readonly error: null
}

/**
 * Failure result containing an error.
 *
 * @example
 * ```ts
 * const result: Err<TypeError> = {
 *   ok: false,
 *   value: null,
 *   error: new TypeError('fail'),
 * }
 * ```
 */
export interface Err<E extends Error = Error> {
  readonly ok: false
  readonly value: null
  readonly error: E
}

/**
 * Discriminated union representing either success (`Ok`) or failure (`Err`).
 * Inspired by Rust's `Result<T, E>`.
 *
 * @example
 * ```ts
 * function divide(a: number, b: number): Result<number> {
 *   return b === 0 ? err('division by zero') : ok(a / b)
 * }
 * ```
 */
export type Result<T, E extends Error = Error> = Ok<T> | Err<E>
