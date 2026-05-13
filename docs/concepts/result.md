# Result type

A `Result<T>` is the value returned by a function that might fail. Instead of throwing, the function returns either an `Ok<T>` (success, with a value) or an `Err` (failure, with an `Error`). Callers discriminate on the `ok` field and read either `value` or `error`.

This is Rust's `Result<T, E>` in TypeScript — with one simplification: errors are always `Error`. The normalization is done for you by `attempt` and `err`.

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
import { isOk, isErr, unwrap, match, Ok, Err } from 'massaman'

// 1. Type guards (good for early-return)
if (isErr(result)) {
  return handleError(result.error)
}
useValue(result.value) // narrowed to T

// 2. Pattern matching (good for multi-arm logic)
return match(result)
  .with(Ok, ({ value }) => render(value))
  .with(Err, ({ error }) => renderError(error))
  .exhaustive()

// 3. Unwrap (escape hatch — throws on Err)
const value = unwrap(result, 'value required')
```

## `Ok` and `Err` as patterns

`Ok` and `Err` come in two forms: type names (`type Ok<T>`, `type Err`) and pattern values (`const Ok`, `const Err`). TypeScript keeps types and values in separate namespaces, so the same name covers both contexts — exactly like Rust, where `Ok(value)` works as both an expression and a match arm.

The pattern values are equivalent to the inline structural patterns:

```typescript
// These two are interchangeable:
match(result)
  .with(Ok, ({ value }) => …)
  .with(Err, ({ error }) => …)
  .exhaustive()

match(result)
  .with({ ok: true }, ({ value }) => …)
  .with({ ok: false }, ({ error }) => …)
  .exhaustive()
```

Use `Ok` / `Err` when you want the Rust feel; use the inline form when you're already extending the pattern with additional fields:

```typescript
// Spread the pattern to add constraints
match(result)
  .with({ ...Ok, value: { name: 'jane' } }, () => 'jane!')
  .with(Ok, ({ value }) => `got ${value.name}`)
  .with(Err, ({ error }) => `err: ${error.message}`)
  .exhaustive()
```

## Error normalization

Whatever you `throw` or `reject` with, `Result` will give you an `Error`:

```typescript
attempt(() => { throw 'oops' })          // err.error = Error('oops')
attempt(() => { throw new Error('x') })  // err.error = Error('x')
attempt(() => { throw { code: 42 } })    // err.error = Error('{"code":42}', { cause: { code: 42 } })
```

This means `result.error` is always an `Error` you can `.message` and inspect uniformly. The original thrown value is preserved on `error.cause` when it wasn't already an `Error`.

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
- [`Ok`](../reference/match/Ok.md), [`Err`](../reference/match/Err.md) — pattern values for `match`
- [Pattern matching concept guide](./match.md)
