---
title: Consolidating External Dependencies
date: "2025-06-12T09:00:00.000Z"
description: |
  We'll use syncpack to rally our monorepo around a single version of each external dependency
course: monorepos-v2
order: 7
---

`syncpack` is a tool that helps us detect and fix varied dependencies across our packages. Unless you've been really observant or you haven't been copying/pasting out of the course notes, you may have a few versions of TypeScript in this project. Let's detect and fix that

Install it

```sh
pnpm i -D syncpack@alpha
```

Run the checker

```sh
pnpm syncpack lint
```

And auto-fix any issues you may find

```sh
pnpm syncpack fix
```

If you want opinionated formatting of your package.json files, you can run

```sh
pnpm syncpack format
```
