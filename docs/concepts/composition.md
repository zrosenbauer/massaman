# Composition

Composing functions — building bigger operations from smaller ones — is the central activity in functional code. `massaman` gives you the standard tools, plus a few async-aware ones that don't exist in `es-toolkit`.

## `flow`

`flow(...fns)` builds a new function from a left-to-right composition. Call the result with a value and it threads through each step.

```typescript
import { flow } from 'massaman'
import { trim, upperCase } from 'massaman/string'

// Build once
const shout = flow(trim, upperCase)

shout('  hello  ') // 'HELLO'
```

For a one-off transformation (no need to name the pipeline), call the composition immediately:

```typescript
flow(trim, upperCase)('  hello  ') // 'HELLO'
```

`flow` is the synchronous composition primitive. Use it when every step is sync.

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
import { flow, when, unless, ifElse } from 'massaman'
import { isEmpty } from 'massaman/predicate'
import { trim } from 'massaman/string'

const sanitize = flow(
  when(isEmpty, () => 'default'), // when condition: run fn, else passthrough
  trim,
)

const requireNonEmpty = flow(
  unless(isEmpty, (s: string) => s),       // unless condition: passthrough, else throw
  (s) => { throw new Error(`empty: ${s}`) },
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
import { flow, tap } from 'massaman'

const handle = flow(
  parseConfig,
  tap((config) => logger.debug({ config }, 'parsed')),
  applyConfig,
)
```

`tap`'s callback can do anything; its return value is ignored. The value flowing through is whatever the tap received.

## `call` and `callAsync`

Apply a function to a value — useful when you have the value first and the function second, and a full `flow` would be overkill for a single call.

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
  (input: string) => attempt(() => JSON.parse(input).title as string),
  (result) => (isOk(result) ? result.value : ''),
  trim,
  kebabCase,
  tap((slug) => logger.debug({ slug }, 'generated')),
  (slug) => (isEmpty(slug) ? 'untitled' : slug),
)

const slug = await buildSlug('{"title":"  Hello World  "}') // 'hello-world'
```

Expressions all the way down. No `let`, no mutation, no `if` statements.

## Related

- [`flow`](../reference/function/flow.md), [`flowAsync`](../reference/function/flowAsync.md)
- [`when`](../reference/function/when.md), [`unless`](../reference/function/unless.md), [`ifElse`](../reference/function/ifElse.md), [`tap`](../reference/function/tap.md)
- [`call`](../reference/function/call.md), [`callAsync`](../reference/function/callAsync.md)
