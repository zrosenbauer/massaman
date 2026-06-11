import { isNil } from 'es-toolkit/predicate'

/**
 * Marks a code path as intentionally unsupported. Throws at runtime, returns
 * `never` so it typechecks in any position.
 *
 * For work you plan to finish later, see `todo`.
 * For paths that should be impossible, see `unreachable`.
 *
 * @param message - Optional context appended to the thrown error
 * @returns Never returns — always throws
 *
 * @example
 * ```ts
 * type Driver = 'postgres' | 'sqlite' | 'mysql'
 *
 * function migrate(driver: Driver): void {
 *   return match(driver)
 *     .with('postgres', runPgMigration)
 *     .with('sqlite', runSqliteMigration)
 *     .with('mysql', () => unimplemented('mysql driver intentionally unsupported'))
 *     .exhaustive()
 * }
 * ```
 */
export function unimplemented(message?: string): never {
  if (isNil(message)) {
    throw new Error('not implemented')
  }
  throw new Error(`not implemented: ${message}`)
}
