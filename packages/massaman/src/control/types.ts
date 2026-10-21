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

/** @private Extracts only success payloads, excluding the failure variant's null field. */
export type ResultValue<R extends Result<unknown>> = Extract<R, { ok: true }>['value']

/** @private Extracts only failure payloads, excluding the success variant's null field. */
export type ResultError<R extends Result<unknown>> = Extract<R, { ok: false }>['error']
