<div align="center">
  <img src="https://raw.githubusercontent.com/zrosenbauer/massaman/main/.github/assets/banner.png" alt="massaman" width="90%" />
  <p><strong>Functional programming utilities for TypeScript. Result types, pattern matching, async pipelines. Fully typed.</strong></p>

<a href="https://github.com/zrosenbauer/massaman/actions/workflows/ci.yml"><img src="https://github.com/zrosenbauer/massaman/actions/workflows/ci.yml/badge.svg?branch=main" alt="CI" /></a>
<a href="https://www.npmjs.com/package/massaman"><img src="https://img.shields.io/npm/v/massaman/rc?label=npm%40rc" alt="npm version" /></a>
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
npm install massaman@rc
```

## Usage

### Standard utilities (from es-toolkit)

Most of the surface (`array`, `object`, `string`, `function`, `math`) is a transparent re-export of [es-toolkit](https://es-toolkit.slash.page). Same names, same behavior, same docs. Import from `massaman` to keep everything under one namespace.

```ts
import { chunk, groupBy } from 'massaman'

chunk([1, 2, 3, 4, 5], 2)
// [[1, 2], [3, 4], [5]]

groupBy(['apple', 'avocado', 'banana', 'blueberry'], (s) => s[0])
// { a: ['apple', 'avocado'], b: ['banana', 'blueberry'] }
```

### Result and pattern matching together

```ts
import { attempt } from 'massaman/control'
import { match } from 'massaman/pattern'

const parsed = attempt(() => JSON.parse(rawInput))

const message = match(parsed)
  .with({ ok: true }, ({ value }) => `Got: ${value.name}`)
  .with({ ok: false }, ({ error }) => `Failed: ${error.message}`)
  .exhaustive()
```

## Why?

Two Rust patterns I keep wanting in TypeScript: `match` for exhaustive branching, and `Result` for errors that compose without throws. `massaman` brings both, layered over the two best FP libraries in the ecosystem (`es-toolkit` and `ts-pattern`), plus a thin set of utilities filling the gaps: async-aware composition, variadic-narrowing predicates, and consistent error normalization.

More on the philosophy at [zrosenbauer.com/blog](https://zrosenbauer.com/blog).

## Contributing

See [CONTRIBUTING.md](https://github.com/zrosenbauer/massaman/blob/main/CONTRIBUTING.md) for development setup, conventions, and PR process.

## License

[MIT](LICENSE)
