import { isNil } from 'es-toolkit/predicate'

/**
 * Marks a code path as logically impossible. Throws at runtime if execution
 * gets there. Returns `never` so it typechecks in any position.
 *
 * For work you plan to finish later, see `todo`.
 * For paths you intentionally don't support, see `unimplemented`.
 *
 * @param message - Optional context appended to the thrown error
 * @returns Never returns — always throws
 *
 * @example
 * ```ts
 * function parseDigit(input: string): number {
 *   const parsed = Number.parseInt(input, 10)
 *   if (Number.isNaN(parsed)) {
 *     return unreachable('caller pre-validated')
 *   }
 *   return parsed
 * }
 * ```
 */
export function unreachable(message?: string): never {
  if (isNil(message)) {
    throw new Error('entered unreachable code')
  }
  throw new Error(`entered unreachable code: ${message}`)
}
