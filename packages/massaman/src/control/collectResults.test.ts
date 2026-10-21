import { describe, expect, it } from 'vitest'

import { collectResults } from './collectResults.js'
import { err, ok } from './result.js'

describe('collectResults', () => {
  it('collects success values in input order without mutating frozen inputs', () => {
    const value = Object.freeze({ id: '123' })
    const results = Object.freeze([Object.freeze(ok(value)), Object.freeze(ok(value))])
    const collected = collectResults(results)

    expect(collected).toEqual(ok([value, value]))
    expect(collected.value?.[0]).toBe(value)
    expect(results).toHaveLength(2)
  })

  it('returns an empty success for empty input', () => {
    expect(collectResults([])).toEqual(ok([]))
  })

  it('returns the first failure unchanged and omits partial successes and later errors', () => {
    const first = Object.freeze(err(new TypeError('first')))
    const second = Object.freeze(err(new RangeError('second')))

    expect(collectResults(Object.freeze([ok(1), first, second, ok(4)]))).toBe(first)
  })

  it('returns the first failure when every result fails', () => {
    const first = err('first')

    expect(collectResults([first, err('second')])).toBe(first)
  })

  it('returns a failure at the end of the input', () => {
    const failure = err('last')

    expect(collectResults([ok(1), ok(2), failure])).toBe(failure)
  })

  it('preserves null and undefined success values', () => {
    expect(collectResults([ok(null), ok(undefined)])).toEqual(ok([null, undefined]))
  })

  it('handles large arrays without recursive calls', () => {
    const results = Array.from({ length: 20_000 }, (_, index) => ok(index))

    expect(collectResults(results).value).toHaveLength(20_000)
  })
})
