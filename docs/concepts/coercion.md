# Coercion

`massaman/conversion` is the answer to "I have an `unknown` and I want a `number`". The functions there coerce inputs through a deterministic, well-specified rule — no silent `NaN`, no `parseInt`-style surprises.

If you want **validation** (reject bad inputs), use a [predicate](../reference/predicate/) instead. If you want **structured parsing** (validate against a schema), reach for a schema library.

## When to coerce

- You're reading from an environment where the type is genuinely unknown — `process.env`, URL query strings, JSON without a schema, form fields.
- You want a single, named operation rather than a chain of `Number(x) || 0` / `String(x ?? '')` idioms scattered through the codebase.
- You want the coercion rule to be explicit and inspectable, not implicit JavaScript coercion.

## The functions

```typescript
import {
  toNumber,
  toInteger,
  toFinite,
  toBoolean,
  toString,
  toArray,
  toError,
  stringify,
} from 'massaman/conversion'
```

| Function | Returns | Notes |
|---|---|---|
| `toNumber(x)` | `number` | `parseFloat`-style: `'42'` → `42`, `'42px'` → `NaN`, `null`/`undefined` → `0` |
| `toInteger(x)` | `number` | Truncates toward zero; `0` for `NaN` |
| `toFinite(x)` | `number` | `MAX_VALUE` / `MIN_VALUE` for `Infinity`; `0` for `NaN` |
| `toBoolean(x)` | `boolean` | `true` for "true", "1", `1`, `true`; `false` for everything else |
| `toString(x)` | `string` | `String(x)` semantics, but `null`/`undefined` → `''` |
| `toArray(x)` | `T[]` | wraps a non-array in `[x]`; passes arrays through |
| `toError(x)` | `Error` | normalizes anything to `Error` (same rule as `err()`) |
| `stringify(x)` | `string` | safe JSON stringify — handles circular refs, BigInt, etc. |

## Coerce vs validate vs parse

```typescript
// Coerce — best-effort, no failure
import { toNumber } from 'massaman/conversion'
toNumber('42')   // 42
toNumber('foo')  // NaN — caller's job to check

// Validate — predicate, no transformation
import { isFiniteNumber } from 'massaman/predicate'
isFiniteNumber(42)    // true
isFiniteNumber('42')  // false (it's still a string)

// Parse — schema, with failure as a value
import { attempt } from 'massaman'
const result = attempt(() => z.number().parse(input))  // Result<number>
```

Three different jobs. Don't reach for `toNumber` to do the parse — it'll silently produce `NaN` and your downstream code will be confused.

## Pattern: coerce, then validate

The common case for `unknown` input:

```typescript
import { toNumber } from 'massaman/conversion'
import { isFiniteNumber } from 'massaman/predicate'
import { err, ok, type Result } from 'massaman'

function readPort(raw: unknown): Result<number> {
  const n = toNumber(raw)
  return isFiniteNumber(n) && n >= 0 && n <= 65535
    ? ok(n)
    : err(`invalid port: ${String(raw)}`)
}
```

Coerce to the right type, then validate the value. Failure becomes an `Err` carrying a useful message.

## `toError` and `stringify`

These two are used internally by `massaman/control` to normalize thrown values. They're exported because they're useful directly:

```typescript
import { toError, stringify } from 'massaman/conversion'

// toError — always returns an Error
toError('boom')              // Error('boom')
toError(new Error('boom'))   // Error('boom') (passthrough)
toError({ code: 42 })        // Error('{"code":42}', { cause: { code: 42 } })

// stringify — JSON.stringify that handles weirdness
stringify({ a: 1n })            // '{"a":"1"}' (BigInt → string)
stringify({ a: undefined })     // '{}' (undefined keys dropped)
const o = {}; o.self = o
stringify(o)                    // '{"self":"[Circular]"}' (no throw)
```

## Related

- [`toNumber`](../reference/conversion/toNumber.md), [`toInteger`](../reference/conversion/toInteger.md), [`toFinite`](../reference/conversion/toFinite.md), [`toBoolean`](../reference/conversion/toBoolean.md), [`toString`](../reference/conversion/toString.md), [`toArray`](../reference/conversion/toArray.md), [`toError`](../reference/conversion/toError.md), [`stringify`](../reference/conversion/stringify.md)
- [Predicates concept guide](./predicates.md)
- [Result type concept guide](./result.md)
