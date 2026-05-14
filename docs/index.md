# massaman

Functional programming utilities for TypeScript. Rust's `match` and `Result` in TypeScript, layered over [`es-toolkit`](https://es-toolkit.dev) and [`ts-pattern`](https://github.com/gvergnaud/ts-pattern).

```bash
npm install massaman
```

```typescript
import { match, P, attempt, isOk } from 'massaman'

const result = attempt(() => JSON.parse(input))

const message = match(result)
  .with({ ok: true }, ({ value }) => `parsed ${typeof value}`)
  .with({ ok: false }, ({ error }) => `failed: ${error.message}`)
  .exhaustive()
```

## Where to start

- **[Introduction](./intro.md)** — what's bundled, what's original
- **[Installation & usage](./installation.md)** — install, imports, tree-shaking
- **[Philosophy](./philosophy.md)** — the FP stance, why no classes / no throws / no switch
- **Concepts** — short guides on the core ideas:
  - [Result type](./concepts/result.md)
  - [Pattern matching](./concepts/pattern-matching.md)
  - [Composition](./concepts/composition.md)
  - [Predicates](./concepts/predicates.md)
  - [Coercion](./concepts/coercion.md)
- **Reference** — every export, by area:
  - [array](./reference/array/) · [object](./reference/object/) · [function](./reference/function/) · [math](./reference/math/) · [string](./reference/string/) · [promise](./reference/promise/) · [error](./reference/error/)
  - [predicate](./reference/predicate/) · [control](./reference/control/) · [conversion](./reference/conversion/) · [match](./reference/pattern/)
