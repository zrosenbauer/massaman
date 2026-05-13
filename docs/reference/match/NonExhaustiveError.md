# NonExhaustiveError

> **Re-exported from [`ts-pattern`](https://github.com/gvergnaud/ts-pattern).** Massaman re-exports the public API unchanged at the [pinned version](../../_meta/upstream-versions.json).

The runtime error thrown by `.exhaustive()` when a value reaches it that no pattern matched.

```typescript
match(value).with(...).exhaustive() // throws NonExhaustiveError if no arm matched at runtime
```

## When this matters

`.exhaustive()` is checked at **compile time** by TypeScript — if your patterns cover the input type, the call type-checks and the runtime branch is unreachable in well-typed code. `NonExhaustiveError` is the safety net for two cases:

1. **Type assertion holes** — a value typed as `T` that's actually something else at runtime (deserialization, external APIs).
2. **Use with `any`** — if you opt out of exhaustiveness checking by passing through `any`, the runtime check still fires.

Treat a `NonExhaustiveError` in production as a type-safety bug: somewhere upstream, the value is wider than its declared type.

```typescript
import { match, NonExhaustiveError } from 'massaman'

try {
  return match(event).with(...).exhaustive()
} catch (e) {
  if (e instanceof NonExhaustiveError) {
    logger.error({ value: e.input }, 'pattern match escaped at runtime')
  }
  throw e
}
```

## See also

- [`match`](./match.md)
- [ts-pattern README — Exhaustiveness](https://github.com/gvergnaud/ts-pattern#exhaustive-pattern-matching)
