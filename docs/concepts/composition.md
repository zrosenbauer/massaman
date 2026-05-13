# Composition

Composing functions — building bigger operations from smaller ones — is the central activity in functional code. `massaman` gives you the standard tools, plus a few async-aware ones that don't exist in `es-toolkit`.

## `flow` and `pipe`

Both re-exported from `es-toolkit/function`.

- **`pipe(value, ...fns)`** — apply functions to a value left-to-right.
- **`flow(...fns)`** — build a new function from a composition. Calling it pipes the input through.

```typescript
import { flow, pipe } from 'massaman'
import { trim, toUpperCase } from 'massaman/string'

// pipe — evaluate now
const result = pipe('  hello  ', trim, toUpperCase) // 'HELLO'

// flow — build, then evaluate later
const shout = flow(trim, toUpperCase)
shout('  hello  ') // 'HELLO'
```

Use `pipe` for one-off transformations on a value. Use `flow` when you want to name and reuse the pipeline.

## `flowAsync`

Original to `massaman`. Like `flow`, but each step can be `async` — the next function receives the awaited value.

```typescript
import { flowAsync } from 'massaman'

const loadUser = flowAsync(
  (id: string) => fetch(`/api/users/${id}`),
  (response) => response.json(),
  (user) => normalize(user),
)

const user = await loadUser('123')
```

`flow` short-circuits with synchronous calls; `flowAsync` always returns a `Promise`.

## Branching combinators

Original to `massaman`. Conditional logic, but as expressions you can compose.

```typescript
import { when, unless, ifElse } from 'massaman'
import { isEmpty } from 'massaman/predicate'

const sanitize = flow(
  when(isEmpty, () => 'default'), // when condition: run fn, else passthrough
  trim,
)

const validate = flow(
  unless(isEmpty, throwError),    // unless condition: run fn, else passthrough
)

const describe = ifElse(
  isEmpty,
  () => 'empty',
  (s: string) => `has ${s.length} chars`,
)
```

- **`when(predicate, fn)`** — apply `fn` if `predicate(x)` is truthy; otherwise pass `x` through.
- **`unless(predicate, fn)`** — the inverse.
- **`ifElse(predicate, thenFn, elseFn)`** — branch on predicate.

All three return a function — compose them into pipelines.

## `tap`

Run a side effect on a value, return the value unchanged. The function for logging or telemetry in the middle of a pipeline.

```typescript
import { tap } from 'massaman'

const result = pipe(
  input,
  parseConfig,
  tap((config) => logger.debug({ config }, 'parsed')),
  applyConfig,
)
```

`tap`'s callback can do anything; its return value is ignored. The value flowing through the pipe is whatever the tap received.

## `call` and `callAsync`

Apply a function to a value — useful when you have the value first and the function second, and `pipe` would be overkill for a single call.

```typescript
import { call } from 'massaman'

// call(value, fn) === fn(value)
const length = call('hello', (s) => s.length)
```

Most useful as a building block inside other combinators, or when constructing pipelines dynamically.

## Putting it together

A realistic massaman pipeline:

```typescript
import { flowAsync, tap, attempt, isOk } from 'massaman'
import { kebabCase, trim } from 'massaman/string'
import { isEmpty } from 'massaman/predicate'

const buildSlug = flowAsync(
  (input: string) => attempt(() => input.normalize('NFD')),
  (result) => (isOk(result) ? result.value : ''),
  trim,
  kebabCase,
  tap((slug) => logger.debug({ slug }, 'generated')),
  (slug) => (isEmpty(slug) ? 'untitled' : slug),
)

const slug = await buildSlug('  Héllo World  ') // 'hello-world'
```

Expressions all the way down. No `let`, no mutation, no `if` statements.

## Related

- [`flow`](../reference/function/flow.md), [`flowAsync`](../reference/function/flowAsync.md), [`pipe`](../reference/function/pipe.md)
- [`when`](../reference/function/when.md), [`unless`](../reference/function/unless.md), [`ifElse`](../reference/function/ifElse.md), [`tap`](../reference/function/tap.md)
- [`call`](../reference/function/call.md), [`callAsync`](../reference/function/callAsync.md)
