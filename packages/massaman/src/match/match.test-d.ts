import { match } from 'ts-pattern'
import { describe, expectTypeOf, it } from 'vitest'

import type { Result } from '../control/types.js'
import { P } from './match.js'

describe('P.ok pattern value', () => {
  it('has literal shape { ok: true }', () => {
    expectTypeOf(P.ok).toEqualTypeOf<{ ok: true }>()
  })

  it('narrows the match arm to Ok<T> with value: T', () => {
    function check(result: Result<number>) {
      match(result)
        .with(P.ok, (matched) => {
          expectTypeOf(matched.value).toEqualTypeOf<number>()
          expectTypeOf(matched.error).toEqualTypeOf<null>()
        })
        .with(P.err, () => null)
        .exhaustive()
    }
    expectTypeOf(check).parameter(0).toEqualTypeOf<Result<number>>()
  })

  it('preserves generic inference for nested types', () => {
    function check(result: Result<{ id: string; count: number }>) {
      match(result)
        .with(P.ok, (matched) => {
          expectTypeOf(matched.value).toEqualTypeOf<{ id: string; count: number }>()
        })
        .with(P.err, () => null)
        .exhaustive()
    }
    expectTypeOf(check).parameter(0).toEqualTypeOf<Result<{ id: string; count: number }>>()
  })
})

describe('P.err pattern value', () => {
  it('has literal shape { ok: false }', () => {
    expectTypeOf(P.err).toEqualTypeOf<{ ok: false }>()
  })

  it('narrows the match arm to Err with error: Error', () => {
    function check(result: Result<string>) {
      match(result)
        .with(P.ok, () => null)
        .with(P.err, (matched) => {
          expectTypeOf(matched.error).toEqualTypeOf<Error>()
          expectTypeOf(matched.value).toEqualTypeOf<null>()
        })
        .exhaustive()
    }
    expectTypeOf(check).parameter(0).toEqualTypeOf<Result<string>>()
  })
})

describe('P preserves ts-pattern primitives after spread', () => {
  it('P.string is still a ts-pattern primitive', () => {
    expectTypeOf(P.string).not.toBeAny()
  })
  it('P.number is still a ts-pattern primitive', () => {
    expectTypeOf(P.number).not.toBeAny()
  })
})

describe('Ok / Err type aliases from massaman/match', () => {
  it('are re-exported alongside the P value', () => {
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
