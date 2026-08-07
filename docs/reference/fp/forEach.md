# forEach (Functional Programming)

> [!NOTE]
> **Direct proxy** — re-exported verbatim from [`es-toolkit`](https://es-toolkit.dev/fp/reference/forEach.html).
> Implementation, edge cases, and performance behavior are owned upstream.
> This page mirrors the upstream documentation at the pinned version; see the linked source for the authoritative copy.

Creates a function that runs a callback for each value and returns the input array. Use it with [`pipe`](./pipe.md).

```typescript
const result = pipe(array, forEach(callback));
```

::: info

This helper is specific to `es-toolkit/fp`. Use it when you want this operation as part of a [`pipe`](./pipe.md) pipeline.

:::

## Usage

`forEach` is useful as a side-effect step in a pipeline. It calls `callback` for each value and passes the original array through. Inside [`pipe`](./pipe.md), it is lazy-capable when adjacent lazy operations can stop early.

```typescript
import { forEach, pipe } from 'es-toolkit/fp';

const values: number[] = [];

pipe(
  [1, 2, 3],
  forEach(value => values.push(value))
); // => [1, 2, 3]
values; // => [1, 2, 3]
```

#### Parameters

- `callback` (`(value: T, index: number) => void`): The function to run for each value.

#### Returns

(`(array: readonly T[]) => readonly T[]`): A function that returns the same array after running the callback.
