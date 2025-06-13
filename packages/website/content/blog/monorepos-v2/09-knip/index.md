---
title: Removing Unused Dependencies and Exports
date: "2025-06-12T09:00:00.000Z"
description: |
  Now we have several packages. What if we were publishing some of them for external consumption?
course: monorepos-v2
order: 9
---

## Trimming away unused dependencies and exports

Knip is a tool that helps us trim away unused dependencies and exports from our packages. It works well with monorepos, and it's a great way to detect extraneous dependencies, and potentially dead code (or over-exposed code) that TypeScript and ESLint aren't sophisticated enough to detect.

Install it

```sh
pnpm i -D knip
```

We need a small config file to tell Knip about entry points

```json
{
 "workspaces": {
  "packages/*": {
   "entry": ["src/{index,main}.ts"],
   "project": ["src/**/*.{ts,tsx,svelte}"]
  }
 },
 "ignoreDependencies": [
  "syncpack",
  "@testing-library/svelte",
  "@tsconfig/svelte",
  "@vitest/coverage-v8"
 ]
}
```

Run it

```sh
pnpm knip
```

You'll see a report of unused dependencies and exports. You can also run it with the `--fix` flag to remove the unused dependencies and exports.

You may notice that sometimes it removes the _export_ of a symbol, but doesn't actually remove the code itself. Think about sequencing and how you could _both_ remove the export and detect the dead code (have we been using another tool that might help detect an _unused function or variable_?)
