/**
 * Extends ts-pattern's `P` namespace with `P.ok` and `P.err` — structural
 * patterns for matching a `Result` inside `match()`.
 *
 * Mirrors Rust's `Ok(value)` / `Err(error)` match arms, but uses the
 * namespace-property form (`P.ok` / `P.err`) so it doesn't collide with
 * the lowercase `ok()` / `err()` constructors from `massaman/control`.
 *
 * @example
 * ```ts
 * import { match, P, attempt } from 'massaman'
 *
 * match(attempt(() => JSON.parse(raw)))
 *   .with(P.ok, ({ value }) => use(value))
 *   .with(P.err, ({ error }) => log(error))
 *   .exhaustive()
 * ```
 */

import { P as TsP } from 'ts-pattern'

import type { Err as ErrType, Ok as OkType } from '../control/types.js'

const okPattern: { ok: true } = { ok: true }
const errPattern: { ok: false } = { ok: false }

/**
 * Extended ts-pattern `P` namespace. Carries everything ts-pattern exports
 * (`P.string`, `P.number`, `P.array`, `P.when`, …) plus `P.ok` / `P.err`
 * for matching `Result` values.
 *
 * Explicit literal-type annotations on the additions (rather than `as const`)
 * keep the values non-`readonly`, which ts-pattern's narrowing requires —
 * a `readonly` pattern collapses the remaining input to `never` after the
 * first arm, breaking exhaustiveness.
 *
 * For the `P.Pattern<T>` type shorthand, import `Pattern` standalone from
 * `massaman/match` — it's the form ts-pattern's own docs recommend.
 */
export const P: typeof TsP & { ok: { ok: true }; err: { ok: false } } = {
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
