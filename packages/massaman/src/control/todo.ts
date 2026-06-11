import { isNil } from 'es-toolkit/predicate'

/**
 * Stub for a code path you intend to write but haven't. Throws at runtime,
 * returns `never` so it typechecks in any position.
 *
 * For paths you intentionally don't support, see `unimplemented`.
 * For paths that should be impossible, see `unreachable`.
 *
 * @param message - Optional context appended to the thrown error
 * @returns Never returns — always throws
 *
 * @example
 * ```ts
 * function parseConfig(raw: string): Config {
 *   return todo('waiting on schema decision')
 * }
 * ```
 */
export function todo(message?: string): never {
  if (isNil(message)) {
    throw new Error('not yet implemented')
  }
  throw new Error(`not yet implemented: ${message}`)
}
