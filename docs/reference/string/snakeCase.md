# snakeCase

> [!NOTE]
> **Direct proxy** — re-exported verbatim from [`es-toolkit`](https://es-toolkit.dev/reference/string/snakeCase.html).
> Implementation, edge cases, and performance behavior are owned upstream.
> This page mirrors the upstream documentation at the pinned version; see the linked source for the authoritative copy.

Converts a string to snake case.

```typescript
const converted = snakeCase(str);
```

## Usage

### `snakeCase(str)`

Use `snakeCase` when you want to convert a string to snake case. Snake case is a naming convention where each word is written in lowercase and words are connected with underscores (\_).

```typescript
import { snakeCase } from 'es-toolkit/string';

// Basic usage
snakeCase('camelCase'); // 'camel_case'
snakeCase('some whitespace'); // 'some_whitespace'

// Words connected with hyphens or other separators
snakeCase('hyphen-text'); // 'hyphen_text'
snakeCase('PascalCase'); // 'pascal_case'

// Handling consecutive uppercase letters
snakeCase('HTTPRequest'); // 'http_request'
snakeCase('XMLHttpRequest'); // 'xml_http_request'
```

It also correctly handles strings with various separators.

```typescript
import { snakeCase } from 'es-toolkit/string';

// Mixed separators
snakeCase('camelCase-with_mixed.separators'); // 'camel_case_with_mixed_separators'

// With numbers
snakeCase('version2.1.0'); // 'version_2_1_0'

// With special characters
snakeCase('user@email.com'); // 'user_email_com'
```

#### Parameters

- `str` (`string`): The string to convert to snake case.

#### Returns

(`string`): Returns a new string converted to snake case.
