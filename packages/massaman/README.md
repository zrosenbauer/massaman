<div align="center">
  <img src="assets/banner.svg" alt="massaman" width="90%" />
  <p><strong>Functional programming utilities for TypeScript — Result types, pattern matching, async pipelines. Fully typed.</strong></p>

<a href="https://github.com/zrosenbauer/massaman/actions/workflows/ci.yml"><img src="https://github.com/zrosenbauer/massaman/actions/workflows/ci.yml/badge.svg?branch=main" alt="CI" /></a>
<a href="https://www.npmjs.com/package/massaman"><img src="https://img.shields.io/npm/v/massaman/rc?label=npm%40rc" alt="npm version" /></a>
<a href="https://github.com/zrosenbauer/massaman/blob/main/LICENSE"><img src="https://img.shields.io/github/license/zrosenbauer/massaman" alt="License" /></a>

</div>

## Features

- **Functional-esque toolkit** — write close to pure FP in TypeScript.
- **Standing on giants** — curated wrappers over [es-toolkit](https://es-toolkit.slash.page) and [ts-pattern](https://github.com/gvergnaud/ts-pattern).
- **Result-style errors** — `attempt`/`ok`/`err`, never throw across a boundary.
- **Variadic-narrowing predicates** — `allPass([isString, isNotEmpty])` narrows to `string`.
- **100% test coverage** — enforced by CI on every commit.

## Install

```bash
npm install massaman@rc
```

## Usage

### Compose

```ts
import { flow, compact, uniq, toArray } from 'massaman'

const normalize = flow(toArray, compact, uniq)
normalize([1, null, 2, 1, null]) // [1, 2]
```

### Match

```ts
import { match, P } from 'massaman/pattern'

const label = match(status)
  .with('active', () => 'Live')
  .with('draft', () => 'Draft')
  .with(P._, () => 'N/A')
  .exhaustive()
```

### Handle errors safely

```ts
import { attempt, isOk } from 'massaman/control'

const result = attempt(() => JSON.parse(raw))
if (isOk(result)) {
  console.log(result.value)
} else {
  console.error(result.error)
}
```

### Narrow with predicates

```ts
import { allPass, isNotEmpty } from 'massaman/predicate'
import { isString } from 'es-toolkit/predicate'

const isNonEmptyString = allPass([isString, isNotEmpty])
if (isNonEmptyString(x)) {
  // x narrowed to string
}
```

## Modules

| Subpath               | Description                                                      |
| --------------------- | ---------------------------------------------------------------- |
| `massaman`            | Root barrel — re-exports everything below                        |
| `massaman/array`      | `chunk`, `groupBy`, `sortWith`, `scan`, `unfold`, …              |
| `massaman/object`     | `evolve`, `pick`, `omit`, `merge`, `mapKeys`, …                  |
| `massaman/function`   | `flow`, `flowAsync`, `tap`, `call`, `curry`, `when`, `unless`, … |
| `massaman/predicate`  | Type guards + variadic-narrowing combinators                     |
| `massaman/conversion` | `toError`, `stringify`, `toNumber`, `toArray`, …                 |
| `massaman/string`     | `camelCase`, `kebabCase`, `trim`, …                              |
| `massaman/math`       | `clamp`, `sum`, `mean`, `range`, …                               |
| `massaman/promise`    | `delay`, `timeout`, `Mutex`, `Semaphore`                         |
| `massaman/control`    | `attempt`, `ok`, `err`, `isOk`, `isErr`, `unwrap`                |
| `massaman/pattern`    | `match`, `P`, `isMatching`                                       |
| `massaman/error`      | `AbortError`, `TimeoutError`                                     |

## Contributing

Issues and PRs welcome at [github.com/zrosenbauer/massaman](https://github.com/zrosenbauer/massaman). Conventional Commits required; run `pnpm changeset` to describe your change for the next release.

## License

[MIT](LICENSE)
