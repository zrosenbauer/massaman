import { describe, expectTypeOf, it } from 'vitest'

import { err } from '../control/result.js'
import type { Result } from '../control/types.js'
import { match, P } from '../match/index.js'
import { defineError, type ErrorWith } from './index.js'

type NotFound = ErrorWith<'NotFound', { readonly userId: string }>
type Forbidden = ErrorWith<'Forbidden', { readonly permission: string }>

const describeFailure = (result: Result<string, NotFound | Forbidden>) =>
  match(result)
    .with(P.ok(), ({ value }) => value)
    .with(P.err({ name: 'NotFound' }), ({ error }) => {
      expectTypeOf(error.userId).toEqualTypeOf<string>()
      return error.userId
    })
    .with(P.err({ name: 'Forbidden' }), ({ error }) => {
      expectTypeOf(error.permission).toEqualTypeOf<string>()
      return error.permission
    })
    .exhaustive()

const failureDefinition = ():
  | { name: 'NotFound'; message: string; userId: string }
  | { name: 'Forbidden'; message: string; permission: string } => ({
  name: 'NotFound',
  message: 'User missing',
  userId: '123',
})

describe('defineError types', () => {
  it('infers zero-argument constructors from static definitions', () => {
    const unauthorized = defineError({
      name: 'Unauthorized',
      message: 'Sign in first',
      status: 401,
    })

    expectTypeOf(unauthorized).parameters.toEqualTypeOf<[]>()
    expectTypeOf(unauthorized().name).toEqualTypeOf<'Unauthorized'>()
    expectTypeOf(unauthorized().status).toEqualTypeOf<401>()
  })

  it('infers builder parameters and error fields', () => {
    const notFound = defineError((userId: string) => ({
      name: 'NotFound',
      message: `User ${userId} not found`,
      userId,
    }))

    expectTypeOf(notFound).parameters.toEqualTypeOf<[userId: string]>()
    expectTypeOf(notFound('123')).toEqualTypeOf<NotFound>()
  })

  it('preserves optional and rest parameters', () => {
    const failure = defineError((message: string, cause?: unknown, ...codes: number[]) => ({
      name: 'Failure' as const,
      message,
      cause,
      codes,
    }))

    expectTypeOf(failure).parameters.toEqualTypeOf<
      [message: string, cause?: unknown, ...codes: number[]]
    >()
    expectTypeOf(failure('Failed').codes).toEqualTypeOf<number[]>()
  })

  it('accepts explicit output and input contracts', () => {
    const notFound = defineError<NotFound, [userId: string]>((userId) => ({
      name: 'NotFound',
      message: `User ${userId} not found`,
      userId,
    }))

    expectTypeOf(notFound).toEqualTypeOf<(userId: string) => NotFound>()
  })

  it('accepts explicit output contracts for static definitions', () => {
    const notFound = defineError<NotFound>({
      name: 'NotFound',
      message: 'User missing',
      userId: '123',
    })

    expectTypeOf(notFound).toEqualTypeOf<() => NotFound>()
  })

  it('narrows error unions by name with exhaustive matching', () => {
    const notFound = defineError<NotFound, [userId: string]>((userId) => ({
      name: 'NotFound',
      message: 'User missing',
      userId,
    }))

    expectTypeOf(describeFailure(err(notFound('123')))).toEqualTypeOf<string>()
  })

  it('preserves correlations between error variants returned by a builder', () => {
    const failure = defineError(failureDefinition)

    expectTypeOf(failure()).toEqualTypeOf<NotFound | Forbidden>()
  })

  it('preserves the output error type in Result', () => {
    const notFound = defineError<NotFound, [userId: string]>((userId) => ({
      name: 'NotFound',
      message: 'User missing',
      userId,
    }))

    expectTypeOf(err(notFound('123')).error).toEqualTypeOf<NotFound>()
  })

  it('rejects incompatible builders and constructor arguments', () => {
    // @ts-expect-error userId is required by the output contract
    defineError<NotFound, []>(() => ({ name: 'NotFound', message: 'User missing' }))
    // @ts-expect-error name must match the output contract
    defineError<NotFound, []>(() => ({ name: 'Forbidden', message: 'Denied', userId: '123' }))
    // @ts-expect-error message is required
    defineError(() => ({ name: 'Failure' }))
    // @ts-expect-error builder input must match the argument tuple
    defineError<NotFound, [number]>((userId: string) => ({ name: 'NotFound', message: '', userId }))

    const failure = defineError({ name: 'Failure', message: 'Failed' })
    // @ts-expect-error static constructors do not take arguments
    failure('extra')

    const notFound = defineError((userId: string) => ({ name: 'NotFound', message: '', userId }))
    // @ts-expect-error builder arguments are required
    notFound()
    // @ts-expect-error builder arguments retain their types
    notFound(123)

    expectTypeOf(notFound).parameters.toEqualTypeOf<[userId: string]>()
  })
})
