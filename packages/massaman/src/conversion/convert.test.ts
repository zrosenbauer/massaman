import { describe, expect, it } from 'vitest'

import {
  toNumber,
  toString,
  toInteger,
  toFinite,
  toArray,
  toBoolean,
  toError,
  stringify,
} from './convert.js'

describe('toError', () => {
  it('returns an Error as-is', () => {
    const original = new Error('boom')
    const result = toError(original)
    expect(result).toBe(original)
    expect(result.message).toBe('boom')
  })

  it('wraps a string in an Error', () => {
    const result = toError('something went wrong')
    expect(result).toBeInstanceOf(Error)
    expect(result.message).toBe('something went wrong')
    expect(result.cause).toBeUndefined()
  })

  it('stringifies a plain object into the Error message', () => {
    const result = toError({ status: 400, detail: 'bad request' })
    expect(result).toBeInstanceOf(Error)
    expect(result.message).toBe('{"status":400,"detail":"bad request"}')
    expect(result.cause).toEqual({ status: 400, detail: 'bad request' })
  })

  it('stringifies a Map into the Error message', () => {
    const map = new Map([['k', 'v']])
    const result = toError(map)
    expect(result).toBeInstanceOf(Error)
    expect(result.message).toBe('[["k","v"]]')
    expect(result.cause).toBe(map)
  })

  it('stringifies a Set into the Error message', () => {
    const set = new Set([1, 2, 3])
    const result = toError(set)
    expect(result).toBeInstanceOf(Error)
    expect(result.message).toBe('[1,2,3]')
    expect(result.cause).toBe(set)
  })

  it('handles null', () => {
    const result = toError(null)
    expect(result).toBeInstanceOf(Error)
    expect(result.message).toBe('null')
    expect(result.cause).toBeNull()
  })

  it('handles circular references gracefully', () => {
    const obj: Record<string, unknown> = { a: 1 }
    obj['self'] = obj
    const result = toError(obj)
    expect(result).toBeInstanceOf(Error)
    expect(result.message).toBe('{"a":1,"self":"[Circular]"}')
    expect(result.cause).toBe(obj)
  })
})

describe('stringify', () => {
  it('stringifies primitive values', () => {
    expect(stringify(42)).toBe('42')
    expect(stringify(true)).toBe('true')
    expect(stringify(false)).toBe('false')
    expect(stringify('')).toBe('')
    expect(stringify('hello')).toBe('hello')
  })

  it('stringifies nil values', () => {
    expect(stringify(null)).toBe('null')
    expect(stringify(undefined)).toBe('undefined')
  })

  it('stringifies plain objects', () => {
    expect(stringify({ status: 400 })).toBe('{"status":400}')
    expect(stringify({ a: 1, b: 'two' })).toBe('{"a":1,"b":"two"}')
  })

  it('stringifies arrays', () => {
    expect(stringify([1, 2, 3])).toBe('[1,2,3]')
  })

  it('stringifies Maps as entries', () => {
    expect(stringify(new Map([['k', 'v']]))).toBe('[["k","v"]]')
  })

  it('stringifies Sets as arrays', () => {
    expect(stringify(new Set([1, 2, 3]))).toBe('[1,2,3]')
  })

  it('handles circular references with [Circular] placeholder', () => {
    const obj: Record<string, unknown> = { a: 1 }
    obj['self'] = obj
    expect(stringify(obj)).toBe('{"a":1,"self":"[Circular]"}')
  })

  it('stringifies Error instances with name, message, and stack', () => {
    const error = new Error('test error')
    const result = stringify(error)
    const parsed = JSON.parse(result) as { name: string; message: string; stack: string }
    expect(parsed.name).toBe('Error')
    expect(parsed.message).toBe('test error')
    expect(parsed.stack).toBeDefined()
  })

  it('stringifies Error instances with enumerable properties', () => {
    const error = new Error('test') as Error & { code: string }
    error.code = 'ERR_CUSTOM'
    const result = stringify(error)
    const parsed = JSON.parse(result) as { name: string; message: string; code: string }
    expect(parsed.name).toBe('Error')
    expect(parsed.message).toBe('test')
    expect(parsed.code).toBe('ERR_CUSTOM')
  })

  it('falls back to String() when JSON.stringify throws', () => {
    // BigInt nested inside an object passes through toSerializable but
    // causes JSON.stringify to throw a TypeError
    const obj = { val: BigInt(42) }
    expect(stringify(obj)).toBe('[object Object]')
  })

  it('recursively serializes nested Maps and Sets', () => {
    const obj = { data: new Map([['key', new Set([1, 2])]]) }
    expect(stringify(obj)).toBe('{"data":[["key",[1,2]]]}')
  })

  it('recursively serializes nested arrays', () => {
    const obj = { items: [new Map([['a', 1]])] }
    expect(stringify(obj)).toBe('{"items":[[["a",1]]]}')
  })

  it('handles symbols as primitives', () => {
    expect(stringify(Symbol('test'))).toBe('Symbol(test)')
  })

  it('handles bigint as primitives', () => {
    expect(stringify(BigInt(42))).toBe('42')
  })
})

describe('toNumber', () => {
  it('converts values to numbers', () => {
    expect(toNumber('42')).toBe(42)
    expect(toNumber(null)).toBe(0)
    expect(toNumber(true)).toBe(1)
    expect(toNumber('abc')).toBeNaN()
  })
})

describe('toString', () => {
  it('converts values to strings', () => {
    expect(toString(42)).toBe('42')
    expect(toString(null)).toBe('null')
    expect(toString(undefined)).toBe('undefined')
    expect(toString(true)).toBe('true')
  })
})

describe('toInteger', () => {
  it('converts and truncates values', () => {
    expect(toInteger('4.9')).toBe(4)
    expect(toInteger(-3.7)).toBe(-3)
    expect(toInteger(null)).toBe(0)
  })
})

describe('toFinite', () => {
  it('returns 0 for non-finite results', () => {
    expect(toFinite(Infinity)).toBe(0)
    expect(toFinite(-Infinity)).toBe(0)
    expect(toFinite('abc')).toBe(0)
  })

  it('returns finite numbers as-is', () => {
    expect(toFinite('3.14')).toBe(3.14)
    expect(toFinite(42)).toBe(42)
    expect(toFinite(0)).toBe(0)
  })
})

describe('toArray', () => {
  it('returns [] for null/undefined', () => {
    expect(toArray(null)).toEqual([])
    expect(toArray(undefined)).toEqual([])
  })

  it('returns arrays as-is', () => {
    const arr = [1, 2, 3]
    expect(toArray(arr)).toBe(arr)
  })

  it('spreads iterables', () => {
    expect(toArray(new Set([1, 2]))).toEqual([1, 2])
    expect(toArray('abc')).toEqual(['a', 'b', 'c'])
  })

  it('wraps non-iterables in an array', () => {
    expect(toArray(42)).toEqual([42])
    expect(toArray(true)).toEqual([true])
  })
})

describe('toBoolean', () => {
  it('proxies Boolean()', () => {
    expect(toBoolean(1)).toBe(true)
    expect(toBoolean(0)).toBe(false)
    expect(toBoolean('')).toBe(false)
    expect(toBoolean('a')).toBe(true)
    expect(toBoolean(null)).toBe(false)
  })
})
