# attemptAsync

Executes an asynchronous function and wraps the outcome in a [`Result`](../../concepts/result.md). Awaits the returned promise — `Err` carries the rejection reason.

```typescript
const result = await attemptAsync(() => fetchUser(id))
```

## Usage

### `attemptAsync(fn)`

Use `attemptAsync` for any `Promise`-returning operation that may reject: HTTP fetches, database calls, file I/O. The rejection value is normalized to an `Error` the same way `attempt` normalizes thrown values.

```typescript
import { attemptAsync, isErr } from 'massaman'
// or:  import { attemptAsync, isErr } from 'massaman/control'

const user = await attemptAsync(() => fetch(`/api/users/${id}`).then((r) => r.json()))
if (isErr(user)) {
  return respond.serverError(user.error)
}
return respond.ok(user.value)
```

#### Parameters

- `fn` (`() => Promise<T>`): a function returning a promise. Pass a thunk, not a promise — `attemptAsync(promise)` would not catch a synchronous throw inside the producing expression.

#### Returns

(`Promise<Result<T>>`): resolves to `Ok<T>` if the promise fulfills, `Err` if it rejects. Never rejects.

## Examples

Compose with `match` at a route boundary:

```typescript
import { attemptAsync, match } from 'massaman'

const result = await attemptAsync(() => db.users.findById(id))

return match(result)
  .with({ ok: true, value: null }, () => respond.notFound())
  .with({ ok: true }, ({ value }) => respond.ok(value))
  .with({ ok: false }, ({ error }) => respond.serverError(error))
  .exhaustive()
```

## See also

- [`attempt`](./attempt.md) — synchronous variant
- [Result type concept guide](../../concepts/result.md)
