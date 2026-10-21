import { describe, expect, it, vi } from 'vitest'

import { err, ok } from './result.js'
import { unwrapOr } from './unwrapOr.js'

describe('unwrapOr', () => {
  it('returns the original success value', () => {
    const value = Object.freeze({ name: 'Zac' })

    expect(unwrapOr(ok(value), null)).toBe(value)
  })

  it('returns the fallback on failure without throwing', () => {
    expect(unwrapOr(err('missing'), 0)).toBe(0)
  })

  it.each([null, undefined, false, 0, ''])('preserves the successful value %s', (value) => {
    expect(unwrapOr(ok(value), 'fallback')).toBe(value)
  })

  it('returns function values without invoking them', () => {
    const value = vi.fn(() => 42)
    const fallback = vi.fn(() => 0)

    expect(unwrapOr(ok(value), fallback)).toBe(value)
    expect(unwrapOr(err('missing'), fallback)).toBe(fallback)
    expect(value).not.toHaveBeenCalled()
    expect(fallback).not.toHaveBeenCalled()
  })

  it('evaluates a fallback expression even on success', () => {
    const fallback = vi.fn(() => 0)

    expect(unwrapOr(ok(42), fallback())).toBe(42)
    expect(fallback).toHaveBeenCalledExactlyOnceWith()
  })
})
