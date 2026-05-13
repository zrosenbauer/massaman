# Usage

## Imports

`massaman` has 11 subpath exports plus a flat barrel:

```typescript
// flat barrel — everything
import { chunk, match, attempt, isEmpty } from 'massaman'

// subpath — same exports, narrower import surface
import { chunk } from 'massaman/array'
import { match, P } from 'massaman/match'
import { attempt, isOk } from 'massaman/control'
import { isEmpty } from 'massaman/predicate'
```

Both forms are equivalent at runtime and tree-shakeable. Pick what reads better — most codebases settle on one and stick with it.

## Available subpaths

| Subpath | Contents |
|---|---|
| `massaman/array` | array manipulation (chunk, groupBy, partition, …) |
| `massaman/object` | object utilities (pick, omit, evolve, merge, …) |
| `massaman/function` | function utilities (flow, flowAsync, debounce, curry, …) |
| `massaman/math` | math utilities (sum, clamp, range, …) |
| `massaman/string` | string utilities (camelCase, kebabCase, …) |
| `massaman/promise` | promise utilities (delay, withTimeout, Semaphore, …) |
| `massaman/error` | error classes (AbortError, TimeoutError) |
| `massaman/predicate` | type guards (isString, isEmpty, isObject, both, either, …) |
| `massaman/match` | pattern matching (match, isMatching, P, Pattern) |
| `massaman/control` | Result type + control flow (attempt, ok, err, isOk, …) |
| `massaman/conversion` | safe coercion (toNumber, toInteger, toError, …) |

## Tree-shaking

`massaman` is ESM-only and ships `"sideEffects": false`. Any modern bundler (Vite, Rollup, esbuild, Webpack 5, Bun) will drop the unused exports.

```typescript
import { chunk } from 'massaman'
// bundle includes: chunk implementation only
```

The flat barrel doesn't hurt tree-shaking — it's a static re-export with no side effects.

## TypeScript

Require `moduleResolution: "bundler"` (or `"node16"` / `"nodenext"`) in `tsconfig.json`. All types are emitted as `.d.mts` files alongside `.mjs`.

Type-only imports work as expected:

```typescript
import { type Result, type Ok, type Err } from 'massaman'
import { type Pattern } from 'massaman/match'
```

## CDN / no-build

ESM via [esm.sh](https://esm.sh) or [jsr.io](https://jsr.io):

```html
<script type="module">
  import { match } from 'https://esm.sh/massaman'
</script>
```

This isn't tested as a primary delivery mechanism. For production, use a bundler.

## Versioning

`massaman` is pre-1.0. We follow a stricter contract while versions are `0.x`:

- `patch` — bug fixes, additive non-breaking changes.
- `minor` — anything that could surprise existing users (rename, signature change, removed export). After 1.0, this becomes `major`.

See [versioning](./versioning.md) for details and [the changeset workflow](https://github.com/zrosenbauer/massaman/blob/main/CONTRIBUTING.md).
