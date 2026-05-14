# isMatching

> **Re-exported from [`ts-pattern`](https://github.com/gvergnaud/ts-pattern).** Massaman re-exports the public API unchanged at the [pinned version](../../_meta/upstream-versions.json).

A predicate form of [`match`](./match.md) — returns `true`/`false` instead of a value, and narrows types in the truthy branch.

```typescript
if (isMatching(pattern, value)) { /* value is narrowed */ }
```

## Usage

### `isMatching(pattern, value)`

Use when you want pattern-based narrowing in an `if` or guard, not a multi-arm dispatch.

```typescript
import { isMatching, P } from 'massaman/match'

const isClickAt = isMatching({ kind: 'click', x: P.number, y: P.number })

if (isClickAt(event)) {
  // event is { kind: 'click'; x: number; y: number }
  drawAt(event.x, event.y)
}
```

### `isMatching(pattern)` — partial application

Called with one argument, returns a reusable guard function. Composes well with `filter`:

```typescript
import { isMatching, P } from 'massaman'

const clicks = events.filter(isMatching({ kind: 'click' }))
// clicks: Array<{ kind: 'click'; ... }>
```

## See also

- [`match`](./match.md) — multi-arm dispatch form
- [`P`](./P.md) — pattern primitives
- [ts-pattern README](https://github.com/gvergnaud/ts-pattern#readme)
