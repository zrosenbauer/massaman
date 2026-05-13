import { describe, expect, it } from 'vitest'

import { evolve } from './evolve.js'

describe('evolve', () => {
  it('transforms matching keys', () => {
    const result = evolve(
      { name: '  Alice  ', age: 29 },
      {
        name: (s) => s.trim(),
        age: (n) => n + 1,
      }
    )

    expect(result).toEqual({ name: 'Alice', age: 30 })
  })

  it('preserves keys not in spec', () => {
    const result = evolve(
      { a: 1, b: 2, c: 3 },
      {
        a: (n) => n * 2,
      }
    )

    expect(result).toEqual({ a: 2, b: 2, c: 3 })
  })

  it('returns a new object (does not mutate)', () => {
    const original = { value: 1 }
    const result = evolve(original, {
      value: (n) => n + 1,
    })

    expect(result).toEqual({ value: 2 })
    expect(original).toEqual({ value: 1 })
  })

  it('handles empty spec', () => {
    const result = evolve({ a: 1 }, {})
    expect(result).toEqual({ a: 1 })
  })

  it('ignores spec keys not in object', () => {
    const result = evolve({ a: 1 } as { a: number; b?: number }, {
      a: (n) => n * 2,
      b: (n) => (n ?? 0) + 1,
    })

    expect(result).toEqual({ a: 2 })
  })
})
