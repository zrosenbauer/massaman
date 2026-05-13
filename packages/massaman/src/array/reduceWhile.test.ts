import { describe, expect, it } from 'vitest'

import { reduceWhile } from './reduceWhile.js'

describe('reduceWhile', () => {
  it('reduces while predicate holds', () => {
    const result = reduceWhile(
      [1, 2, 3, -1, 5],
      (_acc, n) => n >= 0,
      (acc, n) => acc + n,
      0
    )
    expect(result).toBe(6)
  })

  it('processes all elements when predicate always holds', () => {
    const result = reduceWhile(
      [1, 2, 3],
      () => true,
      (acc, n) => acc + n,
      0
    )
    expect(result).toBe(6)
  })

  it('returns initial value when predicate immediately fails', () => {
    const result = reduceWhile(
      [1, 2, 3],
      () => false,
      (acc, n) => acc + n,
      0
    )
    expect(result).toBe(0)
  })

  it('handles empty array', () => {
    const result = reduceWhile(
      [],
      () => true,
      (acc: number, n: number) => acc + n,
      42
    )
    expect(result).toBe(42)
  })

  it('passes index to reducer', () => {
    const indices: number[] = []
    reduceWhile(
      [10, 20, 30],
      () => true,
      (acc, _n, i) => {
        indices.push(i)
        return acc
      },
      0
    )
    expect(indices).toEqual([0, 1, 2])
  })
})
