---
'massaman': minor
---

Add three Rust-style stub helpers to `massaman/control`: `todo`, `unimplemented`, `unreachable`.

All three return `never` so they typecheck in any position (expression, branch arm, return value). Messages mirror Rust's stdlib (`not yet implemented`, `not implemented`, `entered unreachable code`) — the `internal error:` prefix is dropped from `unreachable` since JavaScript's `Error:` wrapper already provides that framing.

```typescript
import { todo, unimplemented, unreachable } from 'massaman/control'

function parseConfig(raw: string): Config {
  return todo('waiting on schema decision')
}

function migrate(driver: Driver): void {
  return match(driver)
    .with('postgres', runPgMigration)
    .with('mysql', () => unimplemented('mysql driver intentionally unsupported'))
    .exhaustive()
}

function parseDigit(input: string): number {
  const parsed = Number.parseInt(input, 10)
  if (Number.isNaN(parsed)) {
    return unreachable('caller pre-validated')
  }
  return parsed
}
```

Each accepts an optional `message?: string` that's appended to the default. Also re-exported from the flat `massaman` barrel.
