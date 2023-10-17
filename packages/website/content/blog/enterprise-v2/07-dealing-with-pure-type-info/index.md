---
title: Step 4 - Dealing with Pure Type Information
date: "2023-10-27T09:00:00.000Z"
description: |
  We'll discuss the goals and agenda of this course, and how to get up and
  running with the workshop project in 2 minutes or less.
course: enterprise-v2
order: 7
---

> (4) **Start formalizing type information relating to your codebase**. Make some `interface`s and `type` aliases.

The next step we'll take in this project involves finding the right "home" for
type information of various kinds. Two we'll focus on in particular are

- Types that relate to _our own code_, and are part of our public API surface
- Fixes and customizations of _types for dependencies_, that are _not_ part of our public API surface

## Formalizing interfaces for our domain model

The models that a slack-like app needs to deal with include concepts like

```js
TEAMS                USERS
  ┃                    ┃
 have                  ┃
 many                  ┃
  ┗━━ CHANNELS       relate
         ┃             to
        have           ┃
        many           ┃
         ┗━━ MESSAGES ━┛ 
```

We could create a bunch of interfaces that represent these concepts

```ts twoslash
/**
 * A user participating in a chat
 */
export interface IUser {
  id: number;
  username: string;
  name: string;
  iconUrl: string;
}

/**
 * A chat message
 */
export interface IMessage {
  id: number;
  teamId: string;
  channelId: string;
  userId: string;
  createdAt: string;
  user: IUser;
  body: string;
}

/**
 * A team, containing one or more chat channels
 */
export interface ITeam {
  iconUrl: string;
  name: string;
  id: string;
  channels: IChannel[];
}

/**
 * A chat channel, containing many chat messages
 */
export interface IChannel {
  teamId: string;
  name: string;
  description: string;
  id: string;
  messages: IMessage[];
}
```

Create a new file `packages/chat/src/types.ts`

```sh
touch src/types.ts
```

and put the above code snippet in it and save. Start going through the other TypeScript modules, from the lowest level and moving upward, replacing some of the explicit object types with types derived from these interfaces.

Keep in mind that if we use these interfaces _directly_, everywhere their respective concepts is needed, we'll end up exposing components to far more data (e.g. all of `IChannel`s fields, when perhaps just `name` would suffice).

Use `Pick<T>` to choose specific properties where only one or two are needed. For example

```ts twoslash
/**
 * A user participating in a chat
 */
export interface IUser {
  id: number;
  username: string;
  name: string;
  iconUrl: string;
}

/**
 * A chat message
 */
export interface IMessage {
  id: number;
  teamId: string;
  channelId: string;
  userId: string;
  createdAt: string;
  user: IUser;
  body: string;
}

/**
 * A team, containing one or more chat channels
 */
export interface ITeam {
  iconUrl: string;
  name: string;
  id: string;
  channels: IChannel[];
}

/**
 * A chat channel, containing many chat messages
 */
export interface IChannel {
  teamId: string;
  name: string;
  description: string;
  id: string;
  messages: IMessage[];
}
/// ---cut---
type ChannelNameAndId = Pick<IChannel, 'name'|'id' >
//     ^?
```

Don't worry about being too _complete_ in this pass. When we start tightening up rules, we can opportunistically catch more occurrences

## Other kinds of type information

These interfaces are a great example of pure type information. Another is, adjustments to type information for _dependencies_. If you've ever dealt with a library that doesn't have any types yet, you probably know where we're going with this.

Even if libraries do provide their own types, sometimes they clash with what you have going on in your app. For example, they might use new TS language syntax that you're not ready to adopt yet.

A local type roots folder gives you the flexibility to "patch" or overwrite types where necessary.

Create a new folder for these kinds of types to live

```shell
mkdir types
```

## Some relevant parts of tsconfig

- `typeRoots` allows us to tell TypeScript about top-level folders which may contain type information
- `paths` allows us to instruct the compiler to look for type information for specific modules in specific locations
- `types` allows us to specify which types can affect the global scope, and which appear in vscode auto-imports

## Local type overrides

and in your top-level tsconfig add a `paths` and a `baseUrl` property

```diff
--- a/tsconfig.json
+++ b/tsconfig.json
@@ -10,7 +10,10 @@
     "outDir": "dist",
     "declaration": true,
     "jsx": "react",
-    "moduleResolution": "Node"
+    "moduleResolution": "Node",
+    "paths": {
+      "*": ["types/*"]
+    }
   },
   "include": ["src"]
```

In this folder we can place our type overrides for dependencies. We'll talk more about this in our discussion of ambient type information later. For now, let's convince ourselves that it works.

Create a new file

```sh
touch types/date-fns.d.ts
```

put the following code snippet in it, and save

```ts twoslash
declare module 'date-fns' {
    export function format(): void;
}
```

Run

```sh
yarn typecheck
```

and you should see a bunch of type errors around `src/utils/date.ts`. Effectively what's happened is

```ts twoslash
// @types: date-fns
import { format } from 'date-fns'
/// ---cut---
function formatTimestamp(date: Date) {
  return format(date, 'MMM dd, yyyy HH:MM:SS a')
//         ^?
}
```

has now become

```ts twoslash
// @errors: 2554
declare function format(): void;
/// ---cut---
function formatTimestamp(date: Date) {
  return format(date, 'MMM dd, yyyy HH:MM:SS a')
//         ^?
}
```

Go ahead and remove the `types/date-fns.d.ts` file, now that we've confirmed that everything works properly.
