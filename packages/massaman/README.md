<div align="center">
  <img src="https://raw.githubusercontent.com/zrosenbauer/massaman/main/.github/assets/banner.png" alt="massaman" width="90%" />
  <p><strong>Functional programming utilities for TypeScript. Result types, pattern matching, async pipelines. Fully typed.</strong></p>

<a href="https://github.com/zrosenbauer/massaman/actions/workflows/ci.yml"><img src="https://github.com/zrosenbauer/massaman/actions/workflows/ci.yml/badge.svg?branch=main" alt="CI" /></a>
<a href="https://www.npmjs.com/package/massaman"><img src="https://img.shields.io/npm/v/massaman" alt="npm version" /></a>
<a href="https://github.com/zrosenbauer/massaman/blob/main/LICENSE"><img src="https://img.shields.io/github/license/zrosenbauer/massaman" alt="License" /></a>

</div>

## Features

- Functional-esque toolkit for writing close to pure FP in TypeScript.
- Built on two great libraries: [es-toolkit](https://es-toolkit.slash.page) and [ts-pattern](https://github.com/gvergnaud/ts-pattern).
- Result-style errors with `attempt`/`ok`/`err`. Never throw across a boundary.
- Variadic-narrowing predicates: `allPass([isString, isNotEmpty])` narrows to `string`.
- 100% test coverage, enforced by CI on every commit.

## Install

```bash
npm install massaman
```

## Usage

### From ts-pattern

The `pattern` subpath is a transparent re-export of [ts-pattern](https://github.com/gvergnaud/ts-pattern). Exhaustive matching with full TypeScript inference.

```ts
import { match, P } from 'massaman/pattern'

const status = match(action)
  .with({ type: 'load' }, () => 'loading')
  .with({ type: 'success' }, () => 'done')
  .with({ type: 'error', msg: P.string }, ({ msg }) => `failed: ${msg}`)
  .exhaustive()
```

### From es-toolkit

Most of the surface (`array`, `object`, `string`, `function`, `math`) is a transparent re-export of [es-toolkit](https://es-toolkit.slash.page). Same names, same behavior, same docs.

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

## Why?

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
import { match, P } from 'massaman/pattern'
import { attempt, isOk } from 'massaman/control'

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

`massaman` brings both patterns to TypeScript, layered over [es-toolkit](https://es-toolkit.slash.page) and [ts-pattern](https://github.com/gvergnaud/ts-pattern), plus a thin set of utilities filling the gaps: async-aware composition, variadic-narrowing predicates, and consistent error normalization.

More on the philosophy at [zrosenbauer.com/blog](https://zrosenbauer.com/blog).

## Contributing

See [CONTRIBUTING.md](https://github.com/zrosenbauer/massaman/blob/main/CONTRIBUTING.md) for development setup, conventions, and PR process.

## License

[MIT](LICENSE)
