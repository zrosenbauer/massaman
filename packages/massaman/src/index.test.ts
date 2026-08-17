import { describe, expect, it } from 'vitest'

import * as arrayBarrel from './array/index.js'
import * as bigintBarrel from './bigint/index.js'
import * as root from './index.js'
import * as mathBarrel from './math/index.js'
import * as objectBarrel from './object/index.js'
import * as predicateBarrel from './predicate/index.js'
import * as promiseBarrel from './promise/index.js'
import * as stringBarrel from './string/index.js'

/**
 * Subpath exports have to be declared in the area barrel AND the root barrel, so a
 * name reachable from one but not the other ships a half-broken surface. These cases
 * pin the es-toolkit re-exports most recently added.
 */
describe('export surface', () => {
  const cases = [
    ['cartesianProduct', arrayBarrel],
    ['chunkBy', arrayBarrel],
    ['combinations', arrayBarrel],
    ['sortKeys', objectBarrel],
    ['percentile', mathBarrel],
    ['allKeyed', promiseBarrel],
    ['isIterable', predicateBarrel],
    ['limitAsync', promiseBarrel],
    ['deepFreeze', objectBarrel],
    ['mapKeysAsync', objectBarrel],
    ['mapValuesAsync', objectBarrel],
    ['toConstantCaseKeys', objectBarrel],
    ['toKebabCaseKeys', objectBarrel],
    ['toPascalCaseKeys', objectBarrel],
    ['dedent', stringBarrel],
  ] as const

  it.each(cases)('exposes %s from its area barrel and the root barrel', (name, barrel) => {
    expect(barrel).toHaveProperty(name)
    expect(root).toHaveProperty(name)
    expect(typeof Reflect.get(root, name)).toBe('function')
  })

  it('does not leak the data-last fp namespace into the root barrel', () => {
    expect(root).not.toHaveProperty('pipe')
    expect(root).not.toHaveProperty('multiply')
  })

  /**
   * es-toolkit 1.51.0 recategorized limitAsync from array to promise. Keeping a
   * stale array re-export around would ship the same symbol from two subpaths.
   */
  it('exposes limitAsync from promise only, not array', () => {
    expect(arrayBarrel).not.toHaveProperty('limitAsync')
  })

  /**
   * bigint is subpath-only: its symbols shadow the number implementations in
   * math/array, so the root barrel must keep the number ones.
   */
  it('keeps the bigint barrel out of the root barrel', () => {
    expect(bigintBarrel).toHaveProperty('max')
    expect(bigintBarrel).toHaveProperty('min')
    expect(root).not.toHaveProperty('max')
    expect(root).not.toHaveProperty('min')
    expect(root.sum).toBe(mathBarrel.sum)
    expect(root.sum).not.toBe(bigintBarrel.sum)
  })

  it('sums bigints without coercing through number', () => {
    const big = 2n ** 64n
    expect(bigintBarrel.sum([big, big])).toBe(2n ** 65n)
  })
})
