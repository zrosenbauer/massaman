# match

> **Re-exported from [`ts-pattern`](https://github.com/gvergnaud/ts-pattern).** Massaman re-exports the public API unchanged at the [pinned version](../../_meta/upstream-versions.json).

Exhaustive, type-safe pattern matching for TypeScript.

```typescript
import { match, P } from 'massaman/match'
// or:  import { match, P } from 'massaman'

match(value)
  .with(patternA, handlerA)
  .with(patternB, handlerB)
  .exhaustive()
```

## Usage

### `match(value)`

`match` opens a builder chain. Each `.with(pattern, handler)` adds an arm. Close with `.exhaustive()` (compile error if any case is unhandled) or `.otherwise(handler)` (fallback for unmatched cases).

```typescript
import { match, P } from 'massaman'

type Event =
  | { kind: 'click'; x: number; y: number }
  | { kind: 'key'; code: string }
  | { kind: 'scroll'; dy: number }

function describe(event: Event): string {
  return match(event)
    .with({ kind: 'click', x: 0, y: 0 }, () => 'origin click')
    .with({ kind: 'click' }, ({ x, y }) => `click @ ${x},${y}`)
    .with({ kind: 'key', code: P.union('Enter', 'Escape') }, ({ code }) => `confirm: ${code}`)
    .with({ kind: 'key' }, ({ code }) => `key ${code}`)
    .with({ kind: 'scroll' }, ({ dy }) => `scroll ${dy}px`)
    .exhaustive()
}
```

## Matching `Result` values

The canonical massaman pattern — discriminate on `ok` and destructure:

```typescript
import { attempt, match } from 'massaman'

const result = attempt(() => JSON.parse(input))

const message = match(result)
  .with({ ok: true }, ({ value }) => `parsed ${typeof value}`)
  .with({ ok: false }, ({ error }) => `failed: ${error.message}`)
  .exhaustive()
```

## See also

- [`isMatching`](./isMatching.md) — predicate form
- [`P`](./P.md) — the pattern primitives
- [ts-pattern README](https://github.com/gvergnaud/ts-pattern#readme) — canonical reference
- [Pattern matching concept guide](../../concepts/match.md)
