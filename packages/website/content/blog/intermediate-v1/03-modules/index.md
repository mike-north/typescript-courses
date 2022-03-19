---
title: Modules & CJS interop
date: "2021-06-10T09:00:00.000Z"
description: |
  Although most of the code we write today is in the form of
  ES modules, plenty of dependencies are packaged in the
  CommonJS module format. In this chapter, we'll look at modules in depth
  so that you have all the tools you need in order to consume all
  the dependencies you care about, while keeping the TS compiler happy
course: intermediate-v1
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

export { lemon, lime } from "./citrus"
```

Although fairly uncommon in the JS world, [it's possible to import
an entire module as a namespace](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#import_an_entire_modules_contents). TypeScript supports
this as well

```ts
import * as allBerries from "./berries" // namespace import

allBerries.strawberry // using the namespace
allBerries.blueberry
allBerries.raspberry

export * from "./berries" // namespace re-export
```

TypeScript also allows something that was recently added (2021) to the JS language

```ts
export * as berries from "./berries" // namespace re-export
```

## CommonJS Interop

Things can sometimes get a bit tricky when consuming CommonJS modules
that do things that are incompatible with the way ES Modules typically work.

Most of the time, you can just convert something like

```js
const fs = require("fs")
```

into

```ts
// namespace import
import * as fs from "fs"
```

but occasionally, you'll run into a rare situation where
the CJS module you're importing from, exports a single thing
that's _incompatible_ with this _namespace import_ technique.

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

> If you need to enable the `esModuleInterop` and `allowSyntheticDefaultImports`
> compiler flags in order to allow your types to compile, anyone
> who depends on your types will also have no choice but to enable them.

I call these "viral options", and take extra steps to avoid using
them in my libraries.

Thankfully we have another option here -- the use of an older module loading API
that imports the code properly, and matches up the type information as well

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

The error message said

> This module can only be referenced **with ECMAScript imports/exports** by turning on the 'esModuleInterop' flag

and we have solved this by avoiding the use of an ECMAScript import/export. After all, the code we're referring
to here is not following the ES module spec to begin with

The compiled output of this file will still be what we're looking for in the CJS world

```ts twoslash
// @showEmit
// @module: CommonJS
// @target: ES5
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

[[info | :bulb: Reminder: Visual Studio Code downloads types automatically]]
| The type information you publish could be downloaded into a user's
| authoring environment, even if they don't directly consume your library
| <br/>
| <br/>
| Type-checking is a _holistic operation_ that can be upset by
| even one dependency whose types are "unhappy"

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
