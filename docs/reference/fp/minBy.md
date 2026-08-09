# minBy (Functional Programming)

> [!NOTE]
> **Direct proxy** — re-exported verbatim from [`es-toolkit`](https://es-toolkit.dev/fp/reference/minBy.html).
> Implementation, edge cases, and performance behavior are owned upstream.
> This page mirrors the upstream documentation at the pinned version; see the linked source for the authoritative copy.

Creates a function that returns the value with the smallest computed score. Use it with [`pipe`](./pipe.md).

```typescript
const result = pipe(array, minBy(getValue));
```

::: info

Prefer the original es-toolkit [`minBy`](../../reference/array/minBy.md) in ordinary code. Use this `fp` variant when composing transformations with [`pipe`](./pipe.md).

:::

## Usage

`minBy` calls `getValue` for each value in the piped array and returns the value with the smallest result. If the array is empty, it returns `undefined`.

```typescript
import { minBy, pipe } from 'es-toolkit/fp';

pipe(
  [{ score: 10 }, { score: 30 }, { score: 20 }],
  minBy(item => item.score)
); // => { score: 10 }
```

#### Parameters

- `getValue` (`(item: T) => number`): The function that returns the value used for comparison.

#### Returns

(`(array: readonly T[]) => T | undefined`): A function that maps a `readonly T[]` to the minimum item, or `undefined`.
