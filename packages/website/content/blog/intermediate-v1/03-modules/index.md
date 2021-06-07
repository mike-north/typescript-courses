---
title: Modules & CJS interop
date: "2015-05-28T22:40:32.169Z"
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
