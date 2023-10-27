---
title: Local Packages
date: "2023-10-27T09:00:00.000Z"
description: |
  We'll learn about yarn workspaces, and how they provide an opportunity for simple but effective modular architecture in a large TypeScript projects.
course: enterprise-v2
order: 11
---

## A need for modular architecture

As a monolithic project starts to get larger and larger, builds get slower, and the need for some sort of modular architecture starts to become more important. Thankfully, it's easier than ever to do this with TypeScript and `yarn`!

We've already taken the first steps by creating the `chat-stdlib` project at the beginning of this course. This package exports the `Deferred` class and the `stringifyError` function.

## Introducing the dependency

Yarn 2+ includes support for [workspaces](https://yarnpkg.com/features/workspaces) -- individual packages that are part of the same project. The root level `package.json` in our course repo contains the following configuration

```json
  "workspaces": [
    "packages/*"
  ],
```

This indicates that every folder in `packages/` is to be treated as a workspace.

Next, go to `packages/chat/package.json`, and add the following to the `dependencies` object

```json
    "chat-stdlib": "workspace:*"
```

The `*` here isn't really important for our purposes, since we're not publishing this `chat` package to npm.

Once you've added this line to `chat`'s `package.json`, be sure to save the file and then run `yarn`

## Consuming the dependency

`chat` has a couple of modules that we won't need anymore

- `packages/chat/src/utils/deferred.ts`
- `packages/chat/src/utils/error.cjs`
- `packages/chat/tests/utils/deferred.test.ts`
- `packages/chat/tests/utils/error.test.ts`

Feel free to delete these, as they're all represented by code we already have in `chat-stdlib`. You'll have to update a couple of import statements as a result of this

in `packages/chat/src/utils/networking.ts`

```diff
- import { stringifyError } from './error'
+ import { stringifyError } from 'chat-stdlib'
```

in `packages/chat/src/ui/components/api.ts`

```diff
- import { Deferred } from './deferred'
+ import { Deferred } from 'chat-stdlib'
```

### Using "beta" types

You may notice that `stringifyError` types don't seem to be available.

Earlier, when we wrote `chat-stdlib`, we added a `@beta` JSDoc comment tag to `stringifyError`

You'll need to add this entry to the top of your `tsconf.json` `compilerOptions.paths` property

```json
"chat-stdlib": ["../../node_modules/chat-stdlib/dist/chat-stdlib-beta.d.ts"],
```

You should now be able to run

```sh
yarn typecheck && echo "passed type checking"
```

and see it return successfully.

## Focusing on the small stuff

One of the advantages of this kind of modular architecture, is we can focus on a particular sub-part of our repo, installing _only_ the dependencies necessary to run that part.

If you want to test this, start by going to the root of the project and removing your `node_modules` folder

Next, let's run

```sh
yarn workspaces focus chat-stdlib
```

Check out the root `node_modules` folder now. You should see a very small number of dependencies. You have just enough in there to build, test and run the one package.

If you want to go back to installing all of the dependencies needed by the whole repo, just run

```sh
yarn
```
