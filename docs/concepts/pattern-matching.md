# Pattern matching

`massaman/pattern` is a full re-export of [`ts-pattern`](https://github.com/gvergnaud/ts-pattern). Use it instead of `switch`, instead of nested ternaries, instead of `if`/`else if` chains that discriminate on a union.

```typescript
import { match, P } from 'massaman'

const message = match(event)
  .with({ kind: 'click' }, ({ x, y }) => `click at ${x},${y}`)
  .with({ kind: 'key', code: 'Enter' }, () => 'confirmed')
  .with({ kind: 'key' }, ({ code }) => `key ${code}`)
  .otherwise(() => 'unknown')
```

## The three things `match` gives you

1. **An expression.** `match(x).with(…).exhaustive()` returns a value — chain it, assign it, return it.
2. **Exhaustiveness.** `.exhaustive()` is a compile error if any case is unhandled. The TypeScript compiler narrows the input against each pattern until nothing is left.
3. **Structural patterns.** Match on shape, not just on equality. `{ kind: 'click', x: 0 }` matches any click at `x: 0`.

## The exhaustiveness contract

```typescript
type Event = { kind: 'click' } | { kind: 'key' } | { kind: 'scroll' }

match(event)
  .with({ kind: 'click' }, () => 'clicked')
  .with({ kind: 'key' }, () => 'typed')
  .exhaustive()
//  ^^^^^^^^^^^ Error: 'scroll' case not handled
```

This is the killer feature. When you add a new variant to a union, every `match` against it becomes a compile error until you handle the new case. You will never have a stale `default:` branch silently swallowing new states.

## Patterns

Use literals to match by equality. Use [`P`](../reference/pattern/P.md) for everything else.

```typescript
import { match, P } from 'massaman'
import { sum } from 'massaman/math'

match(value)
  .with(0, () => 'zero')                          // literal
  .with(P.number, (n) => `number ${n}`)           // any number
  .with(P.string, (s) => `string ${s}`)           // any string
  .with({ id: P.string }, ({ id }) => `id ${id}`) // shape with a string id
  .with(P.array(P.number), (xs) => sum(xs))       // array of numbers
  .with(P.union('a', 'b', 'c'), () => 'letter')   // any of these literals
  .otherwise(() => 'something else')
```

## Matching `Result`

The canonical pattern in `massaman` — discriminate on the `ok` field:

```typescript
import { attempt, match } from 'massaman'

const parsed = attempt(() => JSON.parse(raw))

return match(parsed)
  .with({ ok: true }, ({ value }) => render(value))
  .with({ ok: false }, ({ error }) => renderError(error))
  .exhaustive()
```

The structural patterns narrow `Result<T>` to `Ok<T>` and `Err` respectively. See the [Result concept guide](./result.md) for the full story.

## `match` vs `if`/`when`/`ifElse`

- **One-armed branching** (do X if condition, otherwise nothing or a default value) → use [`when`](../reference/function/when.md), [`unless`](../reference/function/unless.md), or [`ifElse`](../reference/function/ifElse.md). They compose with `flow`.
- **Multi-armed dispatch on a union** → use `match`. Don't reach for `match` for a single `if`.

```typescript
import { flow, when } from 'massaman'
import { isEmpty } from 'massaman/predicate'
import { trim } from 'massaman/string'

// Good — when() for single-condition branching
const sanitize = flow(
  when(isEmpty, () => 'default'),
  trim,
)
sanitize(input)

// Good — match() for multi-arm dispatch
match(action)
  .with({ kind: 'load' }, ...)
  .with({ kind: 'save' }, ...)
  .exhaustive()
```

## `.exhaustive()` vs `.otherwise()`

- **`.exhaustive()`** — compile error if any case is unhandled. Use when the input type is closed (a union you control).
- **`.otherwise(handler)`** — fallback for unmatched cases. Use when the input is open (a `string`, a `number`, anything you don't fully enumerate).

You can't use both on the same chain — pick one.

## Related

- [`match`](../reference/pattern/match.md), [`isMatching`](../reference/pattern/isMatching.md), [`P`](../reference/pattern/P.md), [`Pattern`](../reference/pattern/Pattern.md)
- [ts-pattern README](https://github.com/gvergnaud/ts-pattern#readme) — the full reference for `P` primitives
- [Result type concept guide](./result.md)
