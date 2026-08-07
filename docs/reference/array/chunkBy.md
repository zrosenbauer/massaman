# chunkBy

> [!NOTE]
> **Direct proxy** — re-exported verbatim from [`es-toolkit`](https://github.com/toss/es-toolkit/blob/main/src/array/chunkBy.ts).
> Implementation, edge cases, and performance behavior are owned upstream.
> Unlike our other proxy pages, this one is hand-written: upstream exports `chunkBy` from
> `es-toolkit/array` but has not published a reference page for it, so we mirror its source
> documentation instead. See [`docs/_meta/upstream-versions.json`](../../_meta/upstream-versions.json).

Splits an array into chunks of consecutive elements that share the same key.

```typescript
const chunked = chunkBy(arr, iteratee)
```

## Usage

### `chunkBy(arr, iteratee)`

Walking left to right, each element's key is derived by `iteratee`. Whenever the key differs
from the previous element's key, a new chunk is started; otherwise the element is appended to
the current chunk. Keys are compared with `!==` (strict inequality), so equal primitives stay
together while distinct object references always start a new chunk.

Unlike [`chunk`](./chunk.md), which splits by a fixed size, `chunkBy` splits by a boundary
condition, keeping runs of same-keyed elements together. Reach for it when the grouping is
positional rather than global — collapsing repeated log levels, segmenting a timeline by
status, or batching sorted rows by their sort key.

```typescript
import { chunkBy } from 'massaman'
// or:  import { chunkBy } from 'massaman/array'

// Group consecutive equal numbers
chunkBy([1, 1, 2, 3, 3, 3], (value) => value)
// Returns: [[1, 1], [2], [3, 3, 3]]

// Group consecutive words by their length
chunkBy(['a', 'b', 'cd', 'ef', 'g'], (word) => word.length)
// Returns: [['a', 'b'], ['cd', 'ef'], ['g']]
```

Note that only *consecutive* runs are grouped. Non-adjacent elements sharing a key land in
separate chunks — use [`groupBy`](./groupBy.md) when you want a global grouping.

```typescript
chunkBy([1, 2, 1], (value) => value)
// Returns: [[1], [2], [1]] — not [[1, 1], [2]]
```

#### Parameters

- `arr` (`readonly T[]`): The array to split into chunks.
- `iteratee` (`(value: T) => unknown`): A function that derives the comparison key for each element.

#### Returns

(`T[][]`): A two-dimensional array where each sub-array is a run of consecutive elements that
produced the same key.

## Examples

```typescript
import { chunkBy } from 'massaman/array'

const entries = [
  { level: 'info', msg: 'boot' },
  { level: 'info', msg: 'ready' },
  { level: 'warn', msg: 'retrying' },
  { level: 'info', msg: 'recovered' },
]

chunkBy(entries, (entry) => entry.level)
// Returns:
// [
//   [{ level: 'info', msg: 'boot' }, { level: 'info', msg: 'ready' }],
//   [{ level: 'warn', msg: 'retrying' }],
//   [{ level: 'info', msg: 'recovered' }],
// ]
```

A data-last version for use with `pipe` is available from [`massaman/fp`](../fp/chunkBy.md).
