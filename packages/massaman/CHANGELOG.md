# massaman

## 0.5.0

### Minor Changes

- [#14](https://github.com/zrosenbauer/massaman/pull/14) [`5f73878`](https://github.com/zrosenbauer/massaman/commit/5f7387833cf95b6c0ae3d47835f57aa4323649a5) Thanks [@zrosenbauer](https://github.com/zrosenbauer)! - Make `P.ok()` and `P.err()` callable Result pattern factories. Call them without an argument to match a variant, or pass a ts-pattern pattern to match the contained value or error.

- [#16](https://github.com/zrosenbauer/massaman/pull/16) [`f896fc1`](https://github.com/zrosenbauer/massaman/commit/f896fc11f14ffaed32db26f074af3152a5606830) Thanks [@zrosenbauer](https://github.com/zrosenbauer)! - Catch up to es-toolkit 1.51.0 and raise the minimum Node version.
  
  **Breaking**
  
  - `limitAsync` moved from `massaman/array` to `massaman/promise`, following es-toolkit's recategorization. It is still reachable from the flat `massaman` barrel; only the `massaman/array` subpath import breaks.
  - `engines.node` is now `>=26.0.0` (was `>=24.0.0`), and the build targets `node26`.
  
  **Added**
  
  - New `massaman/bigint` subpath: `sum`, `sumBy`, `max`, `min`, `maxBy`, `minBy`, `clamp`, `inRange`, `median`, `medianBy`, `percentile`, `range`, `rangeRight` for `bigint`. Subpath-only — these names collide with the `number` implementations in `massaman/math` and `massaman/array`, so they are deliberately absent from the flat barrel.
  - `massaman/object`: `deepFreeze`, `mapKeysAsync`, `mapValuesAsync`, `toPascalCaseKeys`, `toKebabCaseKeys`, `toConstantCaseKeys`, and the `ToCamelCaseKeys` / `ToPascalCaseKeys` / `ToSnakeCaseKeys` / `ToKebabCaseKeys` / `ToConstantCaseKeys` types.
  - `massaman/string`: `dedent`.
  
  **Fixed upstream** (inherited from es-toolkit 1.51.0)
  
  - `retry` now passes the last error to the `delay` callback and throws without a trailing delay.
  - `pullAt` removes the correct elements for negative indices.
  - `at`, `pullAt`, `orderBy`, and `sortBy` accept readonly arrays.
  - `flattenObject` gained a `preserveArrays` option.

## 0.4.0

### Minor Changes

- [#12](https://github.com/zrosenbauer/massaman/pull/12) [`61c5207`](https://github.com/zrosenbauer/massaman/commit/61c52079602ab6faefbbb3a5f986bafebf7dd0bc) Thanks [@zrosenbauer](https://github.com/zrosenbauer)! - Add the `massaman/fp` subpath and catch up on es-toolkit re-exports.

  **New subpath: `massaman/fp`**

  Data-last, pipeable operators re-exported from `es-toolkit/fp`, including `pipe`,
  which fuses adjacent lazy-capable operators (`map`, `filter`, `take`, ...) into a
  single element-by-element walk so a trailing `take(n)` terminates early:

  ```ts
  import { filter, map, pipe, take } from "massaman/fp";

  pipe(
    [1, 2, 3, 4, 5, 6, 7, 8],
    map((x) => x * x),
    filter((x) => x % 2 === 0),
    take(2)
  ); // [4, 16] — elements 5..8 are never visited
  ```

  This barrel is deliberately not flattened into the root `massaman` export. Many names
  collide with their data-first counterparts, and `flow` from `massaman/fp` is the
  `pipe`-based lazy composition rather than the eager `flow` on `massaman/function`,
  which is unchanged. Pick a namespace per module and stay in it.

  **New re-exports**

  - `massaman/array`: `cartesianProduct`, `chunkBy`, `combinations`
  - `massaman/object`: `sortKeys`
  - `massaman/math`: `percentile`
  - `massaman/promise`: `allKeyed`
  - `massaman/predicate`: `isIterable`

  **Upstream bump: es-toolkit 1.47.0 to 1.50.0**

  Behavior changes inside the re-exported surface:

  - `maxBy`/`minBy` propagate `NaN`
  - `orderBy`/`sortBy` sort `null` and `undefined` last
  - `isNumber` no longer treats boxed `Number` objects as numbers
  - `toMerged` deep clones the target
  - `timeout`/`withTimeout` accept an `AbortSignal`
  - `deburr` removes all combining diacritical marks
  - `partition` accepts any truthy predicate return
  - `unzipWith` returns `[]` instead of throwing on empty input

  `attempt` and `attemptAsync` on `massaman/control` are unchanged — they keep returning
  the `Result` object and continue to shadow the tuple-shaped versions in `es-toolkit/util`.

## 0.3.0

### Minor Changes

- [#7](https://github.com/zrosenbauer/massaman/pull/7) [`0b29739`](https://github.com/zrosenbauer/massaman/commit/0b297391fac42f6a6b3d632a0acaff69ed106cbf) Thanks [@zrosenbauer](https://github.com/zrosenbauer)! - Add three Rust-style stub helpers to `massaman/control`: `todo`, `unimplemented`, `unreachable`.

  All three return `never` so they typecheck in any position (expression, branch arm, return value). Messages mirror Rust's stdlib (`not yet implemented`, `not implemented`, `entered unreachable code`) — the `internal error:` prefix is dropped from `unreachable` since JavaScript's `Error:` wrapper already provides that framing.

  ```typescript
  import { todo, unimplemented, unreachable } from "massaman/control";

  function parseConfig(raw: string): Config {
    return todo("waiting on schema decision");
  }

  function migrate(driver: Driver): void {
    return match(driver)
      .with("postgres", runPgMigration)
      .with("mysql", () =>
        unimplemented("mysql driver intentionally unsupported")
      )
      .exhaustive();
  }

  function parseDigit(input: string): number {
    const parsed = Number.parseInt(input, 10);
    if (Number.isNaN(parsed)) {
      return unreachable("caller pre-validated");
    }
    return parsed;
  }
  ```

  Each accepts an optional `message?: string` that's appended to the default. Also re-exported from the flat `massaman` barrel.

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
