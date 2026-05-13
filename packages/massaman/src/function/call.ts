/**
 * Invokes a function with the provided arguments and returns the result.
 *
 * Equivalent to `fn(...args)` — exists as a stable, named surface for the
 * "apply function to args" operation. Use inside `.map(call)` over arrays
 * of thunks, or anywhere a value-position function-call is clearer than an
 * inline arrow.
 *
 * @example
 * ```ts
 * call(Math.max, 1, 2, 3) // 3
 * [getUser, getAccount, getPrefs].map((fn) => call(fn))
 * ```
 */
export function call<A extends readonly unknown[], R>(fn: (...args: A) => R, ...args: A): R {
  return fn(...args)
}

/**
 * Invokes a function returning a Promise with the provided arguments.
 *
 * Async-typed sibling of {@link call} — equivalent to `fn(...args)` for
 * promise-returning functions, but the signature constrains the return to
 * `Promise<R>` so it composes cleanly inside async pipelines.
 *
 * @example
 * ```ts
 * const user = await callAsync(fetchUser, 'user-123')
 * ```
 */
export async function callAsync<A extends readonly unknown[], R>(
  fn: (...args: A) => Promise<R>,
  ...args: A
): Promise<R> {
  return fn(...args)
}
