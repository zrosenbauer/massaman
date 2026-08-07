# maxBy (Functional Programming)

> [!NOTE]
> **Direct proxy** — re-exported verbatim from [`es-toolkit`](https://es-toolkit.dev/fp/reference/maxBy.html).
> Implementation, edge cases, and performance behavior are owned upstream.
> This page mirrors the upstream documentation at the pinned version; see the linked source for the authoritative copy.

Creates a function that returns the value with the largest computed score. Use it with [`pipe`](./pipe.md).

```typescript
const result = pipe(array, maxBy(getValue));
```

::: info

Prefer the original es-toolkit [`maxBy`](../../reference/array/maxBy.md) in ordinary code. Use this `fp` variant when composing transformations with [`pipe`](./pipe.md).

:::

## Usage

`maxBy` calls `getValue` for each value in the piped array and returns the value with the largest result. If the array is empty, it returns `undefined`.

```typescript
import { maxBy, pipe } from 'es-toolkit/fp';

pipe(
  [{ score: 10 }, { score: 30 }, { score: 20 }],
  maxBy(item => item.score)
); // => { score: 30 }
```

#### Parameters

- `getValue` (`(item: T) => number`): The function that returns the value used for comparison.

#### Returns

(`(array: readonly T[]) => T | undefined`): A function that maps a `readonly T[]` to the maximum item, or `undefined`.
