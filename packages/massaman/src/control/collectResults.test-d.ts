import { describe, expectTypeOf, it } from 'vitest'

import { collectResults } from './collectResults.js'
import { err, ok } from './result.js'
import type { Result } from './types.js'

type ParseError = Error & { readonly name: 'ParseError' }
type SaveError = Error & { readonly name: 'SaveError' }

describe('collectResults types', () => {
  it('accepts readonly inputs and preserves value and error unions', () => {
    const run = (results: readonly Result<number | string, ParseError | SaveError>[]) =>
      collectResults(results)

    expectTypeOf<ReturnType<typeof run>>().toEqualTypeOf<
      Result<(number | string)[], ParseError | SaveError>
    >()
  })

  it('infers heterogeneous errors from an inline array', () => {
    const run = (parseError: ParseError, saveError: SaveError) =>
      collectResults([ok(1), err(parseError), err(saveError)])

    expectTypeOf<ReturnType<typeof run>>().toEqualTypeOf<Result<number[], ParseError | SaveError>>()
  })

  it('does not introduce Error for all-success or empty inputs', () => {
    expectTypeOf(collectResults([ok(1), ok(2)] as const)).toEqualTypeOf<Result<number[], never>>()
    expectTypeOf(collectResults([])).toEqualTypeOf<Result<never[], never>>()
  })

  it('infers never for success values in an error-only input', () => {
    expectTypeOf(collectResults([err('missing')])).toEqualTypeOf<Result<never[], Error>>()
  })
})
