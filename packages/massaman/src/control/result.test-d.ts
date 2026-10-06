import { describe, expectTypeOf, it } from 'vitest'

import { err, isErr, isOk, ok } from './result.js'
import type { Err, Ok, Result } from './types.js'

describe('ok()', () => {
  it('returns Ok<T>', () => {
    expectTypeOf(ok(42)).toEqualTypeOf<Ok<number>>()
  })

  it('has value property typed as T', () => {
    expectTypeOf(ok('hello').value).toEqualTypeOf<string>()
  })

  it('has error property typed as null', () => {
    expectTypeOf(ok(42).error).toEqualTypeOf<null>()
  })
})

describe('err()', () => {
  it('returns Err<E>', () => {
    expectTypeOf(err(new Error('fail'))).toEqualTypeOf<Err<Error>>()
  })

  it('preserves the error payload type', () => {
    interface NotFoundError extends Error {
      readonly kind: 'not-found'
      readonly id: string
    }
    const failure: NotFoundError = Object.assign(new Error('missing spec'), {
      kind: 'not-found' as const,
      id: 'spec-1',
    })

    expectTypeOf(err(failure).error).toEqualTypeOf<NotFoundError>()
  })

  it('preserves structural Error fields', () => {
    const failure: Error & { readonly status: 404 } = {
      name: 'HttpError',
      message: 'missing spec',
      status: 404,
    }

    expectTypeOf(err(failure).error).toEqualTypeOf<Error & { readonly status: 404 }>()
  })

  it('normalizes non-Error values to Error', () => {
    expectTypeOf(err('oops').error).toEqualTypeOf<Error>()
  })

  it('has value property typed as null', () => {
    expectTypeOf(err('oops').value).toEqualTypeOf<null>()
  })
})

describe('Result<T>', () => {
  it('defaults the error type to Error', () => {
    expectTypeOf<Result<string>>().toEqualTypeOf<Ok<string> | Err>()
  })

  it('accepts a typed error parameter', () => {
    type Failure = Error & ({ kind: 'not-found'; id: string } | { kind: 'forbidden' })

    expectTypeOf<Result<string, Failure>>().toEqualTypeOf<Ok<string> | Err<Failure>>()
  })
})

describe('isOk()', () => {
  it('narrows Result to Ok', () => {
    const result: Result<number> = ok(42)

    if (isOk(result)) {
      expectTypeOf(result).toEqualTypeOf<Ok<number>>()
      expectTypeOf(result.value).toEqualTypeOf<number>()
      expectTypeOf(result.error).toEqualTypeOf<null>()
    }
  })

  it('value is not null inside Ok branch', () => {
    const result: Result<string> = ok('hello')

    if (isOk(result)) {
      expectTypeOf(result.value).toEqualTypeOf<string>()
    }
  })
})

describe('isErr()', () => {
  it('narrows Result to Err', () => {
    interface Failure extends Error {
      readonly kind: 'failure'
    }
    const failure: Failure = Object.assign(new Error('fail'), {
      kind: 'failure' as const,
    })
    const result: Result<number, Failure> = err(failure)

    if (isErr(result)) {
      expectTypeOf(result).toEqualTypeOf<Err<Failure>>()
      expectTypeOf(result.error).toEqualTypeOf<Failure>()
      expectTypeOf(result.value).toEqualTypeOf<null>()
    }
  })

  it('error is not null inside Err branch', () => {
    interface BadError extends Error {
      readonly kind: 'bad'
    }
    const failure: BadError = Object.assign(new Error('bad'), { kind: 'bad' as const })
    const result: Result<string, BadError> = err(failure)

    if (isErr(result)) {
      expectTypeOf(result.error).toEqualTypeOf<BadError>()
    }
  })
})
