import { describe, expectTypeOf, it } from 'vitest'

import { andThen } from './andThen.js'
import { err, ok } from './result.js'
import type { Result } from './types.js'

type ParseError = Error & { readonly name: 'ParseError' }
type SaveError = Error & { readonly name: 'SaveError' }

describe('andThen types', () => {
  it('infers the callback value and unions distinct error types', () => {
    const run = (
      result: Result<string, ParseError>,
      save: (value: number) => Result<number, SaveError>
    ) =>
      andThen(result, (value) => {
        expectTypeOf(value).toEqualTypeOf<string>()
        return save(Number(value))
      })

    expectTypeOf<ReturnType<typeof run>>().toEqualTypeOf<Result<number, ParseError | SaveError>>()
  })

  it('does not introduce Error for an infallible input or callback', () => {
    expectTypeOf(andThen(ok('42'), (value) => ok(Number(value)))).toEqualTypeOf<
      Result<number, never>
    >()
  })

  it('preserves the input error when the next step cannot fail', () => {
    const run = (result: Result<string, ParseError>) => andThen(result, (value) => ok(value.length))

    expectTypeOf<ReturnType<typeof run>>().toEqualTypeOf<Result<number, ParseError>>()
  })

  it('infers an error-only callback without adding an unknown success type', () => {
    const run = (result: Result<string, ParseError>, error: SaveError) =>
      andThen(result, () => err(error))

    expectTypeOf<ReturnType<typeof run>>().toEqualTypeOf<Result<never, ParseError | SaveError>>()
  })

  it('rejects callbacks that do not return a synchronous Result', () => {
    expectTypeOf(andThen(ok(1), (value) => ok(value))).toEqualTypeOf<Result<number, never>>()
    // @ts-expect-error The callback must return a Result, not a bare value.
    andThen(ok(1), (value) => value + 1)
    // @ts-expect-error Await asynchronous work explicitly before composing Results.
    andThen(ok(1), async (value) => ok(value))
  })
})
