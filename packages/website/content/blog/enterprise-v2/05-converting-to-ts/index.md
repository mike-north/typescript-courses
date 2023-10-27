---
title: Converting to TypeScript
date: "2023-10-27T09:00:00.000Z"
description: |
  Converting to TypeScript: Integrate TypeScript into your build, rename files to .ts, and incrementally enforce stricter types. Progressively refine type information, enhance function and class types, and reduce usage of any. Aim for methodical, incremental changes, backed by tests.
course: enterprise-v2
order: 5
---

Converting a large project to TypeScript can sometimes be daunting. It's clear that the starting point is a bunch of JavaScript, totally lacking static types, and in the end you want to have very specific types across the entire project and all of your dependencies, but jumping straight to that end point in one shot can be _very dangerous_. In this chapter, we'll walk through a hands-on example together, demonstrating how a migration like this can be conducted on an _enterprise-scale_ project.

<!-- markdownlint-disable-next-line MD026-->
## Keep in mind...

- **Stay focused on carrying out specific tasks**. It's very easy to succumb to the temptation to do too much at a time. Don't worry, we'll get there, and if we stay well-organized, we'll get there _safely and without incident_
- **Make sure you have a solid test suite**. It's very easy to make a simple change (e.g. changing a `if (foo)` to `if (typeof foo === 'undefined')`) which can break your program in subtle ways
- **Don't let the perfect be the enemy of the good**. TypeScript was built to allow [incremental adoption](https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html#moving-to-typescript-files) -- take advantage of it! The types we'll be using early on in the process are _way less descriptive_ than what we'll want to end up with. That's ok!

## An overview of the approach

Each of these steps should involve verifying that building and testing the program works, and a separate `git commit`.

1. **Get TypeScript into your build toolchain**, type-checking your existing `.js` files, in the most permissive mode possible
1. **Rename some files from `.js` to `.ts`**, fixing only the things necessary to get the compile working
1. **Forbid implicit `any`s**, replacing them throughout the codebase with _explicit `any`s_, `{}`s or more descriptive types
   - Improve error handling by enabling `useUnknownInCatchVariables` in tsconfig
   - Install community-supported types from [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped/) where necessary
1. **Start formalizing type information relating to your codebase**. Make some `interface`s and `type` aliases.
1. **Add safety to boolean expressions, and improve handling of `null` and `undefined`**
   - Enable the ESLint rule `@typescript-eslint/strict-boolean-expressions` to catch problematic truthy/falsy expressions
   - Enable the tsconfig option `strictNullChecks` to ensure that if `null` is desired to be an allowed value in a type, it has to be explicitly stated as such
   - Enable the tsconfig option `exactOptionalPropertyTypes` to catch occurrences where optional properties are explicitly set to the value `undefined` instead of being deleted
1. **Improve types for functions** by doing the following
   - In `tsconfig.json`
      - Add safety around `Function` methods `bind`, `call` and `apply` by enabling `strictBindCallApply`
      - Add safety around `this` types by enabling `noImplicitThis`
      - Catch inappropriate `function` vs `function` type-checking by enabling `strictFunctionTypes`
      - Ensure all code branches within a function consistently return a value, or return no value by enabling `noImplicitReturns`
1. **Improve typing around `class`es**
   - In `tsconfig.json`
      - Ensure class fields are initialized by the time instances are returned by constructors, by turning on `strictPropertyInitialization`
      - Start requiring use of the `override` keyword on methods that override a same-named method on a base class, by enabling `noImplicitOverride`
1. **Start to get rid of explicit `any`s** in some places. This is a BIG step, and should be done in smaller increments
   - In `.eslintrc.js`
      - Ensure functions don't return an `any` or `any[]`, by enabling `@typescript-eslint/no-unsafe-return`
      - Ensure values of type `any` aren't passed to functions functions by enabling `@typescript-eslint/no-unsafe-argument`
      - Ensure values of type `any` can't be called (as a function) by enabling `@typescript-eslint/no-unsafe-calls`
      - These two rules are going object to a _lot_ more things, relative to the other two in this group. Consider doing these steps in smaller chunks, each with their own commit
        - Ensure that member access (grabbing a property) can't be performed on values of type `any` by enabling `@typescript-eslint/no-unsafe-member-access`
        - Ensure variables can't be assigned a value of type `any` or `any[]` by enabling `@typescript-eslint/no-unsafe-assignment`
1. **Develop a clear distinction between access of known properties and "dictionary access"**
   - Require that known properties must be accessed via `foo.bar` syntax, by enabling the tsconfig option `noPropertyAccessFromIndexSignature`
   - Require that "dictionary access" must be performed via `foo["bar"]` syntax, and represent that any given dictionary value may be `undefined` by enabling the tsconfig option `noUncheckedIndexedAccess`
1. **Require an eslint-disable comment for all remaining explicit `any`s**
   - Turn on the ESLint rule `@typescript-eslint/no-explicit-any`
1. **Remove or appropriately denote unused and unnecessary things**
   - Turn on `noUnusedLocals` and `noUnusedParameters` in tsconfig, to catch unused variables and function parameters, respectively
   - Turn on `@typescript-eslint/no-unnecessary-type-assertion` to catch places where the use of a type assertion isn't necessary in order to narrow a type for downstream usage
   - Turn on `@typescript-eslint/no-unnecessary-type-arguments` to catch places where an explicit typeParam is provided unnecessarily (meaning the same type would have been inferred)
   - Turn on `@typescript-eslint/no-unnecessary-condition` to catch places where, as long as the types are correct, a condition will _always_ be evaluated as either `true` or `false`
   - Turn on `@typescript-eslint/no-type-constraint` to catch places where type constraints are written in a way that doesn't change the allowed values (e.g. `T extends any` is just `T`)

There are [a wide range of TypeScript ESLint rules](https://typescript-eslint.io/rules/) available, but not all of them are necessarily useful as part of the journey to add static types to a formerly un-typed codebase. In particular, I would avoid making _stylistic changes_ (e.g. [naming conventions for certain types of declarations](https://typescript-eslint.io/rules/naming-convention)) during this conversion journey, as this is more perturbance of the codebase while it's in a partially-typed state.

We won't go through every one of these steps together, as the whole point of this approach is that the work becomes quite methodical and predictable.
