import { describe, expectTypeOf, it } from 'vitest'

import { orElse } from './orElse.js'
import { err, ok } from './result.js'
import type { Result } from './types.js'

type ParseError = Error & { readonly name: 'ParseError' }
type RecoveryError = Error & { readonly name: 'RecoveryError' }

describe('orElse types', () => {
  it('infers the error and replaces it with the recovery error type', () => {
    const run = (
      result: Result<number, ParseError>,
      recover: (error: ParseError) => Result<string, RecoveryError>
    ) =>
      orElse(result, (error) => {
        expectTypeOf(error).toEqualTypeOf<ParseError>()
        return recover(error)
      })

    expectTypeOf<ReturnType<typeof run>>().toEqualTypeOf<Result<number | string, RecoveryError>>()
  })

  it('does not introduce unknown when recovering an error-only input', () => {
    expectTypeOf(orElse(err('missing'), () => ok(42))).toEqualTypeOf<Result<number, never>>()
  })

  it('preserves the original success type when recovery only fails', () => {
    const run = (result: Result<number, ParseError>, error: RecoveryError) =>
      orElse(result, () => err(error))

    expectTypeOf<ReturnType<typeof run>>().toEqualTypeOf<Result<number, RecoveryError>>()
  })

  it('rejects callbacks that do not return a synchronous Result', () => {
    expectTypeOf(orElse(err('missing'), () => ok(42))).toEqualTypeOf<Result<number, never>>()
    // @ts-expect-error Recovery must return a Result, not a bare value.
    orElse(err('missing'), () => 42)
    // @ts-expect-error Await asynchronous recovery explicitly.
    orElse(err('missing'), async () => ok(42))
  })
})
