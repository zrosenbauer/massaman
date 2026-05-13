import { describe, expect, it } from 'vitest'

import { flowAsync } from './flowAsync.js'

describe('flowAsync', () => {
  it('chains sync functions', async () => {
    const fn = flowAsync(
      (n: number) => n + 1,
      (n: number) => n * 2
    )
    expect(await fn(3)).toBe(8)
  })

  it('awaits async functions', async () => {
    const fn = flowAsync(
      async (n: number) => n + 1,
      async (n: number) => n * 2
    )
    expect(await fn(3)).toBe(8)
  })

  it('handles mixed sync and async', async () => {
    const fn = flowAsync(
      (n: number) => n + 1,
      async (n: number) => n * 2,
      (n: number) => n + 10
    )
    expect(await fn(3)).toBe(18)
  })

  it('passes multiple arguments to first function', async () => {
    const fn = flowAsync(
      (a: number, b: number) => a + b,
      (n: number) => n * 2
    )
    expect(await fn(3, 4)).toBe(14)
  })

  it('works with a single function', async () => {
    const fn = flowAsync(async (n: number) => n * 2)
    expect(await fn(5)).toBe(10)
  })

  it('propagates errors', async () => {
    const fn = flowAsync(
      async () => {
        throw new Error('boom')
      },
      (n: number) => n * 2
    )
    await expect(fn()).rejects.toThrow('boom')
  })
})
