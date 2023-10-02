---
title: Intro
date: "2021-06-08T09:00:00.000Z"
description: |
  We'll discuss the goals and agenda of this course, and how to get up and
  running with the workshop project in 2 minutes or less.
course: fundamentals-v3
order: 1
---

## About the Instructor

- [Frontend Masters instructor](https://frontendmasters.com/teachers/mike-north/) for 9 years
- Developer Platform Lead @ [Stripe](https://stripe.com)
- Designs [Stripe's API semantics](https://stripe.com/docs/api)
- Architect responsible for TypeScript projects like [node-stripe](https://github.com/stripe/stripe-node), [Stripe Shell](https://stripe.sh/), and [Stripe Workbench](https://workbench.stripe.dev/)

## #1 Goal for this course

> By the end of this course, **I want you to have a rock solid mental model, that will serve you well for years**

## What is TypeScript?

> TypeScript is an [open source](https://github.com/microsoft/TypeScript), typed **syntactic superset** of JavaScript

- Compiles to readable JS
- Three parts: Language, [Language Server](https://microsoft.github.io/language-server-protocol/) and Compiler
- Kind of like a fancy linter

**TypeScript is _increasingly popular_**
![downloads-graph](./graph.png)

## Why developers want types

It allows you, as a code author, **to leave more of your intent "on the page"**

This kind of _intent_ is often missing from JS code. For example:

```js
function add(a, b) {
  return a + b
}
```

Is this meant to take numbers as args? strings? both?

What if someone who interpreted `a` and `b` as numbers made this "backwards-compatible change?"

```js
function add(a, b, c = 0) {
  return a + b + c
}
```

We're headed for trouble if we decided to pass strings in for `a` and `b`!

Types make the author's intent more clear

```ts twoslash
// @errors: 2345
function add(a: number, b: number): number {
  return a + b
}
add(3, "4")
```

**It has the potential to move some kinds of errors from _runtime_ to _compile time_** [^1]

Examples:

- Values that are potentially absent (`null` or `undefined`)
- Incomplete refactoring
- Breakage around _internal code contracts_ (e.g., an argument _becomes_ required)

**It serves as the foundation for a _great_ code authoring experience**

Example: in-editor autocomplete, as shown here:

```ts twoslash
window.setInterval
//       ^|
```

## Workshop Setup

As long as you can access the following websites, you should require no further setup :tada:

- [The course website you're reading right now](https://fun-v3.typescript-training.com)
- [The official TypeScript website](https://www.typescriptlang.org)

<!-- ## Which of your TypeScript courses is right for me?

I've made four TS courses for Frontend Masters so far:

### Core

These courses focus on deep understanding of the programming language
and how the TS compiler models and checks your code. Most of the "class time" is
spent in a _lab environment_.

- [TypeScript Fundamentals (v3)](https://frontendmasters.com/workshops/typescript-v3/) <br />
  By the end of this course, you'll have **a basic understanding of the TypeScript language**
- [Intermediate TypeScript](https://frontendmasters.com/workshops/intermediate-typescript/) <br />
  By the end of this course, you'll be **prepared to contribute to a wide range of non-trivial TypeScript projects**. You
  could be well on your way to becoming the TypeScript expert on your team.

### Electives

These courses focus on _application_ of TypeScript to _solving problems at scale_.
Most of the "class time" is spent _building apps together_.

- [Production-Grade TypeScript](https://frontendmasters.com/courses/production-typescript/) <br />
  This course focuses on **build pipelines, tooling, and practical use of TypeScript _at scale_**.
- [JS &amp; TS Monorepos](https://frontendmasters.com/courses/monorepos/) <br />
  This course focuses on _monorepos_ -- the concept of **multiple sub-projects existing in a single git repository**. -->

## Agenda

- Using `tsc` and **compiling** TS code into JavaScript
- **Variables** and simple values
- **Objects** and arrays
  <br/>`--- BREAK ---`
- Categorizing **type systems**
- Set theory, **Union and Intersection types**
- **Interfaces and Type Aliases**
  <br/>`--- LUNCH ---`
- **Hack**: Writing types for JSON values
- **Functions**
- **Classes** in TypeScript
- **Top and bottom types**
- User-defined **Type guards**
  <br/>`--- BREAK ---`
- Handling **nullish values**
- **Generics**
- **Hack**: higher-order functions for dictionaries
- Wrap up

[^1]: TypeScript by itself is not going to reduce the occurrence of errors in your projects. It does, however, provide several tools that _greatly_ improve visibility of some kinds of defects.
