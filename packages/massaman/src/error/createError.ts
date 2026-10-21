import { omit } from 'es-toolkit/object'

import type { ErrorDefinition, ErrorFrom, ErrorInput } from './types.js'

/**
 * Creates a native error with a typed name and custom data, without subclassing.
 *
 * @param definition - The name, message, optional cause, and custom fields
 * @returns A fresh native `Error` with a stack and readonly custom field types
 *
 * @example
 * ```ts
 * const failure = createError({
 *   name: 'NotFound',
 *   message: 'User not found',
 *   userId: '123',
 * })
 * err(failure)
 * ```
 */
export function createError<const Input extends ErrorInput>(definition: Input): ErrorFrom<Input>
export function createError<E extends Error>(definition: ErrorDefinition<E>): E
export function createError(definition: ErrorInput): Error {
  return Object.defineProperties(
    new Error(definition.message, definition),
    Object.getOwnPropertyDescriptors({
      ...omit(definition, ['message', 'cause', 'stack', 'toString']),
      name: definition.name,
    })
  )
}
