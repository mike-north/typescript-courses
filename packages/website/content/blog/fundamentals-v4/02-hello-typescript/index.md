---
title: Hello TypeScript
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

Let's consider [`a very simple TypeScript project`](https://github.com/mike-north/typescript-courses/blob/main/packages/hello-ts/)
that consists of only three files:

```sh
package.json   # Package manifest
tsconfig.json  # TypeScript compiler settings
src/index.ts   # "the program"
```

`package.json`
[(view source)](https://github.com/mike-north/typescript-courses/blob/main/packages/hello-ts/package.json) <br />

```jsonc
{
  "name": "hello-ts",
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
- We have a `dev` script (this is what runs when you invoke `yarn dev-hello-ts` from the project root)
  - It runs the TypeScript compiler in "watch" mode (watches for source changes, and rebuilds automatically).

The following is just about the simplest possible [config file](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) for the TS compiler:

`tsconfig.json`
[(view source)](https://github.com/mike-north/typescript-courses/blob/main/packages/hello-ts/tsconfig.json) <br />

```jsonc
{
  "compilerOptions": {
    "outDir": "dist", // where to put the TS files
    "target": "ES5", // JS language level (as a build target)
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
[(view source)](https://github.com/mike-north/typescript-courses/blob/main/packages/hello-ts/src/index.ts) <br />

```ts twoslash
/**
 * Create a promise that resolves after some time
 * @param n number of milliseconds before promise resolves
 */
function timeout(n: number) {
  return new Promise((res) => setTimeout(res, n))
}

/**
 * Add three numbers
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

From within the `packages/hello-ts` folder of [the git repo](https://github.com/mike-north/typescript-courses/), you can run

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

Note that within the "hello-ts" project

- a `./dist` folder has appeared,
- inside it is an `index.js` file.

Open this file -- **it will be a mess**

<details>
  <summary>Click here to see what the compiled output looks like</summary>

```js twoslash
"use strict"
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value)
          })
    }
    return new (P || (P = Promise))(function (
      resolve,
      reject
    ) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected)
      }
      step(
        (generator = generator.apply(
          thisArg,
          _arguments || []
        )).next()
      )
    })
  }
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1]
          return t[1]
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g
    return (
      (g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2),
      }),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this
        }),
      g
    )
    function verb(n) {
      return function (v) {
        return step([n, v])
      }
    }
    function step(op) {
      if (f)
        throw new TypeError(
          "Generator is already executing."
        )
      while ((g && ((g = 0), op[0] && (_ = 0)), _))
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                  ? y["throw"] ||
                    ((t = y["return"]) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t
          if (((y = 0), t)) op = [op[0] & 2, t.value]
          switch (op[0]) {
            case 0:
            case 1:
              t = op
              break
            case 4:
              _.label++
              return { value: op[1], done: false }
            case 5:
              _.label++
              y = op[1]
              op = [0]
              continue
            case 7:
              op = _.ops.pop()
              _.trys.pop()
              continue
            default:
              if (
                !((t = _.trys),
                (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0
                continue
              }
              if (
                op[0] === 3 &&
                (!t || (op[1] > t[0] && op[1] < t[3]))
              ) {
                _.label = op[1]
                break
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1]
                t = op
                break
              }
              if (t && _.label < t[2]) {
                _.label = t[2]
                _.ops.push(op)
                break
              }
              if (t[2]) _.ops.pop()
              _.trys.pop()
              continue
          }
          op = body.call(thisArg, _)
        } catch (e) {
          op = [6, e]
          y = 0
        } finally {
          f = t = 0
        }
      if (op[0] & 5) throw op[1]
      return { value: op[0] ? op[1] : void 0, done: true }
    }
  }
var __classPrivateFieldGet =
  (this && this.__classPrivateFieldGet) ||
  function (receiver, state, kind, f) {
    if (kind === "a" && !f)
      throw new TypeError(
        "Private accessor was defined without a getter"
      )
    if (
      typeof state === "function"
        ? receiver !== state || !f
        : !state.has(receiver)
    )
      throw new TypeError(
        "Cannot read private member from an object whose class did not declare it"
      )
    return kind === "m"
      ? f
      : kind === "a"
      ? f.call(receiver)
      : f
      ? f.value
      : state.get(receiver)
  }
Object.defineProperty(exports, "__esModule", {
  value: true,
})
exports.addNumbers = void 0
/**
 * Create a promise that resolves after some time
 * @param n number of milliseconds before promise resolves
 */
function timeout(n) {
  return new Promise(function (res) {
    return setTimeout(res, n)
  })
}
/**
 * Add three numbers
 * @param a first number
 * @param b second
 */
function addNumbers(a, b) {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, timeout(500)]
        case 1:
          _a.sent()
          return [2 /*return*/, a + b]
      }
    })
  })
}
exports.addNumbers = addNumbers
var Foo = /** @class */ (function () {
  function Foo() {}
  Foo.getValue = function () {
    return __classPrivateFieldGet(_a, _a, "f", _Foo_bar)
  }
  var _a, _Foo_bar
  _a = Foo
  _Foo_bar = { value: 3 }
  return Foo
})()
//== Run the program ==//
;(function () {
  return __awaiter(void 0, void 0, void 0, function () {
    var _b, _c
    return __generator(this, function (_d) {
      switch (_d.label) {
        case 0:
          _c = (_b = console).log
          return [
            4 /*yield*/,
            addNumbers(Foo.getValue(), 4),
          ]
        case 1:
          _c.apply(_b, [_d.sent()])
          return [2 /*return*/]
      }
    })
  })
})()
```

</details>

### Changing target language level

If we go to `hello-ts/tsconfig.json` and change the "compilerOptions.target" property:

```diff
{
    "compilerOptions": {
        "outDir": "dist",
-       "target": "ES5"
+       "target": "ES2015"
    },
    "include": ["src"]
}
```

Look at that `dist/index.js` file again -- it's much cleaner now! Do you notice what has changed? Can you find a `Promise` constructor? Maybe the `yield` keyword?

<details>
  <summary>Click here to see what the compiled output looks like</summary>

```ts twoslash
// @showEmit
// @target ES2015
/**
 * Create a promise that resolves after some time
 * @param n number of milliseconds before promise resolves
 */
function timeout(n: number) {
  return new Promise((res) => setTimeout(res, n))
}

/**
 * Add three numbers
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

Now let's bump the language level up even more, to 2017:

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

**It's even cleaner!**

Some changes to observe:

- We start to see `async` and `await`
- We no longer see the `_awaiter` helper

In fact, this looks a lot like **the type information has just been stripped away from our original `.ts` source code**.

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
 * Add three numbers
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

You'll see that the code now looks pretty much like the original source code, with all the types stripped away (e.g. `a: string` -> `a`).

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
 * Add three numbers
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
 * Add three numbers
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
node packages/hello-ts/dist/index.js
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

Look at your `packages/hello-ts/dist/index.js` one more time now. You should see
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
node packages/hello-ts/dist/index.js
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

Build the file again by running `tsc` while in the `./packages/hello-ts` folder.

Finally, run from within the same folder

```sh
node dist/index.js
```

And you should see `7` printed to the console again!

CONGRATS! You've just compiled your first TypeScript program!

[esm]: https://en.wikipedia.org/wiki/ECMAScript#6th_Edition_%E2%80%93_ECMAScript_2015
[cjs]: https://en.wikipedia.org/wiki/CommonJS
