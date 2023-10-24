---
title: Welcome to TypeScript
date: "2023-10-23T09:00:00.000Z"
description: |
  In this chapter, we'll get hands on with our first TypeScript program and the
  compiler CLI command, and examine a simple program's compiled output
course: fundamentals-v4
order: 2
---

In this chapter we will...

- Get hands-on with our first TypeScript program and the
  compiler CLI command
- Learn how the compiler-emitted JS code changes depending on JS language level and module type
- Examine a simple program's compiled output, including the _type declaration file_

## Anatomy of the project

Let's consider [`a very simple TypeScript project`](https://github.com/mike-north/typescript-courses/blob/main/packages/welcome-to-ts/)
that consists of only three files:

```sh
package.json   # Package manifest
tsconfig.json  # TypeScript compiler settings
src/index.ts   # "the program"
```

This project can be found in the `packages/welcome-to-ts` folder, within the workshop repo

```sh
cd packages/welcome-to-ts
```

`package.json`
[(view source)](https://github.com/mike-north/typescript-courses/blob/main/packages/welcome-to-ts/package.json) <br />

```jsonc
{
  "name": "welcome-to-ts",
  "license": "NOLICENSE",
  "devDependencies": {
    "typescript": "^5.2.0"
  },
  "scripts": {
    "dev": "tsc --watch --preserveWatchOutput"
  }
}
```

Note that...

- We just have one dependency in our package.json: `typescript`.
- We have a `dev` script (this is what runs when you invoke `yarn dev-welcome-to-ts` from the project root)
  - It runs the TypeScript compiler in "watch" mode (watches for source changes, and rebuilds automatically).

The following is just about the simplest possible [config file](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) for the TS compiler:

`tsconfig.json`
[(view source)](https://github.com/mike-north/typescript-courses/blob/main/packages/welcome-to-ts/tsconfig.json) <br />

```jsonc
{
  "compilerOptions": {
    "outDir": "dist", // where to put the TS files
    "target": "ES2015", // JS language level (as a build target)
    "moduleResolution": "Node" // Find cjs modules in node_modules
  },
  "include": ["src"] // which files to compile
}
```

All of these things could be specified on the command line (e.g., `tsc --outDir dist`), but particularly as
things get increasingly complicated, we'll benefit a lot from having this config file:

Finally, we have a relatively simple and pointless TypeScript program. It does
have **a few interesting things in it that should make changes to the `"target"`
property in our `tsconfig.json` more obvious**:

- Use of a built in `Promise` constructor (introduced in ES2015)
- Use of `async` and `await` (introduced in ES2017)
- Use of a `static` private class field (introduced in ES2022)

Here is the original (TypeScript) source code that we aim to compile:

`src/index.ts`
[(view source)](https://github.com/mike-north/typescript-courses/blob/main/packages/welcome-to-ts/src/index.ts) <br />

```ts twoslash
/**
 * Create a promise that resolves after some time
 * @param n number of milliseconds before promise resolves
 */
function timeout(n: number) {
  return new Promise((res) => setTimeout(res, n))
}

/**
 * Add two numbers
 * @param a first number
 * @param b second
 */
export async function addNumbers(a: number, b: number) {
  await timeout(500)
  return a + b
}

class Foo {
  static #bar = 3
  static getValue() {
    return Foo.#bar
  }
}

//== Run the program ==//
;(async () => {
  console.log(await addNumbers(Foo.getValue(), 4))
})()
```

Note that when you hover over certain code points on this website, you get
the equivalent of a "VScode tooltip". **This is one of our most important
tools for learning about how TypeScript understands our code!**

![cursor hovering](/cursor-tooltip-ts.gif)

## Running the compiler

From within the `packages/welcome-to-ts` folder of [the git repo](https://github.com/mike-north/typescript-courses/), you can run

```sh
tsc
```

to build the project. Alternatively, from within the same folder, you can run this command to start a task that will rebuild the project whenever you change important files.

```sh
yarn dev
```

You should see something in your terminal like:

```log
12:01:57 PM - Starting compilation in watch mode...
```

Note that within the "welcome-to-ts" project

- a `./dist` folder has appeared,
- inside it is an `index.js` file.

Open this file -- **it will be a mess**

<details>
  <summary>Click here to see what the compiled output looks like</summary>

```js twoslash
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _a, _Foo_bar;
/**
 * Create a promise that resolves after some time
 * @param n number of milliseconds before promise resolves
 */
function timeout(n) {
    return new Promise((res) => setTimeout(res, n));
}
/**
 * Add two numbers
 * @param a first number
 * @param b second
 */
export function addNumbers(a, b) {
    return __awaiter(this, void 0, void 0, function* () {
        yield timeout(500);
        return a + b;
    });
}
class Foo {
    static getValue() { return __classPrivateFieldGet(_a, _a, "f", _Foo_bar); }
}
_a = Foo;
_Foo_bar = { value: 3 };
//== Run the program ==//
(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log(yield addNumbers(Foo.getValue(), 4));
}))();
```

</details>
<br />

If you're familiar with the very old `ES5` JavaScript language level, there are a few things in here that tell us we're dealing with `ES2015`. For example, the use of the `yield` keyword, a generator `function*`, `class`es and a `Promise` constructor.

### Changing target language level

If we go to `welcome-to-ts/tsconfig.json` and change the "compilerOptions.target" property:

```diff
{
    "compilerOptions": {
        "outDir": "dist",
-       "target": "ES2015"
+       "target": "ES2017"
    },
    "include": ["src"]
}
```

Look at that `dist/index.js` file again -- it's much cleaner now! Do you notice what has changed?

<details>
  <summary>Click here to see what the compiled output looks like</summary>

```ts twoslash
// @showEmit
// @target: ES2017
/**
 * Create a promise that resolves after some time
 * @param n number of milliseconds before promise resolves
 */
function timeout(n: number) {
  return new Promise((res) => setTimeout(res, n))
}

/**
 * Add two numbers
 * @param a first number
 * @param b second
 */
export async function addNumbers(a: number, b: number) {
  await timeout(500)
  return a + b
}

class Foo {
  static #bar = 3
  static getValue() {
    return Foo.#bar
  }
}

//== Run the program ==//
;(async () => {
  console.log(await addNumbers(Foo.getValue(), 4))
})()
```

</details>
<br />

Some changes to observe:

- We start to see `async` and `await`
- We no longer see the `_awaiter` helper

It's starting to look more recognizable -- as if **the type information has just been stripped away from our original `.ts` source code** in some places. There's still some compiler-provided workarounds for the private class field, which isn't supported in native JavaScript until ES2022.

And now finally, let's try ES2022:

```diff
{
    "compilerOptions": {
        "outDir": "dist",
-       "target": "ES2017"
+       "target": "ES2022"
    },
    "include": ["src"]
}
```

<details>
  <summary>Click here to see what the compiled output looks like</summary>

```ts twoslash
// @showEmit
// @target: ES2022
/**
 * Create a promise that resolves after some time
 * @param n number of milliseconds before promise resolves
 */
function timeout(n: number) {
  return new Promise((res) => setTimeout(res, n))
}

/**
 * Add two numbers
 * @param a first number
 * @param b second
 */
export async function addNumbers(a: number, b: number) {
  await timeout(500)
  return a + b
}

class Foo {
  static #bar = 3
  static getValue() {
    return Foo.#bar
  }
}

//== Run the program ==//
;(async () => {
  console.log(await addNumbers(Foo.getValue(), 4))
})()
```

</details>

### Declaration Files

You may also notice that a `.d.ts` file is generated as part of the compile process. **This is known as a declaration file**.

```ts twoslash
// @declaration: true
// @showEmit
// @target: ES2017
// @showEmittedFile: index.d.ts

/**
 * Create a promise that resolves after some time
 * @param n number of milliseconds before promise resolves
 */
function timeout(n: number) {
  return new Promise((res) => setTimeout(res, n))
}

/**
 * Add two numbers
 * @param a first number
 * @param b second
 */
export async function addNumbers(a: number, b: number) {
  await timeout(500)
  return a + b
}

//== Run the program ==//
;(async () => {
  console.log(await addNumbers(3, 4))
})()
```

A good way to think of TS files:

- `.ts` files contain both type information and code that runs
- `.js` files contain only code that runs
- `.d.ts` files contain only type information

There are other types of file extensions which have a TypeScript equivalent

| File Purpose | JS extension | TS extension |
|----|----|----|
| React  | `.jsx` | `.tsx` |
| Native ES Modules | `.mjs` | `.mts` |

### Types of modules

#### CommonJS

Did you notice that the `export` keyword was still present in the build output for our program? We are generating [ES2015 modules][esm] from our TypeScript source.

If you tried to run this file with `node` like this:

```sh
node packages/welcome-to-ts/dist/index.js
```

There's an error!

```sh
export async function addNumbers(a, b) {
^^^^^^
SyntaxError: Unexpected token 'export'
```

It seems that, at least with most recent versions of Node.js and the way
our project is currently set up, we can't just run this program directly as-is.

Node conventionally expects [CommonJS modules][cjs] [^1], so we'll have to tell TypeScript to output
this kind of code.

Let's add a new property to our `tsconfig` file:

```diff json
"compilerOptions": {
    "outDir": "dist",
+   "module": "CommonJS",
```

Look at your `packages/welcome-to-ts/dist/index.js` one more time now. You should see
that the way the `addNumbers` function is exported has changed:

```js twoslash
async function addNumbers(a, b) {
  await timeout(500)
  return a + b
}
/// ---cut---
exports.addNumbers = addNumbers
```

This is an indication that we're emitting CommonJS modules! We could try running
this program with `node` one more time:

```sh
node packages/welcome-to-ts/dist/index.js
```

If the program works correctly at this point, we should see it pause for a short
time and then print `7` to the console, before ending successfully.

#### ES Modules

Node now supports running native modules (`.ejs` files) directly! We can configure TypeScript to build this type of file. Make this change to your `tsconfig.json`

```diff
   "target": "ES2022",
+  "module": "NodeNext",
-  "module": "CommonJS",
-  "moduleResolution": "Node"
```

Build the file again by running `tsc` while in the `./packages/welcome-to-ts` folder.

Finally, run from within the same folder

```sh
node dist/index.js
```

And you should see `7` printed to the console again!

CONGRATS! You've just compiled your first TypeScript program!

[esm]: https://en.wikipedia.org/wiki/ECMAScript#6th_Edition_%E2%80%93_ECMAScript_2015
[cjs]: https://en.wikipedia.org/wiki/CommonJS
