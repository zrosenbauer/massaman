# Dependency patches

## braces 3.0.3

`braces@3.0.3.patch` mitigates [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)
by rejecting parsed patterns with more than 127 nested AST containers before
recursive walkers run. The limit covers braces, parentheses, and mixed nesting.
It does not alter ordinary glob expansion or permit a caller to disable the limit.

The dependency is used by `ciderpress → @ciderpress/cli → fast-glob → micromatch`,
not the published Massaman runtime. `pnpm test:security` verifies the installed
dependency's behavior, and runs as part of `pnpm validate`.

No fixed upstream release is available. The registry audit still reports 3.0.3;
this advisory is deliberately not suppressed. Remove this patch after upgrading
to an upstream release that addresses the advisory and passes the regression tests.
