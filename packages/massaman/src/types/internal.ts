/**
 * Explicit alias for `any` that makes dangerous intent visible at the call site.
 *
 * The `typescript/no-explicit-any` lint rule is configured as an error, so raw
 * `any` is banned. Use this alias only when `unknown` genuinely will not work —
 * almost always in conditional types that need to match function signatures with
 * arbitrary parameter types, where contravariance makes `unknown` reject narrow
 * predicates like `(n: number) => boolean`.
 *
 * Reach for this last. If you can use `unknown`, use `unknown`.
 *
 * @example
 * ```ts
 * // Generic over a tuple of predicates with arbitrary input types:
 * type Guarded<P> = P extends (value: DangerouslyAllowAny) => value is infer X ? X : never
 * ```
 */
// oxlint-disable-next-line typescript/no-explicit-any -- centralized escape hatch: this is the ONLY place `any` is allowed
export type DangerouslyAllowAny = any
