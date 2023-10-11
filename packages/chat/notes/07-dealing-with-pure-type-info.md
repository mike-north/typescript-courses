<p align='left'>
 <a href="./06-converting-to-ts.md">◀ Back: Converting to TypeScript</a>
</p>

---

# Dealing with Pure Type Information

The next step we'll take in this project involves finding the right "home" for
type information of various kinds. Two we'll focus on in particular are

- Types that relate to _our own code_, and are part of our public API surface
- Fixes and customizations of _types for dependencies_, that are _not_ part of our public API surface

## Some relevant parts of tsconfig

- `typeRoots` allows us to tell TypeScript about top-level folders which may contain type information
- `paths` allows us to instruct the compiler to look for type information for specific modules in specific locations
- `types` allows us to specify which types can affect the global scope, and which appear in vscode auto-imports

## Local type overrides

Create a `types/` folder

```sh
mkdir types
```

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
+    "baseUrl": ".",
+    "paths": {
+      "*": ["types/*"]
+    }
   },
   "include": ["src"]
```

In this folder we can place our type overrides for dependencies. We'll talk more about
this in our discussion of ambient type information later.

## Published type information for your app

Types can pass through module boundaries just like values, so we can create
one or more modules for interfaces that are needed by many concerns in our
chat app.

Let's start by forbidding explicit anys in our app. To do so, make the following
change in your app

```diff
--- a/.eslintrc
+++ b/.eslintrc
@@ -83,7 +83,7 @@
         "@typescript-eslint/no-unsafe-member-access": "off",
         "@typescript-eslint/no-unsafe-assignment": "off",
         "@typescript-eslint/no-unsafe-return": "off",
-        "@typescript-eslint/no-explicit-any": "off"
+        "@typescript-eslint/no-explicit-any": "error"
       }
     },
```

A lot of the `any`s we'll encounter in the app can be replaced with either
and `unknown` or a more appropriate concrete type.

Let's make sure we first create types for important data models in our app.
Make a new file `src/types.ts` containing the following

```ts
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

# Challenge: get rid of all of the new lint errors

Keep replacing `any`s until the ESLint errors and warnings go away, **with one exception**

```ts
/**
 * PLEASE LEAVE THIS WARNING ABOUT AN UNSPECIFIED RETURN TYPE ALONE
 */

// src/utils/networking.ts
export async function apiCall(path: string, init?: RequestInit) {}
```

---

<p align='right'>
 <a href="./08-types-at-runtime.md">Next: Types at Runtime ▶</a>
</p>
```
