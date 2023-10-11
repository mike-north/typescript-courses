<p align='left'>
 <a href="03-app-vs-library-concerns.md">◀ Back: App vs. Library Concerns</a>
</p>

---

# Mike's "bare bones" TS setup

In this part of the workshop, we'll create a new small library from nothing, so you can see how Mike's "lots of value out of few tools" approach keeps things nice and simple.

## Getting Started

First, create a new directory and enter it

```sh
mkdir my-lib
cd my-lib
```

Then, create a `.gitignore` file

```sh
npx gitignore node
```

and a package.json file

```sh
yarn init --yes
```

Make a few direct modifications to your `package.json` file as follows

```diff
--- a/package.json
+++ b/package.json
@@ -1,6 +1,13 @@
 {
   "name": "my-lib",
   "version": "1.0.0",
-  "main": "index.js",
+  "main": "dist/index.js",
+  "types": "dist/index.d.ts",
+  "scripts": {
+    "build": "tsc",
+    "dev": "yarn build --watch --preserveWatchOutput",
+    "lint": "eslint src --ext js,ts",
+    "test": "jest"
+  },
   "license": "MIT"
 }
```

This ensures that TS and non-TS consumers alike can use this library, and that we can run the following commands

```sh
yarn build   # build the project
yarn dev     # build, and rebuild when source is changed
yarn lint    # run the linter
yarn test    # run tests
```

Pin the node and yarn versions to their current stable releases using volta

```sh
volta pin node yarn
```

this will add `node` and `yarn` versions to your `package.json` automatically.

Next, initialize the git repository

```sh
git init
```

## TypeScript Compiler

install typescript as a development dependency. We'll only need this at build
time, because not all consumers of this library may be using TypeScript
themselves.

```sh
yarn add -D typescript
```

## Setting up your tsconfig

Create a default `tsconfig.json`

```sh
yarn tsc --init
```

and ensure the following values are set:

```diff
  "compilerOptions": {
+   "outDir": "dist",
+   "rootDirs": ["src"],
  },
+ "include": ["src"]
```

We want to make sure that the `src/` folder is where our source code lives, that it's treated as a root directory, and that the compiled output is in the `dist/` folder.

Next, make sure that the TS compiler creates Node-friendly CommonJS modules, and that we target the ES2018 language level (Node 10, allowing for features like `async` and `await`).

```diff
  "compilerOptions": {
+   "module": "commonjs",
+   "target": "ES2018",
  }
```

Let's make sure two potentially problematic features are _disabled_. We'll talk later about why these are not great for a library.

```diff
  "compilerOptions": {
+   "esModuleInterop": false,
+   "skipLibCheck": false
  }
```

Make sure that the compiler outputs ambient type information in addition to the JavaScript

```diff
  "compilerOptions": {
+   "declaration": true,
  }
```

And finally, let's make sure that we set up an "extra strict" type-checking configuration

```diff
  "compilerOptions": {
   /**
    * "strict": true,
    * -------------------
    * - noImplicitAny
    * - strictNullChecks
    * - strictFunctionTypes
    * - strictBindCallApply
    * - strictPropertyInitialization
    * - noImplicitThis
    * - alwaysStrict
    */
+   "strict": true,
+   "noUnusedLocals": true,
+   "noImplicitReturns": true,
+   "stripInternal": true,
+   "types": [],
+   "forceConsistentCasingInFileNames": true,
  }
```

We'll go in to more detail later about what some of these options mean, and why I suggest setting them this way.

Finally, please create a folder for your source code, and create an empty `index.ts` file within it

```sh
mkdir src
touch src/index.ts
```

Open `src/index.ts` and set its contents to the following

```ts
/**
 * @packageDocumentation A small library for common math functions
 */

/**
 * Calculate the average of three numbers
 *
 * @param a - first number
 * @param b - second number
 * @param c - third number
 *
 * @public
 */
export function avg(a: number, b: number, c: number): number {
  return sum3(a, b, c) / 3;
}

/**
 * Calculate the sum of three numbers
 *
 * @param a - first number
 * @param b - second number
 * @param c - third number
 *
 * @beta
 */
export function sum3(a: number, b: number, c: number): number {
  return sum2(a, sum2(b, c));
}

/**
 * Calculate the sum of two numbers
 *
 * @param a - first number
 * @param b - second number
 *
 * @internal
 */
export function sum2(a: number, b: number): number {
  const sum = a + b;
  return sum;
}
```

This is obviously convoluted, but it'll serve our purposes for looking at some interesting behavior later.

Let's make sure that things are working so far by trying to build this project.

```sh
rm -rf dist    # clear away any old compiled output
yarn build     # build the project
ls dist        # list the contents of the dist/ folder
```

You should see something like

```sh
index.d.ts index.js
```

## Linting

Install eslint as a development dependency

```sh
yarn add -D eslint
```

and go through the process of creating a starting point ESLint config file

```sh
yarn eslint --init
```

When asked, please answer as follows for the choices presented to you:

<dl>
    <dt>How would you like to use ESLint?</dt>
    <dd>To check syntax and find problems</dd>
    <dt>What type of modules does your project use</dt>
    <dd>None of these</dd>
    <dt>Which framework does your project use?</dt>
    <dd>None of these</dd>
    <dt>Does your project use TypeScript?</dt>
    <dd>Yes</dd>
    <dt>Where does your code run?</dt>
    <dd>Node</dd>
    <dt>What format do you want your config file to be in?</dt>
    <dd>JSON</dd>
    <dt>Would you like to install them now with npm?</dt>
    <dd>Yes</dd>
</dl>

Because we're using `yarn`, let's delete that `npm` file `package-lock.json` and run `yarn` to update `yarn.lock`.

```sh
rm package-lock.json
yarn
```

Let's also enable a set of rules that take advantage of type-checking information

```diff
--- a/.eslintrc.json
+++ b/.eslintrc.json
@@ -5,7 +5,8 @@
   },
   "extends": [
     "eslint:recommended",
-    "plugin:@typescript-eslint/recommended"
+    "plugin:@typescript-eslint/recommended",
+    "plugin:@typescript-eslint/recommended-requiring-type-checking"
   ],
   "parser": "@typescript-eslint/parser",
```

There's one rule we want to enable, and that's a preference for `const` over `let`. While we're here,
we can disable ESLint's rules for unused local variables and params, because the TS
compiler is responsible for telling us about those

```diff
--- a/.eslintrc.json
+++ b/.eslintrc.json
@@ -14,5 +14,6 @@
   },
   "plugins": ["@typescript-eslint"],
   "rules": {
+    "prefer-const": "error",
+    "@typescript-eslint/no-unused-vars": "off",
+    "@typescript-eslint/no-unused-params": "off"
   }
 }
```

ESLint needs a single tsconfig file that includes our entire project (including tests), so we'll need to make a small dedicated one

##### `/tsconfig.eslint.json`

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "types": ["jest"]
  },
  "include": ["src", "tests"]
}
```

Going back to our `/.eslintrc.json`, we need to tell ESLint about this new TS config -- rules that require type-checking need to know about where it is

```diff
--- a/.eslintrc.json
+++ b/.eslintrc.json
@@ -4,14 +4,17 @@
   "parserOptions": {
-    "ecmaVersion": 12
+    "ecmaVersion": 12,
+    "project": "tsconfig.eslint.json"
   },

 }
```

While we're in here, let's set up some different rules for our
test files compared to our source files

```diff
--- a/.eslintrc.json
+++ b/.eslintrc.json
@@ -15,5 +15,11 @@
   "plugins": ["@typescript-eslint"],
   "rules": {
     "prefer-const": "error"
-  }
+  },
+  "overrides": [
+    {
+      "files": "tests/**/*.ts",
+      "env": { "node": true, "jest": true }
+    }
+  ]
 }
```

Let's make sure this works by making a change to our `src/index.ts` that breaks our `prefer-const` rule

```diff
--- a/src/index.ts
+++ b/src/index.ts
@@ -33,5 +33,6 @@ export function sum3(a: number, b: number, c: number): number {
  * @internal
  */
 export function sum2(a: number, b: number): number {
-  return a + b;
+  let sum = a + b;
+  return sum;
 }
```

running

```sh
yarn lint
```

should tell us that this is a problem. If properly configured, you may also see feedback right in your code editor as well

![eslint error](img/eslint-error.png)

Undo the problematic code change, run `yarn lint` again and you should see no errors

## Testing

Next, let's install our test runner, and associated type information, along with some required babel plugins

```sh
yarn add -D jest @types/jest @babel/preset-env @babel/preset-typescript
```

and make a folder for our tests

```sh
mkdir tests
```

Create a file to contain the tests for our `src/index.ts` module

```sh
touch tests/index.test.ts
```

###### `tests/index.test.ts`

```ts
import { avg, sum3 } from '..';

describe('avg should calculate an average properly', () => {
  test('three positive numbers', () => {
    expect(avg(3, 4, 5)).toBe(4);
  });
  test('three negative numbers', () => {
    expect(avg(3, -4, -5)).toBe(-2);
  });
});

describe('sum3 should calculate a sum properly', () => {
  test('three positive numbers', () => {
    expect(sum3(3, 4, 5)).toBe(12);
  });
  test('three negative numbers', () => {
    expect(sum3(3, -4, -5)).toBe(-6);
  });
});
```

We'll need to make a one-line change in our existing `/tsconfig.json` file

```diff
--- a/tsconfig.json
+++ b/tsconfig.json
@@ -1,4 +1,5 @@
 {
   "compilerOptions": {
+    "composite": true,
```

and to create a small `tests/tsconfig.json` just for our tests

###### `tests/tsconfig.json`

```json
{
  "extends": "../tsconfig.json",
  "references": [{ "name": "my-lib", "path": ".." }],
  "compilerOptions": {
    "types": ["jest"],
    "rootDir": ".."
  },
  "include": ["."]
}
```

and a small little babel config at the root of our project, so that Jest can understand TypeScript

###### `.babelrc`

```json
{
  "presets": [
    ["@babel/preset-env", { "targets": { "node": "10" } }],
    "@babel/preset-typescript"
  ]
}
```

### Take it for a spin

At this point, we should make sure that everything works as intended before proceeding further.

Run

```sh
yarn test
```

to run the tests with jest. You should see some output like

```sh
 PASS  tests/index.test.ts
  avg should calculate an average properly
    ✓ three positive numbers (2 ms)
    ✓ three negative numbers
  sum3 should calculate a sum properly
    ✓ three positive numbers
    ✓ three negative numbers

Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
Snapshots:   0 total
Time:        1.125 s
Ran all test suites.
✨  Done in 1.74s.
```

## API Surface Report & Docs

We're going to use Microsoft's [api-extractor](https://api-extractor.com/) as our
documentation tool -- but it's really much more than that as we'll see later

First, let's install it

```sh
yarn add -D @microsoft/api-extractor @microsoft/api-documenter
```

and let's ask `api-extractor` to create a default config for us

```sh
 yarn api-extractor init
```

This should result in a new file `/api-extractor.json` being created. Open it
up and make the following changes

```diff
--- a/api-extractor.json
+++ b/api-extractor.json
@@ -45,7 +45,7 @@
    *
    * SUPPORTED TOKENS: <projectFolder>, <packageName>, <unscopedPackageName>
    */
-  "mainEntryPointFilePath": "<projectFolder>/lib/index.d.ts",
+  "mainEntryPointFilePath": "<projectFolder>/dist/index.d.ts",^M

   /**
    * A list of NPM package names whose exports should be treated as part of this package.
@@ -181,7 +181,7 @@
     /**
      * (REQUIRED) Whether to generate the .d.ts rollup file.
      */
-    "enabled": true
+    "enabled": true,^M

     /**
      * Specifies the output path for a .d.ts rollup file to be generated without any trimming.
@@ -195,7 +195,7 @@
      * SUPPORTED TOKENS: <projectFolder>, <packageName>, <unscopedPackageName>
      * DEFAULT VALUE: "<projectFolder>/dist/<unscopedPackageName>.d.ts"
      */
-    // "untrimmedFilePath": "<projectFolder>/dist/<unscopedPackageName>.d.ts",
+    "untrimmedFilePath": "<projectFolder>/dist/<unscopedPackageName>-private.d.ts",

     /**
      * Specifies the output path for a .d.ts rollup file to be generated with trimming for a "beta" release.
@@ -207,7 +207,7 @@
      * SUPPORTED TOKENS: <projectFolder>, <packageName>, <unscopedPackageName>
      * DEFAULT VALUE: ""
      */
-    // "betaTrimmedFilePath": "<projectFolder>/dist/<unscopedPackageName>-beta.d.ts",
+    "betaTrimmedFilePath": "<projectFolder>/dist/<unscopedPackageName>-beta.d.ts",

     /**
      * Specifies the output path for a .d.ts rollup file to be generated with trimming for a "public" release.
@@ -221,7 +221,7 @@
      * SUPPORTED TOKENS: <projectFolder>, <packageName>, <unscopedPackageName>
      * DEFAULT VALUE: ""
      */
-    // "publicTrimmedFilePath": "<projectFolder>/dist/<unscopedPackageName>-public.d.ts",
+    "publicTrimmedFilePath": "<projectFolder>/dist/<unscopedPackageName>-public.d.ts"

     /**
      * When a declaration is trimmed, by default it will be replaced by a code comment such as
```

Make an empty `/etc` folder

```sh
mkdir etc
```

and then run api-extractor for the first time

```sh
yarn api-extractor run --local
```

This should result in a new file being created: `/etc/my-lib.api.md`. This is
your api-report. There's also a `/temp` folder that will have been created. You
should add this to your `.gitignore`.

```diff
--- a/.gitignore
+++ b/.gitignore
@@ -114,3 +114,5 @@ dist
 .yarn/build-state.yml
 .yarn/install-state.gz
 .pnp.*
+
+temp
```

you may also notice that some new `.d.ts` files are in your `/dist` folder.
Take a look at the contents. Do you see anything interesting?

## API Docs

We can use `api-documenter` to create markdown API docs by running

```sh
yarn api-documenter markdown -i temp -o docs
```

This should result in the creation of a `/docs` folder containing the markdown pages.

Finally, we should make a couple of new npm scripts to help us easily
generate new docs by running `api-extractor` and `api-documenter` sequentially

```diff
--- a/package.json
+++ b/package.json
@@ -7,7 +7,10 @@
     "build": "tsc",
     "watch": "yarn build --watch --preserveWatchOutput",
     "lint": "eslint src tests --ext ts,js",
-    "test": "jest"
+    "test": "jest",
+    "api-report": "api-extractor run",
+    "api-docs": "api-documenter markdown -i temp -o docs",
+    "build-with-docs": "yarn build && yarn api-report && yarn api-docs"
   },
   "license": "MIT",
   "volta": {
```

Make a commit so you have a clean workspace.

```sh
git commit -am "setup api-extractor and api-documenter"
```

## Making a change that affects our API

Let's "enhance" our library by supporting a fourth number in `sum3()`

```diff
--- a/src/index.ts
+++ b/src/index.ts
@@ -21,11 +21,12 @@ export function avg(a: number, b: number, c: number): number {
  * @param a - first number
  * @param b - second number
  * @param c - third number
+ * @param d - fourth number
  *
  * @beta
  */
-export function sum3(a: number, b: number, c: number): number {
-  return sum2(a, sum2(b, c));
+export function sum3(a: number, b: number, c: number, d = 0): number {
+  return sum2(a, b) + sum2(c, d);
 }
```

Now run

```sh
yarn build-with-docs
```

You should see something like

```
Warning: You have changed the public API signature for this project. Please copy the file "temp/my-lib.api.md" to "etc/my-lib.api.md", or perform a local build (which does this automatically). See the Git repo documentation for more info.
```

This is `api-extractor` telling you that something that users can observe
through the public API surface of this library has changed. We can follow its instructions
to indicate that this was an _intentional change_ (and probably a minor release instead of a patch)

```sh
cp temp/my-lib.api.md etc
```

and build the docs again

```sh
yarn build-with-docs
```

You should now see an updated api-report. It's now very easy to see
the ramifications of changes to our API surface on a per-code-change basis!

```diff
diff --git a/etc/my-lib.api.md b/etc/my-lib.api.md
index fc8ea25..82c4ac4 100644
--- a/etc/my-lib.api.md
+++ b/etc/my-lib.api.md
@@ -8,7 +8,7 @@
 export function avg(a: number, b: number, c: number): number;

 // @beta
-export function sum3(a: number, b: number, c: number): number;
+export function sum3(a: number, b: number, c: number, d?: number): number;
```

Our documentation has also been updated automatically

```diff
--- a/docs/my-lib.md
+++ b/docs/my-lib.md
@@ -11,5 +11,5 @@ A small library for common math functions
 |  Function | Description |
 |  --- | --- |
 |  [avg(a, b, c)](./my-lib.avg.md) | Calculate the average of three numbers |
-|  [sum3(a, b, c)](./my-lib.sum3.md) | <b><i>(BETA)</i></b> Calculate the sum of three numbers |
+|  [sum3(a, b, c, d)](./my-lib.sum3.md) | <b><i>(BETA)</i></b> Calculate the sum of three numbers |

diff --git a/docs/my-lib.sum3.md b/docs/my-lib.sum3.md
index 8ab69a1..4ca8888 100644
--- a/docs/my-lib.sum3.md
+++ b/docs/my-lib.sum3.md
@@ -12,7 +12,7 @@ Calculate the sum of three numbers
 <b>Signature:</b>

 ` ``typescript
-export declare function sum3(a: number, b: number, c: number): number;
+export declare function sum3(a: number, b: number, c: number, d?: number): number;
 ` ``

## Parameters

@@ -22,6 +22,7 @@ export declare function sum3(a: number, b: number, c: number): number;
 | a | number | first number |
 | b | number | second number |
 | c | number | third number |
+| d | number | fourth number |

<b>Returns:</b>

```

Congrats! we now have

- Compiling to JS
- Linting
- Tests
- Docs
- API surface change detection

without having to reach for more complicated tools like webpack!

---

<p align='right'>
 <a href="./05-what-have-I-done.md">Next: ...What have I done? ▶</a>
</p>
