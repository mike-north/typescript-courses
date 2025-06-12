---
title: Dev mode
date: "2025-06-12T09:00:00.000Z"
description: "We've done a lot of refactoring and rearranging. Let's explore our options for restoring a project-wide dev script"
course: monorepos-v2
order: 8
---

When we started, we could run `pnpm dev` and start both the client and server at the same time. Sure, sometimes there was a race condition, but it was easy to fire up and get productive.

Let's try the same thing with pnpm as our runner. First, update your UI's `package.json` to include a `dev` n updated script

```diff
- "dev": "concurrently -n \"Server,Client\" -c \"yellow,blue\" \"pnpm run dev-server\" \"pnpm run dev-client\"",- "dev-client": "vite",
+ "dev": "vite",
```

```sh
pnpm -r dev
```

You might see something like

```
packages/models dev$ tsc -p tsconfig.build.json --watch --preserveWatchOutput
│ 9:00:42 PM - Starting compilation in watch mode...
│ 9:00:43 PM - Found 0 errors. Watching for file changes.
└─ Running...
```

Only our `models` project has started. Pnpm has knowledge that there's a workspace dependency, but because the `dev` command never exits it's not able to start the other projects.

## Concurrently

We could use concurrently again -- something like

```sh
#!/bin/bash
pnpm dlx concurrently -n "dev-models,dev-ui,dev-server" \
                 -c "yellow,blue,green" \
                 "pnpm --filter=@seeds/models --stream run dev" \
                 "pnpm --filter=@seeds/ui --stream run dev" \
                 "pnpm --filter=@seeds/server --stream run dev"

```

Create this script in the root of the repo in a `/scripts` folder, make it executable

```sh
chmod +x scripts/dev.sh
```

and wire it up in your root `package.json` as the "dev" script

```diff
- "dev": "pnpm --color run -r dev",
+ "dev": "./scripts/dev.sh",
```
