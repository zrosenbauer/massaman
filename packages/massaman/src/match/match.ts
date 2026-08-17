/**
 * Extends ts-pattern's `P` namespace with `P.ok()` and `P.err()` — pattern
 * factories for matching a `Result` and its contained value or error.
 *
 * Mirrors Rust's `Ok(value)` / `Err(error)` match arms, but uses the
 * namespace-method form (`P.ok()` / `P.err()`) so it doesn't collide with
 * the lowercase `ok()` / `err()` constructors from `massaman/control`.
 *
 * @example
 * ```ts
 * import { match, P, attempt } from 'massaman'
 *
 * match(attempt(() => JSON.parse(raw)))
 *   .with(P.ok(), ({ value }) => use(value))
 *   .with(P.err(), ({ error }) => log(error))
 *   .exhaustive()
 * ```
 */

import { match as matchValue, P as TsP } from 'ts-pattern'

import type { Err as ErrType, Ok as OkType } from '../control/types.js'

function okPattern(): { ok: true }
function okPattern<const pattern extends TsP.Pattern<unknown>>(
  pattern: pattern
): { ok: true; value: pattern }
function okPattern(
  ...patterns: readonly [] | readonly [TsP.Pattern<unknown>]
): { ok: true } | { ok: true; value: TsP.Pattern<unknown> } {
  return matchValue(patterns)
    .with([], () => ({ ok: true as const }))
    .otherwise(([pattern]) => ({ ok: true as const, value: pattern }))
}

function errPattern(): { ok: false }
function errPattern<const pattern extends TsP.Pattern<unknown>>(
  pattern: pattern
): { ok: false; error: pattern }
function errPattern(
  ...patterns: readonly [] | readonly [TsP.Pattern<unknown>]
): { ok: false } | { ok: false; error: TsP.Pattern<unknown> } {
  return matchValue(patterns)
    .with([], () => ({ ok: false as const }))
    .otherwise(([pattern]) => ({ ok: false as const, error: pattern }))
}

/**
 * Extended ts-pattern `P` namespace. Carries everything ts-pattern exports
 * (`P.string`, `P.number`, `P.array`, `P.when`, …) plus `P.ok()` / `P.err()`
 * for matching `Result` values and their contents.
 *
 * For the `P.Pattern<T>` type shorthand, import `Pattern` standalone from
 * `massaman/match` — it's the form ts-pattern's own docs recommend.
 */
export const P: typeof TsP & { ok: typeof okPattern; err: typeof errPattern } = {
  ...TsP,
  ok: okPattern,
  err: errPattern,
}

/**
 * The `Ok` variant of a `Result<T>`. Re-exported here so the value-side
 * patterns and the type-side `Ok<T>` live in one module — any consumer
 * import gets both type and value namespaces without cross-module merge
 * issues (TS2300).
 */
export type Ok<T> = OkType<T>

/**
 * The `Err` variant of a `Result<T>`. See {@link Ok} for the co-location note.
 */
export type Err = ErrType
