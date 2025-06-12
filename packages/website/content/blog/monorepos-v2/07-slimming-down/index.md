---
title: Versioning
date: "2025-06-12T09:00:00.000Z"
description: |
  Now we have several packages. What if we were publishing some of them for external consumption?
course: monorepos-v2
order: 7
---

In this section, we'll focus on applying monorepo best practices to our project.

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

## Detecting varied dependencies

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