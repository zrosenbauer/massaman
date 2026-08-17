# Composition

Composition builds larger operations from small functions. Each step receives the previous step's output, which keeps transformations explicit and avoids intermediate mutable state.

Massaman includes the standard synchronous tools from `es-toolkit` and adds async-aware and branching combinators for pipelines that need them.

## Why it matters

A composed operation describes data flow from left to right. Individual steps remain easy to name, test, reuse, and replace, while side effects can stay visible at the edge or in an intentional `tap`.

Composition is useful when the sequence itself is the abstraction. It should make the transformation easier to read, not hide a handful of straightforward expressions behind combinators.

## Core tools

| Tool | Purpose |
|---|---|
| `flow(...functions)` | Build a reusable synchronous function |
| `flowAsync(...functions)` | Build a reusable function that awaits each step |
| `pipe(value, ...functions)` | Transform one value immediately |
| `when(predicate, fn)` | Transform a value only when a condition passes |
| `unless(predicate, fn)` | Transform a value only when a condition does not pass |
| `ifElse(predicate, onTrue, onFalse)` | Choose one of two transformations |
| `tap(fn)` | Run an intentional side effect and pass the value through unchanged |

Use `flow` when you want a function. Use `pipe` when you already have the value. Reach for `flowAsync` only when at least one step is asynchronous.

## When to use it

Use composition for:

- reusable normalization or validation pipelines
- transformations made from independently useful steps
- async workflows where each step depends on the previous result
- conditional transformations that should remain expressions

Name substantial steps instead of building a wall of anonymous callbacks. A pipeline should expose its stages like a flight plan.

## Complete example

```typescript
import { flow, tap, when } from 'massaman'
import { isEmpty } from 'massaman/predicate'
import { kebabCase, trim } from 'massaman/string'

const defaultTitle = when(isEmpty, () => 'untitled')

const buildSlug = flow(
  trim,
  defaultTitle,
  kebabCase,
  tap((slug) => logger.debug({ slug }, 'generated slug')),
)

buildSlug('  Hello World  ') // 'hello-world'
buildSlug('   ') // 'untitled'
```

The pipeline has one input and one output. `tap` marks the only side effect without changing the value moving through it.

The asynchronous form follows the same model:

```typescript
import { flowAsync } from 'massaman'

const loadUser = flowAsync(
  (id: string) => fetch(`/api/users/${id}`),
  (response) => response.json(),
  (user) => normalizeUser(user),
)
```

## When not to use it

Do not create a pipeline for a single ordinary call or hide unrelated side effects inside transformation steps. If several stages need the same intermediate value, a small named function may communicate the control flow better than forcing it through `flow`.

## Related reference

- [`flow`](../reference/function/flow.md), [`flowAsync`](../reference/function/flowAsync.md), and [`pipe`](../reference/fp/pipe.md)
- [`when`](../reference/function/when.md), [`unless`](../reference/function/unless.md), and [`ifElse`](../reference/function/ifElse.md)
- [`tap`](../reference/function/tap.md)
- [Pattern Matching](./match.md)
