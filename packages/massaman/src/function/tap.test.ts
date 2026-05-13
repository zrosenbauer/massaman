import { describe, expect, it, vi } from 'vitest'

import { tap } from './tap.js'

describe('tap', () => {
  it('returns the original value', () => {
    const result = tap(() => {})(42)
    expect(result).toBe(42)
  })

  it('calls the side-effect function', () => {
    const fn = vi.fn()
    tap(fn)('hello')
    expect(fn).toHaveBeenCalledWith('hello')
  })

  it('ignores the return value of the side-effect', () => {
    const result = tap(() => 'ignored' as unknown as void)(42)
    expect(result).toBe(42)
  })

  it('works with objects (preserves reference)', () => {
    const obj = { a: 1 }
    const result = tap(() => {})(obj)
    expect(result).toBe(obj)
  })
})
