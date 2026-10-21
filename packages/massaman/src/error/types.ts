/**
 * A native `Error` with a literal name and readonly custom fields.
 * Native error fields are not overridden by `Data`.
 *
 * @example
 * ```ts
 * type NotFound = ErrorWith<'NotFound', { readonly userId: string }>
 * ```
 */
export type ErrorWith<
  Name extends string,
  Data extends object = Record<never, never>,
> = Data extends unknown
  ? Omit<Error, 'name'> & { readonly name: Name } & Readonly<Omit<Data, keyof Error>>
  : never

/** @private */
export interface ErrorInput {
  readonly name: string
  readonly message: string
  readonly cause?: unknown
  readonly stack?: never
  readonly toString: Error['toString']
}

/** @private */
export type ErrorDefinition<E extends Error> = E extends Error
  ? ErrorInput & Omit<E, 'stack' | 'toString'>
  : never

/** @private */
export type ErrorFrom<Input extends ErrorInput> = Input extends unknown
  ? ErrorWith<Input['name'], Omit<Input, keyof Error>>
  : never
