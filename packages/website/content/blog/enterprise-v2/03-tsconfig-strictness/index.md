---
title: tsconfig strictness
date: "2023-10-27T09:00:00.000Z"
description: |
  We'll look closely at the tsconfig we created for our library, examining a variety of the compiler options we enabled 
course: enterprise-v2
order: 3
---

## What's in the `tsconfig.json`?

Let's look closely at what we just did, and make sure we understand all of the parts that make up the whole

## In my `tsconfig.json` what exactly is "strict"?

The source of truth is [here](https://github.com/microsoft/TypeScript/blob/8d30552c65b9455e280374f329c2cd04c97208f9/src/compiler/commandLineParser.ts#L813), and it's important to know that this is a moving target

### `noImplicitAny`

- “Default to explicit” instead of “default to loose”
- This is not in any way restrictive, it only requires that we be explicit about `any`

### `noImplicitThis`

- There are certain places where `this` is important and non-inferrable

Example: addEventListener

```ts twoslash
/// ---cut---
const my_element = document.createElement('button')
my_element.addEventListener('click', function (e) {
  this
//   ^?
  console.log(this.className)
  // logs `true`
  console.log(e.currentTarget === this)
})
```

If we wanted to make it an independent function declaration and had `noImplicitThis` enabled, we'd be asked to provide a proper `this` type annotation

```ts twoslash
// @errors: 2683
function clickListener(e: MouseEvent) {
  console.log(this.className)
  console.log(e.currentTarget === this)
}
```

```ts{1} twoslash
function clickListener(this: HTMLButtonElement, e: MouseEvent) {
  console.log(this.className)
  console.log(e.currentTarget === this)
}
```

### `alwaysStrict`

- JS “use strict”
- necessary for modern JS language features

### `strictBindCallApply`

- Bind, call, apply used to return very loosely-typed functions.
- No good reasons I'm aware of to disable this

### `strictNullChecks`

- Without this enabled, **all types allow `null` values**
- Leaving this disabled makes truthy/falsy type guards much less useful
- Operating without `strictNullChecks` is asking for runtime errors that could otherwise be caught at build time

```ts twoslash
// @strictNullChecks: false
// Without `strictNullChecks` enabled
class Animal {
  run() {}
}
let animal = new Animal()
//     ^?
animal = null // type-checks, but do we really want it to?
```

### `strictFunctionTypes`

Some common-sense loopholes around matching function arguments during type-checking function values

```ts twoslash
// @errors: 2322
abstract class Animal {
    public abstract readonly legs: number
}
class Cat extends Animal {
  legs = 4
  purr() {
    console.log('purr')
  }
}
class Dog extends Animal {
  legs = 4
  bark() {
    console.log('arf')
  }
}

let animalFn!: (x: Animal) => void
let dogFn!: (x: Dog) => void
let catFn!: (x: Cat) => void

animalFn = dogFn // Error with --strictFunctionTypes
dogFn = animalFn // Always ok
dogFn = catFn // Always error
```

If you took my Intermediate TypeScript course, you may recognize this as **detecting when functions are [contravariant](../../intermediate-v2/10-covariance-contravariance/index.md) over their argument types**, and preventing a problematic assignment.

### `strictPropertyInitialization`

Holds you to your promises around class fields really being “always there” vs. “sometimes undefined”

```ts twoslash
// @errors: 2564
class Car {
  numDoors: number
}
```

## Even more strict

### `noUnusedLocals`

- Busts you on unused local variables
- Better to have TS detect this rather than a linter

### `noUnusedParameters`

Function arguments you don’t use need to be prefixed with \_

```ts twoslash
// @errors: 6133
// @noUnusedParameters
const p = new Promise((resolve, reject) => {
  reject("boom")
});
```

```diff
- const p = new Promise((resolve, reject) => {
+ const p = new Promise((_resolve, reject) => {
```

```ts{1} twoslash
// @noUnusedParameters
const p = new Promise((_resolve, reject) => {
  reject("boom")
});
```

### `noImplicitReturns`

If any code paths return something explicitly, all code paths must return something explicitly. I'm a big fan of explicitly typing function boundaries, so I love this compiler setting

### `noFallthroughCasesInSwitch`

**I’m ok with this one as being _disabled_**, as I find case fall-throughs to be useful, important and easy (enough) to notice while reading code

### `types`

- Instead of pulling in all @types/\* packages, specify exactly what should be available
- **NOTE:** this is nuanced, and only affects global scope (i.e., window, process) and auto-import.
- _Why I care:_ I don’t want types used exclusively in things like tests to be quite so readily available for accidental use in “app code”

### `stripInternal` (most important for libraries)

- Sometimes you need type information to only be available within a codebase.
- `@internal` JSdoc tag surgically strips out type information for respective symbols

### `exactOptionalPropertyTypes`

In essence, I think of this one as establishing some very reasonable rule of appropriate distinction between `null` and `undefined`

If we have a type like this

```ts twoslash
interface VideoPlayerPreferences {
  volume?: number // 0 - 100, initially unset 
}
```

and enable `exactOptionalPropertyTypes`, we'll be stopped from doing things like this

```ts twoslash
// @errors: 2412
// @exactOptionalPropertyTypes
interface VideoPlayerPreferences {
  volume?: number // 0 - 100, initially unset 
}
/// ---cut---
const prefs: VideoPlayerPreferences = {
  volume: 50
}
prefs.volume = undefined // Bad practice
delete prefs.volume // Good practice
```

What we're seeing here is that we're being stopped from explicitly setting an optional property to `undefined`. This is a good thing to prevent, because it causes some strangeness around things you'd expect to behave a certain way with undefined properties

```ts twoslash
// @errors: 2412
// @exactOptionalPropertyTypes
interface VideoPlayerPreferences {
  volume?: number // 0 - 100, initially unset 
}
const prefs: VideoPlayerPreferences = {
  volume: 50
}
/// ---cut---
prefs.hasOwnProperty('volume') // returns TRUE
Object.keys(prefs) // includes "volume"
for (let key in prefs) {} // will iterate over "volume" key
```

The fact is, we _do_ have a property on `prefs`, and it has a value. We've just made that value `undefined`.

It's _much_ more appropriate to use `null` for these cases, since it's an explicitly provided value that can't be confused with the thing we get when we ask for properties that don't exist.

### `noUncheckedIndexedAccess`

Sometimes we can have object types which have some known properties as well as index signatures

```ts twoslash
interface PhoneBookEntry {
  name: string
  home_phone: string
  cell_phone: string
  [k: string]: string
}

```

This rule ensures that _undeclared keys_ have the `undefined` type added to them, to represent the possibility that no value is present

```ts twoslash
// @noUncheckedIndexedAccess
interface PhoneBookEntry {
  name: string
  home_phone: string
  cell_phone: string
  [k: string]: string
}
/// ---cut---
function callback(phoneBook: PhoneBookEntry) {
  phoneBook.name
//            ^?
  phoneBook.office_phone // would have been `string`
//            ^?
}
```

### `noPropertyAccessFromIndexSignature`

This rule draws a distinction between `.foo` syntax (to be used for known property access) and `["foo"]` syntax (to be used for index signatures). Using the same example from above

```ts twoslash
// @errors: 4111
// @noPropertyAccessFromIndexSignature
interface PhoneBookEntry {
  name: string
  home_phone: string
  cell_phone: string
  [k: string]: string
}
/// ---cut---
function callback(phoneBook: PhoneBookEntry) {
  phoneBook.name
//            ^?
  phoneBook.office_phone // would have been `string`
//            ^?
}
```

### `noImplicitOverride`

The `override` keyword prevents incomplete refactors and other kinds of errors relating to object-oriented inheritance

```ts twoslash
class Animal {
  walk() {}
}

class Dog extends Animal {
  override walk() {}
}
```

if we make this change to `Animal`

```diff
-  walk() {}
+  run() {}
```

We'll be appropriately alerted

```ts twoslash
// @errors: 4113
class Animal {
  run() {}
}

class Dog extends Animal {
  override walk() {}
}
```

So this `override` keyword is quite valuable -- we just need to make sure we put it in place where appropriate. `noImplicitOverride` helps guide us to do just that.

```ts twoslash
// @noImplicitOverride
// @errors: 4114
class Animal {
  walk() {}
}

class Dog extends Animal {
  walk() {}
}
```

## Don't go viral

There are some compiler options that I _really dislike_ when used in libraries, because they have a high probability of "infecting" any consumer and depriving them from making choices about their own codebase

### `allowSyntheticDefaultImports`

Allows you to import CommonJS modules as if they’re ES modules with a default export

### `esModuleInterop`

Adds some runtime support for CJS/ESM interop, and enables allowSyntheticDefaultImports

### `skipDefaultLibCheck`

This effectively ignores potential breaking changes that stem from your node_modules types mixing with your own types. Particularly if you’re building a library, you need to know that if you “hide” this problem they’ll still “feel” it (and probably need to “skip” too)

### `useUnknownInCatchVariables`

Caught throwables in a catch block will be typed as `unknown` instead of `any`, promoting better error-handling hygiene

```ts twoslash
// @useUnknownInCatchVariables: true
try {} 
catch (err) { }
//      ^?
```

### But sometimes we need these, right?

I have never found a good reason to enable these options in well-structured TS code.

`allowSyntheticDefaultImports` and `esModuleInterop` aim to allow patterns like

```ts
import fs from 'fs'
```

in situations where `fs` doesn't actually expose an ES module `export default`. It exports a _namespace_ of filesystem-related functions. Thankfully, even with these flags _both_ disabled, we can still use a namespace import:

```ts
import * as fs from 'fs'
```

Now there are rare situations where some CommonJS code exports a single non-namespace thing in a way like

```ts
module.exports = function add(a, b) {
  return a + b
}
```

add is definitely not a namespace, and

```ts
import * as add from './calculator'
```

WILL NOT WORK. There's a TS-specific pattern that _will work_ though -- it's a little weird, but it doesn't require turning any compiler options on

```ts
import add = require('./calculator')
```

### Is Mike asking me to take on tech debt?

You may be thinking "these don't look like ES modules", and "won't the TS team standardize on ES modules later?"

The answer is: _yes_, but you should think about this the same way that you think about a "legacy" version of Node.js that you need to support

- You may not wish to break consumers yet
- Apps should be the first to adopt new things, followed by libraries that are more conservative

TS modules predate ES modules, but there’s tons of code out there that already uses TS module stuff, and this is one of the most easy to codemod kinds of “tech debt” to incur.
