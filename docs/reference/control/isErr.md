# isErr

Type guard that narrows a [`Result`](../../concepts/result.md) to `Err`.

```typescript
if (isErr(result)) {
  // result.error is Error
}
```

## Usage

### `isErr(result)`

The inverse of [`isOk`](./isOk.md). Useful when the failure path is the early-return: check `isErr`, bail, continue with the narrowed `Ok` after.

```typescript
import { attemptAsync, isErr } from 'massaman'

const user = await attemptAsync(() => db.users.findById(id))
if (isErr(user)) {
  return respond.serverError(user.error)
}
// user is Ok<User> here
return respond.ok(user.value)
```

#### Parameters

- `result` (`Result<T>`): the result to test.

#### Returns

(`result is Err`): `true` if the result is a failure.

## See also

- [`isOk`](./isOk.md) — the inverse guard
- [Result type concept guide](../../concepts/result.md)
