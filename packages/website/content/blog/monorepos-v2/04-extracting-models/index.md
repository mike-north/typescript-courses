---
title: Extracting Models
date: "2025-06-12T09:00:00.000Z"
description: |
  We'll create a "models" package that both our ui and server depend on
course: monorepos-v2
order: 4
---

Ok, so technicall we have a workspace now, but we haven't realized any benefits yet. Everything is sort of still in one package. _Let's change that_

## The `@seeds/models` package

Let's create a new `packages/models` folder

```sh
mkdir -p packages/models/src
mkdir -p packages/models/tests
```

Move the contents of

- `packages/ui/src/models` into our new `src` subfolder
- `packages/ui/tests/models` into our new `tests` subfolder

```sh
mv packages/ui/src/models/* packages/models/src
mv packages/ui/tests/models/* packages/models/tests
```

You'll need to fix an import in the test file

```diff
import type {
 USDAHardinessZoneRangeMap,
 Distance,
- } from '../../src/models/seed-packet.model.js'
+ } from '../src/seed-packet.model.js'
```

Create a `packages/models/src/index.ts` file (the point will become clear in a moment)

```ts
export * from './seed-packet-collection.model.js'
export * from './seed-packet.model.js'
```

Now we need a very basic `packages/models/package.json`. Let's start with this

```json
{
  "name": "@seeds/models",
  "private": true,
  "version": "0.0.0",
  "type": "module"
}
```

We should add some basic dependencies. Some of you who are aware of spoilers may know I don't need all of these, but it's fine for now.

```json
{
  "devDependencies": {
    "@eslint/js": "^9.28.0",
    "@types/node": "^24.0.0",
    "@vitest/coverage-v8": "^3.2.3",
    "eslint": "^9.28.0",
    "prettier": "^3.5.3",
    "typescript": "~5.8.3",
    "typescript-eslint": "^8.34.0",
    "vite": "^6.3.5",
    "vitest": "^3.2.3"
  }
}
```

Run `pnpm i` in the root to set up these dependencies for this package, and then you should be able to run the tests and see that they work

```sh
pnpm --filter=@seeds/models test
```

## Exporting from the package root

This package is going to be a library, and we'll end up exporting everything from the _package root_. This means from outside of this package, you'll always import from `@seeds/models`.

```ts
import { ... } from '@seeds/models'
```

and ideally not something like. We'll actually take steps to prevent this later in the course.

```ts
import { ... } from '@seeds/models/src/seed-packet-collection.model'
```

Packages that depend on this one will need to find the entry point for both execution of the code and the types. Add a `"types"` field to the `package.json` that points to the `dist/index.d.ts` file. This is why we created the `src/index.ts` file -- it's the entry point for the package.

```json
{
  "types": "dist/index.d.ts",
  "main": "dist/index.js"
}
```

We can copy-paste some of the scripts from the `@seeds/ui` package into this one.

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "lint": "eslint ."
  }
}
```

Let's also add `build` and `dev` scripts -- it's an excuse for us to tackle some interesting tsconfig-related issues (we'll get to that in a moment)

```json
{
  "scripts": {
    "build": "tsc -p tsconfig.build.json",
    "dev": "tsc -p tsconfig.build.json --watch --preserveWatchOutput"
  }
}
```

this `tsconfig.build.json` file doesn't exist yet, so this script won't work

## TS configs, for authoring feedback and builds

We have a couple of needs we want to meet

What we want in terms of type-checking:

- Authoring-time feedback in our IDE based **and this includes feedback when writing our tests**
- A `check` npm script that alerts us to errors in `src` and `test` (and anything else we care about)
- When we build, we want to only compile the `src` folder

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
    "packages/*/tests/**/*.ts",
    "packages/*/tests/**/*.js"
  ]
}
```

Now create a new `packages/ui/tsconfig.json` file that extends the root `tsconfig.json`

```json
{
  "extends": "../../tsconfig.json",
  "include": [
    "src/**/*",
    "tests/**/*",
    "src/**/*.svelte",
    "tests/**/*.svelte",
    "tailwind.config.js",
    "postcss.config.cjs",
    "vite.config.ts",
    "svelte.config.js",
    "eslint.config.mts"
  ]
}
```

After this change, it's a good idea to restart your TS language server in your IDE to make sure everything is working as expected.

This root-level `tsconfig.json` is going to be the source of truth for "strictness" compiler settings across your entire monorepo. You can of course make package-level customizations if you need to, but it's useful to have a single place to set your defaults.

Now let's go back to our `@seeds/models` package and create a new `tsconfig.json` file that extends the root `tsconfig.json`. It's the same as we did for the ui package, but with different `include` paths.

```json
{
  "extends": "../../tsconfig.json",
  "include": ["src/**/*", "tests/**/*"]
}
```

and a `packages/models/tsconfig.build.json` file that extends the server-level `./tsconfig.json`, but specifically emits files and writes them to the `dist` folder. This should only include the `src` folder.

`packages/models/tsconfig.build.json`

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "noEmit": false
  },
  "include": ["src/**/*"]
}
```

Why extend the server package's `tsconfig.json`? Because we want to make sure that we're using the same strictness for visual feedback in our IDE and the build, but we also want to make sure that we're only compiling the `src` folder.

Now we can add a `check` script to our server package's `package.json`

`packages/models/package.json`

```json
{
  "scripts": {
    "check": "tsc -p tsconfig.json"
  }
}
```

Now try running

```sh
pnpm --filter=@seeds/models build
```

and it should succeed. We now have a library in our monorepo!

## Integrating `@seeds/models` into `@seeds/ui`

Now we need to integrate this new `@seeds/models` package into our `@seeds/ui` package -- after all, our svelte components need this code in order to compile.

Go to `packages/ui/package.json` and add `@seeds/models` to the `dependencies` object using the `workspace:*` syntax.

```json
  "dependencies": {
    "@seeds/models": "workspace:*"
  }
```

We're saying two things with this syntax:

- The `@seeds/models` package is a _workspace dependency_
- We're happy to use _any version of it_.

pnpm will bias toward the locally linked package if it meets this version requirement, and will fall back to checking an external package registry like `registry.npmjs.org`.

As usual, we've touched dependencies, so run `pnpm i` in the root to link everything up.

Now, from the workspace root, run `pnpm check` and you should see some import paths that need to be updated. For example

```diff
- import type { SeedPacketModel } from '../models/seed-packet.model'
+ import type { SeedPacketModel } from '@seeds/models'
```

Once you fix all the import paths, you should be able to run

```sh
pnpm build && \
pnpm test && \
pnpm check && \
pnpm format
```

and it should complete successfully! Note that we haven't included linting here -- we'll fix that later.

Next, let's disentangle the server from the UI part of the project, and factor it out into a new `@seeds/server` package.
