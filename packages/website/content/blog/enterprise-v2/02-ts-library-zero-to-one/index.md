---
title: TypeScript Libraries - Zero to One
date: "2023-10-27T09:00:00.000Z"
description: |
  We'll code together to create a new library from scratch, and incrementally add build tools, linting, testing and even automatic API documentation
course: enterprise-v2
order: 2
---

## A "bare bones" TypeScript Library Setup

Let's start by creating new small library from nothing, so you can see how my "lots of value out of few tools" approach keeps things nice and simple.

## Getting Started

### Installing `volta`

First, make sure you have the latest version of [`volta`](https://volta.sh) installed on your machine

If you're using a POSIX-compliant operating system like macOS, linux or Windows with [Windows Subsystem for Linux (WSL)](https://learn.microsoft.com/en-us/windows/wsl/install) run

```sh
curl https://get.volta.sh | bash
```

If you want to install volta for native windows support (e.g. powershell or `cmd.exe`), you can install the latest `.msi` package from [the latest release](https://github.com/volta-cli/volta/releases/).

Follow the installation instructions you may see as part of the installation process, which may involve **closing your terminal and opening it again to start a new session**.

### Installing `node` and `yarn` through volta

Have volta download versions of node and yarn

```sh
volta install node@lts yarn@^3.0.0
```

You should see it download the appropriate versions of `node` and `yarn`.

```sh
success: installed and set node@18.18.2 as default
success: installed and set yarn@3.6.4 as default
```

It's not important what specific versions these are, as part of what volta does for us is ensure you obtain and use the right versions for each project.

## Cloning the project repo

clone the workshop project

```sh
git clone git@github.com:mike-north/typescript-courses
cd typescript-courses
yarn
```

You may see volta obtain a new version of `yarn` and `node` (if necessary), and then it should install all of the relevant dependencies

## The beginnings of the project

First, create a new directory in the `packages/` folder and enter it

```sh
cd packages
mkdir chat-stdlib
cd chat-stdlib
```

Then, create a `.gitignore` file

```sh
npx gitignore node
```

and a package.json file

```sh
yarn init --yes
yarn config set nodeLinker node-modules
```

Add the following fields your `packages/chat-stdlib/package.json` file

```json
 {
   "main": "dist/index.js",
   "types": "dist/index.d.ts",
   "scripts": {
     "build": "yarn tsc",
     "dev": "yarn build --watch --preserveWatchOutput",
     "lint": "yarn eslint src --ext js,ts",
     "test": "yarn jest"
   },
   "license": "NOLICENSE"
 }
```

and **make sure to save the file**. This ensures that TS and non-TS consumers alike can use this library, and that we can run the following commands

```sh
yarn build   # build the project
yarn dev     # build, and rebuild when source is changed
yarn lint    # run linting
yarn test    # run tests
```

These commands won't do anything yet, because each of them requires a tool we have yet to install

Pin the node and yarn versions to their current stable releases using volta

```sh
volta pin node@lts yarn@^3
```

this will add `node` and `yarn` versions to your `package.json` automatically.

```diff
+ "volta": {
+   "node": "18.18.2",
+   "yarn": "3.6.4"
+ }
```

Note that we're using an LTS version of `node`, which is what the Node.js project tells us to do

> LTS release status is "long-term support", which typically guarantees that critical bugs will be fixed for a total of 30 months. **Production applications should only use Active LTS or Maintenance LTS releases.**

Source: [nodejs.dev/en/about/releases/](https://nodejs.dev/en/about/releases/)

## TypeScript Compiler

Install typescript as a `devDependency`, which establishes two important things

- TypeScript is included at build time, and not packaged with the library as a runtime dependency
- Consumers of this library do not need to use the same version of TypeScript being used to build this library. They don't necessarily need to use TypeScript at all.

```sh
yarn add -D typescript@5.3.0-beta
```

## Setting up your tsconfig

Create a default `tsconfig.json`

```sh
yarn tsc --init
```

And add a compiler option to ensure that we target the ES2022 language level (allowing for features like `async` and `await`, as well as Ecma privave `#fields`).

```diff
  "compilerOptions": {
    /* Language and Environment */
+   "target": "ES2022",
  }
```

Next, let's change some settings to customize the how the TypeScript compiler treats modules

- tell the TS compiler to create Node-friendly CommonJS modules
- require _explicit specification of types_ that should be used in the `src/` folder, as opposed to allowing free reign to access anything that might be in the `node_modules` folder

```diff
  "compilerOptions": {
    /* Modules */
+   "module": "commonjs",
+   "rootDir": "src",
+   "types": [],
  }
```

Next, let's describe the _output_ of the TS compiler, ensuring that everything ends up in the `/dist` folder, declaration (`.d.ts`) files are emitted as well, and any types marked with the JSDoc tag `@internal` are omitted from publicly visible types

```diff
  "compilerOptions": {
    /* Emit */
+   "declaration": true,
+   "outDir": "dist",
+   "stripInternal": true, 
  },
```

Let's make sure two potentially problematic features are _disabled_. We'll talk later about why these are not great to leave enabled for a library.

```diff
  "compilerOptions": {
    /* Interop Constraints */
+   "esModuleInterop": false,
    /* Completeness */
+   "skipLibCheck": false
  }
```

Let's make sure that we have an "extra strict" type-checking configuration, appropriate for a green field typescript library.

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
    /* Type Checking */
+   "strict": true,
+   "useUnknownInCatchVariables": true,
+   "noUnusedLocals": true,
+   "noUnusedParameters": true,
+   "exactOptionalPropertyTypes": true,
+   "noImplicitReturns": true,
+   "noUncheckedIndexedAccess": true,                
+   "noImplicitOverride": true,
+   "noPropertyAccessFromIndexSignature": true,      
  }
```

We'll go in to more detail later about what some of these options mean, and why I suggest setting them this way.

Finally we need to define an area for our source code. Add one more line to your `tsconfig.json`

```diff
{
  "compilerOptions": {
    ... 
- }
+ },
+ "include": ["src", ".eslintrc.js"]
}
```

create a folder for your source code, and make an empty `index.ts` file within it

```sh
mkdir src
touch src/index.ts
```

Open `src/index.ts` and set its contents to the following

```ts
/**
 * @packageDocumentation A small library for common chat app functions
 */

/**
 * A class that represents a deferred operation.
 * @public
 */
export class Deferred<T> {
    // The promise object associated with the deferred operation.
    #_promise: Promise<T>
    /**
     * The function to call to resolve the deferred operation.
     */
    #_resolve!: Parameters<ConstructorParameters<typeof Promise<T>>[0]>[0]
    /**
     * The function to call to reject the deferred operation.
     */
    #_reject!: Parameters<ConstructorParameters<typeof Promise<T>>[0]>[1]
    /**
     * Creates a new instance of the Deferred class.
     */
    constructor() {
        this.#_promise = new Promise<T>((resolve, reject) => {
            this.#_resolve = resolve
            this.#_reject = reject
        })
    }

    /**
     * Gets the promise object associated with the deferred operation.
     */
    get promise() {
        return this.#_promise
    }

    /**
     * Gets the function to call to resolve the deferred operation.
     */
    get resolve() {
        return this.#_resolve
    }

    /**
     * Gets the function to call to reject the deferred operation.
     */
    get reject() {
        return this.#_reject
    }
}

/**
 * Stringify an Error instance
 * @param err - The error to stringify
 * @internal
 */
export function stringifyErrorValue(err: Error): string {
    return `${err.name.toUpperCase()}: ${err.message}
    ${err.stack || '(no stack trace information)'}`
}

/**
 * Stringify a thrown value
 *
 * @param errorDescription - A contextual description of the error
 * @param err - The thrown value
 * @beta
 */
export function stringifyError(err: unknown, errorDescription?: string) {
    return `${errorDescription ?? "( no error description )"}\n${err instanceof Error
            ? stringifyErrorValue(err)
            : err
                ? '' + err
                : '(missing error information)'
        }`
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

Make a commit! We have working build script.

```sh
git add -A ../..
git commit -m "Build is working"
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
    <dd>JavaScript modules (import/export)</dd>
    <dt>Which framework does your project use?</dt>
    <dd>None of these</dd>
    <dt>Does your project use TypeScript?</dt>
    <dd>Yes</dd>
    <dt>Where does your code run?</dt>
    <dd>

**Both** (check both options)

</dd>
    <dt>What format do you want your config file to be in?</dt>
    <dd>JavaScript</dd>
    <dt>Would you like to install them now?</dt>
    <dd>Yes</dd>
    <dt>Which package manager are you using?</dt>
    <dd>yarn</dd>
</dl>

Let's also enable a set of rules that take advantage of type-checking information

```diff
--- a/packages/chat-stdlib/.eslintrc.js
+++ b/packages/chat-stdlib/.eslintrc.js
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
--- a/packages/chat-stdlib/.eslintrc.js
+++ b/packages/chat-stdlib/.eslintrc.js
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

Going back to our `/.eslintrc.js`, we need to tell ESLint about this new TS config -- rules that require type-checking need to know about where it is

```diff
--- a/packages/chat-stdlib/.eslintrc.js
+++ b/packages/chat-stdlib/.eslintrc.js
@@ -4,14 +4,17 @@
   "parserOptions": {
-    "ecmaVersion": "latest"
+    "ecmaVersion": "latest",
+    "project": true,
+    "tsconfigRootDir": __dirname
   },
 }
```

While we're in here, let's set up some different rules for our test files compared to our source files, by adding a new object to the `overrides` array

```json
 {
     "files": "tests/**/*.ts",
     "env": { "node": true, "jest": true }
 }
```

And one more modification to the override for the `.eslintrc.js` file itself

```json
  extends: ["plugin:@typescript-eslint/disable-type-checked"],
  rules: {
    "@typescript-eslint/no-unsafe-assignment": "off",
  }
```

Let's make sure this works by running

```sh
yarn lint
```

You should see a linting error

```pre
.../typescript-courses/packages/chat-stdlib/src/index.ts
  75:24  error  Invalid operand for a '+' operation. Operands must
                each be a number or string, allowing a string + any
                of: `any`, `boolean`, `null`, `RegExp`, `undefined`.
                Got `{}` @typescript-eslint/restrict-plus-operands
  75:24  error  'err' will evaluate to '[object Object]' when stringified
```

The problem occurs here

```ts twoslash
export function stringifyErrorValue(err: Error): string {
    return `${err.name.toUpperCase()}: ${err.message}
    ${err.stack || '(no stack trace information)'}`
}
/// ---cut---
/**
 * Stringify a thrown value
 *
 * @param errorDescription - A contextual description of the error
 * @param err - The thrown value
 * @beta
 */
export function stringifyError(err: unknown, errorDescription?: string) {
  return `${errorDescription ?? "( no error description )"}\n${err instanceof Error
    ? stringifyErrorValue(err)
    : err
      ? '' + err
//            ^?
      : '(missing error information)'
  }`
}
```

ESLint is warning us about a `{} -> string` coercion using the `+` operator. We can either change this to use the `String` constructor

```diff
-      ? '' + err
+      ? String(err)
```

Running `lint` again should indicate that ESLint no longer objects.

```sh
yarn lint
```

Make a commit! We have working lint command.

```sh
git add -A .
git commit -m "Linting with ESLint is working"
```

## Testing

Next, let's install our test runner, and associated type information, along with some required babel plugins

```sh
yarn add -D jest @types/jest @babel/core @babel/preset-env @babel/preset-typescript
```

and make a folder for our tests, and create a file to contain the tests for our `src/index.ts` module

```sh
mkdir tests
touch tests/index.test.ts
```

### `tests/index.test.ts`

```ts twoslash
// @filename: node_modules/chat-stdlib/index.ts
// @types: jest
export class Deferred<T> {
    // The promise object associated with the deferred operation.
    #_promise: Promise<T>
    /**
     * The function to call to resolve the deferred operation.
     */
    #_resolve!: Parameters<ConstructorParameters<typeof Promise<T>>[0]>[0]
    /**
     * The function to call to reject the deferred operation.
     */
    #_reject!: Parameters<ConstructorParameters<typeof Promise<T>>[0]>[1]
    /**
     * Creates a new instance of the Deferred class.
     */
    constructor() {
        this.#_promise = new Promise<T>((resolve, reject) => {
            this.#_resolve = resolve
            this.#_reject = reject
        })
    }

    /**
     * Gets the promise object associated with the deferred operation.
     */
    get promise() {
        return this.#_promise
    }

    /**
     * Gets the function to call to resolve the deferred operation.
     */
    get resolve() {
        return this.#_resolve
    }

    /**
     * Gets the function to call to reject the deferred operation.
     */
    get reject() {
        return this.#_reject
    }
}


/**
 * Stringify an Error instance
 * @param err - The error to stringify
 * @internal
 */
export function stringifyErrorValue(err: Error): string {
    return `${err.name.toUpperCase()}: ${err.message}
${err.stack || '(no stack trace information)'}`
}

/**
 * Stringify a thrown value
 *
 * @param errorDescription - A contextual description of the error
 * @param err - The thrown value
 * @beta
 */
export function stringifyError(err: unknown, errorDescription?: string) {
    return `${errorDescription ?? "( no error description )"}\n${err instanceof Error
            ? stringifyErrorValue(err)
            : err
                ? String(err)
                : '(missing error information)'
        }`
}
/// ---cut---
// @filename: tests/index.test.ts
import { Deferred, stringifyError } from 'chat-stdlib'

describe('Utils - Deferred', () => {
  let deferred: Deferred<string>

  beforeEach(() => {
    deferred = new Deferred()
  })

  it('should create a new instance with a promise', () => {
    expect(deferred.promise).toBeInstanceOf(Promise)
  })

  it('should resolve the promise when calling resolve', async () => {
    const testValue = 'Resolved Value'
    deferred.resolve(testValue)

    await expect(deferred.promise).resolves.toBe(testValue)
  })

  it('should reject the promise when calling reject', async () => {
    const testError = new Error('Rejected Error')
    deferred.reject(testError)

    await expect(deferred.promise).rejects.toThrow(testError)
  })

  it('should have resolve and reject methods', () => {
    expect(typeof deferred.resolve).toBe('function')
    expect(typeof deferred.reject).toBe('function')
  })
})


describe('Utils - stringifyError', () => {
  it('should stringify an Error instance correctly', () => {
    const errorDescription = 'Test Error'
    const testError = new Error('This is a test error')
    const expectedString = `${errorDescription}\n${testError.name.toUpperCase()}: ${
      testError.message
    }\n${testError.stack}`

    const result = stringifyError(testError, errorDescription)

    expect(result).toBe(expectedString)
  })

  it('should stringify a non-Error value correctly', () => {
    const errorDescription = 'Test Error'
    const testValue = 'This is a test value'
    const expectedString = `${errorDescription}\n${testValue}`

    const result = stringifyError(testValue, errorDescription)

    expect(result).toBe(expectedString)
  })

  it('should handle missing error information', () => {
    const errorDescription = 'Test Error'
    const expectedString = `${errorDescription}\n(missing error information)`

    const result = stringifyError(null, errorDescription)

    expect(result).toBe(expectedString)
  })

  it('should handle Error instance without a stack trace', () => {
    const errorDescription = 'Test Error'
    const testError = new Error('This is a test error without stack')
    delete testError.stack
    const expectedString = `${errorDescription}\n${testError.name.toUpperCase()}: ${
      testError.message
    }\n(no stack trace information)`

    const result = stringifyError(testError, errorDescription)

    expect(result).toBe(expectedString)
  })
})
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

### `tests/tsconfig.json`

```json
{
  "extends": "../tsconfig.json",
  "references": [{ "name": "chat-stdlib", "path": ".." }],
  "compilerOptions": {
    "types": ["jest"],
    "rootDir": ".."
  },
  "include": ["."]
}
```

and a small little babel config at the root of our project, so that Jest can understand TypeScript

### `.babelrc`

```json
{
  "presets": [
    ["@babel/preset-env", { "targets": { "node": "18" } }],
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
  Utils - Deferred
    ✓ should create a new instance with a promise (2 ms)
    ✓ should resolve the promise when calling resolve
    ✓ should reject the promise when calling reject (3 ms)
    ✓ should have resolve and reject methods
  Utils - stringifyError
    ✓ should stringify an Error instance correctly
    ✓ should stringify a non-Error value correctly
    ✓ should handle missing error information
    ✓ should handle Error instance without a stack trace (1 ms)

Test Suites: 1 passed, 1 total
Tests:       8 passed, 8 total
Snapshots:   0 total
Time:        0.357 s, estimated 1 s
Ran all test suites.
```

Make a commit! We have the beginnings of a test suite in place.

```sh
git add -A .
git commit -m "Testing with Jest is working"
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
diff --git a/packages/chat-stdlib/api-extractor.json b/packages/chat-stdlib/api-extractor.json
index c5b47c8..51da632 100644
--- a/packages/chat-stdlib/api-extractor.json
+++ b/packages/chat-stdlib/api-extractor.json
@@ -43,11 +43,11 @@
    * The path is resolved relative to the folder of the config file that contains the setting; to change this,
    * prepend a folder token such as "<projectFolder>".
    *
    * SUPPORTED TOKENS: <projectFolder>, <packageName>, <unscopedPackageName>
    */
-  "mainEntryPointFilePath": "<projectFolder>/lib/index.d.ts",
+  "mainEntryPointFilePath": "<projectFolder>/dist/index.d.ts",
 
   /**
    * A list of NPM package names whose exports should be treated as part of this package.
    *
    * For example, suppose that Webpack is used to generate a distributed bundle for the project "library1",
@@ -239,11 +239,11 @@
    */
   "dtsRollup": {
     /**
      * (REQUIRED) Whether to generate the .d.ts rollup file.
      */
-    "enabled": true
+    "enabled": true,
 
     /**
      * Specifies the output path for a .d.ts rollup file to be generated without any trimming.
      * This file will include all declarations that are exported by the main entry point.
      *
@@ -253,11 +253,11 @@
      * prepend a folder token such as "<projectFolder>".
      *
      * SUPPORTED TOKENS: <projectFolder>, <packageName>, <unscopedPackageName>
      * DEFAULT VALUE: "<projectFolder>/dist/<unscopedPackageName>.d.ts"
      */
-    // "untrimmedFilePath": "<projectFolder>/dist/<unscopedPackageName>.d.ts",
+    "untrimmedFilePath": "<projectFolder>/dist/<unscopedPackageName>-private.d.ts",
 
     /**
      * Specifies the output path for a .d.ts rollup file to be generated with trimming for an "alpha" release.
      * This file will include only declarations that are marked as "@public", "@beta", or "@alpha".
      *
@@ -265,11 +265,11 @@
      * prepend a folder token such as "<projectFolder>".
      *
      * SUPPORTED TOKENS: <projectFolder>, <packageName>, <unscopedPackageName>
      * DEFAULT VALUE: ""
      */
-    // "alphaTrimmedFilePath": "<projectFolder>/dist/<unscopedPackageName>-alpha.d.ts",
+    "alphaTrimmedFilePath": "<projectFolder>/dist/<unscopedPackageName>-alpha.d.ts",
 
     /**
      * Specifies the output path for a .d.ts rollup file to be generated with trimming for a "beta" release.
      * This file will include only declarations that are marked as "@public" or "@beta".
      *
@@ -277,11 +277,11 @@
      * prepend a folder token such as "<projectFolder>".
      *
      * SUPPORTED TOKENS: <projectFolder>, <packageName>, <unscopedPackageName>
      * DEFAULT VALUE: ""
      */
-    // "betaTrimmedFilePath": "<projectFolder>/dist/<unscopedPackageName>-beta.d.ts",
+    "betaTrimmedFilePath": "<projectFolder>/dist/<unscopedPackageName>-beta.d.ts",
 
     /**
      * Specifies the output path for a .d.ts rollup file to be generated with trimming for a "public" release.
      * This file will include only declarations that are marked as "@public".
      *
```

Make an empty `/etc` folder

```sh
mkdir etc
```

and then run api-extractor for the first time

```sh
yarn api-extractor run --local
```

This should result in a new file being created: `/etc/chat-stdlib.api.md`. This is
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
+# API Extractor working folder
+temp
```

you may also notice that some new `.d.ts` files are in your `/dist` folder.
Take a look at the contents. Do you see anything interesting?

The last step we need to handle here is making `dist/chat-stdlib.d.ts` the types that should be used by consumers of our module. Make this change to `packages/chat-stdlib/package.json`

```json
- "types": "dist/index.d.ts"
+ "types": "dist/chat-stdlib.d.ts"
```

## API Docs

We can use `api-documenter` to create markdown API docs by running

```sh
yarn api-documenter markdown -i temp -o docs
```

This should result in the creation of a `/docs` folder containing the markdown pages. **Take a moment to look at these!**

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

Make a commit! We have API extraction and a documentation generator in place.

```sh
git add -A .
git commit -m "API Extractor and API Documenter are working"
```

## Making a change that affects our API

Let's "enhance" our library by requiring that our `stringifyError` function _always_ be passed a `errorDescription` of type `string`. Just remove the optional `?` aspect of the `errorDescription`'s type annotation.

```diff
--- a/packages/chat-stdlib/src/index.ts
+++ b/packages/chat-stdlib/src/index.ts
@@ -68,7 +68,7 @@ ${err.stack || '(no stack trace information)'}`
  * @param err - The thrown value
  * @beta
  */
-export function stringifyError(err: unknown, errorDescription?: string) {
+export function stringifyError(err: unknown, errorDescription: string) {
     return `${errorDescription ?? "( no error description )"}\n${err instanceof Error
             ? stringifyErrorValue(err)
             : errurn sum2(a, b) + sum2(c, d);
 }
```

Now run

```sh
yarn build-with-docs
```

You should see something like

```pre
Warning: You have changed the public API signature for this project. 
  Please copy the file "temp/chat-stdlib.api.md" to "etc/chat-stdlib.api.md",
  or perform a local build (which does this automatically). See the Git
  repo documentation for more info.
```

This is `api-extractor` telling you that something that users can observe
through the public API surface of this library has changed. We can follow its instructions
to indicate that this was an _intentional change_ (and probably a minor release instead of a patch)

```sh
cp temp/chat-stdlib.api.md etc
```

and build the docs again

```sh
yarn build-with-docs
```

You should now see an updated api-report. It's now very easy to see the ramifications of changes to our API surface on a per-code-change basis! **Imagine how much easier this makes discussions about public API changes in pull requests!**

```diff
--- a/packages/chat-stdlib/etc/chat-stdlib.api.md
+++ b/packages/chat-stdlib/etc/chat-stdlib.api.md
@@ -13,6 +13,6 @@ export class Deferred<T> {
 }
 
 // @beta
-export function stringifyError(err: unknown, errorDescription?: string): string;
+export function stringifyError(err: unknown, errorDescription: string): string;
```

Our documentation has also been updated automatically

```diff
index 4d4dda0..fa4d35d 100644
--- a/packages/chat-stdlib/docs/chat-stdlib.stringifyerror.md
+++ b/packages/chat-stdlib/docs/chat-stdlib.stringifyerror.md
@@ -12,7 +12,7 @@ Stringify a thrown value
 **Signature:**

 ` ``typescript
-export declare function stringifyError(err: unknown, errorDescription?: string): string;
+export declare function stringifyError(err: unknown, errorDescription: string): string;
 ` ``

## Parameters

@@ -20,7 +20,7 @@ export declare function stringifyError(err: unknown, errorDescription?: string):
 |  Parameter | Type | Description |
 |  --- | --- | --- |
 |  err | unknown | The thrown value |
-|  errorDescription | string | _(Optional)_ A contextual description of the error |
+|  errorDescription | string | A contextual description of the error |

 **Returns:**
```

Make a commit! We've introduced the first change to our library's public API

```sh
git add -A .
git commit -m "BREAKING: stringifyError - errorDescription is now required"
```

Congrats! we now have

- Compiling to JS
- Linting
- Tests
- Docs
- API surface change detection

without having to reach for more complicated tools like webpack!
