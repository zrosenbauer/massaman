import { describe, expect, it } from 'vitest'

import * as arrayBarrel from './array/index.js'
import * as root from './index.js'
import * as mathBarrel from './math/index.js'
import * as objectBarrel from './object/index.js'
import * as predicateBarrel from './predicate/index.js'
import * as promiseBarrel from './promise/index.js'

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
})
