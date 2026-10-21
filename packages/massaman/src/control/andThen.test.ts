import { describe, expect, it, vi } from 'vitest'

import { andThen } from './andThen.js'
import { err, ok } from './result.js'

describe('andThen', () => {
  it('passes the success value to the next operation and returns its result', () => {
    const nextResult = ok(42)
    const next = vi.fn(() => nextResult)

    expect(andThen(ok('42'), next)).toBe(nextResult)
    expect(next).toHaveBeenCalledExactlyOnceWith('42')
  })

  it('preserves the original failure without calling the next operation', () => {
    const failure = Object.freeze(err(new TypeError('invalid')))
    const next = vi.fn(() => ok(42))

    expect(andThen(failure, next)).toBe(failure)
    expect(next).not.toHaveBeenCalled()
  })

  it('returns the next failure unchanged', () => {
    const failure = err(new RangeError('out of range'))

    expect(andThen(ok(42), () => failure)).toBe(failure)
  })

  it('passes null and undefined successes through without treating them as failures', () => {
    expect(andThen(ok(null), (value) => ok(value))).toEqual(ok(null))
    expect(andThen(ok(undefined), (value) => ok(value))).toEqual(ok(undefined))
  })

  it('propagates unexpected callback exceptions', () => {
    const failure = new Error('bug')

    expect(() =>
      andThen(ok(42), () => {
        throw failure
      })
    ).toThrow(failure)
  })
})
