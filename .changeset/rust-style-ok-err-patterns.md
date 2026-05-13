---
'massaman': minor
---

Rename the `massaman/pattern` subpath to `massaman/match` and add `Ok` / `Err` pattern values for matching `Result` in `match()`. Mirrors Rust's `Ok(value)` / `Err(error)` match arms.

**Breaking** — `massaman/pattern` is no longer exported. Update imports to use `massaman/match`:

```diff
- import { match, P } from 'massaman/pattern'
+ import { match, P, Ok, Err } from 'massaman/match'
```

The flat-barrel import is unaffected:

```typescript
import { match, Ok, Err, attempt } from 'massaman'

match(attempt(() => JSON.parse(raw)))
  .with(Ok, ({ value }) => use(value))
  .with(Err, ({ error }) => log(error))
  .exhaustive()
```

`Ok` and `Err` are equivalent to the inline structural patterns `{ ok: true }` / `{ ok: false }`. The names share TypeScript's type and value namespaces with the existing `type Ok<T>` / `type Err`, so a single `import { Ok }` covers both contexts.
