# isWeakMap

> [!NOTE]
> **Direct proxy** — re-exported verbatim from [`es-toolkit`](https://es-toolkit.dev/reference/predicate/isWeakMap.html).
> Implementation, edge cases, and performance behavior are owned upstream.
> This page mirrors the upstream documentation at the pinned version; see the linked source for the authoritative copy.

Checks if a given value is a `WeakMap` instance.

```typescript
const result = isWeakMap(value);
```

## Usage

### `isWeakMap(value)`

Use `isWeakMap` when you want to check if a value is a `WeakMap` instance. `WeakMap` is a key-value store with weak references to objects as keys, useful for preventing memory leaks.

```typescript
import { isWeakMap } from 'es-toolkit/predicate';

// WeakMap instances
const weakMap1 = new WeakMap();
const weakMap2 = new WeakMap([[{}, 'value']]);

console.log(isWeakMap(weakMap1)); // true
console.log(isWeakMap(weakMap2)); // true

// Non-WeakMap values
console.log(isWeakMap(new Map())); // false
console.log(isWeakMap(new Set())); // false
console.log(isWeakMap(new WeakSet())); // false
console.log(isWeakMap({})); // false
console.log(isWeakMap([])); // false
console.log(isWeakMap(null)); // false
console.log(isWeakMap(undefined)); // false
```

#### Parameters

- `value` (`unknown`): The value to check if it's a WeakMap instance.

#### Returns

(`value is WeakMap<WeakKey, any>`): Returns `true` if the value is a WeakMap instance, `false` otherwise.
