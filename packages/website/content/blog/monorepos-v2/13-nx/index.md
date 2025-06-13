---
title: Nx
date: "2025-06-12T09:00:00.000Z"
description: |
  We'll learn to use the nx monorepo tool for dependency-aware builds and distributed caching
course: monorepos-v2
order: 13
---

Lerna is a monorepo tool that's been around for a while. There was a period of time where it was basically abandoned, and [it has since been maintained by the Nx team](https://dev.to/nrwl/lerna-is-dead-long-live-lerna-3jal). We'll look at what Lerna can do for us, and then we'll see when it's appropriate to use Nx directly instead.

## Lerna

Run

```sh
pnpm dlx lerna init
```

You should then be able to run

```sh
pnpm lerna run build
```

Which will build every package in the monorepo. You can similarly run

```sh
pnpm lerna run test
pnpm lerna run lint
```

You can run multiple tasks

```sh
pnpm lerna run build,lint,test,check
```

You can stream output

```sh
pnpm lerna run build,lint,test,check --stream
```

You can control the degree of parallelism

```sh
pnpm lerna run build,lint,test,check --concurrency=2
```

Or unlimited concurrency

```sh
pnpm lerna run build,lint,test,check --parallel
```

## --since

A lot of the task running can be accomplished with pnpm (although it's a bit more convoluted),  however lerna is much more sophisticated. It can run tasks based on changes relative to a given git ref (e.g. a branch).

Change the logging message in
`packages/server/src/index.ts`

```diff
-  console.log(`Server listening on port http://localhost:${cfg.port}`)
+  console.log(`Listening on port http://localhost:${cfg.port}`)
```

Now run

```sh
pnpm lerna run test --since=origin/steps-2
```

and you should see that only tests in the `@seeds/server` package are run. If you make a change within the `@seeds/model` package, you should see that tests in _all three packages_ are run because of the dependency graph.

Particularly if you're thinking about git pre-commit hooks (e.g. if you're using [husky](https://github.com/typicode/husky)), this is a great foundational feature that lets you operate on the _increment of code change_ while taking the dependency graph within the monorepo into account.

## Nx

Let's go deeper and explore using `Nx` directly.

Install nx globally

```sh
npm add --global nx
# OR
volta install nx
```

And install it in the root of the repo

```sh
pnpm dlx nx init
```

Follow the prompts to create a `nx.json` file

At the end of the process we should benefit from distributed caching. As long as the inputs to cachable build tasks are the same, the output should be the same and the response is pretty much instantaneous. This can dramatically speed up your build process.

```sh
nx run-many -p models,ui,server,check -t build,lint,test
```
