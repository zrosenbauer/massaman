# Contributing to massaman

Thanks for your interest in contributing. This document covers the development setup, conventions, and process for submitting changes.

## Reporting issues

Use [GitHub Issues](https://github.com/zrosenbauer/massaman/issues) for bug reports and feature requests. Include:

- What you tried
- What you expected
- What actually happened
- Minimal reproduction (if possible)

## Development setup

Requirements:

- Node.js >= 24.0.0
- pnpm >= 10.32.1

Clone, install, validate:

```bash
git clone https://github.com/zrosenbauer/massaman.git
cd massaman
pnpm install
pnpm validate    # typecheck + test + lint + format:check
```

## Scripts

| Script           | Description                                |
| ---------------- | ------------------------------------------ |
| `pnpm build`     | Build all packages via turborepo           |
| `pnpm test`      | Run vitest across all packages             |
| `pnpm typecheck` | Type-check via tsgo                        |
| `pnpm lint`      | Lint with oxlint                           |
| `pnpm format`    | Format with oxfmt                          |
| `pnpm fix`       | Auto-fix lint + format issues              |
| `pnpm validate`  | typecheck + test + lint + format:check     |
| `pnpm changeset` | Add a changeset entry for the next release |
| `pnpm release`   | Build and publish via changesets           |
| `pnpm clean`     | Remove build artifacts and `node_modules`  |

## Stack

| Tool                                                                                                            | Purpose                            |
| --------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| [pnpm workspaces](https://pnpm.io/workspaces) + [turborepo](https://turbo.build)                                | Monorepo and task orchestration    |
| [TypeScript](https://www.typescriptlang.org/) (via [`tsgo`](https://github.com/microsoft/typescript-go))        | Types and Go-based typechecking    |
| [tsdown](https://tsdown.dev)                                                                                    | Build                              |
| [vitest](https://vitest.dev)                                                                                    | Tests with 100% coverage threshold |
| [oxlint](https://oxc.rs/docs/guide/usage/linter.html) + [oxfmt](https://oxc.rs/docs/guide/usage/formatter.html) | Lint and format                    |
| [changesets](https://github.com/changesets/changesets)                                                          | Versioning and publishing          |
| [lefthook](https://lefthook.dev) + [commitlint](https://commitlint.js.org)                                      | Git hooks and conventional commits |

## Commit conventions

Conventional Commits are enforced via commitlint. Format:

```
<type>(<scope>): <subject>
```

Valid types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `perf`, `style`, `ci`, `deps`, `revert`, `sec`, `release`.

Valid scopes: `massaman`, `tsconfig`, `ci`, `deps`, `repo`, `tooling`, `docs`.

Example:

```bash
git commit -m "feat(massaman): add flowAsync combinator"
```

## Adding a changeset

Every user-visible change needs a changeset entry:

```bash
pnpm changeset
```

Pick the affected package and the bump type (patch / minor / major). A markdown file is written under `.changeset/` and committed with your PR.

## Submitting a pull request

1. Fork the repo and create a feature branch from `main`.
2. Make your changes, including tests where appropriate.
3. Run `pnpm validate` locally. Pre-commit and pre-push hooks will block obviously broken commits.
4. Add a changeset entry describing the change.
5. Open a PR against `main` with a clear description.

Don't bypass hooks. If something fails, fix the root cause.

## License

By contributing, you agree your contributions will be licensed under the MIT License.
