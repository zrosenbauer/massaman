# length (Functional Programming)

> [!NOTE]
> **Direct proxy** — re-exported verbatim from [`es-toolkit`](https://es-toolkit.dev/fp/reference/length.html).
> Implementation, edge cases, and performance behavior are owned upstream.
> This page mirrors the upstream documentation at the pinned version; see the linked source for the authoritative copy.

Creates a function that returns the length of an array. Use it with [`pipe`](./pipe.md).

```typescript
const result = pipe(array, length());
```

::: info

This helper is specific to `es-toolkit/fp`. Use it when you want this operation as part of a [`pipe`](./pipe.md) pipeline.

:::

## Usage

`length` returns the number of values in the piped array.

```typescript
import { length, pipe } from 'es-toolkit/fp';

pipe([1, 2, 3], length()); // => 3
```

#### Parameters

This function takes no arguments; call it as `length()`.

#### Returns

(`(array: readonly T[]) => number`): A function that maps a `readonly T[]` to its length.
