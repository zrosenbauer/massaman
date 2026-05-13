import { describe, expect, it } from 'vitest'

import { ascend, descend, sortWith } from './sorting.js'

describe('ascend', () => {
  it('creates ascending comparator', () => {
    const items = [{ v: 3 }, { v: 1 }, { v: 2 }]
    expect([...items].toSorted(ascend((x) => x.v))).toEqual([{ v: 1 }, { v: 2 }, { v: 3 }])
  })

  it('works with strings', () => {
    const items = [{ name: 'Charlie' }, { name: 'Alice' }, { name: 'Bob' }]
    expect([...items].toSorted(ascend((x) => x.name))).toEqual([
      { name: 'Alice' },
      { name: 'Bob' },
      { name: 'Charlie' },
    ])
  })
})

describe('descend', () => {
  it('creates descending comparator', () => {
    const items = [{ v: 1 }, { v: 3 }, { v: 2 }]
    expect([...items].toSorted(descend((x) => x.v))).toEqual([{ v: 3 }, { v: 2 }, { v: 1 }])
  })

  it('returns 0 for equal values', () => {
    const cmp = descend((x: { v: number }) => x.v)
    expect(cmp({ v: 5 }, { v: 5 })).toBe(0)
  })
})

describe('sortWith', () => {
  it('sorts by multiple comparators', () => {
    const data = [
      { dept: 'B', age: 30 },
      { dept: 'A', age: 25 },
      { dept: 'A', age: 30 },
      { dept: 'B', age: 25 },
    ]
    const result = sortWith(data, [ascend((x) => x.dept), descend((x) => x.age)])
    expect(result).toEqual([
      { dept: 'A', age: 30 },
      { dept: 'A', age: 25 },
      { dept: 'B', age: 30 },
      { dept: 'B', age: 25 },
    ])
  })

  it('does not mutate the original', () => {
    const original = [{ v: 3 }, { v: 1 }, { v: 2 }]
    sortWith(original, [ascend((x) => x.v)])
    expect(original).toEqual([{ v: 3 }, { v: 1 }, { v: 2 }])
  })

  it('handles empty comparators', () => {
    const data = [3, 1, 2]
    expect(sortWith(data, [])).toEqual([3, 1, 2])
  })

  it('handles empty array', () => {
    expect(sortWith([], [ascend((x: number) => x)])).toEqual([])
  })
})
