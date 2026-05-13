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
  it('returns Err', () => {
    expectTypeOf(err(new Error('fail'))).toEqualTypeOf<Err>()
  })

  it('has error property typed as Error', () => {
    expectTypeOf(err('oops').error).toEqualTypeOf<Error>()
  })

  it('has value property typed as null', () => {
    expectTypeOf(err('oops').value).toEqualTypeOf<null>()
  })
})

describe('Result<T>', () => {
  it('is a union of Ok and Err', () => {
    expectTypeOf<Result<string>>().toEqualTypeOf<Ok<string> | Err>()
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
    const result: Result<number> = err('fail')

    if (isErr(result)) {
      expectTypeOf(result).toEqualTypeOf<Err>()
      expectTypeOf(result.error).toEqualTypeOf<Error>()
      expectTypeOf(result.value).toEqualTypeOf<null>()
    }
  })

  it('error is not null inside Err branch', () => {
    const result: Result<string> = err(new Error('bad'))

    if (isErr(result)) {
      expectTypeOf(result.error).toEqualTypeOf<Error>()
    }
  })
})
