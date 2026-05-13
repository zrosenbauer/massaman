# Installation

## Requirements

- **Node** >= 24.0.0 (or any modern bundler targeting ES2022+).
- **TypeScript** >= 5.0 if using TS. `moduleResolution: "bundler"` (or `"node16"` / `"nodenext"`) is required to resolve subpath exports.

## Install

```bash
npm install massaman
# or
pnpm add massaman
# or
yarn add massaman
# or
bun add massaman
```

There are no peer dependencies. `es-toolkit` and `ts-pattern` are bundled as direct dependencies — you don't install them separately.

## Verify

```typescript
import { match, attempt } from 'massaman'

const result = attempt(() => JSON.parse('{"ok":1}'))
match(result)
  .with({ ok: true }, ({ value }) => console.log(value))
  .with({ ok: false }, ({ error }) => console.error(error))
  .exhaustive()
```

If TypeScript can't resolve `'massaman'`, your `moduleResolution` setting is too old. Add to `tsconfig.json`:

```jsonc
{
  "compilerOptions": {
    "moduleResolution": "bundler" // or "nodenext"
  }
}
```

## Module format

ESM-only. `massaman` does not ship a CommonJS build.

- ESM-native projects: nothing extra to do.
- CommonJS projects: import via dynamic `import()` or migrate to ESM.

## Bundle size

`massaman` is built with [tsdown](https://tsdown.dev), produces per-subpath `.mjs` and `.d.mts` files, and is marked `"sideEffects": false`. Imports are tree-shaken aggressively — the cost of `import { chunk } from 'massaman'` is the cost of `chunk` plus the cost of importing it from `es-toolkit/array`.

For raw size numbers per function, see each function's reference page.
