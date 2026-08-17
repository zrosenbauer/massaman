# Philosophy

Massaman is opinionated about how JavaScript should be written, but it does not invent a new world for your application to live in.

## Take what works

Massaman borrows useful ideas from languages, libraries, and tools. We keep the parts that make JavaScript clearer, safer, or easier to compose and leave out the ceremony that does not help.

## Don't rebuild what works

Massaman builds on proven tools whenever they already solve part of the problem. Today, [`es-toolkit`](https://es-toolkit.dev) provides most of the general utilities and [`ts-pattern`](https://github.com/gvergnaud/ts-pattern) provides pattern matching. We will build on other tools when they are the right foundation instead of recreating their work.

## Borrow the good bits from Rust

Rust is the largest influence on Massaman:

- expected failures are returned as `Result` values
- `Ok` and `Err` make success and failure separate cases
- pattern matching can require every case to be handled
- immutable values are the default
- small functions build larger operations through composition

JavaScript does not have Rust's ownership model or compiler guarantees. Massaman uses the parts that translate well and leaves the rest in Rust.

## Practical functional programming

Functional programming here means ordinary code built from values and functions. It does not require category-theory vocabulary or a new runtime.

- **Pure functions by default:** Give a function a value and get a value back.
- **Immutable transformations:** Return new objects and arrays instead of changing the inputs.
- **Errors as values:** Use [`attempt`](./reference/control/attempt.md) and [`attemptAsync`](./reference/control/attemptAsync.md) to turn unsafe boundaries into [`Result`](./concepts/result.md).
- **Composition over intermediate state:** Build operations with [`pipe`](./reference/fp/pipe.md), [`flow`](./reference/function/flow.md), and other functions.
- **Exhaustive branching when it matters:** Use [`match`](./reference/match/match.md) when the cases represent the domain. A simple `if` can stay an `if`.
- **Functions over classes:** Massaman's own APIs favor functions and closures over inheritance and object lifecycles.

Some utilities, such as memoization and debouncing, need internal state. That state stays inside the utility and does not mutate the values passed to it.

## A utility library, not a framework

Massaman uses ordinary functions, values, and promises. You can adopt one helper, one subpath, or the full programming model without restructuring the application around a runtime.

The API works in JavaScript. TypeScript adds narrowing and exhaustiveness checks where it can.

> [!TIP]
> [Effect](https://effect.website) is excellent when a team wants effects, services, concurrency, retries, and resource management in one typed system. Massaman has a smaller job: make everyday JavaScript more functional without taking over the application.
