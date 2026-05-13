import { describe, expect, it } from 'vitest'

import { scan } from './scan.js'

describe('scan', () => {
  it('returns running totals', () => {
    expect(scan([1, 2, 3, 4], (acc, n) => acc + n, 0)).toEqual([0, 1, 3, 6, 10])
  })

  it('starts with initial value', () => {
    const result = scan([1, 2], (acc, n) => acc + n, 10)
    expect(result[0]).toBe(10)
  })

  it('result length is array.length + 1', () => {
    expect(scan([1, 2, 3], (acc, n) => acc + n, 0)).toHaveLength(4)
  })

  it('handles empty array', () => {
    expect(scan([], (acc, n) => acc + n, 0)).toEqual([0])
  })

  it('passes index to callback', () => {
    const indices: number[] = []
    scan(
      [10, 20, 30],
      (acc, _n, i) => {
        indices.push(i)
        return acc
      },
      0
    )
    expect(indices).toEqual([0, 1, 2])
  })
})
