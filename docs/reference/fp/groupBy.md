# groupBy (Functional Programming)

> [!NOTE]
> **Direct proxy** — re-exported verbatim from [`es-toolkit`](https://es-toolkit.dev/fp/reference/groupBy.html).
> Implementation, edge cases, and performance behavior are owned upstream.
> This page mirrors the upstream documentation at the pinned version; see the linked source for the authoritative copy.

Creates a function that groups values by a key. Use it with [`pipe`](./pipe.md).

```typescript
const result = pipe(array, groupBy(getKey));
```

::: info

Prefer the original es-toolkit [`groupBy`](../../reference/array/groupBy.md) in ordinary code. Use this `fp` variant when composing transformations with [`pipe`](./pipe.md).

:::

## Usage

`groupBy` calls `getKey` for each value in the piped array and returns an object whose keys are the returned keys and whose values are arrays of matching items.

```typescript
import { groupBy, pipe } from 'es-toolkit/fp';

pipe(
  ['one', 'two', 'three'],
  groupBy(word => word.length)
); // => { 3: ['one', 'two'], 5: ['three'] }
```

#### Parameters

- `getKey` (`(item: T) => K`): The function that returns the group key for each value.

#### Returns

(`(array: readonly T[]) => Record<K, T[]>`): A function that maps a `readonly T[]` to grouped arrays by key.
