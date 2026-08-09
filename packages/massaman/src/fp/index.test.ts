import { describe, expect, it, vi } from 'vitest'

import { flow as eagerFlow } from '../function/index.js'
import { filter, flow, map, pick, pipe, take } from './index.js'

describe('massaman/fp', () => {
  describe('pipe', () => {
    it('threads a value left-to-right through each operator', () => {
      const result = pipe(
        [1, 2, 3, 4],
        filter((n: number) => n % 2 === 0),
        map((n: number) => n * 10)
      )
      expect(result).toEqual([20, 40])
    })

    it('returns the value unchanged with no operators', () => {
      expect(pipe(42)).toBe(42)
    })

    it('accepts any unary function, not just fp operators', () => {
      const result = pipe(
        '  Hello  ',
        (s: string) => s.trim(),
        (s: string) => s.toLowerCase()
      )
      expect(result).toBe('hello')
    })

    it('works on objects via data-last pick', () => {
      const result = pipe({ a: 1, b: 2, c: 3 }, pick(['a', 'c']))
      expect(result).toEqual({ a: 1, c: 3 })
    })
  })

  describe('lazy fusion', () => {
    it('short-circuits on a trailing take instead of walking the whole input', () => {
      const square = vi.fn((n: number) => n * n)

      const result = pipe(
        [1, 2, 3, 4, 5, 6, 7, 8],
        map(square),
        filter((n: number) => n % 2 === 0),
        take(2)
      )

      expect(result).toEqual([4, 16])
      // Eager evaluation would square all 8 elements; fusion stops at the 4th.
      expect(square).toHaveBeenCalledTimes(4)
    })
  })

  describe('flow', () => {
    it('builds a reusable data-last pipeline', () => {
      const firstTwoEvenSquares = flow(
        map((n: number) => n * n),
        filter((n: number) => n % 2 === 0),
        take(2)
      )
      expect(firstTwoEvenSquares([1, 2, 3, 4, 5, 6, 7, 8])).toEqual([4, 16])
    })

    it('is a distinct binding from the eager flow on massaman/function', () => {
      expect(flow).not.toBe(eagerFlow)
    })
  })
})
