import { describe, expect, it } from 'vitest'

import { attempt, attemptAsync } from './attempt.js'

describe('attempt', () => {
  describe('successful execution', () => {
    it('returns Ok for a successful function', () => {
      const result = attempt(() => 42)

      expect(result).toEqual({ ok: true, value: 42, error: null })
    })

    it('returns Ok for a function returning an object', () => {
      const result = attempt(() => ({ name: 'test' }))

      expect(result).toEqual({ ok: true, value: { name: 'test' }, error: null })
    })

    it('returns Ok for a function returning null', () => {
      const result = attempt(() => null)

      expect(result).toEqual({ ok: true, value: null, error: null })
    })

    it('returns Ok for a function returning false', () => {
      const result = attempt(() => false)

      expect(result).toEqual({ ok: true, value: false, error: null })
    })
  })

  describe('error handling', () => {
    it('returns Err when function throws an Error', () => {
      const result = attempt(() => {
        throw new Error('Something went wrong')
      })

      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.error).toBeInstanceOf(Error)
        expect((result.error as Error).message).toBe('Something went wrong')
      }
    })

    it('returns Err when function throws a string', () => {
      const result = attempt(() => {
        throw 'string error'
      })

      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.error).toBeInstanceOf(Error)
        expect(result.error.message).toBe('string error')
      }
    })

    it('returns Err when function throws null', () => {
      const result = attempt(() => {
        throw null
      })

      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.error).toBeInstanceOf(Error)
      }
    })

    it('returns Err when function throws undefined', () => {
      const result = attempt(() => {
        throw undefined
      })

      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.error).toBeInstanceOf(Error)
        expect(result.error.message).toBe('undefined')
      }
    })

    it('returns Err with serialized message when function throws a plain object', () => {
      const result = attempt(() => {
        throw { code: 404, detail: 'not found' }
      })

      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.error).toBeInstanceOf(Error)
        expect(result.error.message).toBe('{"code":404,"detail":"not found"}')
        expect(result.error.cause).toEqual({ code: 404, detail: 'not found' })
      }
    })

    it('falls back to String() when JSON.stringify throws on the thrown value', () => {
      // BigInt cannot be JSON-stringified; the catch branch in coerceError handles it.
      const result = attempt(() => {
        throw BigInt(42)
      })

      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.error).toBeInstanceOf(Error)
        expect(result.error.message).toBe('42')
        expect(result.error.cause).toBe(BigInt(42))
      }
    })
  })

  describe('real-world use cases', () => {
    it('handles JSON.parse safely', () => {
      const result = attempt(() => JSON.parse('{"name":"test"}'))

      expect(result).toEqual({ ok: true, value: { name: 'test' }, error: null })
    })

    it('handles invalid JSON safely', () => {
      const result = attempt(() => JSON.parse('invalid'))

      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.error).toBeInstanceOf(SyntaxError)
      }
    })
  })
})

describe('attemptAsync', () => {
  describe('successful execution', () => {
    it('returns Ok for a resolved promise', async () => {
      const result = await attemptAsync(async () => 42)

      expect(result).toEqual({ ok: true, value: 42, error: null })
    })

    it('returns Ok for an async function returning an object', async () => {
      const result = await attemptAsync(async () => {
        await new Promise((r) => setTimeout(r, 5))
        return { name: 'test' }
      })

      expect(result).toEqual({ ok: true, value: { name: 'test' }, error: null })
    })
  })

  describe('error handling', () => {
    it('returns Err when async function throws', async () => {
      const result = await attemptAsync(async () => {
        throw new Error('Async error')
      })

      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect((result.error as Error).message).toBe('Async error')
      }
    })

    it('returns Err when promise rejects', async () => {
      const result = await attemptAsync(() => Promise.reject(new Error('Rejected')))

      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect((result.error as Error).message).toBe('Rejected')
      }
    })

    it('returns Err for rejected promise with string', async () => {
      const result = await attemptAsync(async () => {
        throw 'string error'
      })

      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.error).toBeInstanceOf(Error)
        expect(result.error.message).toBe('string error')
      }
    })
  })

  describe('edge cases', () => {
    it('handles direct Promise.resolve', async () => {
      const result = await attemptAsync(() => Promise.resolve('direct'))

      expect(result).toEqual({ ok: true, value: 'direct', error: null })
    })
  })
})
