---
'massaman': minor
---

Add the `massaman/fp` subpath and catch up on es-toolkit re-exports.

**New subpath: `massaman/fp`**

Data-last, pipeable operators re-exported from `es-toolkit/fp`, including `pipe`,
which fuses adjacent lazy-capable operators (`map`, `filter`, `take`, ...) into a
single element-by-element walk so a trailing `take(n)` terminates early:

```ts
import { filter, map, pipe, take } from 'massaman/fp'

pipe(
  [1, 2, 3, 4, 5, 6, 7, 8],
  map((x) => x * x),
  filter((x) => x % 2 === 0),
  take(2)
) // [4, 16] — elements 5..8 are never visited
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
