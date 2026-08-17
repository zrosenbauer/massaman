# Result & Errors

Massaman treats expected failure as data. A fallible operation returns a `Result<T>` so its caller can see and handle both outcomes without relying on an exception path.

```typescript
type Ok<T> = { ok: true; value: T; error: null }
type Err = { ok: false; value: null; error: Error }
type Result<T> = Ok<T> | Err
```

Thrown and rejected values still exist at unsafe boundaries. `attempt`, `attemptAsync`, and `err` normalize those values into an `Error` before returning an `Err`.

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
| `err(error)` | Construct a failed result and normalize its error |
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
- [`AbortError`](../reference/error/AbortError.md) and [`TimeoutError`](../reference/error/TimeoutError.md)
- [Pattern Matching](./match.md)
