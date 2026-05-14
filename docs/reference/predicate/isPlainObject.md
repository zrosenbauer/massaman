# isPlainObject

> [!NOTE]
> **Direct proxy** — re-exported verbatim from [`es-toolkit`](https://es-toolkit.dev/reference/predicate/isPlainObject.html).
> Implementation, edge cases, and performance behavior are owned upstream.
> This page mirrors the upstream documentation at the pinned version; see the linked source for the authoritative copy.

Checks if a value is a plain object.

```typescript
const result = isPlainObject(value);
```

## Usage

### `isPlainObject(value)`

Use `isPlainObject` when you want to check if a value is a plain object. A plain object is an object created with an object literal (`{}`) or the `Object` constructor. Class instances, arrays, or other special objects are not plain objects.

```typescript
import { isPlainObject } from 'es-toolkit/predicate';

// Plain objects
console.log(isPlainObject({})); // true
console.log(isPlainObject({ name: 'John', age: 30 })); // true
console.log(isPlainObject(Object.create(null))); // true
console.log(isPlainObject(new Object())); // true

// Non-plain objects
console.log(isPlainObject([])); // false (array)
console.log(isPlainObject(new Date())); // false (Date object)
console.log(isPlainObject(new Set())); // false (Set object)
console.log(isPlainObject(new Map())); // false (Map object)
console.log(isPlainObject(null)); // false (null)
console.log(isPlainObject(42)); // false (number)
console.log(isPlainObject('hello')); // false (string)

// Class instances
class MyClass {}
console.log(isPlainObject(new MyClass())); // false
```

It's useful when serializing data or validating configuration objects.

```typescript
function processConfig(config: unknown) {
  if (isPlainObject(config)) {
    // config is now narrowed to Record<PropertyKey, any>
    console.log('Valid configuration object');
    Object.keys(config).forEach(key => {
      console.log(`${key}: ${config[key]}`);
    });
  } else {
    throw new Error('Configuration must be a plain object');
  }
}
```

#### Parameters

- `value` (`unknown`): The value to check if it's a plain object.

#### Returns

(`value is Record<PropertyKey, any>`): Returns `true` if the value is a plain object, `false` otherwise.

## Performance Comparison

|                   | [Bundle Size](https://es-toolkit.dev/bundle-size.html) | [Runtime Performance](https://es-toolkit.dev/performance.html) |
| ----------------- | ----------------------------------- | ------------------------------------------- |
| es-toolkit        | 279 bytes (82.4% smaller)           | 1,505,684 times (1.70× faster)              |
| es-toolkit/compat | 435 bytes (72.5% smaller)           | 2,013,760 times (2.28× faster)              |
| lodash-es         | 1,586 bytes                         | 882,669 times                               |
