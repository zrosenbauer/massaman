# isSubset (Functional Programming)

> [!NOTE]
> **Direct proxy** — re-exported verbatim from [`es-toolkit`](https://es-toolkit.dev/fp/reference/isSubset.html).
> Implementation, edge cases, and performance behavior are owned upstream.
> This page mirrors the upstream documentation at the pinned version; see the linked source for the authoritative copy.

Creates a function that checks whether the piped array is a subset of another array. Use it with [`pipe`](./pipe.md).

```typescript
const result = pipe(array, isSubset(superset));
```

::: info

Prefer the original es-toolkit [`isSubset`](../../reference/array/isSubset.md) in ordinary code. Use this `fp` variant when composing transformations with [`pipe`](./pipe.md).

:::

## Usage

`isSubset` returns `true` when every value in the piped array is present in `superset`.

```typescript
import { isSubset, pipe } from 'es-toolkit/fp';

pipe([1, 2], isSubset([1, 2, 3])); // => true

pipe([1, 4], isSubset([1, 2, 3])); // => false
```

#### Parameters

- `superset` (`readonly T[]`): The array that may contain all values from the piped array.

#### Returns

(`(array: readonly T[]) => boolean`): A function that maps a `readonly T[]` to whether it is a subset.
