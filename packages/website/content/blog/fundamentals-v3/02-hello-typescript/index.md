---
title: Hello TypeScript
date: '2015-05-01T22:12:03.284Z'
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

* Use of a built in `Promise` constructor that was introduced in ES2015 ("ES6")
* Use of `async` and `await`, which were introduced in ES2017

```ts twoslash
/**
 * Create a promise that resolves after some time
 * @param n number of milliseconds before promise resolves
 */
function timeout(n: number) {
  return new Promise((res) => setTimeout(res, n));
}

/**
 * Add three numbers
 * @param a first number
 * @param b second
 */
export async function addNumbers(a: number, b: number) {
  await timeout(500);
  return a + b;
}

//== Run the program ==//
(async () => {
  console.log(await addNumbers(3, 4));
})();
```
Note that when you hover over certain code points on this website, you get
the equivalent of a "vscode tooltip". This is one of our most important
tools for learning about how TypeScript understands our code

![cursor hovering](/cursor-tooltip-ts.gif)

## Running the compiler

Run the following terminal command from the root of your project

```sh
yarn dev-hello-ts
```
You should see something in your terminal like

```sh
hello-ts: 12:01:57 PM - Starting compilation in watch mode...
```

Note that within the "hello-ts" project, a `./dist` folder has appeared, 
and inside it is an `index.js` file. Open this file -- it will be a _mess_

### Changing target language level

Now, go to your `hello-ts/tsconfig.json` and change the "compilerOptions.target" property

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

### Types of modules

Did you notice that the `export` keyword was still present in the build output for our program? We're generating [ES2015 modules][ESM] from our TypeScript source. Try to run this file via node

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

Node expects [CommonJS modules][CJS] [^1], so we'll have to tell TypeScript to output
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
    await timeout(500);
    return a + b;
}
/// ---cut---
exports.addNumbers = addNumbers;
```
This is an indication that we're emitting CommonJS modules! Let's try running
this program with `node` one more time

```sh
node packages/hello-ts/dist/index.js
```
If your program works correctly at this point, you should see it pause for a short
time and then print `7` to the console, before ending successfully.


[^1]: There are certainly ways of making modern versions of Node happy to run [ES2015 modules][ESM], and they'll likely soon be the default type of JS module, but `.js` files passed directly into `node` with no flags or other arguments are still treated as CommonJS

CONGRATS! You've just written your first TypeScript program!

[ESM]:(https://en.wikipedia.org/wiki/ECMAScript#6th_Edition_%E2%80%93_ECMAScript_2015) 
[CJS]:(https://en.wikipedia.org/wiki/CommonJS)