---
title: Hello TypeScript
date: "2015-05-01T22:12:03.284Z"
description: |
  In this unit, we'll get hands on with our first TypeScript program and the
  compiler CLI command
course: fundamentals-v3
order: 2
---

## Anatomy of the project

Open your [`packages/hello-ts`](https://github.com/mike-north/ts-fundamentals-v3/blob/main/packages/hello-ts/) folder to find
our first tiny project. There are only three files

```sh
package.json  # Package manifest
tsconfig.json  # TypeScript compiler settings
src/index.ts  # "the program"
```

`package.json`
[(view source)](https://github.com/mike-north/ts-fundamentals-v3/blob/main/packages/hello-ts/package.json) <br />

```jsonc
{
  "name": "hello-ts",
  "license": "NOLICENSE",
  "devDependencies": {
    "typescript": "^4.3.2"
  },
  "scripts": {
    "dev": "tsc --watch --preserveWatchOutput"
  }
}
```

Note that we just have one dependency in our package.json: `typescript`. We have a `dev` script (this is
what runs when you invoke `yarn dev-hello-ts` from the project root) that runs the typescript compiler in "watch"
mode (watches for source changes, and rebuilds automatically).

`tsconfig.json`
[(view source)](https://github.com/mike-north/ts-fundamentals-v3/blob/main/packages/hello-ts/tsconfig.json) <br />

This is just about the simplest possible config file for the TS compiler

```jsonc
{
  "compilerOptions": {
    "outDir": "dist", // where to put the TS files
    "target": "ES3" // which level of JS support to target
  },
  "include": ["src"] // which files to compile
}
```

All of these things could be specified on the command line (e.g., `tsc --outDir dist`), but particularly as
things get increasingly complicated, we'll benefit a lot from having this config file

`src/index.ts`
[(view source)](https://github.com/mike-north/ts-fundamentals-v3/blob/main/packages/hello-ts/src/index.ts) <br />

Finally, we have a relatively simple and pointless TypeScript program. It does
have a few interesting things in it that should make changes to the `"target"`
property in our `tsconfig.json` more obvious

- Use of a built in `Promise` constructor that was introduced in ES2015 ("ES6")
- Use of `async` and `await`, which were introduced in ES2017

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

//== Run the program ==//
;(async () => {
  console.log(await addNumbers(3, 4))
})()
```

Note that when you hover over certain code points on this website, you get
the equivalent of a "vscode tooltip". This is one of our most important
tools for learning about how TypeScript understands our code

![cursor hovering](/cursor-tooltip-ts.gif)

## Running the compiler

Optionally, you may run the following terminal command from the root of your project

```sh
yarn dev-hello-ts
```

You should see something in your terminal like

```sh
hello-ts: 12:01:57 PM - Starting compilation in watch mode...
```

Note that within the "hello-ts" project, a `./dist` folder has appeared,
and inside it is an `index.js` file. Open this file -- it will be a _mess_

<details>
  <summary>Click here to see what the compiled output looks like</summary>

```js twoslash
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.addNumbers = void 0;
/**
 * Create a promise that resolves after some time
 * @param n number of milliseconds before promise resolves
 */
function timeout(n) {
    return new Promise(function (res) { return setTimeout(res, n); });
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
                case 0: return [4 /*yield*/, timeout(500)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, a + b];
            }
        });
    });
}
exports.addNumbers = addNumbers;
//== Run the program ==//
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _b = (_a = console).log;
                return [4 /*yield*/, addNumbers(3, 4)];
            case 1:
                _b.apply(_a, [_c.sent()]);
                return [2 /*return*/];
        }
    });
}); })();

```

</details>

### Changing target language level

If we go to `hello-ts/tsconfig.json` and change the "compilerOptions.target" property

```diff
{
    "compilerOptions": {
        "outDir": "dist",
-       "target": "ES3"
+       "target": "ES2015"
    },
    "include": ["src"]
}
```

Look at that `dist/index.js` folder again -- it's much cleaner now! What do you notice has changed? Can you find a `Promise` constructor? Maybe the `yield` keyword?

<details>
  <summary>Click here to see what the compiled output looks like</summary>

```ts twoslash
// @showEmit
// @target: ES2015
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

</details>


Now let's bump the language level up even more, to 2017

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

It's even cleaner! We start to see `async` and `await`, and lose the `_awaiter` helper. In fact, this looks a lot like some of the type information has just been stripped away from our original `.ts` source code.


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

//== Run the program ==//
;(async () => {
  console.log(await addNumbers(3, 4))
})()
```

</details>

You may also notice that a `.d.ts` file is generated as part of the compile process. This is known as **a declaration file**
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

A good way to think of this is
* `.ts` files contain both type information and code that runs
* `.js` files contain only code that runs
* `.d.ts` files contain only type information

### Types of modules

Did you notice that the `export` keyword was still present in the build output for our program? We're generating [ES2015 modules][esm] from our TypeScript source. Try to run this file via node

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
our project is currently set up, this file can't be run directly quite so easily.

Node expects [CommonJS modules][cjs] [^1], so we'll have to tell TypeScript to output
this kind of code.

Let's add a new property to our `tsconfig`

```diff json
"compilerOptions": {
    "outDir": "dist",
+   "module": "CommonJS",
```

Look at your `packages/hello-ts/dist/index.js` one more time now. You should see
that the way the `addNumbers` function is exported has changed

```js twoslash
async function addNumbers(a, b) {
  await timeout(500)
  return a + b
}
/// ---cut---
exports.addNumbers = addNumbers
```

This is an indication that we're emitting CommonJS modules! Let's try running
this program with `node` one more time

```sh
node packages/hello-ts/dist/index.js
```

If your program works correctly at this point, you should see it pause for a short
time and then print `7` to the console, before ending successfully.

[^1]: There are certainly ways of making modern versions of Node happy to run [ES2015 modules][esm], and they'll likely soon be the default type of JS module, but `.js` files passed directly into `node` with no flags or other arguments are still treated as CommonJS

CONGRATS! You've just written your first TypeScript program!

[esm]: (https://en.wikipedia.org/wiki/ECMAScript#6th_Edition_%E2%80%93_ECMAScript_2015)
[cjs]: (https://en.wikipedia.org/wiki/CommonJS)
