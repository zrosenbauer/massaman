# massaman

## 0.0.1-rc.3

### Patch Changes

- - Rewrite README to follow the [standard-readme](https://github.com/RichardLitt/standard-readme) spec with a Features section mirrored from `joggrdocs/{kidd,zpress}`.
  - Scope every file-level `oxlint-disable` directive down to per-line `oxlint-disable-next-line` so future additions require their own justification (`types/internal.ts`, `array/unfold.ts`, `array/reduceWhile.ts`, `object/evolve.ts`).
  - Wrap const-aliased built-in predicates (`isArray`, `isFiniteNumber`, `isInteger`, `isNaN`) as real functions so they don't lose binding when passed around as callbacks.
  - Move `combinators.ts` internal helper types (`Guarded`, `InferInput`, `UnionToIntersection`) to the bottom of the file — they're not used elsewhere.
  - Strip label/divider comments from `src/index.ts`, `src/conversion/convert.ts`, and `src/control/result.test.ts`.

## 0.0.1-rc.2

### Patch Changes

- Polish README for release candidate: badges, status section, `@rc` install commands, and dropped the unimplemented banner block.

## 0.0.1-rc.1

### Patch Changes

- Sync `homepage`, `bugs`, and `repository` URLs to the new package identity.

## 0.0.1-rc.0

### Patch Changes

- Initial release candidate. Functional programming utilities for TypeScript — curated surface over es-toolkit and ts-pattern with Result-style error handling, async-aware composition, variadic-narrowing predicates, and pattern matching.
