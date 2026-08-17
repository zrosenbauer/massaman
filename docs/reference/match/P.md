---
description: "The pattern primitives namespace."
---

# P

The pattern primitives namespace. Builds patterns that match by type, structure, or predicate.

<details>
<summary>Source: ts-pattern</summary>

Most of `P` is re-exported from [`ts-pattern`](https://github.com/gvergnaud/ts-pattern). Massaman extends it with `P.ok` and `P.err` for matching `Result` values—see [P.ok](#pok) and [P.err](#perr) below.

</details>

```typescript
import { P } from 'massaman/match'
// or:  import { P } from 'massaman'
```

## Primitives

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
| `P.ok(pattern?)` | matches an `Ok` [`Result`](../../concepts/result.md), optionally constraining its value — massaman extension |
| `P.err(pattern?)` | matches an `Err` [`Result`](../../concepts/result.md), optionally constraining its error — massaman extension |

## P.ok

Matches the `Ok` variant of a `Result<T>`. With no argument it is equivalent to `{ ok: true }`; with an argument it applies that pattern to `value`.

```typescript
import { match, P, attempt } from 'massaman'

match(attempt(() => JSON.parse(raw)))
  .with(P.ok(), ({ value }) => render(value))
  .with(P.err(), ({ error }) => log(error))
  .exhaustive()
```

Inside the `P.ok()` arm, the matched value is narrowed to `Ok<T>` — `value` is typed as `T`, `error` is `null`.

Pass a pattern to constrain the contained value:

```typescript
match(result)
  .with(P.ok({ name: 'jane' }), () => 'jane!')
  .with(P.ok(), ({ value }) => `got ${value.name}`)
  .with(P.err(), ({ error }) => `err: ${error.message}`)
  .exhaustive()
```

## P.err

Matches the `Err` variant of a `Result<T>`. With no argument it is equivalent to `{ ok: false }`; with an argument it applies that pattern to `error`.

Inside the `P.err()` arm, the matched value is narrowed to `Err` — `error` is `Error`, `value` is `null`.

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
- [ts-pattern README — Patterns](https://github.com/gvergnaud/ts-pattern#patterns) — full reference for the primitives we re-export
- [Pattern matching concept guide](../../concepts/match.md)
- [Result & Errors concept guide](../../concepts/result.md)
