# massaman

## 0.2.0

### Minor Changes

- [#4](https://github.com/zrosenbauer/massaman/pull/4) [`e37cfd1`](https://github.com/zrosenbauer/massaman/commit/e37cfd13e96e6617f8b93dddd9a8d7cf320a9aa0) Thanks [@zrosenbauer](https://github.com/zrosenbauer)! - Rename the `massaman/pattern` subpath to `massaman/match` and extend ts-pattern's `P` namespace with `P.ok` and `P.err` for matching `Result` in `match()`. Mirrors Rust's `Ok(value)` / `Err(error)` match arms.

  **Breaking** — `massaman/pattern` is no longer exported. Update imports to use `massaman/match`:

  ```diff
  - import { match, P } from 'massaman/pattern'
  + import { match, P } from 'massaman/match'
  ```

  `P.ok` and `P.err` are structural patterns equivalent to inline `{ ok: true }` / `{ ok: false }`, but they read like Rust's match arms and pair naturally with the rest of `P`:

  ```typescript
  import { match, P, attempt } from "massaman";

  match(attempt(() => JSON.parse(raw)))
    .with(P.ok, ({ value }) => use(value))
    .with(P.err, ({ error }) => log(error))
    .exhaustive();
  ```

  The flat-barrel import is unaffected. `type Ok<T>` / `type Err` continue to be exported as types alongside the existing `ok()` / `err()` value constructors — no name collision because types, function calls, and namespace-property access live in different syntactic contexts.

  `P.Pattern<T>` shorthand is no longer available; import `Pattern` standalone from `massaman/match` instead — the form ts-pattern's own docs recommend.

### Patch Changes

- [`b0848f5`](https://github.com/zrosenbauer/massaman/commit/b0848f5d8d6d8471c5a71d778112fdd754c5cb7a) Thanks [@zrosenbauer](https://github.com/zrosenbauer)! - Polish README. Reframe Features around the four pillars (Rust's `match`, Rust's `Result`, functional programming in TS, gaps around es-toolkit). Swap the "100% test coverage" bullet for tree-shakeable subpath exports. Correct es-toolkit URL to https://es-toolkit.dev. Full-width banner.

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
import { match, P } from "massaman/pattern";
import { attempt, isOk } from "massaman/control";

match(action)
  .with({ type: "load" }, () => "loading")
  .with({ type: "success" }, () => "done")
  .with({ type: "error", msg: P.string }, ({ msg }) => `failed: ${msg}`)
  .exhaustive();

const parsed = attempt(() => JSON.parse(raw) as User);
if (isOk(parsed)) {
  console.log(`got: ${parsed.value.name}`);
} else {
  console.error(`failed: ${parsed.error.message}`);
}
```
