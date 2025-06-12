---
title: Hello, Workspace!
date: "2025-06-12T09:00:00.000Z"
description: |
  We'll take the smallest set of possible steps to converting our project to a pnpm workspace
course: monorepos-v2
order: 3
---
## What's a workspace?

A **pnpm workspace** is a monorepo setup driven by a root-level `pnpm-workspace.yaml` file that lists all local package folders.

### What do we want to see?
* `pnpm install` continues to work
* `pnpm run { build, lint, test }` continue to work
* We haven't ruined our `git` history
* We haven't lost our lockfile package versions
* ...more benefits to come later

**We're not looking to break the monolith up yet -- that comes later**. We'll focus on making small incremental changes, and verify that things work early and often.

## Let's go!

Begin by creating a `packages/ui` folder

### The monolith becomes the first monorepo package
```sh
mkdir -p packages/ui
```
Move everything that was in the repo root folder into `packages/ui` **except for the following files**

* `.gitignore`
* `.nvpmrc`
* `.prettierrc`
* `pnpm-lock.yaml`
* `README.md`

Now create a top-level file in the repo called `pnpm-workspace.yaml`.

```yaml
# pnpm-workspace.yaml
packages:
  - 'packages/*'

```

You'll need to create a _very thin_ top-level `package.json` file

```json
{
  "name": "seeds",
	"repository": "https://github.com/mike-north/ts-monorepos-v2",
  "private": true,
  "volta": {
    "node": "22.16.0"
  }
}
```
...and because "seeds" was the name of our monolith package, let's change that to `@seeds/ui`

```diff
{
+  "name": "@seeds/ui",
-  "name": "seeds",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  ...
}
```
What we're leaning into with this package naming convention is [npm scopes](https://docs.npmjs.com/cli/v7/using-npm/scope) -- we could use `@seeds/*` for all of our monorepo packages, and potentially the workspace root as an "umbrella" package, so that those who already depend on it have a very clear upgrade path.

Alternatively, we could have called the monorepo package something else like `seeds-workspace` and created `packages/seeds` with the `seeds` package. This might be a good choice if your existing users need CLI commands, and there's more to maintaining general compatibility with users' existing expecations of `seeds` than its existence in someone's `package.json` file

Now run 
```sh
pnpm i
```
And it should complete successfully

Next, let's get those build, lint and test commands working

In your root `package.json` add the following

```json
{
  "scripts": {
    "build": "pnpm --color run -r build",
    "lint": "pnpm --color run -r lint",
    "check": "pnpm --color run -r check",
    "test": "pnpm --color run -r test",
    "format": "pnpm --color run -r format",
    "dev": "pnpm --color run -r dev"
  },
	"volta": {
		"node": "22.16.0"
	}
}
```
Ok, let's stage all the files we have changed
```sh
git add -A .
```
and run `git status`

Look at all those

```
renamed:  <file>
renamed:  <file>
renamed:  <file>
renamed:  <file>
renamed:  <file>
```
This means we're preserving our git history. What you don't want to see is files deleted and new files re-created. 

Check out our lockfile too

```sh
git diff HEAD pnpm-lock.yaml
```
You should see

```diff
index a499dd8..9b6f4be 100644
--- a/pnpm-lock.yaml
+++ b/pnpm-lock.yaml
@@ -6,7 +6,9 @@ settings:
 
 importers:
 
-  .:
+  .: {}
+
+  packages/ui:
     dependencies:
       cors:
         specifier: ^2.8.5
```

This should give you confidence that we're not releasing all of our locked versions as part of this process. 

At this point you should be able to run 
```sh
pnpm build && \
pnpm test && \
pnpm lint && \
pnpm check && \
pnpm format
```
and see that everything works.


Make a git commit, and let's move on!