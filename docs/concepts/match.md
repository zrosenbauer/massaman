# Pattern Matching

`massaman/match` re-exports [`ts-pattern`](https://github.com/gvergnaud/ts-pattern) and adds `P.ok` and `P.err` patterns for Massaman results. It turns branching into an expression and can prove that every variant of a union is handled.

## Why it matters

Branching on a discriminated union is domain logic. A fallback branch can silently swallow a new variant, while an exhaustive match makes that new variant a type error everywhere it must be handled.

Matching also works on structure rather than only equality. A pattern can select a union variant, narrow nested fields, or apply a predicate without manually chaining checks.

## Core tools

| Tool | Purpose |
|---|---|
| `match(value)` | Start a match expression |
| `.with(pattern, handler)` | Handle values matching a pattern |
| `.exhaustive()` | Require every possible case to be handled |
| `.otherwise(handler)` | Handle anything unmatched when the input is open-ended |
| `P` | Build structural, collection, and predicate patterns |
| `P.ok(pattern?)` / `P.err(pattern?)` | Match Massaman `Result` variants |
| `isMatching(pattern, value)` | Test and narrow a value without building a match expression |

Use `.exhaustive()` for a closed union you control. Use `.otherwise()` for open inputs such as arbitrary strings or unknown external data.

## When to use it

Use pattern matching when logic has multiple meaningful cases:

- rendering a discriminated union
- handling every state in a workflow
- branching on nested object or array shapes
- consuming `Result` values with structural error cases

For one boolean condition, use an `if`, `when`, `unless`, or `ifElse`. A match should clarify a domain, not add ceremony to a yes-or-no check.

## Complete example

```typescript
import { match, P } from 'massaman'

type Job =
  | { status: 'queued' }
  | { status: 'running'; progress: number }
  | { status: 'failed'; error: Error }
  | { status: 'complete'; output: string }

const describeJob = (job: Job): string =>
  match(job)
    .with({ status: 'queued' }, () => 'Waiting to start')
    .with(
      { status: 'running', progress: P.number },
      ({ progress }) => `${progress}% complete`,
    )
    .with({ status: 'failed' }, ({ error }) => `Failed: ${error.message}`)
    .with({ status: 'complete' }, ({ output }) => output)
    .exhaustive()
```

Adding another `Job` variant makes this function fail type checking until the new case is handled.

For a `Result`, use the same structure with `P.ok()` and `P.err()`:

```typescript
match(result)
  .with(P.ok(), ({ value }) => render(value))
  .with(P.err(), ({ error }) => renderError(error))
  .exhaustive()
```

## When not to use it

Do not use `match` merely to avoid every `if`. A guard clause or a branching combinator is clearer for a single condition. Do not use `.otherwise()` on a closed domain just to silence exhaustiveness; handling each variant is the point.

## Related reference

- [`match`](../reference/match/match.md) and [`isMatching`](../reference/match/isMatching.md)
- [`P`](../reference/match/P.md) and [`Pattern`](../reference/match/Pattern.md)
- [`when`](../reference/function/when.md), [`unless`](../reference/function/unless.md), and [`ifElse`](../reference/function/ifElse.md)
- [Result & Errors](./result.md)
