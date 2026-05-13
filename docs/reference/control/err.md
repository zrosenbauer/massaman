# err

Constructs a failure [`Result`](../../concepts/result.md). Normalizes any thrown value into an `Error`.

```typescript
const result = err(reason)
```

## Usage

### `err(reason)`

Pass an `Error`, a string, or any other value. Strings are wrapped in `new Error(reason)`. Non-error, non-string values get `JSON.stringify`'d into the message and the original is preserved on `error.cause`.

```typescript
import { err } from 'massaman'

err(new Error('boom'))
// { ok: false, value: null, error: Error('boom') }

err('division by zero')
// { ok: false, value: null, error: Error('division by zero') }

err({ code: 'EBADF', fd: 3 })
// { ok: false, value: null, error: Error('{"code":"EBADF","fd":3}', { cause: { code: 'EBADF', fd: 3 } }) }
```

#### Parameters

- `reason` (`unknown`): the failure value. Accepts anything — normalization to `Error` is the function's job.

#### Returns

(`Err`): `{ ok: false, value: null, error: Error }`.

## See also

- [`ok`](./ok.md) — construct a success result
- [`attempt`](./attempt.md) — wrap an unsafe call
- [Result type concept guide](../../concepts/result.md)
