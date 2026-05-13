# ok

Constructs a success [`Result`](../../concepts/result.md).

```typescript
const result = ok(value)
```

## Usage

### `ok(value)`

Use `ok` when you want to return a `Result` directly without going through `attempt`. Common in validation functions, parsers, or any code that wants to return a `Result` as its native shape.

```typescript
import { ok, err, type Result } from 'massaman'

function divide(a: number, b: number): Result<number> {
  if (b === 0) return err('division by zero')
  return ok(a / b)
}
```

#### Parameters

- `value` (`T`): the success value. Can be `null`, `undefined`, or any other type — `Result.ok` is determined by the discriminant, not the value.

#### Returns

(`Ok<T>`): `{ ok: true, value, error: null }`.

## See also

- [`err`](./err.md) — construct a failure result
- [`attempt`](./attempt.md) — wrap an unsafe call
- [Result type concept guide](../../concepts/result.md)
