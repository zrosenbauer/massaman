import { describe, expect, it } from 'vitest'

import { unfold } from './unfold.js'

const countdown = (n: number): [number, number] | false => {
  if (n > 0) {
    return [n, n - 1]
  }
  return false
}

const countup = (n: number): [number, number] | false => {
  if (n < 5) {
    return [n, n + 1]
  }
  return false
}

const fibonacci = ([a, b, count]: [number, number, number]):
  | [number, [number, number, number]]
  | false => {
  if (count > 0) {
    return [a, [b, a + b, count - 1]]
  }
  return false
}

describe('unfold', () => {
  it('builds a list from a seed', () => {
    const result = unfold(countdown, 5)
    expect(result).toEqual([5, 4, 3, 2, 1])
  })

  it('returns empty array when immediately false', () => {
    const result = unfold(() => false, 0)
    expect(result).toEqual([])
  })

  it('can generate fibonacci-style sequences', () => {
    const result = unfold(fibonacci, [0, 1, 6] as [number, number, number])
    expect(result).toEqual([0, 1, 1, 2, 3, 5])
  })

  it('can build range-like sequences', () => {
    const result = unfold(countup, 0)
    expect(result).toEqual([0, 1, 2, 3, 4])
  })
})
