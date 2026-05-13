# massaman

[![npm](https://img.shields.io/npm/v/massaman/rc?label=npm%40rc&color=B45309)](https://www.npmjs.com/package/massaman)
[![types](https://img.shields.io/npm/types/massaman?color=3178c6)](https://www.typescriptlang.org/)
[![license](https://img.shields.io/npm/l/massaman?color=475569)](./LICENSE)
[![status](https://img.shields.io/badge/status-release%20candidate-B45309)](#status)

Functional programming utilities for TypeScript — a curated unified surface over [es-toolkit](https://es-toolkit.slash.page) and [ts-pattern](https://github.com/gvergnaud/ts-pattern), with Result-style error handling, variadic-narrowing predicates, async-aware composition, and pattern matching.

## Status

Release candidate. The public API is frozen — no breaking changes will land before `1.0.0`. Feedback welcome via [issues](https://github.com/zrosenbauer/massaman/issues).

## Install

```bash
npm install massaman@rc
# or
pnpm add massaman@rc
# or
yarn add massaman@rc
```

## Quick start

```ts
import { flow, attempt, isOk } from 'massaman'

const parseUser = flow(JSON.parse, (u) => u.name.trim())

const result = attempt(() => parseUser(rawInput))
if (isOk(result)) {
  return result.value
}
return 'unknown'
```

## Features

| Feature                            | Description                                                                                              |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------- |
| **Unified FP surface**             | Array, object, string, function, math, predicate, promise — one curated import root, tree-shakeable.     |
| **Result-style error handling**    | `attempt` / `attemptAsync` / `ok` / `err` / `isOk` / `isErr` / `unwrap` — no thrown exceptions.          |
| **Pattern matching**               | Full [ts-pattern](https://github.com/gvergnaud/ts-pattern) re-export under `massaman/pattern`.           |
| **Variadic type-guard narrowing**  | `allPass([isString, isNotEmpty])` returns a guard that narrows to `string` — composes any arity.         |
| **Async-aware pipelines**          | `flowAsync` chains promise-returning functions with end-to-end type inference (up to 7 steps).           |
| **Safe error normalization**       | `toError` + `stringify` handle non-`Error` throws, circular refs, Maps/Sets — no more `[object Object]`. |
| **Branching combinators**          | `when` / `unless` / `ifElse` for point-free conditionals inside `flow` pipelines.                        |
| **100% test coverage**             | Enforced by CI — every line, branch, and function is verified.                                           |
| **ESM-only, `sideEffects: false`** | 12 subpath exports, tree-shakeable, zero side effects.                                                   |

## Usage

```ts
import { flow, compact, uniq, toArray } from 'massaman'

const normalize = flow(toArray, compact, uniq)
normalize([1, null, 2, 1, null]) // [1, 2]
```

```ts
import { match, P } from 'massaman/pattern'

const label = match(status)
  .with('active', () => 'Live')
  .with('draft', () => 'Draft')
  .with(P._, () => 'N/A')
  .exhaustive()
```

```ts
import { attempt, isOk } from 'massaman/control'

const result = attempt(() => JSON.parse(raw))
if (isOk(result)) {
  console.log(result.value)
} else {
  console.error(result.error)
}
```

```ts
import { allPass } from 'massaman/predicate'
import { isString } from 'es-toolkit/predicate'
import { isNotEmpty } from 'massaman/predicate'

const isNonEmptyString = allPass([isString, isNotEmpty])
if (isNonEmptyString(x)) {
  // x is narrowed to string
}
```

## Modules

| Subpath               | Description                                                                |
| --------------------- | -------------------------------------------------------------------------- |
| `massaman`            | Root barrel — re-exports everything below                                  |
| `massaman/array`      | Array utilities (chunk, groupBy, sortWith, scan, unfold, …)                |
| `massaman/object`     | Object utilities (evolve, pick, omit, merge, mapKeys, …)                   |
| `massaman/function`   | Composition (flow, flowAsync, tap, call, curry, when, unless, ifElse, …)   |
| `massaman/predicate`  | Type guards, combinators with variadic narrowing                           |
| `massaman/conversion` | Coercion + safe stringification (toError, stringify, toNumber, toArray, …) |
| `massaman/string`     | String transforms (camelCase, kebabCase, trim, …)                          |
| `massaman/math`       | Numeric utilities (clamp, sum, mean, range, …)                             |
| `massaman/promise`    | Async helpers (delay, timeout, Mutex, Semaphore)                           |
| `massaman/control`    | Result-style error handling (attempt, ok, err, isOk, isErr, unwrap, …)     |
| `massaman/pattern`    | Pattern matching (match, P, isMatching)                                    |
| `massaman/error`      | Error types (AbortError, TimeoutError)                                     |

## Custom utilities

Utilities not in es-toolkit or ts-pattern — implemented in this package:

| Module       | Utility                                          | Description                                                    |
| ------------ | ------------------------------------------------ | -------------------------------------------------------------- |
| `array`      | `adjust`, `scan`, `unfold`, `dropRepeats`        | Index update, accumulator scan, seed unfold, consecutive dedup |
| `array`      | `reduceWhile`, `ascend`, `descend`, `sortWith`   | Short-circuit reduce, comparator factories, multi-key sort     |
| `function`   | `flowAsync`, `tap`                               | Async composition, side-effect-in-pipeline                     |
| `function`   | `when`, `unless`, `ifElse`, `call`, `callAsync`  | Point-free conditionals, named application                     |
| `object`     | `evolve`                                         | Apply transforms per key                                       |
| `predicate`  | `allPass`, `anyPass`, `both`, `either`           | Variadic-narrowing predicate combinators                       |
| `predicate`  | `isArray`, `isObject`, `isEmpty`, `isNotEmpty`   | Type guards + emptiness                                        |
| `predicate`  | `isFiniteNumber`, `isInteger`, `isNaN`           | Strict numeric guards (shadowing the broken global `isNaN`)    |
| `control`    | `attempt`, `attemptAsync`                        | Wrap throwing/rejecting code into a `Result`                   |
| `control`    | `ok`, `err`, `isOk`, `isErr`, `unwrap`           | Construct, narrow, and unwrap a `Result`                       |
| `conversion` | `toError`, `stringify`                           | Normalize unknown thrown values + safe JSON of any value       |
| `conversion` | `toNumber`, `toString`, `toBoolean`, `toInteger` | Stable coercion primitives                                     |
| `conversion` | `toFinite`, `toArray`                            | Safe coercion with fallback semantics                          |

## Requirements

- Node.js >= 24.0.0
- ESM only (`require()` / CommonJS is not supported)
- TypeScript >= 5.9 recommended (variadic narrowing benefits from recent inference)

## License

MIT © Zac Rosenbauer
