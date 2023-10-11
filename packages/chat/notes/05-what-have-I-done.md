<p align='left'>
 <a href="04-mikes-ts-setup.md">◀ Back: Mike's Professional-Grade TS Setup</a>
</p>

---

# What have I done?

Let's look closely at what we just did, and make sure we understand all of the parts that make up the whole

## In my `tsconfig.json` what exactly is "strict"?

The source of truth is [here](https://github.com/microsoft/TypeScript/blob/dc8952d308c9de815e95bdb96727a9cbaedc9adb/src/compiler/commandLineParser.ts#L594), and it's important to know that this is a moving target

### `noImplicitAny`

- “Default to explicit” instead of “default to loose”
- This is not in any way restrictive, it only requires that we be explicit about `any`

### `noImplicitThis`

- There are certain places where `this` is important and non-inferrable
  > Example: addEventListener
  >
  > ```ts
  > my_element.addEventListener('click', function (e) {
  >   // logs the className of my_element
  >   console.log(this.className);
  >   // logs `true`
  >   console.log(e.currentTarget === this);
  > });
  > ```

### `alwaysStrict`

- JS “use strict”
- necessary for modern JS language features

### `strictBindCallApply`

- Bind, call, apply used to return very loosely-typed functions.
- No good reasons I'm aware of to disable this

### `strictNullChecks`

- Without this enabled, primitive types allow `null` values
- Leaving this disabled makes truthy/falsy type guards much less useful
- This is asking for runtime errors that could otherwise be caught at build time

### `strictFunctionTypes`

- Some common-sense loopholes around matching function arguments during type-checking function values
- [example](https://www.typescriptlang.org/play?#code/IYIwzgLgTsDGEAJYBthjAgggOwJYFthkEBvAKAUoQAcBXEZXWBUSGeBKAU2ABMB7bMgCeCZFwDmYAFwJstfCC5QA3GQC+ZFGgwBhYIi4APCF2y8MOAkVIUq4qQgC8CACxqqNWlCgAKAJSksIJg-OIAdMj8Er4A5HQ+sf6amtroCAAi0QjGpuaWeITE5J4OGC7udpQgwFAA1gFBIWFckdFxtQBmSSlkZLxc2txiXIidAIyyvkayVkWBTgB8CABu-Li8agNDXCNjAExTM5nRC8trG1uDqMPiYwDMR7L6EGer65tkE84InfsqlAA9ICEABRHz8KAIADuuAgAAsEABaJFsJgQABitGw8FwggAKsJqFwwF99j8JgCEMCEAB5Opkin3Kk08FQSFAA)
  > ```ts
  > abstract class Animal {
  >   public abstract readonly legs: number;
  > }
  > class Cat extends Animal {
  >   legs = 4;
  >   purr() {
  >     console.log('purr');
  >   }
  > }
  > class Dog extends Animal {
  >   legs = 4;
  >   bark() {
  >     console.log('arf');
  >   }
  > }
  >
  > declare let f1: (x: Animal) => void;
  > declare let f2: (x: Dog) => void;
  > declare let f3: (x: Cat) => void;
  >
  > // Error with --strictFunctionTypes
  > f1 = f2;
  > f2 = f1; // Always ok
  > f2 = f3; // Always error
  > ```

### `strictPropertyInitialization`

- Holds you to your promises around class fields really being “always there” vs. “sometimes undefined”

## Even more strict

### `noUnusedLocals`

- Busts you on unused local variables
- Better to have TS detect this rather than a linter

### `noUnusedParameters`

- Function arguments you don’t use need to be prefixed with \_
- I love this during the “exploration” phase of development b/c it highlights opportunities to simplify API surface

### `noImplicitReturns`

- If any code paths return something explicitly, all code paths must return something explicitly

### `noFallthroughCasesInSwitch`

- I’m ok with this one as being _disabled_, as I find case fall-throughs to be useful, important and easy (enough) to notice while reading code

### `types`

- Instead of pulling in all @types/\*, specify exactly what should be available
- **NOTE:** this is nuanced, and only affects global scope (i.e., window, process) and auto-import.
- _Why I care:_ I don’t want types used exclusively in things like tests to be quite so readily available for accidental use in “app code”

### `stripInternal` (most important for libraries)

- Sometimes you need type information to only be available within a codebase.
- `@internal` JSdoc tag surgically strips out type information for respective symbols

## Don't go viral

There are some compiler options that I _really dislike_ when used in libraries, because they have a high probability of "infecting" any consumer and depriving them from making choices about their own codebase

### `allowSyntheticDefaultImports`

Allows you to import CommonJS modules as if they’re ES modules with a default export

### `esModuleInterop`

Adds some runtime support for CJS/ESM interop, and enables allowSyntheticDefaultImports

### `skipDefaultLibCheck`

This effectively ignores potential breaking changes that stem from your node_modules types mixing with your own types. Particularly if you’re building a library, you need to know that if you “hide” this problem they’ll still “feel” it (and probably need to “skip” too)

### But sometimes we need these, right?

I have never found a good reason to enable these options in well-structured TS code.

`allowSyntheticDefaultImports` and `esModuleInterop` aim to allow patterns like

```ts
import fs from 'fs';
```

in situations where `fs` doesn't actually expose an ES module `export default`. It exports a _namespace_ of filesystem-related functions. Thankfully, even with these flags _both_ disabled, we can still use a namespace import:

```ts
import * as fs from 'fs';
```

Now there are rare situations where some CommonJS code exports a single non-namespace thing in a way like

```ts
// calculator.ts
module.exports = function add(a, b) {
  return a + b;
};
```

add is definitely not a namespace, and

```ts
import * as add from './calculator';
```

WILL NOT WORK. There's a TS-specific pattern that _will work_ though -- it's a little weird, but it doesn't require turning any compiler options on

```ts
import add = require('./calculator');
```

### Is Mike asking me to take on tech debt?

You may be thinking "these don't look like ES modules", and "won't the TS team standardize on ES modules later?"

The answer is: _yes_, but you should think about this the same way that you think about a "legacy" version of Node.js that you need to support

- You shouldn't break consumers yet
- Apps should be the first to adopt new things, followed by libraries that are more conservative

TS modules predate ES modules, but there’s tons of code out there that already uses TS module stuff, and this is one of the most easy to codemod kinds of “tech debt” to incur.

---

<p align='right'>
 <a href="./06-converting-to-ts.md">Next: Converting to TypeScript ▶</a>
</p>
```
