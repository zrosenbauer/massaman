import { describe, expect, it } from 'vitest'

import { attempt } from '@/control/attempt.js'
import { err } from '@/control/result.js'
import { defineError as rootDefineError } from '@/index.js'
import { match, P } from '@/match/index.js'

import { defineError } from './index.js'

describe('defineError', () => {
  it('exports the constructor from the root and error subpath', () => {
    expect(rootDefineError).toBe(defineError)
  })

  it('defines a zero-argument constructor from a static object', () => {
    const unauthorized = defineError({
      name: 'Unauthorized',
      message: 'Sign in first',
      status: 401,
    })

    expect(unauthorized()).toMatchObject({
      name: 'Unauthorized',
      message: 'Sign in first',
      status: 401,
    })
    expect(unauthorized()).toBeInstanceOf(Error)
  })

  it('creates a fresh error and stack on each call without mutating the definition', () => {
    const definition = Object.freeze({ name: 'Failure', message: 'Failed' })
    const failure = defineError(definition)
    const first = failure()
    const second = failure()

    expect(first).not.toBe(second)
    expect(first.stack).toContain('defineError.test.ts')
    expect(second.stack).toContain('defineError.test.ts')
    expect(first.stack).not.toBe(second.stack)
    expect(Object.hasOwn(definition, 'stack')).toBe(false)
  })

  it('passes positional arguments to the builder and copies the resulting data', () => {
    const notFound = defineError((userId: string, status: number) => ({
      name: 'NotFound',
      message: `User ${userId} not found`,
      userId,
      status,
    }))

    expect(notFound('123', 404)).toMatchObject({
      name: 'NotFound',
      message: 'User 123 not found',
      userId: '123',
      status: 404,
    })
  })

  it('supports zero-argument builders and evaluates them at construction time', () => {
    let calls = 0
    const failure = defineError(() => {
      calls += 1
      return { name: 'Failure', message: 'Failed', calls }
    })

    expect(calls).toBe(0)
    expect(failure().calls).toBe(1)
    expect(failure().calls).toBe(2)
  })

  it('preserves causes supplied by static definitions and builders', () => {
    const cause = new Error('Database offline')
    const staticFailure = defineError({ name: 'Failure', message: 'Failed', cause })
    const failure = defineError((reason: unknown) => ({
      name: 'Failure',
      message: 'Failed',
      cause: reason,
    }))

    expect(staticFailure().cause).toBe(cause)
    expect(failure(cause).cause).toBe(cause)
    expect(Object.getOwnPropertyDescriptor(failure(cause), 'cause')?.enumerable).toBe(false)
  })

  it('returns errors that work with Result patterns and unsafe boundaries', () => {
    const notFound = defineError((userId: string) => ({
      name: 'NotFound' as const,
      message: 'User missing',
      userId,
    }))
    const error = notFound('123')

    expect(err(error).error).toBe(error)
    expect(
      match(err(error))
        .with(P.err({ name: 'NotFound' }), ({ error: failure }) => failure.userId)
        .exhaustive()
    ).toBe('123')
    expect(
      attempt(() => {
        throw error
      }).error
    ).toBe(error)
  })
})
