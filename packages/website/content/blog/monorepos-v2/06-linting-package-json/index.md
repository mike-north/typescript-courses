---
title: Linting Package.json
date: "2025-06-12T09:00:00.000Z"
description: |
  We'll get hands-on with manypkg, a tool that helps us detect common problems in our package.json files
course: monorepos-v2
order: 6
---
## Manypkg

Manypkg does a bunch of things for monorepos, but we're going to rely on it for _linting our `package.json` files_.

Install it

```sh
pnpm add -D @manypkg/cli
```

You can run the checks

```sh
pnpm manypkg check
```

And some checks can be fixed automatically (e.g. ordering of dependencies)

```sh
pnpm manypkg fix
```

Let's add this as a script to our root `package.json`, and make it part of the top-level `lint` script (this feels more like linting than typechecking to me, personally, although arguably TypeScript is just a fancy linter)

```json
"scripts": {
  "dev": "pnpm --color run -r dev",
  "lint": "pnpm --color run -r lint && pnpm --color manifests-lint",
  "manifests-lint": "pnpm manypkg check",
  "manifests-fix": "pnpm manypkg fix"
}
```

Now you can run `pnpm lint` and it applies some rules to our package.json files.
