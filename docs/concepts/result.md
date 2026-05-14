# Result type

A `Result<T>` is the value returned by a function that might fail. Instead of throwing, the function returns either an `Ok<T>` (success, with a value) or an `Err` (failure, with an `Error`). Callers discriminate on the `ok` field and read either `value` or `error`.

This is Rust's `Result<T, E>` in TypeScript — with one simplification: errors are always `Error`. The normalization is done for you by `attempt`, `attemptAsync`, and `err`.

## The shape

```typescript
type Ok<T>  = { ok: true;  value: T;    error: null }
type Err    = { ok: false; value: null; error: Error }
type Result<T> = Ok<T> | Err
```

`ok` is the discriminant. TypeScript narrows on it.

## Three ways to make one

```typescript
import { attempt, attemptAsync, ok, err } from 'massaman'

// 1. Wrap an unsafe call
const parsed = attempt(() => JSON.parse(input))

// 2. Wrap an async unsafe call
const user = await attemptAsync(() => fetch('/api/me').then((r) => r.json()))

// 3. Construct directly (in your own functions)
function divide(a: number, b: number): Result<number> {
  return b === 0 ? err('division by zero') : ok(a / b)
}
```

## Three ways to consume one

```typescript
import { isOk, isErr, unwrap, match, P } from 'massaman'

// 1. Type guards (good for early-return)
if (isErr(result)) {
  return handleError(result.error)
}
useValue(result.value) // narrowed to T

// 2. Pattern matching (good for multi-arm logic)
return match(result)
  .with(P.ok, ({ value }) => render(value))
  .with(P.err, ({ error }) => renderError(error))
  .exhaustive()

// 3. Unwrap (escape hatch — throws on Err)
const value = unwrap(result, 'value required')
```

## `P.ok` and `P.err` for matching

`massaman/match` extends ts-pattern's `P` namespace with `P.ok` and `P.err` — structural patterns that match the `Ok` and `Err` variants of `Result`. They mirror Rust's `Ok(value)` / `Err(error)` match arms.

```typescript
match(result)
  .with(P.ok, ({ value }) => …)   // narrows to Ok<T>
  .with(P.err, ({ error }) => …)  // narrows to Err
  .exhaustive()
```

The values are equivalent to the inline structural patterns:

```typescript
// These two are interchangeable:
match(result)
  .with(P.ok, ({ value }) => …)
  .with(P.err, ({ error }) => …)
  .exhaustive()

match(result)
  .with({ ok: true }, ({ value }) => …)
  .with({ ok: false }, ({ error }) => …)
  .exhaustive()
```

Use `P.ok` / `P.err` for readability. Use the inline form when you're already extending the pattern with additional fields:

```typescript
// Spread the pattern to add constraints
match(result)
  .with({ ...P.ok, value: { name: 'jane' } }, () => 'jane!')
  .with(P.ok, ({ value }) => `got ${value.name}`)
  .with(P.err, ({ error }) => `err: ${error.message}`)
  .exhaustive()
```

## Names and namespaces

The same word appears in multiple places — here's the map:

| Form | Namespace | What it is |
|---|---|---|
| `type Ok<T>`, `type Err` | type | shape of a `Result` variant |
| `ok()`, `err()` | value (function) | constructors — make a `Result` |
| `P.ok`, `P.err` | value (property of `P`) | patterns — match a `Result` in `match()` |
| `isOk()`, `isErr()` | value (function) | type guards — narrow a `Result` in `if` |

The forms don't collide because they live in different syntactic contexts: a type annotation, a function call, a namespace property access, or an `if` guard. Pick whichever the situation needs.

## Error normalization

Whatever you `throw` or `reject` with, `Result` will give you an `Error`:

```typescript
attempt(() => { throw 'oops' })          // err.error = Error('oops')
attempt(() => { throw new Error('x') })  // err.error = Error('x')
attempt(() => { throw { code: 42 } })    // err.error = Error('{"code":42}', { cause: { code: 42 } })
```

`result.error` is always an `Error` you can `.message` and inspect uniformly. The original thrown value is preserved on `error.cause` when it wasn't already an `Error`.

## When NOT to use Result

- **Programmer errors** (out-of-bounds, missing argument that should always be there) — throw. These are bugs, not values.
- **Truly fatal conditions at boot** — let it crash. Use `unwrap` if you want a one-liner.
- **Already-typed unions** — if you have `User | NotFound`, use that. `Result<User | NotFound>` would just add a useless `Err` layer.

## Compare: throw vs Result

```typescript
// Throw — caller has to remember
function parseConfig(raw: string): Config {
  return JSON.parse(raw) // might throw
}
try {
  const config = parseConfig(raw)
  useConfig(config)
} catch (e) {
  // what type is e? what threw? do I rethrow?
}

// Result — failure is visible in the type
function parseConfig(raw: string): Result<Config> {
  return attempt(() => JSON.parse(raw) as Config)
}
const config = parseConfig(raw)
if (isOk(config)) useConfig(config.value)
else log(config.error)
```

The Result version pushes failure into the type signature — impossible to forget at the call site.

## Related

- [`attempt`](../reference/control/attempt.md), [`attemptAsync`](../reference/control/attemptAsync.md)
- [`ok`](../reference/control/ok.md), [`err`](../reference/control/err.md)
- [`isOk`](../reference/control/isOk.md), [`isErr`](../reference/control/isErr.md), [`unwrap`](../reference/control/unwrap.md)
- [`P`](../reference/match/P.md) — pattern primitives including `P.ok` / `P.err`
- [Pattern matching concept guide](./match.md)
