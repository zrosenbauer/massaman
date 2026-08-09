# difference (Functional Programming)

> [!NOTE]
> **Direct proxy** — re-exported verbatim from [`es-toolkit`](https://es-toolkit.dev/fp/reference/difference.html).
> Implementation, edge cases, and performance behavior are owned upstream.
> This page mirrors the upstream documentation at the pinned version; see the linked source for the authoritative copy.

Creates a function that excludes values found in another array. Use it with [`pipe`](./pipe.md).

```typescript
const result = pipe(array, difference(secondArray));
```

::: info

Prefer the original es-toolkit [`difference`](../../reference/array/difference.md) in ordinary code. Use this `fp` variant when composing transformations with [`pipe`](./pipe.md).

:::

## Usage

`difference` keeps values from the piped array that are not present in `secondArray`. It preserves the order of the piped array.

```typescript
import { difference, pipe } from 'es-toolkit/fp';

pipe([1, 2, 3, 4], difference([2, 4])); // => [1, 3]
```

#### Parameters

- `secondArray` (`readonly T[]`): The array containing values to exclude.

#### Returns

(`(array: readonly T[]) => T[]`): A function that maps a `readonly T[]` to values not found in `secondArray`.
