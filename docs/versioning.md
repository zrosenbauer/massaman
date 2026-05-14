# Versioning

## SemVer, with a pre-1.0 cap

`massaman` is pre-1.0. Until we hit 1.0:

- **`patch`** — bug fixes, additive non-breaking changes (new utility, new type export).
- **`minor`** — anything that could surprise existing users: renames, signature changes, removed exports. After 1.0, these will become `major`.
- **`major`** — reserved for the 1.0 release itself.

After 1.0 we follow standard semver: `patch` for fixes, `minor` for additive features, `major` for breaking changes.

## What's a breaking change

Pre-1.0 (treated as `minor`), post-1.0 (treated as `major`):

- Removing an export.
- Renaming an exported symbol.
- Changing a function signature in a way that breaks existing callers.
- Changing inferred return types in a way that breaks existing callers (TypeScript-level breakage counts).
- Bumping `es-toolkit` or `ts-pattern` major versions.
- Changing the minimum Node version.

What's **not** a breaking change:

- Adding a new export.
- Adding a new subpath.
- Tightening an internal type that's not part of the public surface.
- Bumping `es-toolkit` or `ts-pattern` minor/patch versions — these are tracked but not breaking unless they introduce a regression we surface.

## Changelog

Every release ships a changelog entry under [CHANGELOG.md](https://github.com/zrosenbauer/massaman/blob/main/packages/massaman/CHANGELOG.md) on GitHub. Subscribe to releases on the repo to get notified of new versions.
