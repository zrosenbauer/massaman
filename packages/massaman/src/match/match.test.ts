import { match } from 'ts-pattern'
import { describe, expect, it } from 'vitest'

import { err, ok } from '../control/result.js'
import type { Result } from '../control/types.js'
import { Err, Ok } from './match.js'

function describeResult<T>(result: Result<T>): string {
  return match(result)
    .with(Ok, ({ value }) => `ok:${String(value)}`)
    .with(Err, ({ error }) => `err:${error.message}`)
    .exhaustive()
}

describe('Ok pattern', () => {
  it('is the literal shape { ok: true }', () => {
    expect(Ok).toEqual({ ok: true })
  })

  it('matches an Ok result via match()', () => {
    expect(describeResult(ok(42))).toBe('ok:42')
  })

  it('does not match an Err result (falls through)', () => {
    expect(describeResult(err('boom'))).toBe('err:boom')
  })
})

describe('Err pattern', () => {
  it('is the literal shape { ok: false }', () => {
    expect(Err).toEqual({ ok: false })
  })

  it('matches an Err result via match() and exposes error.message', () => {
    expect(describeResult(err('boom'))).toBe('err:boom')
  })

  it('does not match an Ok result (falls through)', () => {
    expect(describeResult(ok('hi'))).toBe('ok:hi')
  })
})

describe('Ok and Err together', () => {
  it('exhaustively cover Result for a sequence of cases', () => {
    const cases: Array<Result<number>> = [ok(1), err('a'), ok(2), err('b')]
    expect(cases.map(describeResult)).toEqual(['ok:1', 'err:a', 'ok:2', 'err:b'])
  })

  it('compose with additional pattern fields by spreading Ok', () => {
    function nested(result: Result<{ name: string }>): string {
      return match(result)
        .with({ ...Ok, value: { name: 'jane' } }, () => 'jane!')
        .with(Ok, ({ value }) => `got ${value.name}`)
        .with(Err, ({ error }) => `err:${error.message}`)
        .exhaustive()
    }

    expect(nested(ok({ name: 'jane' }))).toBe('jane!')
    expect(nested(ok({ name: 'bob' }))).toBe('got bob')
    expect(nested(err('nope'))).toBe('err:nope')
  })
})
