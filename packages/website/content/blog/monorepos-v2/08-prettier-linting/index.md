---
title: Code formatting
date: "2025-06-12T09:00:00.000Z"
description: |
  We'll set up some monorepo-level code formatting and linting that works seamlessly with your favorite code authoring tools
course: monorepos-v2
order: 8
---

We're missing some developer experience niceties due to our rearrangement of packages.

- Linting only works in the `@seeds/ui` package, and now we've moved code out of it that's not being linted
- Prettier used to work in this project, but it's now failing
- When you alt/command + click (or whatever your "jump to definition" shortcut is) on an import symbol that crosses monorepo package boundaries (e.g. something from `@seeds/models`), you're brought to the compiled declaration file, not the source `.ts` file
- We're not yet taking advantage of TypeScript project references, which allows for faster and better incremental builds

We'll fix all of these issues in this section.

## Formatting

Prettier is unhappy.

```sh
pnpm dlx prettier --write packages/*/src/**/*
> [error] Cannot find package 'prettier-plugin-svelte' ...
```

If you use the [prettier vscode extension](https://marketplace.cursorapi.com/items?itemName=esbenp.prettier-vscode) in vscode, cursor or a similar environment, it may have been erroring and trying to get your attention.

![prettier vscode extension error](./img/prettier-failing.png)

**This is symptomatic of us still having "project wide" tooling installed in individual monorepo packages.** In this case, we have a prettier plugin for svelte, and it's installed in the `@seeds/ui` package and thus not being picked up by the prettier command and the root-level `.prettierrc`.

Let's fix that by pulling prettier up into the root `package.json`

`/package.json`

```json
{
  "devDependencies": {
    "prettier": "^3.5.3",
    "prettier-plugin-svelte": "^3.4.0"
  }
}
```

Go ahead and remove prettier from the `@seeds/ui` package and any other packages that have it installed in their respective `package.json` files.

Run `pnpm install` for these changes to take effect.

Now run the command

```sh
pnpm dlx prettier --write packages/*/src/**/*
```

And you should see that it works! Wrap this up in a nice project-level script. This replaces the `@seeds/ui`'s `format` script, so you can remove it.

```json
"scripts": {
  "format": "prettier --write packages/*/{src,tests}/**/*.ts packages/*/{tailwind.config.js,postcss.config.cjs,vite.config.ts,svelte.config.js}"
}
```

So we can just run `pnpm format` to format all of our code in the entire repo.

## Linting

Linting works in the `@seeds/ui` package, but not in the `@seeds/server` oro `@seeds/models` packages. Similar to how we handled prettier, we need to hoist the eslint concept up to the _project level_.

Start by moving the eslint config from `@seeds/ui` to the root level of the workspace

```sh
mv packages/ui/eslint.config.mts .
```

This eslint config has _dependencies_, which must also be moved up to the workspace root

`/package.json`

```json
{
  "devDependencies": {
    "@eslint/js": "^9.28.0",
    "eslint": "^9.28.0",
    "typescript": "~5.8.3",
    "typescript-eslint": "^8.34.0"
  }
}
```

## Type checking the config file

To get the benefit of type-checking on your eslint config, you'll also need to install `@types/node` at the workspace level

```sh
pnpm i -D @types/node
```

Now we can run `pnpm run lint` to lint all of our code in the entire repo. Wrap this up in a nice project-level script

```json
"scripts": {
  "lint": "eslint packages/*/src/**/*"
}
```

You'll want to update your `@seeds/ui` `tsconfig.json` to no longer include `eslint.config.mts`, so remove this line and \_add it to the root `tsconfig.json`.

## Config file adjustments

Now that we're aiming to lint beyond just the UI package, we have to worry about `**/dist` folders. Find the place to make this change in `eslint.config.mts`

```diff
- ignores: ['**/assets/**/*'],
+ ignores: ['**/assets/**/*', "**/dist/**"],
```

You'll also need to update some paths in this file

```diff
+  files: ['packages/*/src/**/*.ts', 'packages/*/tests/**/*.ts'],
-  files: ['src/**/*.ts', 'tests/**/*.ts'],
```

Now run `pnpm lint` and you should see that it works! If you discover any lint errors -- try to fix them!

## Jump to definition

Finally we need to solve the jump to definition issue. What's missing is something called a "declaration map". Update your `@seeds/models` `tsconfig.build.json` to include this

```json
"compilerOptions": {
  "declarationMap": true
}
```

Now run `pnpm build`, try to jump to definition and you should see that it takes you to a `src/**/*.ts` file, not a `dist/**/*.d.ts` file.

Now run

```sh
 pnpm build && \
  pnpm test && \
  pnpm check && \
  pnpm format && \
  pnpm lint
```
