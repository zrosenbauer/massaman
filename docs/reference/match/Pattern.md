# Pattern

> **Re-exported from [`ts-pattern`](https://github.com/gvergnaud/ts-pattern).** Massaman re-exports the public API unchanged at the [pinned version](../../_meta/upstream-versions.json).

The type-level representation of a pattern. Used when you need to type a pattern variable or write a helper that accepts patterns.

```typescript
import { type Pattern, match, P } from 'massaman/match'
```

## Usage

Most code doesn't reference `Pattern` directly — you just inline patterns into `.with(…)`. Reach for it when storing a pattern in a variable or returning one from a helper.

```typescript
import { type Pattern, match, P } from 'massaman'

type Event = { kind: 'click' } | { kind: 'key'; code: string }

const isInterestingKey: Pattern<Event> = {
  kind: 'key',
  code: P.union('Enter', 'Escape'),
}

match(event)
  .with(isInterestingKey, ({ code }) => `confirm: ${code}`)
  .otherwise(() => 'ignored')
```

## See also

- [`P`](./P.md) — pattern primitives
- [`match`](./match.md)
- [ts-pattern README](https://github.com/gvergnaud/ts-pattern#readme)
