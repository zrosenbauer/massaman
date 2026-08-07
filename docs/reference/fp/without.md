# without (Functional Programming)

> [!NOTE]
> **Direct proxy** — re-exported verbatim from [`es-toolkit`](https://es-toolkit.dev/fp/reference/without.html).
> Implementation, edge cases, and performance behavior are owned upstream.
> This page mirrors the upstream documentation at the pinned version; see the linked source for the authoritative copy.

Creates a function that removes specific values from an array. Use it with [`pipe`](./pipe.md).

```typescript
const result = pipe(array, without(...values));
```

::: info

Prefer the original es-toolkit [`without`](../../reference/array/without.md) in ordinary code. Use this `fp` variant when composing transformations with [`pipe`](./pipe.md).

:::

## Usage

`without` removes every value from the piped array that is equal to one of `values`. It is lazy-capable inside [`pipe`](./pipe.md).

```typescript
import { pipe, without } from 'es-toolkit/fp';

pipe([1, 2, 3, 2], without(2)); // => [1, 3]
```

#### Parameters

- `values` (`T[]`): The values to remove from the piped array.

#### Returns

(`(array: readonly T[]) => T[]`): A function that maps a `readonly T[]` to an array without `values`.
