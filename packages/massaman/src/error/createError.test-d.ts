import { describe, expectTypeOf, it } from 'vitest'

import { err } from '../control/result.js'
import type { Err } from '../control/types.js'
import type { ErrorWith as RootErrorWith } from '../index.js'
import { createError, type ErrorWith } from './index.js'

type NotFound = ErrorWith<'NotFound', { readonly userId: string }>

describe('ErrorWith', () => {
  it('exports the same type from the root and error subpath', () => {
    expectTypeOf<RootErrorWith<'NotFound', { userId: string }>>().toEqualTypeOf<NotFound>()
  })

  it('defaults to a named native error without custom fields', () => {
    expectTypeOf<ErrorWith<'Failure'>>().toExtend<Error>()
    expectTypeOf<ErrorWith<'Failure'>['name']>().toEqualTypeOf<'Failure'>()
  })

  it('adds readonly custom fields without replacing native fields', () => {
    type Failure = ErrorWith<
      'Failure',
      { code: number; name: number; message: number; stack: number }
    >

    expectTypeOf<Failure['code']>().toEqualTypeOf<number>()
    expectTypeOf<Failure['name']>().toEqualTypeOf<'Failure'>()
    expectTypeOf<Failure['message']>().toEqualTypeOf<string>()
    expectTypeOf<Failure['stack']>().toEqualTypeOf<string | undefined>()
  })

  it('accepts interfaces for custom data', () => {
    interface Data {
      readonly id: string
    }

    expectTypeOf<ErrorWith<'Failure', Data>['id']>().toEqualTypeOf<string>()
  })

  it('preserves custom data unions', () => {
    type Failure = ErrorWith<
      'HttpError',
      | { readonly status: 404; readonly userId: string }
      | { readonly status: 403; readonly permission: string }
    >

    expectTypeOf<Extract<Failure, { status: 404 }>['userId']>().toEqualTypeOf<string>()
    expectTypeOf<Extract<Failure, { status: 403 }>['permission']>().toEqualTypeOf<string>()
  })
})

describe('createError types', () => {
  it('infers literal names and custom fields', () => {
    const error = createError({
      name: 'NotFound',
      message: 'User missing',
      userId: '123',
      status: 404,
    })

    expectTypeOf(error).toExtend<Error>()
    expectTypeOf(error.name).toEqualTypeOf<'NotFound'>()
    expectTypeOf(error.userId).toEqualTypeOf<'123'>()
    expectTypeOf(error.status).toEqualTypeOf<404>()
  })

  it('checks explicit output contracts and preserves them through err', () => {
    const error = createError<NotFound>({
      name: 'NotFound',
      message: 'User missing',
      userId: '123',
    })

    expectTypeOf(error).toEqualTypeOf<NotFound>()
    expectTypeOf(err(error)).toEqualTypeOf<Err<NotFound>>()
  })

  it('rejects missing fields and incompatible output contracts', () => {
    // @ts-expect-error name is required
    createError({ message: 'Failed' })
    // @ts-expect-error message is required
    createError({ name: 'Failure' })
    // @ts-expect-error messages must be strings
    createError({ name: 'Failure', message: 123 })
    // @ts-expect-error userId is required by NotFound
    createError<NotFound>({ name: 'NotFound', message: 'User missing' })
    // @ts-expect-error name must match the output contract
    createError<NotFound>({ name: 'Forbidden', message: 'User missing', userId: '123' })
    // @ts-expect-error custom fields must match the output contract
    createError<NotFound>({ name: 'NotFound', message: 'User missing', userId: 123 })
    // @ts-expect-error stack is supplied by native Error construction
    createError({ name: 'Failure', message: 'Failed', stack: 'fake' })

    expectTypeOf(
      createError<NotFound>({ name: 'NotFound', message: 'User missing', userId: '123' })
    ).toEqualTypeOf<NotFound>()
  })

  it('exposes readonly name and custom data', () => {
    const error = createError({ name: 'Failure', message: 'Failed', code: 500 })

    // @ts-expect-error name is readonly
    error.name = 'Failure'
    // @ts-expect-error custom fields are readonly
    error.code = 500

    expectTypeOf(error.code).toEqualTypeOf<500>()
  })
})
