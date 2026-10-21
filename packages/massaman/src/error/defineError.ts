import { isFunction } from 'es-toolkit/predicate'
import { match, P } from 'ts-pattern'

import { createError } from './createError.js'
import type { ErrorDefinition, ErrorFrom, ErrorInput } from './types.js'

/**
 * Defines a callable error constructor from a static definition or a function.
 * Every call creates a fresh native error through `createError`.
 *
 * @param definition - An error definition, or a function that builds one
 * @returns A constructor preserving the builder's arguments and error fields
 *
 * @example
 * ```ts
 * const notFound = defineError((userId: string) => ({
 *   name: 'NotFound',
 *   message: `User ${userId} not found`,
 *   userId,
 * }))
 * err(notFound('123'))
 *
 * const unauthorized = defineError({
 *   name: 'Unauthorized',
 *   message: 'Sign in first',
 * })
 * unauthorized()
 * ```
 */
export function defineError<const Input extends ErrorInput, Args extends readonly unknown[]>(
  definition: (...args: Args) => Input
): (...args: Args) => ErrorFrom<Input>
export function defineError<E extends Error, Args extends readonly unknown[]>(
  definition: (...args: Args) => ErrorDefinition<E>
): (...args: Args) => E
export function defineError<const Input extends ErrorInput>(
  definition: Input
): () => ErrorFrom<Input>
export function defineError<E extends Error>(definition: ErrorDefinition<E>): () => E
export function defineError<Args extends readonly unknown[]>(
  definition: ErrorInput | ((...args: Args) => ErrorInput)
): (...args: Args) => Error {
  return match(definition)
    .with(
      P.when(isFunction),
      (build) =>
        (...args: Args) =>
          createError(build(...args))
    )
    .otherwise((input) => () => createError(input))
}
