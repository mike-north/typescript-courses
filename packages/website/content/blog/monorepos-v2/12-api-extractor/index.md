---
title: API Extractor
date: "2025-06-12T09:00:00.000Z"
description: "We'll learn to use API Extractor to generate a unified API surface for our monorepo"
course: monorepos-v2
order: 12
---

API Extractor is a tool that operates purely on _declaration files_. It can generate rollups for different levels of maturity of a given package, and produce a markdown "api report" that make detecting changes to the API surface of a package easy to detect and review

Install it

```sh
pnpm install -D @microsoft/api-extractor
```

Enter the `packages/models` directory and run

```sh
pnpm api-extractor init
```

This will create a `api-extractor.json` file. If you don't like the vscode or cursor validation errors due to comments in JSON, you can add

```json
"files.associations": { "*.json": "jsonc" }
```

to your `settings.json` file.

Find these lines and make the following changes

```diff
- "mainEntryPointFilePath": "<projectFolder>/lib/index.d.ts",
+ "mainEntryPointFilePath": "<projectFolder>/dist/index.d.ts",
```

Uncomment the lines with the following properties

- `untrimmedFilePath`
- `publicTrimmedFilePath`
- `alphaTrimmedFilePath`
- `betaTrimmedFilePath`

Find the `extractorMessageReporting` object and insert this into it

```json
"ae-missing-release-tag": {
  "logLevel": "warning"
}
```

There are lots of options you can enable [here](https://api-extractor.com/pages/messages/ae-extra-release-tag/)

Make an `/etc` folder in the package

```sh
mkdir packages/models/etc
```

And run the extractor

```sh
pnpm api-extractor run --local --verbose
```

This will create a `api-report.md` file in the `/etc` folder. Look in the `./dist` folder and you should see the generated declaration files.

```raw
packages/models/dist/models-alpha.d.ts
packages/models/dist/models-beta.d.ts
packages/models/dist/models-public.d.ts
packages/models/dist/models.d.ts
```

Now in your `package/models/package.json`'s "types" field, point to the "public" declaration file

```json
"types": "dist/models-public.d.ts",
```

Now you could decorate individual exports with `@alpha` or `@beta` tags to indicate the maturity of the API, and early adopters can just point to a different declaration file (using tsconfig's `paths` field) to get the right type information

## Documentation

In your API extractor config file, you can specify a `apiReport` object. This will generate a markdown file that can be used to generate documentation for the API. Uncomment the following line

```diff
"apiJsonFilePath": "<projectFolder>/temp/<unscopedPackageName>.api.json",
```

Run the extractor again and you should see a `api-report.md` file in the `/etc` folder.

```sh
pnpm api-extractor run --local --verbose
```

You should now see

```raw
packages/models/temp/models.api.json
```

Now run

```sh
pnpm api-documenter markdown -i temp -o docs
```

And you should have markdown docs in a `./docs` folder.
