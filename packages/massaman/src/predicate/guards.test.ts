import { describe, expect, it } from 'vitest'

import {
  isEmpty,
  isNotEmpty,
  isArray,
  isObject,
  isFiniteNumber,
  isInteger,
  isNaN,
} from './guards.js'

describe('isArray', () => {
  it('returns true for arrays', () => {
    expect(isArray([])).toBe(true)
    expect(isArray([1, 2])).toBe(true)
  })

  it('returns false for non-arrays', () => {
    expect(isArray('hello')).toBe(false)
    expect(isArray(null)).toBe(false)
    expect(isArray({})).toBe(false)
  })
})

describe('isObject', () => {
  it('returns true for objects', () => {
    expect(isObject({})).toBe(true)
    expect(isObject([])).toBe(true)
    expect(isObject(new Map())).toBe(true)
  })

  it('returns false for null and primitives', () => {
    expect(isObject(null)).toBe(false)
    expect(isObject(42)).toBe(false)
    expect(isObject('str')).toBe(false)
    expect(isObject(undefined)).toBe(false)
  })
})

describe('isEmpty', () => {
  it('returns true for empty values', () => {
    expect(isEmpty('')).toBe(true)
    expect(isEmpty([])).toBe(true)
    expect(isEmpty({})).toBe(true)
    expect(isEmpty(new Map())).toBe(true)
    expect(isEmpty(new Set())).toBe(true)
  })

  it('returns false for non-empty values', () => {
    expect(isEmpty('a')).toBe(false)
    expect(isEmpty([1])).toBe(false)
    expect(isEmpty({ a: 1 })).toBe(false)
    expect(isEmpty(new Map([['a', 1]]))).toBe(false)
    expect(isEmpty(new Set([1]))).toBe(false)
  })
})

describe('isNotEmpty', () => {
  it('is the complement of isEmpty', () => {
    expect(isNotEmpty('')).toBe(false)
    expect(isNotEmpty('a')).toBe(true)
    expect(isNotEmpty([])).toBe(false)
    expect(isNotEmpty([1])).toBe(true)
  })
})

describe('isFiniteNumber', () => {
  it('returns true for finite numbers', () => {
    expect(isFiniteNumber(42)).toBe(true)
    expect(isFiniteNumber(0)).toBe(true)
    expect(isFiniteNumber(-3.14)).toBe(true)
  })

  it('returns false for non-finite values', () => {
    expect(isFiniteNumber(Infinity)).toBe(false)
    expect(isFiniteNumber(NaN)).toBe(false)
    expect(isFiniteNumber('42')).toBe(false)
  })
})

describe('isInteger', () => {
  it('returns true for integers', () => {
    expect(isInteger(42)).toBe(true)
    expect(isInteger(0)).toBe(true)
  })

  it('returns false for non-integers', () => {
    expect(isInteger(4.2)).toBe(false)
    expect(isInteger('42')).toBe(false)
  })
})

describe('isNaN', () => {
  it('returns true for NaN', () => {
    expect(isNaN(NaN)).toBe(true)
  })

  it('returns false for non-NaN', () => {
    expect(isNaN(42)).toBe(false)
    expect(isNaN('NaN')).toBe(false)
  })
})
