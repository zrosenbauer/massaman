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
 * const result: Err = { ok: false, error: new Error('fail') }
 * ```
 */
export interface Err {
  readonly ok: false
  readonly value: null
  readonly error: Error
}

/**
 * Discriminated union representing either success (`Ok`) or failure (`Err`).
 * Inspired by Rust's `Result<T, E>`, but errors are always `Error`.
 *
 * @example
 * ```ts
 * function divide(a: number, b: number): Result<number> {
 *   return b === 0 ? err('division by zero') : ok(a / b)
 * }
 * ```
 */
export type Result<T> = Ok<T> | Err
