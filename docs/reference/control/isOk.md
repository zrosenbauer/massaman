# isOk

Type guard that narrows a [`Result`](../../concepts/result.md) to `Ok`.

```typescript
if (isOk(result)) {
  // result.value is T
}
```

## Usage

### `isOk(result)`

`isOk` is how you discriminate a `Result` in TypeScript — inside the truthy branch, `result.value` is `T`; in the falsy branch, `result` is `Err` and `result.error` is `Error`.

```typescript
import { attempt, isOk } from 'massaman'

const parsed = attempt(() => JSON.parse(input))
if (isOk(parsed)) {
  console.log(parsed.value) // narrowed to T
} else {
  console.error(parsed.error) // narrowed to Error
}
```

For pattern matching across both branches, prefer [`match`](../match/match.md) with [`P.ok`](../match/P.md#pok) / [`P.err`](../match/P.md#perr) — it's exhaustive and reads better with multi-arm logic.

#### Parameters

- `result` (`Result<T>`): the result to test.

#### Returns

(`result is Ok<T>`): `true` if the result is a success.

## See also

- [`isErr`](./isErr.md) — the inverse guard
- [`unwrap`](./unwrap.md) — extract the value or throw
- [`P.ok`](../match/P.md#pok) — pattern value for `match`
- [Result type concept guide](../../concepts/result.md)
