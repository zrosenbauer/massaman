import { describe, expect, it } from 'vitest'

import { err } from '../control/result.js'
import { toError } from '../conversion/convert.js'
import { createError as rootCreateError } from '../index.js'
import { createError } from './index.js'

describe('createError', () => {
  it('exports the constructor from the root and error subpath', () => {
    expect(rootCreateError).toBe(createError)
  })

  it('creates a native error with a name, message, and stack', () => {
    const error = createError({ name: 'NotFound', message: 'User missing', userId: '123' })

    expect(error).toBeInstanceOf(Error)
    expect(Object.getPrototypeOf(error)).toBe(Error.prototype)
    expect(error.name).toBe('NotFound')
    expect(error.message).toBe('User missing')
    expect(error.userId).toBe('123')
    expect(error.stack).toContain('NotFound: User missing')
    expect(error.stack).toContain('createError.test.ts')
    expect(error.toString()).toBe('NotFound: User missing')
  })

  it('keeps the message and cause non-enumerable', () => {
    const cause = new Error('Database offline')
    const error = createError({ name: 'LoadFailed', message: 'Cannot load user', cause })

    expect(error.cause).toBe(cause)
    expect(Object.getOwnPropertyDescriptor(error, 'message')).toMatchObject({ enumerable: false })
    expect(Object.getOwnPropertyDescriptor(error, 'cause')).toMatchObject({ enumerable: false })
  })

  it('omits cause when it is not supplied', () => {
    const error = createError({ name: 'Failure', message: '' })

    expect(Object.hasOwn(error, 'cause')).toBe(false)
    expect(error.message).toBe('')
  })

  it('preserves arbitrary causes including explicit undefined', () => {
    const definition = { name: 'Failure', message: 'Failed', cause: { code: 503 } }

    expect(createError(definition).cause).toBe(definition.cause)
    expect(createError({ ...definition, cause: null }).cause).toBeNull()
    expect(Object.hasOwn(createError({ ...definition, cause: undefined }), 'cause')).toBe(true)
  })

  it('copies custom string and symbol fields without mutating the definition', () => {
    const key = Symbol('request')
    const metadata = Object.freeze({ retryable: true })
    const definition = Object.freeze({
      name: 'Failure',
      message: 'Failed',
      metadata,
      [key]: 'req-1',
    })
    const error = createError(definition)

    expect(error.metadata).toBe(metadata)
    expect(Object.getOwnPropertyDescriptor(error, key)?.value).toBe('req-1')
    expect(Object.keys(definition)).toEqual(['name', 'message', 'metadata'])
    expect(Object.hasOwn(definition, 'stack')).toBe(false)
    expect(error).not.toBe(definition)
  })

  it('copies a custom __proto__ field without changing the native prototype', () => {
    const error = createError({
      name: 'Failure',
      message: 'Failed',
      ['__proto__']: { polluted: true },
    })

    expect(Object.getPrototypeOf(error)).toBe(Error.prototype)
    expect(Object.getOwnPropertyDescriptor(error, '__proto__')?.value).toEqual({ polluted: true })
    expect(error).toBeInstanceOf(Error)
  })

  it('preserves identity through err and toError', () => {
    const error = createError({ name: 'NotFound', message: 'User missing', userId: '123' })

    expect(err(error).error).toBe(error)
    expect(toError(error)).toBe(error)
  })

  it('keeps the native toString method instead of copying an override', () => {
    const error = createError({
      name: 'Failure',
      message: 'Failed',
      toString: () => 'override',
    })

    expect(error.toString()).toBe('Failure: Failed')
    expect(Object.hasOwn(error, 'toString')).toBe(false)
  })
})
