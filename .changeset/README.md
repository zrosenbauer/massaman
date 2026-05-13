# Changesets

This directory holds version bump entries for the `massaman` monorepo.

## Adding a changeset

```bash
pnpm changeset
```

Pick the affected package(s) and the bump type. A markdown file is written here and committed with your PR.

## Releasing

CI/maintainer runs:

```bash
pnpm release
```

This runs `pnpm build` then `changeset publish` to publish updated packages to npm.

See the [changesets docs](https://github.com/changesets/changesets) for details.
