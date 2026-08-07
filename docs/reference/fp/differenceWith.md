# differenceWith (Functional Programming)

> [!NOTE]
> **Direct proxy** — re-exported verbatim from [`es-toolkit`](https://es-toolkit.dev/fp/reference/differenceWith.html).
> Implementation, edge cases, and performance behavior are owned upstream.
> This page mirrors the upstream documentation at the pinned version; see the linked source for the authoritative copy.

Creates a function that excludes values using a custom equality function. Use it with [`pipe`](./pipe.md).

```typescript
const result = pipe(array, differenceWith(secondArray, areItemsEqual));
```

::: info

Prefer the original es-toolkit [`differenceWith`](../../reference/array/differenceWith.md) in ordinary code. Use this `fp` variant when composing transformations with [`pipe`](./pipe.md).

:::

## Usage

`differenceWith` keeps values from the piped array only when `areItemsEqual` returns `false` for every value in `secondArray`.

```typescript
import { differenceWith, pipe } from 'es-toolkit/fp';

pipe(
  [{ id: 1 }, { id: 2 }],
  differenceWith([{ id: 2 }], (a, b) => a.id === b.id)
); // => [{ id: 1 }]
```

#### Parameters

- `secondArray` (`readonly U[]`): The array containing values to compare against.
- `areItemsEqual` (`(item: T, other: U) => boolean`): The function that decides whether two values are equal.

#### Returns

(`(array: readonly T[]) => T[]`): A function that maps a `readonly T[]` to values not matched by the comparator.
