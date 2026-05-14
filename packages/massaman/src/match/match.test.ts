import { match } from 'ts-pattern'
import { describe, expect, it } from 'vitest'

import { err, ok } from '../control/result.js'
import type { Result } from '../control/types.js'
import { P } from './match.js'

function describeResult<T>(result: Result<T>): string {
  return match(result)
    .with(P.ok, ({ value }) => `ok:${String(value)}`)
    .with(P.err, ({ error }) => `err:${error.message}`)
    .exhaustive()
}

describe('P.ok', () => {
  it('is the literal shape { ok: true }', () => {
    expect(P.ok).toEqual({ ok: true })
  })

  it('matches an Ok result via match()', () => {
    expect(describeResult(ok(42))).toBe('ok:42')
  })

  it('does not match an Err result (falls through)', () => {
    expect(describeResult(err('boom'))).toBe('err:boom')
  })
})

describe('P.err', () => {
  it('is the literal shape { ok: false }', () => {
    expect(P.err).toEqual({ ok: false })
  })

  it('matches an Err result via match() and exposes error.message', () => {
    expect(describeResult(err('boom'))).toBe('err:boom')
  })

  it('does not match an Ok result (falls through)', () => {
    expect(describeResult(ok('hi'))).toBe('ok:hi')
  })
})

describe('P with ts-pattern primitives', () => {
  it('still exposes ts-pattern primitives after the spread', () => {
    expect(typeof P.string).toBe('object')
    expect(typeof P.number).toBe('object')
    expect(typeof P.when).toBe('function')
  })

  it('matches non-Result values via ts-pattern primitives', () => {
    function describeNumber(n: number): string {
      return match(n)
        .with(0, () => 'zero')
        .with(P.number, (x) => `num:${x}`)
        .exhaustive()
    }
    expect(describeNumber(0)).toBe('zero')
    expect(describeNumber(42)).toBe('num:42')
  })
})

describe('P.ok and P.err together', () => {
  it('exhaustively cover Result for a sequence of cases', () => {
    const cases: Array<Result<number>> = [ok(1), err('a'), ok(2), err('b')]
    expect(cases.map(describeResult)).toEqual(['ok:1', 'err:a', 'ok:2', 'err:b'])
  })

  it('compose with additional pattern fields by spreading P.ok', () => {
    function nested(result: Result<{ name: string }>): string {
      return match(result)
        .with({ ...P.ok, value: { name: 'jane' } }, () => 'jane!')
        .with(P.ok, ({ value }) => `got ${value.name}`)
        .with(P.err, ({ error }) => `err:${error.message}`)
        .exhaustive()
    }

    expect(nested(ok({ name: 'jane' }))).toBe('jane!')
    expect(nested(ok({ name: 'bob' }))).toBe('got bob')
    expect(nested(err('nope'))).toBe('err:nope')
  })
})
