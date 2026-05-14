---
'massaman': minor
---

Rename the `massaman/pattern` subpath to `massaman/match` and extend ts-pattern's `P` namespace with `P.ok` and `P.err` for matching `Result` in `match()`. Mirrors Rust's `Ok(value)` / `Err(error)` match arms.

**Breaking** — `massaman/pattern` is no longer exported. Update imports to use `massaman/match`:

```diff
- import { match, P } from 'massaman/pattern'
+ import { match, P } from 'massaman/match'
```

`P.ok` and `P.err` are structural patterns equivalent to inline `{ ok: true }` / `{ ok: false }`, but they read like Rust's match arms and pair naturally with the rest of `P`:

```typescript
import { match, P, attempt } from 'massaman'

match(attempt(() => JSON.parse(raw)))
  .with(P.ok, ({ value }) => use(value))
  .with(P.err, ({ error }) => log(error))
  .exhaustive()
```

The flat-barrel import is unaffected. `type Ok<T>` / `type Err` continue to be exported as types alongside the existing `ok()` / `err()` value constructors — no name collision because types, function calls, and namespace-property access live in different syntactic contexts.

`P.Pattern<T>` shorthand is no longer available; import `Pattern` standalone from `massaman/match` instead — the form ts-pattern's own docs recommend.
