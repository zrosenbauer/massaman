# attempt

Executes a synchronous function and wraps the outcome in a [`Result`](../../concepts/result.md), so callers can handle failure without `try`/`catch`.

```typescript
const result = attempt(() => fn())
```

## Usage

### `attempt(fn)`

`attempt` is the canonical way to call a function that may throw — JSON parsing, schema validation, anything from a third-party API that doesn't itself return a `Result`. The thrown value is normalized to an `Error` (strings get wrapped; non-error values become an `Error` whose `message` is `JSON.stringify(thrown)` and whose `cause` is the original value).

```typescript
import { attempt, isOk } from 'massaman'
// or:  import { attempt, isOk } from 'massaman/control'

const parsed = attempt(() => JSON.parse(input))
if (isOk(parsed)) {
  doSomething(parsed.value)
} else {
  console.error(parsed.error)
}
```

#### Parameters

- `fn` (`() => T`): the function to execute. Must be synchronous — use [`attemptAsync`](./attemptAsync.md) for async work.

#### Returns

(`Result<T>`): an `Ok<T>` on success, `Err` on throw.

## Examples

Replace `try`/`catch` at the boundary of an unsafe API:

```typescript
import { attempt, match, Ok, Err } from 'massaman'

const result = attempt(() => JSON.parse(req.body))

return match(result)
  .with(Ok, ({ value }) => respond.ok(value))
  .with(Err, ({ error }) => respond.badRequest(error.message))
  .exhaustive()
```

## See also

- [`attemptAsync`](./attemptAsync.md) — async variant
- [`ok`](./ok.md) / [`err`](./err.md) — construct results manually
- [`unwrap`](./unwrap.md) — extract or throw
- [`Ok`](../pattern/Ok.md) / [`Err`](../pattern/Err.md) — pattern values for `match`
- [Result type concept guide](../../concepts/result.md)
