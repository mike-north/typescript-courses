---
title: Intro
date: "2021-06-10T09:00:00.000Z"
description: |
  We'll discuss the goals and agenda of this course, and how to get up and
  running with the workshop project in 2 minutes or less.
course: intermediate-v1
order: 1
---

## About the Instructor

- [Frontend Masters instructor](https://frontendmasters.com/teachers/mike-north/) for 9 years
- Developer Platform Lead @ [Stripe](https://stripe.com)
- Designs [Stripe's API semantics](https://stripe.com/docs/api)
- Architect responsible for TypeScript projects like [node-stripe](https://github.com/stripe/stripe-node), [Stripe Shell](https://stripe.sh/), and [Stripe Workbench](https://workbench.stripe.dev/)

## Top Goals for this course

> Pass along key knowledge gained through _thousands_ of hours of TypeScript teaching, Q&A and pair programming
> By the end of this course, **you will be able to understand _challenging_ type information**.

This likely is pretty scary right now, but you'll know what it
means by the end of the course

```ts twoslash
// Get keys of type T whose values are assignable to type U
type FilteredKeys<T, U> = {
  [P in keyof T]: T[P] extends U ? P : never
}[keyof T] &
  keyof T

/**
 * get a subset of Document, consisting only of methods
 * returning an Element (e.g., querySelector) or an
 * Element[] (e.g., querySelectorAll)
 */
type ValueFilteredDoc = Pick<
  Document,
  FilteredKeys<
    Document,
    (...args: any[]) => Element | Element[]
  >
>
```

## What do you assume I already know?

- Modern javascript
- The basics of function, object and array types
- Basic generics (e.g., typescript fundamentals v3)
- Index signatures

Also... some practical experience is important

## Workshop Setup

As long as you can access the following websites, you should require no further setup :tada:

- [The course website you're reading right now](https://fun-v3.typescript-training.com)
- [The official TypeScript website](https://www.typescriptlang.org)

## Which of your TypeScript courses is right for me?

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
  This course focuses on _monorepos_ -- the concept of **multiple sub-projects existing in a single git repository**.
