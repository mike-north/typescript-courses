---
title: Steps 1, 2 and 3 - Adding our first types
date: "2023-10-27T09:00:00.000Z"
description: |
  We'll discuss the goals and agenda of this course, and how to get up and
  running with the workshop project in 2 minutes or less.
course: enterprise-v2
order: 6
---

In this chapter, we'll follow steps 1, 2 and 3 as described in [the approach for converting large projects from JavaScript to TypeScript](../05-converting-to-ts/#an-overview-of-the-approach).

> 1. **Get TypeScript into your build toolchain**, type-checking your existing `.js` files, in the most permissive mode possible
> 1. **Rename some files from `.js` to `.ts`**, fixing only the things necessary to get the compile working
> 1. **Forbid implicit `any`s**, replacing them throughout the codebase with _explicit `any`s_, `{}`s or more descriptive types
>    - Improve error handling by enabling `useUnknownInCatchVariables` in tsconfig
>    - Install community-supported types from [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped/) where necessary

## Getting started with the big project

Let's look back at our project git repo. We'll be working a little bit with the `packages/chat-stdlib` library we created earlier, and the main chat app in `packages/chat`.

From the root of the git repo, enter the folder

```sh
cd packages/chat
yarn dev
```

If this is your first time running the project, it may take a minute or two to build. Start the app up to make sure everything works properly. Look for the console output

```sh
 Serving on http://localhost:3000
```

This is an indication that the UI should be viewable on [http://localhost:3000](http://localhost:3000)

You should see something like this

![chat app home screen](./img/app-home.png)

## Adding TypeScript to the project

### Some Quick Tricks

```sh
node scripts/rename-to-ts.mjs
```

and don't forget to make this small change to [`/index.html`](/index.html)

```diff
--- a/index.html
+++ b/index.html
@@ -8,6 +8,6 @@
   </head>
   <body class="font-sans antialiased h-screen">
     <div id="appContainer" class="w-full h-full"></div>
-    <script src="src/index.js" type="text/javascript"></script>
+    <script src="src/index.ts" type="text/javascript"></script>
   </body>
 </html>
```

and this change to tsconfig for step 1

```diff
--- a/tsconfig.json
+++ b/tsconfig.json
@@ -3,9 +3,10 @@
     "target": "ES2018",
     "allowJs": true,
     "module": "commonjs" /* Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', 'es2020', or 'ESNext'. */,
-    "strict": true /* Enable all strict type-checking options. */,
+    // "strict": true /* Enable all strict type-checking options. */,
     "forceConsistentCasingInFileNames": true,
     "noEmit": true,
+    "noImplicitAny": false,
     "outDir": "dist",
     "declaration": true,
     "jsx": "react",
```

### Other tips

- Most react components can be typed as `React.FC<any>`
