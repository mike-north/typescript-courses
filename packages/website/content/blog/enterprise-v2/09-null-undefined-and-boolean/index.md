---
title: Step 5 - Null, undefined and boolean operators
date: "2023-10-27T09:00:00.000Z"
description: |
  We'll take on Step 5 to add safety to nullish value and boolean expression handling
course: enterprise-v2
order: 9
---

Let's proceed with step 5

> (5) **Add safety to boolean expressions, and improve handling of `null` and `undefined`**
>
> - To catch problematic truthy/falsy expressions, enable the ESLint rule `@typescript-eslint/strict-boolean-expressions`
> - Enable the tsconfig option `strictNullChecks` to ensure that if `null` is desired to be an allowed value in a type, it has to be explicitly stated as such
> - Enable the tsconfig option `exactOptionalPropertyTypes` to catch occurrences where optional properties are explicitly set to the value `undefined` instead of being deleted

There are a few places where you'll need to change `if (!foo)` to `if (typeof foo === 'undefined')`. Use care when deciding whether `null` should be handled specifically -- it's easy to make mistakes!

Fix compiler and lint errors until all of the important commands succeed

```sh
yarn typecheck
yarn lint
yarn test
```

This is the last of the "tightening up strictness" steps we'll complete together, because they all pretty much feel this way, and we have more interesting things to discuss.
