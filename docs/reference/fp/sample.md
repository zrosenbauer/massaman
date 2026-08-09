# sample (Functional Programming)

> [!NOTE]
> **Direct proxy** — re-exported verbatim from [`es-toolkit`](https://es-toolkit.dev/fp/reference/sample.html).
> Implementation, edge cases, and performance behavior are owned upstream.
> This page mirrors the upstream documentation at the pinned version; see the linked source for the authoritative copy.

Creates a function that returns a random value from an array. Use it with [`pipe`](./pipe.md).

```typescript
const result = pipe(array, sample());
```

::: info

Prefer the original es-toolkit [`sample`](../../reference/array/sample.md) in ordinary code. Use this `fp` variant when composing transformations with [`pipe`](./pipe.md).

:::

## Usage

`sample` returns one random value from the piped array.

```typescript
import { pipe, sample } from 'es-toolkit/fp';

const value = pipe([1, 2, 3], sample());
// value is one of 1, 2, or 3.
```

#### Parameters

This function takes no arguments; call it as `sample()`.

#### Returns

(`(array: readonly T[]) => T`): A function that maps a `readonly T[]` to one random value.
