# intersection (Functional Programming)

> [!NOTE]
> **Direct proxy** — re-exported verbatim from [`es-toolkit`](https://es-toolkit.dev/fp/reference/intersection.html).
> Implementation, edge cases, and performance behavior are owned upstream.
> This page mirrors the upstream documentation at the pinned version; see the linked source for the authoritative copy.

Creates a function that keeps values found in another array. Use it with [`pipe`](./pipe.md).

```typescript
const result = pipe(array, intersection(secondArray));
```

::: info

Prefer the original es-toolkit [`intersection`](../../reference/array/intersection.md) in ordinary code. Use this `fp` variant when composing transformations with [`pipe`](./pipe.md).

:::

## Usage

`intersection` keeps values from the piped array that are also present in `secondArray`. It preserves the order of the piped array.

```typescript
import { intersection, pipe } from 'es-toolkit/fp';

pipe([1, 2, 3], intersection([2, 3, 4])); // => [2, 3]
```

#### Parameters

- `secondArray` (`readonly T[]`): The array containing values to keep.

#### Returns

(`(array: readonly T[]) => T[]`): A function that maps a `readonly T[]` to values also found in `secondArray`.
