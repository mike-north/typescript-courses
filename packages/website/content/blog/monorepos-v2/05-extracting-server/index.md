---
title: Extracting Server
date: "2025-06-12T09:00:00.000Z"
description: |
  Let's start teasing packages out of our ui package, explore pnpm workspace references, and get a holistic "dev" script working
course: monorepos-v2
order: 5
---

## The `@seeds/server` package

Make a new `packages/server` folder

```sh
mkdir -p packages/server/src
mkdir -p packages/server/tests
```

Move the contents of

- `packages/ui/src/server` into our new `src` subfolder
- `packages/ui/tests/server` into our new `tests` subfolder

```sh
mv packages/ui/src/data packages/server
mv packages/ui/src/server/* packages/server/src
mv packages/ui/tests/server/* packages/server/tests
```

Now we need a very basic `packages/server/package.json`. Let's start with this

```json
  "name": "@seeds/server",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "dependencies": {
    "@seeds/models": "workspace:*"
  }
```
You touched `dependencies`, so run `pnpm i`.

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

Let's also add `build` and `dev` scripts -- copy these straight from the `@seeds/models` package.

```json
{
  "scripts": {
    "build": "tsc -p tsconfig.build.json",
    "dev": "tsc -p tsconfig.build.json --watch --preserveWatchOutput"
  }
}
```
Copy the `tsconfig.json` and `tsconfig.build.json` files from the `@seeds/models` package into the `@seeds/server` package.

```sh
cp packages/models/tsconfig.json packages/server/tsconfig.json
cp packages/models/tsconfig.build.json packages/server/tsconfig.build.json
```

Ok we're not quite done. We need still need external dependencies for this package -- it uses express, a logger, etc. Let's grab anything that doesn't seem obviously UI-related from `@seeds/ui`'s `package.json`


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
    "typescript": "5.7.0",
    "typescript-eslint": "^8.34.0",
    "vitest": "^3.2.3",
    "@seeds/models": "workspace:*"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^5.1.0",
    "winston": "^3.17.0",
    "yaml": "^2.8.0"
  }
```

And our ui package won't need some of these server-related things now, so let's slim that down (`dependencies` has been removed entirely)

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
    "typescript": "5.8.1",
    "typescript-eslint": "^8.34.0",
    "vite": "^6.3.5",
    "vitest": "^3.2.3"
  }
```
You can also get rid of the `volta` object in the ui's `package.json` at this time. You touched `dependencies`, so run `pnpm i`.

Now run
```sh
pnpm check
```
so that you can find any module import paths that need to be fixed. Once you get it passing, you should now be able to build and test everything across the repo now.

```sh
 pnpm build && pnpm test && pnpm check
```

You may notice that _linting_ doesn't work yet. Let's fix that next