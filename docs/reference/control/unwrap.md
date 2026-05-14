# unwrap

Extract the value from an `Ok` result, or throw on `Err`. Mirrors Rust's `Result::unwrap` / `Result::expect`.

```typescript
const value = unwrap(result)
const value = unwrap(result, 'config required')
```

## Usage

### `unwrap(result, message?)`

`unwrap` is the escape hatch back to throwing — useful at module boundaries where you can't propagate a `Result` further (program startup, top-level scripts, test setup). Prefer pattern matching or `isOk`/`isErr` guards inside normal code.

```typescript
import { attempt, unwrap } from 'massaman'

// Boot-time config — failure is fatal, throwing is fine.
const config = unwrap(
  attempt(() => JSON.parse(readFileSync('./config.json', 'utf8'))),
  'config file is missing or invalid',
)
```

With no `message`, the original `Error` from `Err` is thrown directly. With a `message`, a new `Error` is thrown with the original preserved on `cause` — same shape as Rust's `expect`.

#### Parameters

- `result` (`Result<T>`): the result to unwrap.
- `message` (`string`, optional): a custom error message. Original error becomes `cause`.

#### Returns

(`T`): the unwrapped value.

#### Throws

- The original `Error` from `Err`, if no `message` is provided.
- A new `Error(message, { cause: original })`, if `message` is provided.

## See also

- [`isOk`](./isOk.md) / [`isErr`](./isErr.md) — non-throwing alternatives
- [Result type concept guide](../../concepts/result.md)
