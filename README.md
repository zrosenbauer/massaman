# massaman

[![npm](https://img.shields.io/npm/v/massaman/rc?label=npm%40rc&color=B45309)](https://www.npmjs.com/package/massaman)
[![types](https://img.shields.io/npm/types/massaman?color=3178c6)](https://www.typescriptlang.org/)
[![license](https://img.shields.io/npm/l/massaman?color=475569)](./LICENSE)

Monorepo for `massaman` — functional programming utilities for TypeScript. Curated wrapper over [es-toolkit](https://es-toolkit.slash.page) and [ts-pattern](https://github.com/gvergnaud/ts-pattern), with Result-style error handling, variadic-narrowing predicates, async-aware composition, and pattern matching.

> Full API docs and usage examples live in [`packages/massaman/README.md`](./packages/massaman/README.md) — that's what ships to npm.

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

## Scripts

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

## Requirements

- Node.js >= 24.0.0
- pnpm >= 10.32.1

## Contributing

Conventional Commits are enforced via commitlint. Pre-commit runs format, lint, and typecheck via lefthook. Pre-push runs the full test suite. Don't bypass hooks.

```bash
pnpm changeset       # describe your change for the next release
git commit -m "feat(massaman): add new utility"
```

## License

MIT © Zac Rosenbauer
