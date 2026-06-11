import { describe, expect, it } from 'vitest'

import { unreachable } from './unreachable.js'

describe('unreachable', () => {
  it('uses the default message when called with no argument', () => {
    expect(() => unreachable()).toThrow('entered unreachable code')
  })

  it('appends the provided message after the default', () => {
    expect(() => unreachable('regex guaranteed a digit')).toThrow(
      'entered unreachable code: regex guaranteed a digit'
    )
  })

  it('throws an Error instance', () => {
    expect(() => unreachable()).toThrow(Error)
  })

  it('treats null as no-message (defensive against `as any` callers)', () => {
    expect(() => unreachable(null as unknown as string)).toThrow('entered unreachable code')
  })

  it('satisfies a `never` return position so it slots into any expression', () => {
    const parseDigit = (input: string): number => {
      const parsed = Number.parseInt(input, 10)
      if (Number.isNaN(parsed)) {
        return unreachable('caller pre-validated')
      }
      return parsed
    }

    expect(parseDigit('7')).toBe(7)
    expect(() => parseDigit('x')).toThrow('entered unreachable code: caller pre-validated')
  })
})
