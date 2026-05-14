# Philosophy

`massaman` takes a strict functional stance — it pushes you toward one shape of code: pure, immutable, declarative, composable.

If you're coming from Rust, this will feel familiar — same patterns, weaker compiler, more discipline required from the codebase to make up for it.

## The stance

### Expressions, not statements

Every operation produces a value. `if`/`else` becomes [`when`](./reference/function/when.md) / [`unless`](./reference/function/unless.md) / [`ifElse`](./reference/function/ifElse.md) or [`match`](./reference/pattern/match.md). `switch` becomes `match`. Mutating loops become `map`/`filter`/`reduce`. The result is code that flows top-to-bottom without intermediate state, and that's much easier to reason about — and to type.

### Errors as values

Throwing is fine inside an internal helper; throwing across a public function boundary is a smell. Use [`attempt`](./reference/control/attempt.md) / [`attemptAsync`](./reference/control/attemptAsync.md) to wrap unsafe calls and propagate a [`Result`](./concepts/result.md) instead. Failure becomes a discriminated case, not a hole in the control flow.

### Immutability by default

Functions don't mutate their arguments. `const` everywhere. New objects/arrays instead of in-place updates. The es-toolkit helpers (`pick`, `omit`, `merge`, `evolve`) all return new values; reach for them instead of writing imperative mutation.

### No classes

A factory function plus a closure does everything a class does, without `this`, without prototype chains, without inheritance, without the `new`-vs-call ambiguity. If you find yourself wanting a class, look for a factory + closure pattern first.

## What this looks like in code

A typical massaman module:

```typescript
import { match, P } from 'massaman/pattern'
import { attemptAsync, err, type Result } from 'massaman/control'
import { isEmpty } from 'massaman/predicate'

type FetchUserResult = Result<User>

export async function fetchUser(id: string): Promise<FetchUserResult> {
  if (isEmpty(id)) return err('id required')

  return attemptAsync(() => fetch(`/api/users/${id}`).then((r) => r.json()))
}

export function describe(result: FetchUserResult): string {
  return match(result)
    .with({ ok: true, value: { name: P.string } }, ({ value }) => `hi ${value.name}`)
    .with({ ok: true }, () => 'no name')
    .with({ ok: false }, ({ error }) => `failed: ${error.message}`)
    .exhaustive()
}
```

No `throw`. No `try`/`catch`. No `class`. No `switch`. No `let`. No nested ternaries. Just expressions, pattern matching, and `Result`.

## What we don't do

- **No `compat` layer.** This is not a lodash replacement. If you need lodash compatibility, use [`es-toolkit/compat`](https://es-toolkit.dev/compatibility.html).
- **No effects system / IO monad.** Tracking effects in the type system is great in Haskell; in TypeScript it's a leaky abstraction. We push effects to the edges by convention.
- **No do-notation, no fp-ts.** `massaman` is not [fp-ts](https://gcanti.github.io/fp-ts/). If you want category theory, use that library — they're well-designed and we've borrowed ideas.

## Why this trade

Working FP code in TypeScript is mostly about making the right thing easy and the wrong thing awkward. `massaman` is what you'd build if you wrote enough of it: the patterns that pay off, packaged so you don't re-implement them in every project.
