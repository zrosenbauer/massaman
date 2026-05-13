# Ok

Pattern value that matches an `Ok` [`Result`](../../concepts/result.md) inside `match()`. Mirrors Rust's `Ok(value)` match arm.

```typescript
match(result)
  .with(Ok, ({ value }) => …)
  .with(Err, …)
  .exhaustive()
```

## Usage

### `Ok` as a pattern

`Ok` is the literal `{ ok: true }`, bound to a name. It works anywhere ts-pattern accepts a structural pattern.

```typescript
import { match, Ok, Err, attempt } from 'massaman'

const parsed = attempt(() => JSON.parse(raw))

const summary = match(parsed)
  .with(Ok, ({ value }) => `parsed: ${typeof value}`)
  .with(Err, ({ error }) => `failed: ${error.message}`)
  .exhaustive()
```

Inside the `Ok` arm, the matched value is narrowed to `Ok<T>` — `value` is typed as `T`, `error` is `null`.

### Extending the pattern

Because `Ok` is a plain object, you can spread it to add field constraints:

```typescript
match(result)
  .with({ ...Ok, value: { name: 'jane' } }, () => 'jane!')
  .with(Ok, ({ value }) => `got ${value.name}`)
  .with(Err, ({ error }) => `err: ${error.message}`)
  .exhaustive()
```

The first arm only matches an `Ok` whose `value.name` is `'jane'`. The second arm catches any other `Ok`. The third catches `Err`.

## Types and values share the name

`Ok` exists in two namespaces:

- **Type:** `Ok<T> = { ok: true; value: T; error: null }` — the success variant of `Result<T>`.
- **Value:** `Ok = { ok: true }` — the pattern matcher.

TypeScript keeps these separate. `const x: Ok<number> = ok(42)` uses the type; `.with(Ok, …)` uses the value. Same import.

## See also

- [`Err`](./Err.md) — the failure pattern
- [`match`](./match.md) — the dispatcher
- [`ok`](../control/ok.md) — the value constructor
- [Result type concept guide](../../concepts/result.md)
