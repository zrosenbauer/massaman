import { describe, expect, it } from 'vitest'

import { call, callAsync } from './call.js'

describe('call', () => {
  it('invokes a function with no arguments', () => {
    expect(call(() => 42)).toBe(42)
  })

  it('invokes a function with a single argument', () => {
    expect(call((x: number) => x * 2, 5)).toBe(10)
  })

  it('invokes a function with multiple arguments', () => {
    expect(call((a: number, b: number, c: number) => a + b + c, 1, 2, 3)).toBe(6)
  })

  it('preserves the return type', () => {
    const result = call((x: string) => ({ name: x }), 'Alice')
    expect(result).toEqual({ name: 'Alice' })
  })

  it('works with built-in functions', () => {
    expect(call(Math.max, 1, 5, 3)).toBe(5)
  })

  it('can be used in a map context', () => {
    const fns = [() => 1, () => 2, () => 3]
    const results = fns.map((fn) => call(fn))
    expect(results).toEqual([1, 2, 3])
  })
})

describe('callAsync', () => {
  it('invokes an async function with no arguments', async () => {
    expect(await callAsync(async () => 42)).toBe(42)
  })

  it('invokes an async function with arguments', async () => {
    const result = await callAsync(async (a: number, b: number) => a + b, 10, 20)
    expect(result).toBe(30)
  })

  it('propagates rejections', async () => {
    await expect(
      callAsync(async () => {
        throw new Error('boom')
      })
    ).rejects.toThrow('boom')
  })

  it('preserves the resolved type', async () => {
    const result = await callAsync(async (x: string) => [x, x], 'hi')
    expect(result).toEqual(['hi', 'hi'])
  })
})
