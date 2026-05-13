import { describe, expect, it } from 'vitest'

import { adjust } from './adjust.js'

describe('adjust', () => {
  it('transforms element at index', () => {
    expect(adjust([1, 2, 3], 1, (n) => n * 10)).toEqual([1, 20, 3])
  })

  it('does not mutate the original', () => {
    const original = [1, 2, 3]
    adjust(original, 0, (n) => n * 10)
    expect(original).toEqual([1, 2, 3])
  })

  it('returns copy when index is out of bounds (positive)', () => {
    expect(adjust([1, 2, 3], 5, (n) => n * 10)).toEqual([1, 2, 3])
  })

  it('returns copy when index is out of bounds (negative)', () => {
    expect(adjust([1, 2, 3], -1, (n) => n * 10)).toEqual([1, 2, 3])
  })

  it('handles first element', () => {
    expect(adjust([1, 2, 3], 0, (n) => n + 100)).toEqual([101, 2, 3])
  })

  it('handles last element', () => {
    expect(adjust([1, 2, 3], 2, (n) => n + 100)).toEqual([1, 2, 103])
  })
})
