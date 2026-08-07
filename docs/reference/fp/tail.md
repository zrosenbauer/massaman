# tail (Functional Programming)

> [!NOTE]
> **Direct proxy** — re-exported verbatim from [`es-toolkit`](https://es-toolkit.dev/fp/reference/tail.html).
> Implementation, edge cases, and performance behavior are owned upstream.
> This page mirrors the upstream documentation at the pinned version; see the linked source for the authoritative copy.

Creates a function that returns all values except the first one. Use it with [`pipe`](./pipe.md).

```typescript
const result = pipe(array, tail());
```

::: info

Prefer the original es-toolkit [`tail`](../../reference/array/tail.md) in ordinary code. Use this `fp` variant when composing transformations with [`pipe`](./pipe.md).

:::

## Usage

`tail` returns a new array without the first value of the piped array.

```typescript
import { pipe, tail } from 'es-toolkit/fp';

pipe([1, 2, 3], tail()); // => [2, 3]
```

#### Parameters

This function takes no arguments; call it as `tail()`.

#### Returns

(`(array: readonly T[]) => T[]`): A function that maps a `readonly T[]` to all values except the first one.
