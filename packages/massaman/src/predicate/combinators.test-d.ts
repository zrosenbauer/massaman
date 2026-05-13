import { isNil, isNumber, isString } from 'es-toolkit/predicate'
import { describe, expectTypeOf, it } from 'vitest'

import { allPass, anyPass, both, either } from './combinators.js'
import { isObject } from './guards.js'

describe('allPass type narrowing', () => {
  it('narrows to intersection when every input is a type guard', () => {
    const isStringAndObject = allPass([isString, isObject])
    const x: unknown = null
    if (isStringAndObject(x)) {
      // intersection of string & object — predicate is still a type guard
      expectTypeOf(x).toEqualTypeOf<string & object>()
    }
  })

  it('keeps return type as a guard even when no input is a guard', () => {
    // No narrowing change — `value is number & unknown` collapses to `number`.
    const allPositive = allPass([(n: number) => n > 0, (n: number) => n < 100])
    const n: number = 5
    expectTypeOf(allPositive).parameter(0).toEqualTypeOf<number>()
    if (allPositive(n)) {
      expectTypeOf(n).toEqualTypeOf<number>()
    }
  })

  // Note: when a mix of guards and plain predicates is passed, TS sometimes
  // doesn't apply the type predicate due to `unknown & T` simplification edge
  // cases. The 99% cases — all guards, or no guards — work correctly. If you
  // need guaranteed narrowing, ensure every predicate is itself a type guard.
})

describe('anyPass type narrowing', () => {
  it('narrows to union when every input is a type guard', () => {
    const isStringOrNumber = anyPass([isString, isNumber])
    const x: unknown = 'hi'
    if (isStringOrNumber(x)) {
      expectTypeOf(x).toEqualTypeOf<string | number>()
    }
  })

  it('narrows union across three guards', () => {
    const isStringNumberOrNil = anyPass([isString, isNumber, isNil])
    const x: unknown = null
    if (isStringNumberOrNil(x)) {
      expectTypeOf(x).toEqualTypeOf<string | number | null | undefined>()
    }
  })
})

describe('both type narrowing', () => {
  it('narrows to intersection of both guards', () => {
    const isStringAndObject = both<unknown, string, object>(isString, isObject)
    const x: unknown = 'hi'
    if (isStringAndObject(x)) {
      expectTypeOf(x).toEqualTypeOf<string & object>()
    }
  })

  it('falls back to boolean when inputs are plain predicates', () => {
    const ge0AndLt100 = both<number>(
      (n) => n >= 0,
      (n) => n < 100
    )
    expectTypeOf(ge0AndLt100).parameter(0).toEqualTypeOf<number>()
    expectTypeOf(ge0AndLt100).returns.toEqualTypeOf<boolean>()
  })
})

describe('either type narrowing', () => {
  it('narrows to union of both guards', () => {
    const isStringOrNumber = either<unknown, string, number>(isString, isNumber)
    const x: unknown = 42
    if (isStringOrNumber(x)) {
      expectTypeOf(x).toEqualTypeOf<string | number>()
    }
  })

  it('narrows correctly with isNil', () => {
    const isNilOrString = either<unknown, null | undefined, string>(isNil, isString)
    const x: unknown = null
    if (isNilOrString(x)) {
      expectTypeOf(x).toEqualTypeOf<null | undefined | string>()
    }
  })
})
