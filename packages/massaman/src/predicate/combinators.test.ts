import { describe, expect, it } from 'vitest'

import { allPass, anyPass, both, either } from './combinators.js'

const isPositive = (n: number) => n > 0
const isEven = (n: number) => n % 2 === 0
const alwaysFalse = () => false
const alwaysTrue = () => true

describe('allPass', () => {
  it('returns true when all predicates pass', () => {
    const check = allPass([isPositive, isEven])
    expect(check(4)).toBe(true)
  })

  it('returns false when any predicate fails', () => {
    const check = allPass([isPositive, isEven])
    expect(check(3)).toBe(false)
    expect(check(-2)).toBe(false)
  })

  it('returns true for empty predicates', () => {
    const check = allPass<number>([] as const)
    expect(check(42)).toBe(true)
  })
})

describe('anyPass', () => {
  it('returns true when any predicate passes', () => {
    const check = anyPass([isPositive, isEven])
    expect(check(3)).toBe(true)
    expect(check(-2)).toBe(true)
  })

  it('returns false when no predicates pass', () => {
    const check = anyPass([isPositive, isEven])
    expect(check(-3)).toBe(false)
  })

  it('returns false for empty predicates', () => {
    const check = anyPass<number>([] as const)
    expect(check(42)).toBe(false)
  })
})

describe('both', () => {
  it('returns true when both predicates pass', () => {
    const check = both(isPositive, isEven)
    expect(check(4)).toBe(true)
  })

  it('returns false when first predicate fails', () => {
    const check = both(isPositive, isEven)
    expect(check(-2)).toBe(false)
  })

  it('returns false when second predicate fails', () => {
    const check = both(isPositive, isEven)
    expect(check(3)).toBe(false)
  })

  it('short-circuits on first failure', () => {
    const state = { secondCalled: false }
    const g = () => {
      state.secondCalled = true
      return true
    }
    both(alwaysFalse, g)('x')
    expect(state.secondCalled).toBe(false)
  })
})

describe('either', () => {
  it('returns true when first predicate passes', () => {
    const check = either(isPositive, isEven)
    expect(check(3)).toBe(true)
  })

  it('returns true when second predicate passes', () => {
    const check = either(isPositive, isEven)
    expect(check(-2)).toBe(true)
  })

  it('returns false when neither passes', () => {
    const check = either(isPositive, isEven)
    expect(check(-3)).toBe(false)
  })

  it('short-circuits on first success', () => {
    const state = { secondCalled: false }
    const g = () => {
      state.secondCalled = true
      return false
    }
    either(alwaysTrue, g)('x')
    expect(state.secondCalled).toBe(false)
  })
})
