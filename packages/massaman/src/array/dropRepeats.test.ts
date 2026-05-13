import { describe, expect, it } from 'vitest'

import { dropRepeats } from './dropRepeats.js'

describe('dropRepeats', () => {
  it('removes consecutive duplicates', () => {
    expect(dropRepeats([1, 1, 2, 3, 3, 2, 1])).toEqual([1, 2, 3, 2, 1])
  })

  it('keeps non-adjacent duplicates', () => {
    expect(dropRepeats([1, 2, 1, 2])).toEqual([1, 2, 1, 2])
  })

  it('handles empty array', () => {
    expect(dropRepeats([])).toEqual([])
  })

  it('handles single element', () => {
    expect(dropRepeats([1])).toEqual([1])
  })

  it('handles all same elements', () => {
    expect(dropRepeats([5, 5, 5, 5])).toEqual([5])
  })

  it('works with strings', () => {
    expect(dropRepeats(['a', 'a', 'b', 'b', 'a'])).toEqual(['a', 'b', 'a'])
  })
})
