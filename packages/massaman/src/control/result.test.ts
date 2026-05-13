import { describe, expect, it } from 'vitest'

import { err, isErr, isOk, ok, unwrap } from './result.js'

describe('ok', () => {
  it('creates an Ok result with a value', () => {
    const result = ok(42)

    expect(result).toEqual({ ok: true, value: 42, error: null })
  })

  it('creates an Ok result with null', () => {
    const result = ok(null)

    expect(result).toEqual({ ok: true, value: null, error: null })
  })

  it('creates an Ok result with undefined', () => {
    const result = ok(undefined)

    expect(result).toEqual({ ok: true, value: undefined, error: null })
  })

  it('creates an Ok result with an object', () => {
    const result = ok({ name: 'test' })

    expect(result).toEqual({ ok: true, value: { name: 'test' }, error: null })
  })
})

describe('err', () => {
  it('creates an Err result with an Error', () => {
    const error = new Error('fail')
    const result = err(error)

    expect(result).toEqual({ ok: false, value: null, error })
  })

  it('creates an Err result with a string', () => {
    const result = err('something went wrong')

    expect(result.ok).toBe(false)
    expect(result.error).toBeInstanceOf(Error)
    expect(result.error.message).toBe('something went wrong')
  })

  it('creates an Err result with null', () => {
    const result = err(null)

    expect(result.ok).toBe(false)
    expect(result.error).toBeInstanceOf(Error)
  })
})

describe('isOk', () => {
  it('returns true for Ok results', () => {
    expect(isOk(ok(42))).toBe(true)
    expect(isOk(ok(null))).toBe(true)
    expect(isOk(ok(false))).toBe(true)
  })

  it('returns false for Err results', () => {
    expect(isOk(err('fail'))).toBe(false)
    expect(isOk(err(null))).toBe(false)
  })
})

describe('isErr', () => {
  it('returns true for Err results', () => {
    expect(isErr(err('fail'))).toBe(true)
    expect(isErr(err(null))).toBe(true)
    expect(isErr(err(new Error('bad')))).toBe(true)
  })

  it('returns false for Ok results', () => {
    expect(isErr(ok(42))).toBe(false)
    expect(isErr(ok(null))).toBe(false)
  })
})

describe('unwrap', () => {
  it('should return the value from an Ok result', () => {
    expect(unwrap(ok(42))).toBe(42)
  })

  it('should return null from an Ok result wrapping null', () => {
    expect(unwrap(ok(null))).toBeNull()
  })

  it('should throw the original error from an Err result', () => {
    const error = new Error('fail')

    expect(() => unwrap(err(error))).toThrow(error)
  })

  it('should throw a new error with message and cause when message is provided', () => {
    const original = new Error('original')
    const result = err(original)

    expect(() => unwrap(result, 'config required')).toThrow(
      expect.objectContaining({
        message: 'config required',
        cause: original,
      })
    )
  })

  it('should throw the converted error when given a non-Error value', () => {
    expect(() => unwrap(err('string error'))).toThrow('string error')
  })
})
