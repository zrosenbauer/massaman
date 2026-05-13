# massaman

## 0.1.0

Initial public release.

`massaman` is a curated functional programming toolkit for TypeScript. It re-exports [es-toolkit](https://es-toolkit.dev) (array/object/string/function/math utilities) and [ts-pattern](https://github.com/gvergnaud/ts-pattern) (exhaustive pattern matching) under one namespace, then layers on a thin set of utilities that fill the gaps: Result-style error handling, async-aware composition, and variadic-narrowing predicates.

### Highlights

- 12 subpath exports: `array`, `object`, `string`, `function`, `math`, `predicate`, `promise`, `pattern`, `control`, `conversion`, `error`, plus a root barrel.
- Result-style error handling via `attempt`, `attemptAsync`, `ok`, `err`, `isOk`, `isErr`, `unwrap`.
- Pattern matching via re-exported `match` and `P` combinators.
- Variadic-narrowing predicate combinators (`allPass`, `anyPass`, `both`, `either`).
- Async composition (`flowAsync`) with end-to-end type inference up to 7 steps.
- 100% test coverage enforced by CI.
- ESM-only, fully typed, tree-shakeable. Requires Node.js >= 24.0.0.

### Example

```ts
import { match, P } from 'massaman/pattern'
import { attempt, isOk } from 'massaman/control'

match(action)
  .with({ type: 'load' }, () => 'loading')
  .with({ type: 'success' }, () => 'done')
  .with({ type: 'error', msg: P.string }, ({ msg }) => `failed: ${msg}`)
  .exhaustive()

const parsed = attempt(() => JSON.parse(raw) as User)
if (isOk(parsed)) {
  console.log(`got: ${parsed.value.name}`)
} else {
  console.error(`failed: ${parsed.error.message}`)
}
```
