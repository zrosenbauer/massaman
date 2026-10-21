<div align="center">
  <img src="https://raw.githubusercontent.com/zrosenbauer/massaman/main/.github/assets/banner.svg" alt="massaman" width="100%" />
  <p><strong>Functional programming utilities for TypeScript. Result types, pattern matching, async pipelines. Fully typed.</strong></p>

<a href="https://github.com/zrosenbauer/massaman/actions/workflows/ci.yml"><img src="https://github.com/zrosenbauer/massaman/actions/workflows/ci.yml/badge.svg?branch=main" alt="CI" /></a>
<a href="https://github.com/zrosenbauer/massaman/actions/workflows/ci-security.yml"><img src="https://github.com/zrosenbauer/massaman/actions/workflows/ci-security.yml/badge.svg?branch=main" alt="Security" /></a>
<a href="https://www.npmjs.com/package/massaman"><img src="https://img.shields.io/npm/v/massaman" alt="npm version" /></a>
<a href="https://github.com/zrosenbauer/massaman/blob/main/LICENSE"><img src="https://img.shields.io/github/license/zrosenbauer/massaman" alt="License" /></a>

</div>

## Features

- **Rust-inspired pattern matching:** match unions, nested objects, and arrays with exhaustive checking powered by [ts-pattern](https://github.com/gvergnaud/ts-pattern).
- **Errors as values:** Rust-style `Result`, `Ok`, and `Err` make expected failure explicit. Handle both outcomes with `P.ok` and `P.err`.
- **Composable functions:** build typed sync and async pipelines with `flow`, `flowAsync`, and branching combinators.
- **Functional data transformations:** array, object, string, and math utilities from [es-toolkit](https://es-toolkit.dev), alongside predicates that preserve type narrowing.
- **Typed errors without subclasses:** create native errors with named variants and domain data using `createError` and `defineError`.
- **Import only what you use:** tree-shakeable ESM with focused subpath exports.

## Install

```bash
npm install massaman
```

## Usage

### From ts-pattern

The `match` subpath re-exports [ts-pattern](https://github.com/gvergnaud/ts-pattern) and adds `P.ok` and `P.err` for Massaman results.

```ts
import { match, P } from 'massaman/match'

const status = match(action)
  .with({ type: 'load' }, () => 'loading')
  .with({ type: 'success' }, () => 'done')
  .with({ type: 'error', msg: P.string }, ({ msg }) => `failed: ${msg}`)
  .exhaustive()
```

### From es-toolkit

Most of the surface (`array`, `object`, `string`, `function`, `math`) is a transparent re-export of [es-toolkit](https://es-toolkit.dev). Same names, same behavior, same docs.

```ts
import { chunk, groupBy } from 'massaman'

chunk([1, 2, 3, 4, 5], 2)
// [[1, 2], [3, 4], [5]]

groupBy(['apple', 'avocado', 'banana', 'blueberry'], (s) => s[0])
// { a: ['apple', 'avocado'], b: ['banana', 'blueberry'] }
```

### Custom: Result and async composition

Built on top of those re-exports, `massaman/control` adds Result-style error handling that never throws across a boundary.

```ts
import { attemptAsync, isOk } from 'massaman/control'

const result = await attemptAsync(() => fetch('/api/user').then((r) => r.json()))

if (isOk(result)) {
  console.log(result.value)
} else {
  console.error(result.error.message)
}
```

### Typed errors without subclasses

```ts
import { defineError, err, type ErrorWith } from 'massaman'

type NotFound = ErrorWith<'NotFound', { readonly userId: string }>

const notFound = defineError<NotFound, [userId: string]>((userId) => ({
  name: 'NotFound',
  message: `User ${userId} not found`,
  userId,
}))

const result = err(notFound('123'))
// Err<NotFound>; result.error is a native Error with typed userId data.
```

Omit the generics to infer the contract. Pass an object to `defineError` for a zero-argument constructor, or use `createError({...})` for a one-off instance. Both functions and `ErrorWith` are also available from `massaman/error`.

## Why Massaman?

Currying is a core functional programming technique, and its name makes curry-the-food jokes inevitable. Massaman is a delicious Thai curry known for its rich blend of spices. This library continues the pun with its own rich blend of functional patterns.

Two Rust patterns I keep wanting in TypeScript: `match` for exhaustive branching, and `Result` for errors that compose without throws.

In Rust:

```rust
match action {
    Action::Load => "loading",
    Action::Success => "done",
    Action::Error(msg) => &format!("failed: {}", msg),
}

let parsed: Result<User, Error> = serde_json::from_str(raw);
match parsed {
    Ok(user) => println!("got: {}", user.name),
    Err(err) => eprintln!("failed: {}", err),
}
```

The equivalent in TypeScript using `massaman`:

```ts
import { attempt, isOk } from 'massaman/control'
import { match, P } from 'massaman/match'

match(action)
  .with({ type: 'load' }, () => 'loading')
  .with({ type: 'success' }, () => 'done')
  .with({ type: 'error', msg: P.string }, ({ msg }) => `failed: ${msg}`)
  .exhaustive()

const parsed = attempt(() => JSON.parse(raw) as User)
if (isOk(parsed)) {
  console.log(`got: ${parsed.value.name}`)
} else {
  console.error(`failed: ${parsed.error.message}`)
}
```

`massaman` brings both patterns to TypeScript, layered over [es-toolkit](https://es-toolkit.dev) and [ts-pattern](https://github.com/gvergnaud/ts-pattern), plus a thin set of utilities filling the gaps: async-aware composition, variadic-narrowing predicates, and consistent error normalization.

More on the philosophy at [zrosenbauer.com/gui/blog](https://zrosenbauer.com/gui/blog).

## Contributing

See [CONTRIBUTING.md](https://github.com/zrosenbauer/massaman/blob/main/CONTRIBUTING.md) for development setup, conventions, and PR process.

## License

[MIT](LICENSE)
