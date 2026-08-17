# unzip (Functional Programming)

> [!NOTE]
> **Direct proxy** — re-exported verbatim from [`es-toolkit`](https://es-toolkit.dev/fp/reference/unzip.html).
> Implementation, edge cases, and performance behavior are owned upstream.
> This page mirrors the upstream documentation at the pinned version; see the linked source for the authoritative copy.

Creates a function that regroups zipped arrays by position. Use it with [`pipe`](./pipe.md).

```typescript
const result = pipe(array, unzip());
```

::: info

Prefer the original es-toolkit [`unzip`](../../reference/array/unzip.md) in ordinary code. Use this `fp` variant when composing transformations with [`pipe`](./pipe.md).

:::

## Usage

`unzip` takes an array of grouped values and returns arrays that collect the values at each position.

The returned array's length matches the longest nested array, and missing positions from shorter arrays are filled with `undefined`.

```typescript
import { pipe, unzip } from 'es-toolkit/fp';

pipe(
  [
    [1, 'a'],
    [2, 'b'],
  ],
  unzip()
); // => [[1, 2], ['a', 'b']]
```

#### Parameters

This function takes no arguments; call it as `unzip()`.

#### Returns

(`(zipped: ReadonlyArray<[...T]>) => Unzip<T>`): A function that maps zipped rows to arrays grouped by position.
