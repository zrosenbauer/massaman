import { describe, expect, it } from 'vitest'

import { partitionResults } from './partitionResults.js'
import { err, ok } from './result.js'

describe('partitionResults', () => {
  it('preserves every value and original error in group order', () => {
    const first = Object.assign(new Error('first'), { id: '123' })
    const second = new RangeError('second')
    const value = Object.freeze({ name: 'Zac' })
    const results = Object.freeze([
      Object.freeze(ok(value)),
      Object.freeze(err(first)),
      Object.freeze(err(second)),
      Object.freeze(ok(value)),
    ])
    const partitioned = partitionResults(results)

    expect(partitioned).toEqual({ values: [value, value], errors: [first, second] })
    expect(partitioned.values[0]).toBe(value)
    expect(partitioned.errors[0]).toBe(first)
    expect(partitioned.errors[1]).toBe(second)
    expect(results).toHaveLength(4)
  })

  it('returns two empty arrays for empty input', () => {
    expect(partitionResults([])).toEqual({ values: [], errors: [] })
  })

  it('returns no errors when every result succeeds', () => {
    expect(partitionResults([ok(1), ok(2)])).toEqual({ values: [1, 2], errors: [] })
  })

  it('returns no values when every result fails', () => {
    const error = new Error('bad')

    expect(partitionResults([err(error), err(error)])).toEqual({
      values: [],
      errors: [error, error],
    })
  })

  it('preserves null and undefined success values', () => {
    expect(partitionResults([ok(null), ok(undefined)])).toEqual({
      values: [null, undefined],
      errors: [],
    })
  })
})
