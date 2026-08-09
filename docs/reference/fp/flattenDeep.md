# flattenDeep (Functional Programming)

> [!NOTE]
> **Direct proxy** — re-exported verbatim from [`es-toolkit`](https://es-toolkit.dev/fp/reference/flattenDeep.html).
> Implementation, edge cases, and performance behavior are owned upstream.
> This page mirrors the upstream documentation at the pinned version; see the linked source for the authoritative copy.

Creates a function that recursively flattens nested arrays. Use it with [`pipe`](./pipe.md).

```typescript
const result = pipe(array, flattenDeep());
```

::: info

Prefer the original es-toolkit [`flattenDeep`](../../reference/array/flattenDeep.md) in ordinary code. Use this `fp` variant when composing transformations with [`pipe`](./pipe.md).

:::

## Usage

`flattenDeep` recursively removes every nested array layer from the piped array. It is lazy-capable inside [`pipe`](./pipe.md).

```typescript
import { flattenDeep, pipe } from 'es-toolkit/fp';

pipe([1, [2, [3, [4]]]], flattenDeep()); // => [1, 2, 3, 4]
```

#### Parameters

This function takes no arguments; call it as `flattenDeep()`.

#### Returns

(`(array: readonly T[]) => Array<ExtractNestedArrayType<T>>`): A function that maps a nested array to a deeply flattened array.
