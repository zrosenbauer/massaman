import { describe, expectTypeOf, it } from 'vitest'

import { err, ok } from './result.js'
import type { Result } from './types.js'
import { unwrapOr } from './unwrapOr.js'

const withFallback = (result: Result<number>) => unwrapOr(result, 'fallback' as const)
const fallbackFunction = () => 42

describe('unwrapOr types', () => {
  it('returns a plain union of the success and fallback types', () => {
    expectTypeOf<ReturnType<typeof withFallback>>().toEqualTypeOf<number | 'fallback'>()
  })

  it('does not introduce unknown for an error-only input', () => {
    expectTypeOf(unwrapOr(err('missing'), 0)).toEqualTypeOf<number>()
  })

  it('preserves nullable success values', () => {
    expectTypeOf(unwrapOr(ok(null), 0)).toEqualTypeOf<null | number>()
    expectTypeOf(unwrapOr(ok(undefined), 0)).toEqualTypeOf<undefined | number>()
  })

  it('returns function values rather than their return types', () => {
    expectTypeOf(unwrapOr(err('missing'), fallbackFunction)).toEqualTypeOf<() => number>()
  })
})
