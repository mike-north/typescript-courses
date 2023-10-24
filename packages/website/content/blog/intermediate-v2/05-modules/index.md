---
title: Modules & CJS interop
date: "2023-10-25T09:00:00.000Z"
description: |
  Although most of the code we write today is in the form of
  ES modules, plenty of dependencies are packaged in the
  CommonJS module format. In this chapter, we'll look at modules in depth
  so that you have all the tools you need in order to consume all
  the dependencies you care about, while keeping the TS compiler happy
course: intermediate-v2
order: 5
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
import { Blueberry, Raspberry } from './berries'
import Kiwi from './kiwi' // default import

export function makeFruitSalad() {} // named export

export default class FruitBasket {} // default export

export { lemon, lime } from './citrus' // re-export
export * as berries from './berries' // re-export entire module as a single namespace
```

Although fairly uncommon in the JS world, [it's possible to import an entire module as a namespace](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#import_an_entire_modules_contents). TypeScript supports this as well

```ts
import * as allBerries from "./berries" // namespace import

allBerries.Strawberry // using the namespace
allBerries.Blueberry
allBerries.Raspberry

export * from "./berries" // namespace re-export
```

## Importing types

### How TypeScript erases imports of types

If you actually use the TypeScript compiler's output as the beginning of your build pipeline, you don't really have to worry about this, because the compiler operates on your whole project holistically, understands exactly what you're importing and how you're using it, and can fully "erase" imports that are exclusively for types from your code

Here's an example of TypeScript doing this, even with _declaration merging_ in play. The compiler knows that in `berries/raspberry.ts` we're importing `Raspberry` as a class, but we only end up using it as a type.

```ts twoslash
////////////////////////////////////////////////////////
// @filename: berries/raspberry.ts
export class Raspberry {
    constructor(public color: 'red' | 'black') {}
}
export function pickRaspberries(time: number): Raspberry[] {
  console.log('picking raspberries')
  return []
}
////////////////////////////////////////////////////////
// @filename: index.ts
import { Raspberry } from './berries/raspberry'

let x: Raspberry = { color: 'red' };
```

Here's the `index.js` file, and the compiled output of `index.ts`

```ts twoslash
// @showEmit
// @module: CommonJS
// @target: ES5
////////////////////////////////////////////////////////
// @filename: berries/raspberry.ts
export class Raspberry {
  constructor(public color: 'red' | 'black') {}
}
export function pickRaspberries(time: number): Raspberry[] {
  console.log('picking raspberries')
  return []
}
////////////////////////////////////////////////////////
// @filename: index.ts
import { Raspberry } from './berries/raspberry'

let x: Raspberry = { color: 'red' };
```

And the compiled output after I add one more line `const y = new Raspberry()` to the bottom of `b.ts`

```ts{3,5} twoslash
// @showEmit
// @module: CommonJS
// @target: ES5
////////////////////////////////////////////////////////
// @filename: berries/raspberry.ts
export class Raspberry {
  constructor(public color: 'red' | 'black') {}
}
export function pickRaspberries(time: number): Raspberry[] {
  console.log('picking raspberries')
  return []
}
////////////////////////////////////////////////////////
// @filename: index.ts
import { Raspberry } from './berries/raspberry'

let x: Raspberry = { color: 'red' };
const y = new Raspberry('red')
```

As we can see, using that constructor caused us to cross a threshold, where we now have to actually import `./berries/raspberry` at runtime, and invoke that `Raspberry()` constructor.

### Using other tools like Babel, Webpack, Parcel and more

There are some other tools that can operate on TypeScript files and produce a build output, but they're subtle in a very important way. Sometimes you may not even know that you're using one of these tools, because they still perform type-checking with the TypeScript compiler. What they _don't do_, is actually have `tsc` produce the `.js` files.

[Babel](https://babeljs.io/) and tools like it type-check and transpile one module at a time, instead of compiling the entire program at once. This has some advantages when it comes to the simplicity of incremental rebuilds and the ability to scale out the compile work horizontally. These tools often support (or are used with tools that support) dead code elimination (or ["tree shaking"](https://webpack.js.org/guides/tree-shaking/)), which attempts to discard non-imported modules from the build.

However -- if you're compiling one module at a time, there's no way to be sure that our `Foo` import is just a type.

### Type-only imports

TypeScript provides an unambiguous way of importing _only types_. Please pardon the bug which is causing the error to show up on the wrong line

```ts{5} twoslash
// @errors: 1361
////////////////////////////////////////////////////////
// @filename: berries/strawberry.ts
export class Strawberry {}

////////////////////////////////////////////////////////
// @filename: index.ts
import type { Strawberry } from './berries/strawberry'
//             ^?
let z: Strawberry = { color: 'red' }
new Strawberry()
```

You can use `import type` and `export type` fairly broadly, in the same ways you'd use `import` and `export` to pass values across module boundaries.

## CommonJS Interop

Things can sometimes get a bit tricky when consuming CommonJS modules that do things that are incompatible with the way ES Modules typically work.

Most of the time, CommonJS modules look kind of like this

```js twoslash
// @types: node
////////////////////////////////////////////////////////
// @filename: banana.js
class Banana {
  peel() {}
}
module.exports = { Banana }
////////////////////////////////////////////////////////
// @filename: index.js
const Banana = require('./banana') // CJS style import
const banana = new Banana()
banana.peel()
```

In this scenario, if we converted the `index.js` file to TypeScript, we could continue to use the `banana.js` module as-is by using a namespace import

```ts{7} twoslash
// @checkJs
// @types: node
////////////////////////////////////////////////////////
// @filename: banana.js
class Banana {
  peel() {}
}
module.exports = { Banana }
////////////////////////////////////////////////////////
// @filename: index.ts
import { Banana } from './banana'

const banana = new Banana()
banana.peel()
//      ^?
```

If you've used Node.js before, this is a common pattern you may see around the system modules. the following JavaScript

```js twoslash
// @noErrors
// @types: node
const fs = require("fs")
fs.readFileSync('example.txt')
```

Into this TypeScript

```ts twoslash
// @noErrors
// @types: node
// namespace import
import * as fs from "fs"
fs.readFileSync('example.txt')
```

or even this

```ts twoslash
// @noErrors
// @types: node
// namespace import
import { readFileSync } from "fs"
readFileSync('example.txt')
```

Occasionally, you'll run into a rare situation where the CJS module you're importing from, exports a single thing that's _incompatible_ with this _namespace import_ technique.

Here's a small example of where the _namespace import_ fails:

```ts twoslash
// @types: node
// @errors: 2497
////////////////////////////////////////////////////////
// @filename: melon.js
class Melon {
    cutIntoSlices() { }
}

module.exports = Melon
////////////////////////////////////////////////////////
// @filename: index.ts
import * as Melon from "./melon"

const melon = new Melon()
melon.cutIntoSlices()
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
// @types: node
// @errors: 2497
////////////////////////////////////////////////////////
// @filename: melon.js
class Melon {
    cutIntoSlices() { }
}

module.exports = Melon
////////////////////////////////////////////////////////
// @filename: index.ts
import Melon = require("./melon")

const melon = new Melon()
melon.cutIntoSlices()
//       ^?
```

Recall that the error message said

> This module can only be referenced **with ECMAScript imports/exports** by turning on the 'esModuleInterop' flag and referencing its default export.

We have solved this by avoiding the use of an ECMAScript import/export entirely. After all, the code we're referring to here is not following the ES module spec.

The compiled output of this `index.ts` file will still be what we're looking for in the CJS world

```ts twoslash
// @showEmit
// @module: CommonJS
// @types: node
////////////////////////////////////////////////////////
// @filename: melon.js
class Melon {
    cutIntoSlices() { }
}

module.exports = Melon
////////////////////////////////////////////////////////
// @filename: index.ts
import Melon = require("./melon")

const melon = new Melon()
melon.cutIntoSlices()
//       ^?
```

Let's say you want to convert the `melon.js` file, without disrupting anything that imports it. This is a common concern for library authors, who want to incrementally convert to TypeScript without having to declare each release containing a few more TypeScript conversions a _major version_.

```ts{2,7} twoslash
// @module: CommonJS
// @types: node
////////////////////////////////////////////////////////
// @filename: melon.ts
class Melon {
    cutIntoSlices() { }
}

export = Melon
////////////////////////////////////////////////////////
// @filename: index.ts
import Melon = require("./melon")

const melon = new Melon()
melon.cutIntoSlices()
//       ^?
```

This `export =` syntax is definitely a little odd. It certainly doesn't conform to ES module syntax in any way, in part becasue this has been part of TypeScript longer than ES modules have existed as a standardized concept.

Let's look at the compiled output and make sure we're not really changing anything. Here's `melon.js`, the compiled output of our `melon.ts` TypeScript module.

```ts twoslash
// @module: CommonJS
// @types: node
// @showEmit
// @showEmittedFile: melon.js
////////////////////////////////////////////////////////
// @filename: melon.ts
class Melon {
    cutIntoSlices() { }
}

export = Melon
////////////////////////////////////////////////////////
// @filename: index.ts
import Melon = require("./melon")

const melon = new Melon()
melon.cutIntoSlices()
```

and `index.js`, the compiled output of `index.ts`.

```ts twoslash
// @module: CommonJS
// @types: node
// @showEmit
// @showEmittedFile: index.js
////////////////////////////////////////////////////////
// @filename: melon.ts
class Melon {
    cutIntoSlices() { }
}

export = Melon
////////////////////////////////////////////////////////
// @filename: index.ts
import Melon = require("./melon")

const melon = new Melon()
melon.cutIntoSlices()
```

It's worth noting that some of these approaches _do not work_ if you're trying to emit some of the most module formats (e.g. `.mjs`) files, but given that support for CJS has been around, and will continue to be around for a long time, these remain very useful techniques.

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
