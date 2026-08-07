# uniq (Functional Programming)

> [!NOTE]
> **Direct proxy** — re-exported verbatim from [`es-toolkit`](https://es-toolkit.dev/fp/reference/uniq.html).
> Implementation, edge cases, and performance behavior are owned upstream.
> This page mirrors the upstream documentation at the pinned version; see the linked source for the authoritative copy.

Creates a function that removes duplicate values from an array. Use it with [`pipe`](./pipe.md).

```typescript
const result = pipe(array, uniq());
```

::: info

Prefer the original es-toolkit [`uniq`](../../reference/array/uniq.md) in ordinary code. Use this `fp` variant when composing transformations with [`pipe`](./pipe.md).

:::

## Usage

`uniq` returns a new array containing only unique values, preserving the order of first occurrence. Equality follows `SameValueZero` (the semantics of `Set`).

```typescript
import { pipe, uniq } from 'es-toolkit/fp';

pipe([1, 2, 2, 3, 3, 3], uniq()); // => [1, 2, 3]

// Order of first occurrence is preserved.
pipe([3, 1, 2, 1, 3], uniq()); // => [3, 1, 2]
```

#### Parameters

This function takes no arguments; call it as `uniq()`.

#### Returns

(`(array: readonly T[]) => T[]`): A function that maps a `readonly T[]` to a new, duplicate-free `T[]`.
