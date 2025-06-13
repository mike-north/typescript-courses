---
title: Code formatting & Linting
date: "2025-06-12T09:00:00.000Z"
description: |
  We'll set up some monorepo-level linting and formatting that works seamlessly with your favorite code authoring tools
course: monorepos-v2
order: 11
---

## TS Project references

We may be sharing a `dist` folder between packages, but we can go further in terms of leveraging incremental builds. **We want to get to a place where TypeScript only has to build _the files that have changed_ -- not _the packages that have changed files within them_**.

First, we need to add something to each package's `tsconfig.build.json` file (`tsconfig.json` for the UI package)

```json
{
  "compilerOptions": {
    "composite": true
  }
}
```

Then, for every edge in our dependency graph, we need to add a `references` array to the `tsconfig.json` file. In this case we have two edges:

- `@seeds/models` -> `@seeds/ui`
- `@seeds/models` -> `@seeds/server`

Update `@seeds/server`'s `tsconfig.build.json` and `@seeds/ui`'s `tsconfig.json` files to include this

```json
"references": [
    {
      "path": "../models/tsconfig.build.json"
    }
]
```

Add this line to your root `.gitignore` file

```diff
+ **/tsconfig.build.tsbuildinfo
```

and run `pnpm build` again. You should see a `tsconfig.build.tsbuildinfo` file in the root of each package. This is a file that TypeScript uses to track the state of the build.

---

Give yourself a pat on the back! We now have the "core" concept of a TypeScript monorepo, but we're not stopping there.
