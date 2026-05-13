<div align="center">
  <img src="packages/massaman/assets/banner.svg" alt="massaman" width="90%" />
  <p><strong>Functional programming utilities for TypeScript — Result types, pattern matching, async pipelines. Fully typed.</strong></p>

<a href="https://github.com/zrosenbauer/massaman/actions/workflows/ci.yml"><img src="https://github.com/zrosenbauer/massaman/actions/workflows/ci.yml/badge.svg?branch=main" alt="CI" /></a>
<a href="https://www.npmjs.com/package/massaman"><img src="https://img.shields.io/npm/v/massaman/rc?label=npm%40rc" alt="npm version" /></a>
<a href="https://github.com/zrosenbauer/massaman/blob/main/LICENSE"><img src="https://img.shields.io/github/license/zrosenbauer/massaman" alt="License" /></a>

<a href="./packages/massaman/README.md">📖 Library docs</a> &nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp; <a href="https://github.com/zrosenbauer/massaman/issues">🐛 Issues</a>

</div>

## Features

- **Result-style error handling** — `attempt` / `ok` / `err` / `isOk` / `isErr` / `unwrap`. Never throw across a boundary again.
- **Pattern matching** — Full [ts-pattern](https://github.com/gvergnaud/ts-pattern) re-exported under `massaman/pattern`.
- **Variadic-narrowing predicates** — `allPass([isString, isNotEmpty])` returns a guard that narrows to `string`.
- **Async-aware composition** — `flowAsync` chains promise-returning functions with end-to-end type inference (up to 7 steps).
- **Curated FP surface** — Array, object, string, function, math, predicate, promise. 12 subpath exports, ESM-only, tree-shakeable.
- **100% test coverage** — Enforced by CI on every commit.

## Packages

| Package                                     | Description                                | Status                                                                           |
| ------------------------------------------- | ------------------------------------------ | -------------------------------------------------------------------------------- |
| [`massaman`](./packages/massaman)           | Main library — FP primitives and utilities | ![rc](https://img.shields.io/badge/release%20candidate-B45309?style=flat-square) |
| [`@massaman/tsconfig`](./packages/tsconfig) | Shared TypeScript configs (private)        | ![internal](https://img.shields.io/badge/internal-475569?style=flat-square)      |

## Development

```bash
pnpm install
pnpm validate    # typecheck + test + lint + format:check
pnpm build       # build all packages via turborepo
```

| Script           | Description                                |
| ---------------- | ------------------------------------------ |
| `pnpm build`     | Build all packages via turborepo           |
| `pnpm test`      | Run vitest across all packages             |
| `pnpm typecheck` | Type-check via tsgo (Go-based TS compiler) |
| `pnpm lint`      | Lint with oxlint                           |
| `pnpm format`    | Format with oxfmt                          |
| `pnpm fix`       | Auto-fix lint + format issues              |
| `pnpm validate`  | typecheck + test + lint + format:check     |
| `pnpm changeset` | Add a changeset entry for the next release |
| `pnpm release`   | Build and publish via changesets           |
| `pnpm clean`     | Remove build artifacts and `node_modules`  |

## Stack

| Tool                                                                                                            | Purpose                               |
| --------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| [pnpm workspaces](https://pnpm.io/workspaces) + [turborepo](https://turbo.build)                                | Monorepo + task orchestration         |
| [TypeScript](https://www.typescriptlang.org/) (via [`tsgo`](https://github.com/microsoft/typescript-go))        | Types + Go-based typechecking         |
| [tsdown](https://tsdown.dev)                                                                                    | Build                                 |
| [vitest](https://vitest.dev)                                                                                    | Test runner — 100% coverage threshold |
| [oxlint](https://oxc.rs/docs/guide/usage/linter.html) + [oxfmt](https://oxc.rs/docs/guide/usage/formatter.html) | Lint + format                         |
| [changesets](https://github.com/changesets/changesets)                                                          | Versioning + publishing               |
| [lefthook](https://lefthook.dev) + [commitlint](https://commitlint.js.org)                                      | Git hooks + conventional commits      |

## Contributing

Conventional Commits are enforced via commitlint. Pre-commit runs format, lint, and typecheck via lefthook. Pre-push runs the full test suite. Don't bypass hooks.

```bash
pnpm changeset       # describe your change for the next release
git commit -m "feat(massaman): add new utility"
```

## License

[MIT](LICENSE)
