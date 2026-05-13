import { match } from 'ts-pattern'
import { describe, expectTypeOf, it } from 'vitest'

import type { Result } from '../control/types.js'
import { Err, Ok } from './match.js'

describe('Ok pattern value', () => {
  it('has literal shape { ok: true }', () => {
    expectTypeOf(Ok).toEqualTypeOf<{ ok: true }>()
  })

  it('narrows the match arm to Ok<T> with value: T', () => {
    function check(result: Result<number>) {
      match(result)
        .with(Ok, (matched) => {
          expectTypeOf(matched.value).toEqualTypeOf<number>()
          expectTypeOf(matched.error).toEqualTypeOf<null>()
        })
        .with(Err, () => null)
        .exhaustive()
    }
    expectTypeOf(check).parameter(0).toEqualTypeOf<Result<number>>()
  })

  it('preserves generic inference for nested types', () => {
    function check(result: Result<{ id: string; count: number }>) {
      match(result)
        .with(Ok, (matched) => {
          expectTypeOf(matched.value).toEqualTypeOf<{ id: string; count: number }>()
        })
        .with(Err, () => null)
        .exhaustive()
    }
    expectTypeOf(check).parameter(0).toEqualTypeOf<Result<{ id: string; count: number }>>()
  })
})

describe('Err pattern value', () => {
  it('has literal shape { ok: false }', () => {
    expectTypeOf(Err).toEqualTypeOf<{ ok: false }>()
  })

  it('narrows the match arm to Err with error: Error', () => {
    function check(result: Result<string>) {
      match(result)
        .with(Ok, () => null)
        .with(Err, (matched) => {
          expectTypeOf(matched.error).toEqualTypeOf<Error>()
          expectTypeOf(matched.value).toEqualTypeOf<null>()
        })
        .exhaustive()
    }
    expectTypeOf(check).parameter(0).toEqualTypeOf<Result<string>>()
  })
})

describe('Ok / Err type aliases', () => {
  it('are re-exported from pattern/match for use alongside the patterns', () => {
    type OkAlias<T> = import('./match.js').Ok<T>
    type ErrAlias = import('./match.js').Err

    expectTypeOf<OkAlias<number>>().toEqualTypeOf<{
      readonly ok: true
      readonly value: number
      readonly error: null
    }>()
    expectTypeOf<ErrAlias>().toEqualTypeOf<{
      readonly ok: false
      readonly value: null
      readonly error: Error
    }>()
  })
})
