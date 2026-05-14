# Introduction

`massaman` is a functional programming library for TypeScript. It gives you:

- **Pattern matching** with full TypeScript inference, via [`ts-pattern`](https://github.com/gvergnaud/ts-pattern).
- **A `Result` type** for errors that compose — `attempt`, `ok`, `err`, `isOk`, `unwrap`.
- **Array, object, function, string, math, and predicate utilities** layered over [`es-toolkit`](https://es-toolkit.dev).
- **Async-aware composition** — `flowAsync`, `tap`, `when`, `ifElse`, and other point-free combinators.
- **Variadic-narrowing predicates** and consistent error normalization for the gaps between the two upstream libraries.

ESM-only. Tree-shakeable. Fully typed. No `compat` layer.

## Available subpaths

`massaman` ships 11 subpath exports plus a flat barrel. Every export is reachable from the flat barrel; the subpaths exist for code-navigation and import-grouping:

| Subpath | What's there |
|---|---|
| `massaman/array` | array manipulation: `chunk`, `groupBy`, `partition`, `uniq`, … |
| `massaman/object` | object utilities: `pick`, `omit`, `evolve`, `merge`, … |
| `massaman/function` | composition + control: `flow`, `flowAsync`, `tap`, `when`, `ifElse`, `debounce`, `curry`, … |
| `massaman/math` | numeric: `sum`, `clamp`, `range`, … |
| `massaman/string` | strings: `camelCase`, `kebabCase`, `trim`, … |
| `massaman/promise` | async primitives: `delay`, `withTimeout`, `Semaphore`, … |
| `massaman/error` | error classes: `AbortError`, `TimeoutError` |
| `massaman/predicate` | type guards + combinators: `isString`, `isEmpty`, `isObject`, `both`, `either`, … |
| `massaman/pattern` | pattern matching: `match`, `isMatching`, `P`, `Pattern` |
| `massaman/control` | Result + control flow: `attempt`, `ok`, `err`, `isOk`, `unwrap`, `assert`, `invariant` |
| `massaman/conversion` | safe coercion: `toNumber`, `toInteger`, `toError`, `stringify`, … |

The full per-symbol reference is under [Reference](./reference/) — each function has its own page.

## Two ways to import

Flat barrel (recommended in most code):

```typescript
import { chunk, match, P, attempt } from 'massaman'
```

Subpath (matches the conceptual area, helps with code navigation):

```typescript
import { chunk } from 'massaman/array'
import { match, P } from 'massaman/pattern'
import { attempt } from 'massaman/control'
```

Both are tree-shakeable. Pick whichever reads better in your codebase.

## Why not just use es-toolkit + ts-pattern directly?

You can. If you don't need the `Result` type, async composition, or the variadic-narrowing predicates, use the originals directly. `massaman` is what you'd build on top anyway — a single import surface plus the connective tissue.

## Where to go next

- **[Installation](./installation.md)** — install, requirements, TypeScript config.
- **[Philosophy](./philosophy.md)** — the FP stance the library encourages.
- **Concepts** — [Result type](./concepts/result.md), [Pattern matching](./concepts/pattern-matching.md), [Composition](./concepts/composition.md), [Predicates](./concepts/predicates.md), [Coercion](./concepts/coercion.md).
- **[Reference](./reference/)** — every export, by area.
