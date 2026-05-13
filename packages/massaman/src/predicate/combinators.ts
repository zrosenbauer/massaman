import type { DangerouslyAllowAny } from '../types/internal.js'

/**
 * Extracts the narrowed target type from a type-guard predicate.
 * Returns `never` for plain `boolean` predicates so they don't pollute
 * the union/intersection downstream.
 *
 * `DangerouslyAllowAny` is required here: this conditional needs to match
 * predicate signatures with arbitrary input types (`(n: number) => …`,
 * `(s: string) => …`, etc.). `unknown` would reject those by contravariance.
 */
type Guarded<P> = P extends ((value: DangerouslyAllowAny) => value is infer X) ? X : never

/**
 * Extracts the input type from a tuple of predicates. Uses `infer V` in
 * contravariant position so multiple predicates with the same input type
 * collapse to that type. Return-position is `unknown` (covariant, accepts
 * any return value).
 */
type InferInput<Ps> = Ps extends ReadonlyArray<(value: infer V) => unknown> ? V : never

/**
 * Converts a union `A | B | C` to an intersection `A & B & C`.
 * Standard contravariant-position trick.
 */
type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never

/**
 * Returns a predicate that checks if a value satisfies ALL predicates.
 *
 * When every input is a type guard, the result narrows to the intersection
 * of every guard's target type. Plain `boolean` predicates contribute nothing
 * to the narrowing (they fall back to no-op).
 *
 * @example
 * ```ts
 * const isPositiveEven = allPass([(n: number) => n > 0, (n: number) => n % 2 === 0])
 * isPositiveEven(4) // true
 *
 * const isNonEmptyString = allPass([isString, isNotEmpty])
 * if (isNonEmptyString(x)) {
 *   // x is narrowed to string here
 * }
 * ```
 */
export function allPass<T>(predicates: readonly []): (value: T) => true
export function allPass<Ps extends ReadonlyArray<(value: DangerouslyAllowAny) => boolean>>(
  predicates: Ps
): (value: InferInput<Ps>) => value is InferInput<Ps> & UnionToIntersection<Guarded<Ps[number]>>
export function allPass(
  predicates: ReadonlyArray<(value: unknown) => boolean>
): (value: unknown) => boolean {
  return (value: unknown) => predicates.every((pred) => pred(value))
}

/**
 * Returns a predicate that checks if a value satisfies ANY predicate.
 *
 * When every input is a type guard, the result narrows to the union of every
 * guard's target type (since only one needs to match).
 *
 * @example
 * ```ts
 * const isAdminOrOwner = anyPass([isAdmin, isOwner])
 * isAdminOrOwner(user)
 *
 * const isStringOrNumber = anyPass([isString, isNumber])
 * if (isStringOrNumber(x)) {
 *   // x is narrowed to string | number here
 * }
 * ```
 */
export function anyPass<T>(predicates: readonly []): (value: T) => false
export function anyPass<Ps extends ReadonlyArray<(value: DangerouslyAllowAny) => boolean>>(
  predicates: Ps
): (value: InferInput<Ps>) => value is InferInput<Ps> & Guarded<Ps[number]>
export function anyPass(
  predicates: ReadonlyArray<(value: unknown) => boolean>
): (value: unknown) => boolean {
  return (value: unknown) => predicates.some((pred) => pred(value))
}

/**
 * Returns a predicate that checks if a value satisfies both predicates.
 *
 * Binary AND combinator — shorthand for `allPass([f, g])`. When both inputs
 * are type guards, the result narrows to the intersection of their target types.
 *
 * @example
 * ```ts
 * const isPositiveEven = both((n: number) => n > 0, (n: number) => n % 2 === 0)
 * isPositiveEven(4)
 * ```
 */
export function both<T, A extends T, B extends T>(
  f: (value: T) => value is A,
  g: (value: T) => value is B
): (value: T) => value is A & B
export function both<T>(f: (value: T) => boolean, g: (value: T) => boolean): (value: T) => boolean
export function both<T>(f: (value: T) => boolean, g: (value: T) => boolean): (value: T) => boolean {
  return (value: T) => f(value) && g(value)
}

/**
 * Returns a predicate that checks if a value satisfies either predicate.
 *
 * Binary OR combinator — shorthand for `anyPass([f, g])`. When both inputs
 * are type guards, the result narrows to the union of their target types.
 *
 * @example
 * ```ts
 * const isNilOrEmpty = either(isNil, (s: string) => s === '')
 * isNilOrEmpty(null)
 * ```
 */
export function either<T, A extends T, B extends T>(
  f: (value: T) => value is A,
  g: (value: T) => value is B
): (value: T) => value is A | B
export function either<T>(f: (value: T) => boolean, g: (value: T) => boolean): (value: T) => boolean
export function either<T>(
  f: (value: T) => boolean,
  g: (value: T) => boolean
): (value: T) => boolean {
  return (value: T) => f(value) || g(value)
}
