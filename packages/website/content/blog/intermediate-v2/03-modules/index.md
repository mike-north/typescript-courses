---
title: Modules & CJS interop
date: "2021-06-10T09:00:00.000Z"
description: |
  Although most of the code we write today is in the form of
  ES modules, plenty of dependencies are packaged in the
  CommonJS module format. In this chapter, we'll look at modules in depth
  so that you have all the tools you need in order to consume all
  the dependencies you care about, while keeping the TS compiler happy
course: intermediate-v2
order: 03
---

The JS ecosystem was without an "official" module specification
until 2015, which led to a variety of different community-defined
module types, including...

- [CommonJS](https://nodejs.org/api/modules.html#modules_modules_commonjs_modules)
- [AMD (RequireJS)](https://requirejs.org/docs/whyamd.html)
- [UMD](https://github.com/umdjs/umd)

AMD and UMD modules are increasingly rare these days, but CommonJS has stuck around, in part
due to it still being the default module type for code that runs in Node.js.

While it's unusual that we write anything other than "ES modules" these days,
it's very common to need to describe the types of older CJS code.

## ES Module imports and exports

First, let's get the conventional stuff out of the way:
TypeScript does exactly what you're used to seeing in modern JavaScript code.

Here are some of the basics:

```ts
// named imports
import { strawberry, raspberry } from "./berries"

import kiwi from "./kiwi" // default import

export function makeFruitSalad() {} // named export

export default class FruitBasket {} // default export

export { lemon, lime } from "./citrus" // re-export
export * as berries from "./berries" // re-export entire module as a single namespace
```

Although fairly uncommon in the JS world, [it's possible to import an entire module as a namespace](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#import_an_entire_modules_contents). TypeScript supports this as well

```ts
import * as allBerries from "./berries" // namespace import

allBerries.strawberry // using the namespace
allBerries.blueberry
allBerries.raspberry

export * from "./berries" // namespace re-export
```

## Importing types

### How TypeScript erases imports of types

If you actually use the TypeScript compiler's output as the beginning of your build pipeline, you don't really have to worry about this, because the compiler operates on your whole project holistically, understands exactly what you're importing and how you're using it, and can fully "erase" imports that are exclusively for types from your code

Here's an example of TypeScript doing this, even with _declaration merging_ in play. The compiler knows that in `b.ts` we're importing `Foo` as a class, but we only end up using it as a type.

```ts twoslash
// @filename: a.ts
export class Foo {}
export function bar() {
  console.log("bar");
}

// @filename: b.ts
import { Foo } from './a'

let x: Foo = {};
```

Here's the `b.js` file, the compiled output of `b.ts`

```ts twoslash
// @showEmit
// @module: CommonJS
// @target: ES5
// @showEmittedFile: b.js
// @filename: a.ts
export class Foo {}
export function bar() {
  console.log("bar")
}

// @filename: b.ts
import { Foo } from './a'

let x: Foo = {}
```

And the compiled output after I add one more line `const y = new Foo()` to the bottom of `b.ts`

```ts{3,5} twoslash
// @showEmit
// @module: CommonJS
// @target: ES5
// @showEmittedFile: b.js
// @filename: a.ts
export class Foo {}
export function bar() {
  console.log("bar")
}

// @filename: b.ts
import { Foo } from './a'

let x: Foo = {}
const y = new Foo()
```

As we can see, using that constructor caused us to cross a threshold, where we now have to actually import `./a` at runtime, and invoke that `Foo()` constructor.

### Using other tools like Babel, Webpack, Parcel and more

There are some other tools that can operate on TypeScript files and produce a build output, but they're subtle in a very important way. Sometimes you may not even know that you're using one of these tools, because they still perform type-checking with the TypeScript compiler. What they _don't do_, is actually have `tsc` produce the `.js` files.

[Babel](https://babeljs.io/) and tools like it type-check and transpile one module at a time, instead of compiling the entire program at once. This has some advantages when it comes to the simplicity of incremental rebuilds and the ability to scale out the compile work horizontally. These tools often support (or are used with tools that support) dead code elimination (or ["tree shaking"](https://webpack.js.org/guides/tree-shaking/)), which attempts to discard non-imported modules from the build.

However -- if you're compiling one module at a time, there's no way to be sure that our `Foo` import is just a type.

### Type-only imports

TypeScript provides an unambiguous way of importing _only types_. Please pardon the bug which is causing the error to show up on the wrong line

```ts{5} twoslash
// @errors: 1361
// @filename: a.ts
export class Foo {}

// @filename: b.ts
import type { Foo } from './a'
//             ^?
let x: Foo = {}
new Foo()
```

You can use `import type` and `export type` fairly broadly, in the same ways you'd use `import` and `export` to pass values across module boundaries.

## CommonJS Interop

Things can sometimes get a bit tricky when consuming CommonJS modules that do things that are incompatible with the way ES Modules typically work.

Most of the time, you can just convert something like

```js
const fs = require("fs")
```

into

```ts
// namespace import
import * as fs from "fs"
```

Occasionally, you'll run into a rare situation where the CJS module you're importing from, exports a single thing that's _incompatible_ with this _namespace import_ technique.

Here's a small example of where the _namespace import_ fails:

```ts twoslash
// @errors: 2497
// @module: CommonJS
////////////////////////////////////////////////////////
// @filename: fruits.ts
function createBanana() {
  return { name: "banana", color: "yellow", mass: 183 }
}

// equivalent to CJS `module.exports = createBanana`
export = createBanana
////////////////////////////////////////////////////////
// @filename: smoothie.ts

import * as createBanana from "./fruits"
```

While this error message is accurate, you may not want to follow the
advice it provides in all situations.

> If you need to enable the `esModuleInterop` and `allowSyntheticDefaultImports` compiler flags in order to allow your types to compile, anyone who depends on your types will also have no choice but to enable them, or their project's types won't compile.

I call these "viral options", and take extra steps to avoid using them in my libraries.

[[warning | :warning: Warning: Visual Studio Code downloads types automatically]]
| The type information you publish could be downloaded into a user's
| authoring environment, even if they don't directly consume your library
| <br/>
| <br/>
| Type-checking is a _holistic operation_ that can be upset by
| even one dependency whose types don't align well with a project's compiler settings

Thankfully we have another option here -- the use of an older module loading API that imports the code properly, and matches up the type information as well

```ts twoslash
// @module: CommonJS
////////////////////////////////////////////////////////
// @filename: fruits.ts
function createBanana() {
  return { name: "banana", color: "yellow", mass: 183 }
}

// equivalent to CJS `module.exports = createBanana`
export = createBanana
////////////////////////////////////////////////////////
// @filename: smoothie.ts

import createBanana = require("./fruits")
const banana = createBanana()
//     ^?
```

Recall that the error message said

> This module can only be referenced **with ECMAScript imports/exports** by turning on the 'esModuleInterop' flag and referencing its default export.

We have solved this by avoiding the use of an ECMAScript import/export entirely. After all, the code we're referring to here is not following the ES module spec.

The compiled output of this file will still be what we're looking for in the CJS world

```ts twoslash
// @showEmit
// @module: CommonJS
// @target: ES2015
// @showEmittedFile: fruits.js
////////////////////////////////////////////////////////
// @filename: fruits.ts
function createBanana() {
  return { name: "banana", color: "yellow", mass: 183 }
}

// equivalent to CJS `module.exports = createBanana`
export = createBanana
////////////////////////////////////////////////////////
// @filename: smoothie.ts

import createBanana = require("./fruits")
const banana = createBanana()
//     ^?
```

```ts twoslash
// @showEmit
// @module: CommonJS
// @target: ES5
// @showEmittedFile: smoothie.js
////////////////////////////////////////////////////////
// @filename: fruits.ts
function createBanana() {
  return { name: "banana", color: "yellow", mass: 183 }
}

// equivalent to CJS `module.exports = createBanana`
export = createBanana
////////////////////////////////////////////////////////
// @filename: smoothie.ts

import createBanana = require("./fruits")
const banana = createBanana()
//     ^?
```

## Native ES module support

[Node.js 13.2.0 introduced support for native ES modules](https://nodejs.medium.com/announcing-core-node-js-support-for-ecmascript-modules-c5d6dc29b663).

This means you can natively run code containing thing like `import { Foo } from 'bar'`, use top-level `await` and more!

How to unambiguously indicate which type of module you're authoring

- Files with the `.mjs` extension are treated as native ES modules
- Files with the `.cjs` extension are treated as CJS modules

You can also indicate whether `.js` files in your project should be treated as ES or CJS modules. In your `package.json` you may include a top-level `"type"` field with either of the following values

- `"module"` indicates that `.js` files should be run as ES modules
- `"commonjs"` indicates that `.js` files should be run as CommonJS

Note that even as of Node 20.8.0, **Node.js still assumes `.js` files are CommonJS if you specify no `"type"` field at all in your `"package.json"`**

### TypeScript ES modules

TypeScript 5 supports native modules that follow the established conventions, replacing the `j` with a `t` (just as is done for `.jsx` and `.tsx` files). `.`

- `.mts` files are for TypeScript ES modules, and generate ES modules as output
- `.cts` files are for TypeSCript CJS modules, and generate CJS modules as output

Given that TypeScript gives you control of the module format in compiled output, you may wonder what the use case is for allowing this degree of flexibility

Imagine you have a large Node project, currently in CJS, and you want to incrementally start converting a few modules at a time. This flexibility would allow you use these two types of modules side-by-side as you incrementally migrate, without attempting a risky automatic conversion that could have ramifications on build output.

Sometimes you also may want different lint rules to apply to different module types, different `tsconfig`s, etc... Different file extensions make it easy to apply tools specifically, via `[globs](https://www.gnu.org/software/bash/manual/html_node/Pattern-Matching.html)`, regexes, etc...

## Importing non-TS things

Particularly if you use a bundler like webpack, parcel or snowpack, you
may end up importing things that aren't `.js` or `.ts` files

For example, maybe you'll need to [import an image file with webpack](https://v4.webpack.js.org/loaders/file-loader/#getting-started) like this

```ts twoslash
// @errors: 2307
import img from "./file.png"
```

`file.png` is obviously not a TypeScript file -- we just need
to tell TypeScript that **whenever we import a `.png` file,
it should be treated as if it's a JS module with a string
value as its default export**

This can be accomplished through a _module declaration_ as shown below

```ts twoslash
// @filename: global.d.ts
declare module "*.png" {
  const imgUrl: string
  export default imgUrl
}
// @filename: component.ts
import img from "./file.png"
```

Like an interface, this is purely type information that will "compile away"
as part of your build process. We'll talk more about module declarations
when we discuss **ambient type information**
