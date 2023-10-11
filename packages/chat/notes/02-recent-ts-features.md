<p align='left'>
 <a href="01-project-tour.md">◀ Back: Project Tour</a>
</p>

---

# TS 3.7 -> 4.1: Quick Summary

## Modern JS Language Features

### Optional Chaining (3.7)

Stops running expression if a null or undefined is encountered

- 🚧 **Warning:** adds complexity. Beware of multiple optional links in a single expression
- 🚧 **Warning:** not appropriate to just “power through” nullish values
- 🚧 **Warning:** only short-circuits the expression in question, not any other compound expressions joined by operators

### Nullish Coalescing (3.7)

Useful for fallback defaults, where a user-supplied 0 or ‘’ would have been treated improperly

- 🚧 **Warning:** not the same as ||, due to falsy values that aren’t nullish

### ECMAScript Private Fields (3.8)

```js
class Foo {
  #bar;
}
```

- “hard private” (undetectable from the outside)
- Cannot be overridden by subclasses
- Use WeakMap under the hood, so might perform differently compared to public class fields (not a problem unless you’re on a really hot path)

### Namespace exports (3.8)

```ts
export * as utils from './utils.mjs';
```

### Inference of class field types (4.0)

Types for class fields that are assigned in constructor are inferred, and no longer need an explicit type declaration

## Tuple Types

### Variadic tuple types (4.0)

```ts
type StrStrNumNumBool = [...Strings, ...Numbers, boolean];
```

### Labeled tuple types (4.0)

```ts
function foo(x: [first: string, second: number]) {}
```

## More powerful type aliases and interfaces

### Recursive type aliases (3.7)

JSON can now be typed in a single type alias!

### Recursive conditional types (4.1)

```ts
type ElementType<T> = T extends ReadonlyArray<infer U>
  ? ElementType<U>
  : T;
```

### Template type literals (4.1)

```ts
type Corner = `${'top'|'bottom'}-${'left'|'right'}`;
```

Allows capitalize, uncapitalize, uppercase, lowercase

```ts
type Corner = `${capitalize 'top'|'bottom'}-${'left'|'right'}`;
```

## Editor Experience

### `/** @deprecated \*/` (4.0)

Strikes out symbols in vscode
Support for "assert that this is not deprecated" in tests (we'll see this later)

### `/** @see \*/` (4.1)

- Reference other documentation in JSDoc comments
- You can "jump to definition" just like it's code

## Error and Assertion Handling

### `// @ts-expect-error` (3.9)

- A huge win for negative test cases
- I prefer it nearly always over `// @ts-ignore`

### Unknown on catch clause (4.0)

- A big improvement over `any` error types
- Forces you to deal with `instanceof Error` properly

### Assertion functions (3.7)

Type guards, but based on return/throw instead of returning true/false

```ts
function assertIsArray(val: any): asserts val is any[] {
  if (!Array.isArray(val)) throw new Error(`${val} is not an array`);
}
```

This makes things like tests _much_ easier. The code you want to write for your tests
and the code you need to write to make type-checking happy are now the same thing.

## Typed JS Support

### Declaration files can be generated from `.js` (3.7)

This is a big deal for projects that may not be viable for converting to TS -- they can still offer first-class TS support entirely based on their JSDoc comments

## Modules

### Type-only imports (3.8)

```ts
import type { SomeThing } from './some-module.js';
```

Big win for lazy loading, in situations where you _only_ need to refer to
a package for type information

---

<p align='right'>
 <a href="./03-app-vs-library-concerns.md">Next: App vs. Library Concerns ▶</a>
</p>
