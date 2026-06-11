import { describe, expect, it } from 'vitest'

import { unimplemented } from './unimplemented.js'

describe('unimplemented', () => {
  it('uses the default message when called with no argument', () => {
    expect(() => unimplemented()).toThrow('not implemented')
  })

  it('appends the provided message after the default', () => {
    expect(() => unimplemented('mysql driver intentionally unsupported')).toThrow(
      'not implemented: mysql driver intentionally unsupported'
    )
  })

  it('throws an Error instance', () => {
    expect(() => unimplemented()).toThrow(Error)
  })

  it('treats null as no-message (defensive against `as any` callers)', () => {
    expect(() => unimplemented(null as unknown as string)).toThrow('not implemented')
  })

  it('satisfies a `never` return position so it slots into any expression', () => {
    const pickHandler = (driver: 'pg' | 'mysql'): string => {
      if (driver === 'pg') {
        return 'pg-handler'
      }
      return unimplemented('mysql off the table')
    }

    expect(pickHandler('pg')).toBe('pg-handler')
    expect(() => pickHandler('mysql')).toThrow('not implemented: mysql off the table')
  })
})
