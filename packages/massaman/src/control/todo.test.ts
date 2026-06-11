import { describe, expect, it } from 'vitest'

import { todo } from './todo.js'

describe('todo', () => {
  it('uses the default message when called with no argument', () => {
    expect(() => todo()).toThrow('not yet implemented')
  })

  it('appends the provided message after the default', () => {
    expect(() => todo('waiting on schema decision')).toThrow(
      'not yet implemented: waiting on schema decision'
    )
  })

  it('throws an Error instance', () => {
    expect(() => todo()).toThrow(Error)
  })

  it('treats null as no-message (defensive against `as any` callers)', () => {
    expect(() => todo(null as unknown as string)).toThrow('not yet implemented')
  })

  it('satisfies a `never` return position so it slots into any expression', () => {
    const compute = (flag: boolean): number => {
      if (flag) {
        return 42
      }
      return todo('not yet wired')
    }

    expect(compute(true)).toBe(42)
    expect(() => compute(false)).toThrow('not yet implemented: not yet wired')
  })
})
