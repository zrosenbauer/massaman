# chunkBy (Functional Programming)

> [!NOTE]
> **Direct proxy** — re-exported verbatim from [`es-toolkit`](https://es-toolkit.dev/fp/reference/chunkBy.html).
> Implementation, edge cases, and performance behavior are owned upstream.
> This page mirrors the upstream documentation at the pinned version; see the linked source for the authoritative copy.

Creates a function that splits adjacent values whenever a key changes. Use it with [`pipe`](./pipe.md).

```typescript
const result = pipe(array, chunkBy(iteratee));
```

::: info

This helper is specific to `es-toolkit/fp`. Use it when you want this operation as part of a [`pipe`](./pipe.md) pipeline.

:::

## Usage

`chunkBy` walks the piped array from left to right and groups adjacent values while `iteratee` returns the same key. A new chunk starts when the key changes.

```typescript
import { chunkBy, pipe } from 'es-toolkit/fp';

pipe(
  [1, 1, 2, 2, 1],
  chunkBy(value => value)
); // => [[1, 1], [2, 2], [1]]
```

#### Parameters

- `iteratee` (`(value: T) => unknown`): The function that returns the grouping key for each value.

#### Returns

(`(array: readonly T[]) => T[][]`): A function that maps a `readonly T[]` to chunks of adjacent values.
