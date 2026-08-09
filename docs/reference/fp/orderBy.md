# orderBy (Functional Programming)

> [!NOTE]
> **Direct proxy** — re-exported verbatim from [`es-toolkit`](https://es-toolkit.dev/fp/reference/orderBy.html).
> Implementation, edge cases, and performance behavior are owned upstream.
> This page mirrors the upstream documentation at the pinned version; see the linked source for the authoritative copy.

Creates a function that sorts objects by criteria and sort orders. Use it with [`pipe`](./pipe.md).

```typescript
const result = pipe(array, orderBy(criteria, orders));
```

::: info

Prefer the original es-toolkit [`orderBy`](../../reference/array/orderBy.md) in ordinary code. Use this `fp` variant when composing transformations with [`pipe`](./pipe.md).

:::

## Usage

`orderBy` sorts the piped array by each criterion in order. Each order controls whether the matching criterion is sorted ascending or descending.

```typescript
import { orderBy, pipe } from 'es-toolkit/fp';

const users = [
  { name: 'a', age: 2 },
  { name: 'b', age: 1 },
];

pipe(users, orderBy(['age'], ['asc'])); // => [{ name: 'b', age: 1 }, { name: 'a', age: 2 }]
```

#### Parameters

- `criteria` (`Array<((item: T) => unknown) | keyof T>`): The object keys and/or selector functions used for comparison.
- `orders` (`Array<'asc' | 'desc'>`): The sort order for each criterion.

#### Returns

(`(array: readonly T[]) => T[]`): A function that maps a `readonly T[]` to a new, sorted array.
