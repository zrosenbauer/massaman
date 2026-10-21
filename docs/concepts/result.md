# Result & Errors

Massaman treats expected failure as data. A fallible operation returns a `Result<T>` so its caller can see and handle both outcomes without relying on an exception path.

```typescript
type Ok<T> = { ok: true; value: T; error: null }
type Err<E extends Error = Error> = { ok: false; value: null; error: E }
type Result<T, E extends Error = Error> = Ok<T> | Err<E>
```

The error parameter preserves specific `Error` types while defaulting to `Error` for existing `Result<T>` call sites. Thrown and rejected values still exist at unsafe boundaries; `attempt`, `attemptAsync`, and `err` normalize non-Error values before returning an `Err`.

## Why it matters

Exceptions hide failure outside a function's return type. A `Result` makes failure visible, keeps it local to the data flow, and gives TypeScript a discriminated union to narrow.

This creates a clear boundary:

- unsafe code may throw or reject
- `attempt` or `attemptAsync` catches that outcome once
- application code handles `Ok` and `Err` as ordinary values

## Core tools

| Tool | Purpose |
|---|---|
| `attempt(fn)` | Run synchronous unsafe work and return a `Result` |
| `attemptAsync(fn)` | Run asynchronous unsafe work and return a promised `Result` |
| `ok(value)` | Construct a successful result |
| `err(error)` | Construct a failed result, preserving its `Error` subtype or normalizing a non-Error value |
| `createError(definition)` | Create a native error with a literal name and custom data |
| `defineError(definition)` | Define a reusable error constructor from an object or function |
| `ErrorWith<Name, Data>` | Describe the native error and its custom data |
| `isOk(result)` / `isErr(result)` | Narrow a result with a type guard |
| `P.ok(pattern?)` / `P.err(pattern?)` | Match a result structurally |
| `unwrap(result, message?)` | Extract an `Ok` value or throw; use only at a deliberate crash boundary |
| `toError(value)` | Normalize an unknown value when no `Result` is needed |

`AbortError` and `TimeoutError` provide recognizable error types for cancellation and time limits. They can be carried by an `Err` like any other `Error`.

## When to use it

Use `Result` when failure is expected and the caller can respond:

- parsing untrusted input
- reading files or configuration
- calling a network or storage boundary
- enforcing a domain rule that can reject a value

Construct `ok` and `err` in functions that model fallibility directly. Use `attempt` and `attemptAsync` around APIs that communicate failure by throwing or rejecting.

## Typed errors

Use `defineError` for reusable domain errors without subclasses. `err` preserves their specific types, and literal names let pattern matching narrow each failure's data.

```typescript
import { defineError, err, match, P, type ErrorWith, type Result } from 'massaman'

type NotFound = ErrorWith<'NotFound', { readonly specId: string }>
type Forbidden = ErrorWith<'Forbidden', { readonly permission: string }>
type SpecFailure = NotFound | Forbidden

const notFound = defineError<NotFound, [specId: string]>((specId) => ({
  name: 'NotFound',
  message: `Spec ${specId} not found`,
  specId,
}))

const describe = (result: Result<string, SpecFailure>): string =>
  match(result)
    .with(P.ok(), ({ value }) => value)
    .with(P.err({ name: 'NotFound' }), ({ error }) => `Missing spec ${error.specId}`)
    .with(P.err({ name: 'Forbidden' }), ({ error }) => `Requires ${error.permission}`)
    .exhaustive()

describe(err(notFound('spec-1')))
// 'Missing spec spec-1'
```

Inference is the default: omit the generics when the definition already describes the contract. An inline function definition infers its arguments and literal name. An object definition creates a zero-argument constructor. `ReturnType<typeof notFound>` extracts the instance type when you do not need to declare it upfront.

For one-off errors, call `createError` directly:

```typescript
import { createError, err } from 'massaman'

err(createError({
  name: 'NotFound',
  message: 'Spec not found',
  specId: 'spec-1',
}))
```

Both constructors create native `Error` instances with fresh stacks and optional causes. Custom data is shallowly copied; its fields are readonly in TypeScript, not frozen at runtime. Return errors through `err` for expected failures. Throw them only at a deliberate exception boundary.

Existing `Error` intersections, interfaces, and subclasses still work. Passing a plain object directly to `err` still normalizes it into `Err<Error>`; use `createError` or `defineError` to preserve typed custom fields.

## Complete example

```typescript
import { attempt, match, P, type Result } from 'massaman'

type Config = { port: number }

const parseConfig = (raw: string): Result<Config> =>
  attempt(() => JSON.parse(raw) as Config)

const message = match(parseConfig(input))
  .with(P.ok(), ({ value }) => `Listening on ${value.port}`)
  .with(P.err(P.instanceOf(SyntaxError)), ({ error }) =>
    `Invalid JSON: ${error.message}`,
  )
  .with(P.err(), ({ error }) => `Could not load config: ${error.message}`)
  .exhaustive()
```

The unsafe operation is isolated in `parseConfig`. Everything after it handles typed data, and every result variant is covered.

## When not to use it

Do not wrap every branch in a `Result`.

- Use a domain union such as `User | NotFound` when both variants are normal outcomes.
- Let programmer errors fail loudly; they are bugs, not recoverable domain values.
- Use `unwrap` only where crashing is the intended policy, such as required boot configuration.

`Result` describes expected failure. It is not a replacement for every union or every exception.

## Related reference

- [`attempt`](../reference/control/attempt.md) and [`attemptAsync`](../reference/control/attemptAsync.md)
- [`ok`](../reference/control/ok.md), [`err`](../reference/control/err.md), [`isOk`](../reference/control/isOk.md), and [`isErr`](../reference/control/isErr.md)
- [`unwrap`](../reference/control/unwrap.md) and [`toError`](../reference/conversion/toError.md)
- [`createError`](../reference/error/createError.md), [`defineError`](../reference/error/defineError.md), and [`ErrorWith`](../reference/error/ErrorWith.md)
- [`AbortError`](../reference/error/AbortError.md) and [`TimeoutError`](../reference/error/TimeoutError.md)
- [Pattern Matching](./match.md)
