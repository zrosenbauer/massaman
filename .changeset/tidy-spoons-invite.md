---
'massaman': minor
---

Catch up to es-toolkit 1.51.0 and raise the minimum Node version.

**Breaking**

- `limitAsync` moved from `massaman/array` to `massaman/promise`, following es-toolkit's recategorization. It is still reachable from the flat `massaman` barrel; only the `massaman/array` subpath import breaks.
- `engines.node` is now `>=26.0.0` (was `>=24.0.0`), and the build targets `node26`.

**Added**

- New `massaman/bigint` subpath: `sum`, `sumBy`, `max`, `min`, `maxBy`, `minBy`, `clamp`, `inRange`, `median`, `medianBy`, `percentile`, `range`, `rangeRight` for `bigint`. Subpath-only — these names collide with the `number` implementations in `massaman/math` and `massaman/array`, so they are deliberately absent from the flat barrel.
- `massaman/object`: `deepFreeze`, `mapKeysAsync`, `mapValuesAsync`, `toPascalCaseKeys`, `toKebabCaseKeys`, `toConstantCaseKeys`, and the `ToCamelCaseKeys` / `ToPascalCaseKeys` / `ToSnakeCaseKeys` / `ToKebabCaseKeys` / `ToConstantCaseKeys` types.
- `massaman/string`: `dedent`.

**Fixed upstream** (inherited from es-toolkit 1.51.0)

- `retry` now passes the last error to the `delay` callback and throws without a trailing delay.
- `pullAt` removes the correct elements for negative indices.
- `at`, `pullAt`, `orderBy`, and `sortBy` accept readonly arrays.
- `flattenObject` gained a `preserveArrays` option.
