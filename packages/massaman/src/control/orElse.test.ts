import { describe, expect, it, vi } from 'vitest'

import { orElse } from './orElse.js'
import { err, ok } from './result.js'

describe('orElse', () => {
  it('passes the original error to recovery and returns its success unchanged', () => {
    const error = Object.assign(new Error('missing'), { id: '123' })
    const recovered = ok('guest')
    const recover = vi.fn(() => recovered)

    expect(orElse(err(error), recover)).toBe(recovered)
    expect(recover).toHaveBeenCalledExactlyOnceWith(error)
  })

  it('preserves the original success without calling recovery', () => {
    const success = Object.freeze(ok({ name: 'Zac' }))
    const recover = vi.fn(() => ok('guest'))

    expect(orElse(success, recover)).toBe(success)
    expect(recover).not.toHaveBeenCalled()
  })

  it('returns a failed recovery unchanged', () => {
    const failure = err(new RangeError('backup failed'))

    expect(orElse(err('primary failed'), () => failure)).toBe(failure)
  })

  it('preserves null and undefined successes', () => {
    expect(orElse(ok(null), () => ok('fallback'))).toEqual(ok(null))
    expect(orElse(ok(undefined), () => ok('fallback'))).toEqual(ok(undefined))
  })

  it('propagates unexpected recovery exceptions', () => {
    const failure = new Error('bug')

    expect(() =>
      orElse(err('missing'), () => {
        throw failure
      })
    ).toThrow(failure)
  })
})
