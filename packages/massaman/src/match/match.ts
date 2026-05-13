/**
 * Structural patterns for matching `Result` values with `match()`.
 *
 * `Ok` and `Err` are the patterns; `ok()` and `err()` (from
 * `massaman/control`) are the constructors. This mirrors Rust, where `Ok(v)`
 * and `Err(e)` work in both expression and match-arm positions.
 *
 * Types and pattern values share the same names — TypeScript keeps types
 * and values in separate namespaces, so `type Ok<T>` and `const Ok` coexist
 * without ambiguity. Pick whichever form reads better in context.
 *
 * @example
 * ```ts
 * import { match, Ok, Err, attempt } from 'massaman'
 *
 * const parsed = attempt(() => JSON.parse(raw))
 *
 * match(parsed)
 *   .with(Ok, ({ value }) => use(value))
 *   .with(Err, ({ error }) => log(error))
 *   .exhaustive()
 * ```
 */

import type { Err as ErrType, Ok as OkType } from '../control/types.js'

/**
 * Pattern that matches an `Ok` Result. Equivalent to the inline pattern
 * `{ ok: true }`, but reads more like Rust's `Ok(value)` match arm.
 *
 * The explicit `{ ok: true }` type annotation (rather than `as const`) keeps
 * the value non-`readonly`, which is required for ts-pattern's input
 * narrowing to leave the `Err` case behind for the next arm.
 */
export const Ok: { ok: true } = { ok: true }

/**
 * Pattern that matches an `Err` Result. Equivalent to the inline pattern
 * `{ ok: false }`, but reads more like Rust's `Err(error)` match arm.
 */
export const Err: { ok: false } = { ok: false }

// Re-export the Result types here so the value `Ok`/`Err` and the type
// `Ok<T>`/`Err` merge in this module's scope. Re-exporting them from a
// barrel (e.g. via `export type { Ok }` and `export { Ok }` pointing at
// different modules) does NOT merge across modules and trips TS2300.

export type Ok<T> = OkType<T>
export type Err = ErrType
