# P

> **Re-exported from [`ts-pattern`](https://github.com/gvergnaud/ts-pattern).** Massaman re-exports the public API unchanged at the [pinned version](../../_meta/upstream-versions.json).

The pattern primitives namespace. Builds patterns that match by type, structure, or predicate.

```typescript
import { P } from 'massaman/match'
```

## Common primitives

| Pattern | Matches |
|---|---|
| `P.string` | any `string` |
| `P.number` | any `number` |
| `P.boolean` | any `boolean` |
| `P.bigint` | any `bigint` |
| `P.symbol` | any `symbol` |
| `P.nullish` | `null` or `undefined` |
| `P.any` / `P._` | anything |
| `P.array(pattern)` | array where every item matches `pattern` |
| `P.union(a, b, …)` | matches if any sub-pattern matches |
| `P.intersection(a, b, …)` | matches if every sub-pattern matches |
| `P.not(pattern)` | matches if `pattern` does NOT match |
| `P.optional(pattern)` | matches `undefined` or the pattern |
| `P.when(predicate)` | matches when `predicate(value)` is truthy — bridge to massaman predicates |
| `P.select()` | captures the matched value for the handler |
| `P.select('name', pattern)` | captures a sub-value by name |

## Examples

```typescript
import { match, P } from 'massaman'

// Discriminate on shape
match(input)
  .with({ kind: 'user', name: P.string }, ({ name }) => `hello ${name}`)
  .with({ kind: 'guest' }, () => 'hello stranger')
  .otherwise(() => 'unknown')
```

```typescript
import { match, P } from 'massaman'
import { isEmpty } from 'massaman/predicate'

// Bridge to a massaman predicate via P.when
match(arr)
  .with(P.when(isEmpty), () => 'empty')
  .with(P.array(P.number), (nums) => `${nums.length} numbers`)
  .otherwise(() => 'something else')
```

## See also

- [`match`](./match.md) — multi-arm dispatch
- [`isMatching`](./isMatching.md) — predicate form
- [ts-pattern README — Patterns](https://github.com/gvergnaud/ts-pattern#patterns) — full reference
- [Pattern matching concept guide](../../concepts/match.md)
