import { describe, expectTypeOf, it } from 'vitest'

import { partitionResults } from './partitionResults.js'
import { err, ok } from './result.js'
import type { Result } from './types.js'

type ParseError = Error & { readonly name: 'ParseError' }
type SaveError = Error & { readonly name: 'SaveError' }

describe('partitionResults types', () => {
  it('accepts readonly inputs and preserves value and error unions', () => {
    const run = (results: readonly Result<number | string, ParseError | SaveError>[]) =>
      partitionResults(results)

    expectTypeOf<ReturnType<typeof run>>().toEqualTypeOf<{
      values: (number | string)[]
      errors: (ParseError | SaveError)[]
    }>()
  })

  it('infers heterogeneous errors from an inline array', () => {
    const run = (parseError: ParseError, saveError: SaveError) =>
      partitionResults([ok(1), err(parseError), err(saveError)])

    expectTypeOf<ReturnType<typeof run>>().toEqualTypeOf<{
      values: number[]
      errors: (ParseError | SaveError)[]
    }>()
  })

  it('infers never for the empty group', () => {
    expectTypeOf(partitionResults([ok(1), ok(2)] as const)).toEqualTypeOf<{
      values: number[]
      errors: never[]
    }>()
    expectTypeOf(partitionResults([err('missing')])).toEqualTypeOf<{
      values: never[]
      errors: Error[]
    }>()
    expectTypeOf(partitionResults([])).toEqualTypeOf<{ values: never[]; errors: never[] }>()
  })
})
