import { describe, expect, it } from 'vitest'

import { ifElse, unless, when } from './branching.js'

describe('when', () => {
  it('applies transform when predicate passes', () => {
    const double = when(
      (n: number) => n > 0,
      (n) => n * 2
    )
    expect(double(5)).toBe(10)
  })

  it('returns value unchanged when predicate fails', () => {
    const double = when(
      (n: number) => n > 0,
      (n) => n * 2
    )
    expect(double(-3)).toBe(-3)
  })
})

describe('unless', () => {
  it('applies transform when predicate fails', () => {
    const ensurePositive = unless(
      (n: number) => n > 0,
      (n) => -n
    )
    expect(ensurePositive(-5)).toBe(5)
  })

  it('returns value unchanged when predicate passes', () => {
    const ensurePositive = unless(
      (n: number) => n > 0,
      (n) => -n
    )
    expect(ensurePositive(3)).toBe(3)
  })
})

describe('ifElse', () => {
  it('applies onTrue when predicate passes', () => {
    const format = ifElse(
      (n: number) => n > 0,
      (n) => `+${n}`,
      (n) => `${n}`
    )
    expect(format(5)).toBe('+5')
  })

  it('applies onFalse when predicate fails', () => {
    const format = ifElse(
      (n: number) => n > 0,
      (n) => `+${n}`,
      (n) => `${n}`
    )
    expect(format(-3)).toBe('-3')
  })

  it('can return different types than input', () => {
    const classify = ifElse(
      (n: number) => n % 2 === 0,
      () => 'even' as const,
      () => 'odd' as const
    )
    expect(classify(4)).toBe('even')
    expect(classify(3)).toBe('odd')
  })
})
