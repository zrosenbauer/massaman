# Err

Pattern value that matches an `Err` [`Result`](../../concepts/result.md) inside `match()`. Mirrors Rust's `Err(error)` match arm.

```typescript
match(result)
  .with(Ok, …)
  .with(Err, ({ error }) => …)
  .exhaustive()
```

## Usage

### `Err` as a pattern

`Err` is the literal `{ ok: false }`, bound to a name. It pairs with [`Ok`](./Ok.md) to exhaustively cover any `Result<T>`.

```typescript
import { match, Ok, Err, attemptAsync } from 'massaman'

const user = await attemptAsync(() => fetch(`/api/users/${id}`).then((r) => r.json()))

return match(user)
  .with(Ok, ({ value }) => respond.ok(value))
  .with(Err, ({ error }) => respond.serverError(error))
  .exhaustive()
```

Inside the `Err` arm, the matched value is narrowed to `Err` — `error` is `Error`, `value` is `null`.

### Extending the pattern

Spread to add constraints, the same way `Ok` works:

```typescript
import { match, Err, Ok } from 'massaman'

match(result)
  .with({ ...Err, error: { name: 'AbortError' } }, () => 'cancelled')
  .with(Err, ({ error }) => `failed: ${error.message}`)
  .with(Ok, ({ value }) => `got ${value}`)
  .exhaustive()
```

## Types and values share the name

`Err` exists in two namespaces:

- **Type:** `Err = { ok: false; value: null; error: Error }` — the failure variant of `Result<T>`.
- **Value:** `Err = { ok: false }` — the pattern matcher.

Same import covers both contexts.

## See also

- [`Ok`](./Ok.md) — the success pattern
- [`match`](./match.md) — the dispatcher
- [`err`](../control/err.md) — the value constructor
- [Result type concept guide](../../concepts/result.md)
