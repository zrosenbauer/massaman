# union (Functional Programming)

> [!NOTE]
> **Direct proxy** — re-exported verbatim from [`es-toolkit`](https://es-toolkit.dev/fp/reference/union.html).
> Implementation, edge cases, and performance behavior are owned upstream.
> This page mirrors the upstream documentation at the pinned version; see the linked source for the authoritative copy.

Creates a function that combines two arrays without duplicate values. Use it with [`pipe`](./pipe.md).

```typescript
const result = pipe(array, union(secondArray));
```

::: info

Prefer the original es-toolkit [`union`](../../reference/array/union.md) in ordinary code. Use this `fp` variant when composing transformations with [`pipe`](./pipe.md).

:::

## Usage

`union` returns unique values from the piped array followed by values from `secondArray` that have not appeared yet.

```typescript
import { pipe, union } from 'es-toolkit/fp';

pipe([1, 2, 2], union([2, 3])); // => [1, 2, 3]
```

#### Parameters

- `secondArray` (`readonly T[]`): The array to combine after the piped array.

#### Returns

(`(array: readonly T[]) => T[]`): A function that maps a `readonly T[]` to the union of both arrays.
