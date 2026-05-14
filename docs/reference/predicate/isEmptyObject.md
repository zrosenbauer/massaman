# isEmptyObject

> [!NOTE]
> **Direct proxy** — re-exported verbatim from [`es-toolkit`](https://es-toolkit.dev/reference/predicate/isEmptyObject.html).
> Implementation, edge cases, and performance behavior are owned upstream.
> This page mirrors the upstream documentation at the pinned version; see the linked source for the authoritative copy.

Checks if a plain object has no properties (`{}`).

```typescript
const result = isEmptyObject(value);
```

## Usage

### `isEmptyObject(value)`

Use `isEmptyObject` when you want to check if a plain object has no properties like `{}`. Returns `false` for other object types like arrays, Map, or Set.

```typescript
import { isEmptyObject } from 'es-toolkit';

// Plain objects with no properties
isEmptyObject({}); // true
isEmptyObject(new Object()); // true
isEmptyObject(Object.create(null)); // true

// Objects with properties
isEmptyObject({ a: 1 }); // false
isEmptyObject({ key: 'value' }); // false

// Non-plain object types
isEmptyObject([]); // false (array)
isEmptyObject(null); // false
isEmptyObject(new Map()); // false
isEmptyObject(new Set()); // false
```

#### Parameters

- `value` (`unknown`): The value to check.

#### Returns

(`value is Record<PropertyKey, never>`): Returns `true` if it's a plain object with no properties, `false` otherwise.
