# isSubsetWith (Functional Programming)

> [!NOTE]
> **Direct proxy** — re-exported verbatim from [`es-toolkit`](https://es-toolkit.dev/fp/reference/isSubsetWith.html).
> Implementation, edge cases, and performance behavior are owned upstream.
> This page mirrors the upstream documentation at the pinned version; see the linked source for the authoritative copy.

Creates a function that checks subset membership using a custom equality function. Use it with [`pipe`](./pipe.md).

```typescript
const result = pipe(array, isSubsetWith(superset, areItemsEqual));
```

::: info

Prefer the original es-toolkit [`isSubsetWith`](../../reference/array/isSubsetWith.md) in ordinary code. Use this `fp` variant when composing transformations with [`pipe`](./pipe.md).

:::

## Usage

`isSubsetWith` returns `true` when every value in the piped array matches at least one value in `superset` according to `areItemsEqual`.

```typescript
import { isSubsetWith, pipe } from 'es-toolkit/fp';

pipe(
  [{ id: 1 }],
  isSubsetWith([{ id: 1 }, { id: 2 }], (a, b) => a.id === b.id)
); // => true
```

#### Parameters

- `superset` (`readonly T[]`): The array that may contain all values from the piped array.
- `areItemsEqual` (`(item: T, other: T) => boolean`): The function that decides whether two values are equal.

#### Returns

(`(array: readonly T[]) => boolean`): A function that maps a `readonly T[]` to whether it is a subset.
