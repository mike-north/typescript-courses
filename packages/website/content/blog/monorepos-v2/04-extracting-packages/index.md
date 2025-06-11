---
title: Extracting Packages
date: "2025-06-12T09:00:00.000Z"
description: |
  Let's start teasing packages out of our ui package, explore pnpm workspace references, and get a holistic "dev" script working
course: monorepos-v2
order: 4
---
Ok, so technicall we have a workspace now, but we haven't realized any benefits yet. Everything is sort of still in one package. _Let's change that_

## The `@seeds/server` package

Make a new `packages/server` folder

```sh
mkdir -p packages/server/src
mkdir -p packages/server/tests
```
Move the contents of 
* `packages/ui/src/server` into our new `src` subfolder
* `packages/ui/tests/server` into our new `tests` subfolder
```sh
mv packages/ui/src/server/* packages/server/src
mv packages/ui/tests/server/* packages/server/tests
```

Now we need a very basic `packages/server/package.json`. Let's start with this

```json
{
  "name": "@seeds/server",
  "private": true,
  "version": "0.0.0",
  "type": "module"
}
```
Now, our ui pakcage has a `dev-server` script that seems useful. Let's bring that over (this time as a `dev` script, since this package _is_ the server). Bring the lint and test scripts as well.

```json
  "scripts": {
    "dev": "tsx --watch --watch-preserve-output src/index.ts",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "lint": "eslint ."
  }
```
Remember to change that path in the `dev` script -- it should point to `src/index.ts`

Let's also add `build` script (this was entirely lacking before) -- it's an excuse for us to tackle some interesting tsconfig-related issues

```json
{
  "scripts": {
    "build": "tsc -P tsconfig.build.json"
  }
}
```
this `tsconfig.build.json` file doesn't exist yet, so this script won't work, but let's outline what we plan to do

## TS configs, for authoring feedback and builds
We have a couple of needs we want to meet

What we want in terms of type-checking:
* Authoring-time feedback in our IDE based **and this includes feedback when writing our tests**
* A `check` npm script that alerts us to errors in `src` and `test` (and anything else we care about)
* When we build, we want to only compile the `src` folder


Grab your `packages/ui/tsconfig.json` and move it to the project root.
```sh
mv packages/ui/tsconfig.json tsconfig.json
```
You're going to have to edit the paths in the `includes` array to point to files within any subfolder of `packages`.

```json
{
    "include": [
    "packages/*/src/**/*.ts",
    "packages/*/src/**/*.js",
    "packages/*/src/**/*.svelte",
    "packages/*/tests/**/*.ts",
    "packages/*/tests/**/*.js",
    "packages/*/tests/**/*.svelte",
    "packages/*/tailwind.config.js",
    "packages/*/postcss.config.cjs",
    "packages/*/vite.config.ts",
    "packages/*/svelte.config.js",
    "packages/*/eslint.config.mts"
  ],
}
```

Now create a new `packages/ui/tsconfig.json` file that extends the root `tsconfig.json`

```json
{
  "extends": "../tsconfig.json"
}
```
After this change, it's a good idea to restart your TS language server in your IDE to make sure everything is working as expected.

This root-level `tsconfig.json` is going to be the source of truth for "strictness" compiler settings across your entire monorepo. You can of course make package-level customizations if you need to, but it's useful to have a single place to set your defaults.

Now let's go back to our server package and create a new `tsconfig.json` file that extends the root `tsconfig.json`

```json
{
  "extends": "../../tsconfig.json"
}
```

and a `packages/server/tsconfig.build.json` file that extends the server-level `./tsconfig.json`, but specifically emits files and writes them to the `dist` folder. This should only include the `src` folder.

`packages/server/tsconfig.build.json`
```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "noEmit": false
  },
  "include": [
    "src/**/*"
  ]
}
```
Why extend the server package's `tsconfig.json`? Because we want to make sure that we're using the same strictness for visual feedback in our IDE and the build, but we also want to make sure that we're only compiling the `src` folder.

Now we can add a `check` script to our server package's `package.json`

`packages/server/package.json`
```json
{
  "scripts": {
    "check": "tsc -p tsconfig.json"
  }
}
```

Ok, try the build by running `pnpm run build` -- it should fail, but that's expected. We are missing dependencies!

Copy the `dependencies` and `devDependencies` from `packages/ui/package.json` into `packages/server/package.json`, and..
* in the server package, remove the `devDependencies` that seem svelte, browser-testing and CSS related
* in the UI package, remove the `devDependencies` that seem server-related, and _all_ runtime dependencies (svelte needs none)

I ended up with the following:
(the `dependencies` object has been removed entirely)

`packages/ui/package.json`
```json
 "devDependencies": {
    "@eslint/js": "^9.28.0",
    "@sveltejs/vite-plugin-svelte": "^5.0.3",
    "@tailwindcss/postcss": "^4.1.8",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/svelte": "^5.2.8",
    "@tsconfig/svelte": "^5.0.4",
    "@vitest/coverage-v8": "^3.2.3",
    "@vitest/ui": "^3.2.3",
    "autoprefixer": "^10.4.21",
    "concurrently": "^9.1.2",
    "daisyui": "^5.0.43",
    "eslint": "^9.28.0",
    "jsdom": "^26.1.0",
    "postcss": "^8.5.4",
    "prettier": "^3.5.3",
    "prettier-plugin-svelte": "^3.4.0",
    "sass-embedded": "^1.89.2",
    "svelte": "^5.28.1",
    "svelte-check": "^4.1.6",
    "tailwindcss": "^4.1.8",
    "typescript": "~5.8.3",
    "typescript-eslint": "^8.34.0",
    "vite": "^6.3.5",
    "vitest": "^3.2.3"
  }
```


`packages/server/package.json`
```json
  "devDependencies": {
    "@eslint/js": "^9.28.0",
    "@types/cors": "^2.8.19",
    "@types/express": "^5.0.3",
    "@types/node": "^24.0.0",
    "@vitest/coverage-v8": "^3.2.3",
    "@vitest/ui": "^3.2.3",
    "concurrently": "^9.1.2",
    "eslint": "^9.28.0",
    "prettier": "^3.5.3",
    "tsx": "^4.20.0",
    "typescript": "~5.8.3",
    "typescript-eslint": "^8.34.0",
    "vitest": "^3.2.3"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^5.1.0",
    "winston": "^3.17.0",
    "yaml": "^2.8.0"
  }
```

Run `pnpm i` in the root to install the new dependencies.

If you go into the `packages/server` folder and run `pnpm build` you should see a `packages/server/dist` folder appear with some JS modules in it, but you'll also see some errors

```

src/load-data.ts:4:43 - error TS2307: Cannot find module '../models/seed-packet-collection.model' or its corresponding type declarations.

4 import { SeedPacketCollectionModel } from '../models/seed-packet-collection.model'
                                            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

src/server/load-data.ts:4:43 - error TS2307: Cannot find module '../models/seed-packet-collection.model' or its corresponding type declarations.

4 import { SeedPacketCollectionModel } from '../models/seed-packet-collection.model'
                                            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


Found 2 errors in 2 files.

Errors  Files
     1  src/load-data.ts:4
     1  src/server/load-data.ts:4
```
What's happening here, is that we depended on some files that haven't moved over into the server package. In fact, these model files are needed by _both_ the ui and server packages. We need a models package to solve this!

## The `@seeds/models` package

Let's create a new `packages/models` folder

```sh
mkdir -p packages/models/src
```

Copy the `package.json`, `tsconfig.json` and `tsconfig.build.json` files from `packages/server` into `packages/models`. We can use those as a starting point, but we'll need to make some changes.

First let's focus on the `package.json`. We'll need to
* Rename the package to `@seeds/models`
* Remove the `devDependencies` that seem server-related
* Remove `dependencies` entirely
* add a `"types"` field to the `package.json` that points to the `dist/index.d.ts` file
* add a `"main"` field to the `package.json` that points to the `dist/index.js` file

`packages/models/package.json`
```json
{
  "name": "@seeds/models",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "types": "dist/index.d.ts",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc -p tsconfig.build.json",
    "check": "tsc -p tsconfig.json",
    "dev": "tsx --watch --watch-preserve-output src/index.ts",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "lint": "eslint ."
  },
  "devDependencies": {
    "@eslint/js": "^9.28.0",
    "@types/node": "^24.0.0",
    "@vitest/coverage-v8": "^3.2.3",
    "@vitest/ui": "^3.2.3",
    "concurrently": "^9.1.2",
    "eslint": "^9.28.0",
    "prettier": "^3.5.3",
    "typescript": "~5.8.3",
    "typescript-eslint": "^8.34.0",
    "vitest": "^3.2.3"
  }
}
```
Run `pnpm i` in the root to install the new dependencies.

Next, we'll need to make one small change to the `packages/models/tsconfig.json` file -- ensure that we create declaration files for the `src` folder.

`packages/models/tsconfig.json`
```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "declaration": true,
  }
}
```

Now move the following files from `packages/ui` into `packages/models`

`packages/ui/src/models/seed-packet-collection.model.ts`
`packages/ui/src/models/seed-packet.model.ts`

```sh
mv packages/ui/src/models/seed-* packages/models/src/
```
and we'll need one more file in `packages/models/src` -- an `index.ts` file

`packages/models/src/index.ts`
```ts
export * from './seed-packet-collection.model'
export * from './seed-packet.model'
```

Now let's run the build command in the `packages/models` folder

```sh
pnpm --filter=@seeds/models build
```
and now should see a `packages/models/dist` folder appear with some JS modules in it **with declaration files**

```sh
ls packages/models/dist
> index.d.ts                        seed-packet-collection.model.js
> index.js                          seed-packet.model.d.ts
> seed-packet-collection.model.d.ts seed-packet.model.js
```

Now let's move the tests over
```sh
mkdir -p packages/models/tests                      # Create the tests folder
mv packages/ui/tests/models/* packages/models/tests # Move the tests
```

Now let's run the tests in the `packages/models` folder

```sh
pnpm --filter=@seeds/models test
```
The tests should pass!

## Inter-package dependencies
Now we have a `@seeds/models` package that we can depend on in our `@seeds/server` package. `pnpm` has a special syntax for this, called "workspace references".

`packages/server/package.json`
```json
  "dependencies": {
    "@seeds/models": "workspace:*"
  }
```
Run `pnpm i` in the root to install the new dependencies. We have to make one code change in `

`packages/server/src/load-data.ts`
``` diff ts
- import { SeedPacketCollectionModel } from '../models/seed-packet-collection.model'
+ import { SeedPacketCollectionModel } from '@seeds/models'
```

Now running the following commands in the project root should work

```sh
pnpm --filter=@seeds/server build
pnpm --filter=@seeds/server test
pnpm --filter=@seeds/models build
pnpm --filter=@seeds/models test
pnpm --filter=@seeds/ui build
pnpm --filter=@seeds/ui test
pnpm --filter=@seeds/ui lint
```
They should all complete successfully.
