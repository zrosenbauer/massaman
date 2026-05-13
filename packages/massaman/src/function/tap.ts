/**
 * Returns a function that runs a side-effect and returns the value unchanged.
 *
 * Useful for debugging inside `flow` pipelines without breaking the chain.
 *
 * @example
 * ```ts
 * const process = flow(
 *   fetchUsers,
 *   tap(users => console.log('count:', users.length)),
 *   filterActive,
 * )
 * ```
 */
export function tap<T>(fn: (value: T) => unknown): (value: T) => T {
  return (value: T) => {
    fn(value)
    return value
  }
}
