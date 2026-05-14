# Predicates

A predicate is a function from a value to a boolean. In `massaman`, predicates do two things:

1. **Filter and check** — pass them to `filter`, `partition`, `every`, `some`.
2. **Narrow types** — when written as a type guard (`x is T`), they narrow inside the truthy branch of an `if`.

`massaman/predicate` is most of `es-toolkit/predicate` plus originals that improve type-narrowing for common shapes (`isArray`, `isEmpty`, `isObject`) and combinators for building predicates from predicates (`both`, `either`, `allPass`, `anyPass`).

## Type guards

The es-toolkit predicates are all type guards:

```typescript
import { isString, isNil, isNumber } from 'massaman/predicate'

function process(input: unknown) {
  if (isString(input)) {
    // input is string here
    return input.toUpperCase()
  }
  if (isNumber(input)) {
    // input is number here
    return input.toFixed(2)
  }
  if (isNil(input)) {
    // input is null | undefined here
    return 'no value'
  }
}
```

## Variadic narrowing

`massaman`'s [`isArray`](../reference/predicate/isArray.md) narrows to a stronger type than the built-in:

```typescript
import { isArray } from 'massaman/predicate'

function process(input: string | string[]) {
  if (isArray(input)) {
    // input is string[]  — preserved item type
    return input.join(', ')
  }
  return input
}
```

The built-in `Array.isArray` would narrow to `any[]`, losing the item type. `massaman/predicate/isArray` keeps it.

## Combinators

Build predicates from predicates.

```typescript
import { both, either, allPass, anyPass } from 'massaman/predicate'
import { isString, isNumber, isNil } from 'massaman/predicate'

// both — true when BOTH predicates pass
const isNonEmptyString = both(isString, (s) => s.length > 0)

// either — true when EITHER predicate passes
const isStringOrNumber = either(isString, isNumber)

// allPass — n-ary `both`
const isValidUser = allPass([
  (u) => isString(u.name),
  (u) => isNumber(u.age),
  (u) => u.age >= 0,
])

// anyPass — n-ary `either`
const isFalsy = anyPass([isNil, (x) => x === '', (x) => x === 0])
```

Combinators preserve narrowing when the underlying predicates are type guards.

## Predicates as pattern matchers

The bridge between `massaman/predicate` and `ts-pattern` is `P.when`:

```typescript
import { match, P } from 'massaman'
import { isEmpty } from 'massaman/predicate'

match(value)
  .with(P.when(isEmpty), () => 'empty')
  .with(P.array(P.number), (xs) => `${xs.length} numbers`)
  .otherwise(() => 'something else')
```

Any predicate works inside `P.when`, including the combinators above.

## `isEmpty` vs `isNotEmpty`

`isEmpty` is true for `null`, `undefined`, `''`, `[]`, `{}`, `new Map()`, `new Set()`. `isNotEmpty` is the inverse. Use these instead of hand-rolled length/key checks — they handle every container type uniformly and narrow accurately.

```typescript
import { isEmpty, isNotEmpty } from 'massaman/predicate'

isEmpty('')        // true
isEmpty([])        // true
isEmpty({})        // true
isEmpty(new Map()) // true
isEmpty(null)      // true
isEmpty('hi')      // false
```

## Related

- [`isString`](../reference/predicate/isString.md), [`isNumber`](../reference/predicate/isNumber.md), [`isNil`](../reference/predicate/isNil.md), [`isArray`](../reference/predicate/isArray.md), [`isEmpty`](../reference/predicate/isEmpty.md), [`isObject`](../reference/predicate/isObject.md)
- [`both`](../reference/predicate/both.md), [`either`](../reference/predicate/either.md), [`allPass`](../reference/predicate/allPass.md), [`anyPass`](../reference/predicate/anyPass.md)
- [Pattern matching concept guide](./match.md)
