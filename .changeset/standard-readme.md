---
'massaman': patch
---

- Rewrite README to follow the [standard-readme](https://github.com/RichardLitt/standard-readme) spec with a Features section mirrored from `joggrdocs/{kidd,zpress}`.
- Scope every file-level `oxlint-disable` directive down to per-line `oxlint-disable-next-line` so future additions require their own justification (`types/internal.ts`, `array/unfold.ts`, `array/reduceWhile.ts`, `object/evolve.ts`).
- Wrap const-aliased built-in predicates (`isArray`, `isFiniteNumber`, `isInteger`, `isNaN`) as real functions so they don't lose binding when passed around as callbacks.
- Move `combinators.ts` internal helper types (`Guarded`, `InferInput`, `UnionToIntersection`) to the bottom of the file — they're not used elsewhere.
- Strip label/divider comments from `src/index.ts`, `src/conversion/convert.ts`, and `src/control/result.test.ts`.
