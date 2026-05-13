import type { DangerouslyAllowAny } from '../types/internal.js'

type MaybePromise<T> = T | Promise<T>

/**
 * Creates an async pipeline that awaits each step before passing the result
 * to the next function. Like {@link flow} from es-toolkit but async-aware.
 *
 * Each function can return a value or a Promise — `flowAsync` always returns
 * a Promise that resolves to the final step's awaited result.
 *
 * @example
 * ```ts
 * const getUsername = flowAsync(
 *   (id: string) => fetchUser(id),  // Promise<User>
 *   (user) => user.name,            // string
 *   (name) => name.toUpperCase(),
 * )
 * await getUsername('123') // 'ALICE'
 * ```
 */
export function flowAsync<A extends readonly unknown[], R1>(
  f1: (...args: A) => MaybePromise<R1>
): (...args: A) => Promise<Awaited<R1>>
export function flowAsync<A extends readonly unknown[], R1, R2>(
  f1: (...args: A) => MaybePromise<R1>,
  f2: (a: Awaited<R1>) => MaybePromise<R2>
): (...args: A) => Promise<Awaited<R2>>
export function flowAsync<A extends readonly unknown[], R1, R2, R3>(
  f1: (...args: A) => MaybePromise<R1>,
  f2: (a: Awaited<R1>) => MaybePromise<R2>,
  f3: (a: Awaited<R2>) => MaybePromise<R3>
): (...args: A) => Promise<Awaited<R3>>
export function flowAsync<A extends readonly unknown[], R1, R2, R3, R4>(
  f1: (...args: A) => MaybePromise<R1>,
  f2: (a: Awaited<R1>) => MaybePromise<R2>,
  f3: (a: Awaited<R2>) => MaybePromise<R3>,
  f4: (a: Awaited<R3>) => MaybePromise<R4>
): (...args: A) => Promise<Awaited<R4>>
export function flowAsync<A extends readonly unknown[], R1, R2, R3, R4, R5>(
  f1: (...args: A) => MaybePromise<R1>,
  f2: (a: Awaited<R1>) => MaybePromise<R2>,
  f3: (a: Awaited<R2>) => MaybePromise<R3>,
  f4: (a: Awaited<R3>) => MaybePromise<R4>,
  f5: (a: Awaited<R4>) => MaybePromise<R5>
): (...args: A) => Promise<Awaited<R5>>
export function flowAsync<A extends readonly unknown[], R1, R2, R3, R4, R5, R6>(
  f1: (...args: A) => MaybePromise<R1>,
  f2: (a: Awaited<R1>) => MaybePromise<R2>,
  f3: (a: Awaited<R2>) => MaybePromise<R3>,
  f4: (a: Awaited<R3>) => MaybePromise<R4>,
  f5: (a: Awaited<R4>) => MaybePromise<R5>,
  f6: (a: Awaited<R5>) => MaybePromise<R6>
): (...args: A) => Promise<Awaited<R6>>
export function flowAsync<A extends readonly unknown[], R1, R2, R3, R4, R5, R6, R7>(
  f1: (...args: A) => MaybePromise<R1>,
  f2: (a: Awaited<R1>) => MaybePromise<R2>,
  f3: (a: Awaited<R2>) => MaybePromise<R3>,
  f4: (a: Awaited<R3>) => MaybePromise<R4>,
  f5: (a: Awaited<R4>) => MaybePromise<R5>,
  f6: (a: Awaited<R5>) => MaybePromise<R6>,
  f7: (a: Awaited<R6>) => MaybePromise<R7>
): (...args: A) => Promise<Awaited<R7>>
export function flowAsync(
  first: (...args: readonly DangerouslyAllowAny[]) => unknown,
  ...rest: ReadonlyArray<(arg: DangerouslyAllowAny) => unknown>
): (...args: readonly unknown[]) => Promise<unknown> {
  return async (...args: readonly unknown[]) =>
    rest.reduce<Promise<unknown>>(async (acc, fn) => fn(await acc), Promise.resolve(first(...args)))
}
