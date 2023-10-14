---
title: Intro & Project Setup
date: "2021-06-10T09:00:00.000Z"
description: |
  We'll discuss the goals and agenda of this course, and how to get up and
  running with the workshop project in 2 minutes or less.
course: enterprise-v2
order: 1
---

## About the Instructor

- [Frontend Masters instructor](https://frontendmasters.com/teachers/mike-north/) for 9 years
- Developer Platform Lead @ [Stripe](https://stripe.com)
- Designs [Stripe's API semantics](https://stripe.com/docs/api)
- Architect responsible for TypeScript projects like [node-stripe](https://github.com/stripe/stripe-node), [Stripe Shell](https://stripe.sh/), and [Stripe Workbench](https://workbench.stripe.dev/)

## Top Goals for this course
<!-- TODO - Fill this in -->

We'll cover a lot of ground in this course, but much of it will come back to a
few central themes:

### Productivity through stability and automation

- The whole point of TS is to allow you do more, and do it better. We'll learn how to make sure that it delivers on this promise
- The bigger your team is, and the more critical your app is, the more costly disruptions can be. We'll learn how to avoid them

### Developer ergonomics, and a modern authoring environment

- Part of the TS value proposition is the idea of a _fantastic development environment_.
  We'll learn how to make sure this is set up nicely so that it works well
  for even _very large_ apps.
- We'll learn about how to use valuable (but oft neglected) features like API
  deprecations, tracking a public API surface, and marking parts of your
  code as "alpha" or "beta" maturity

### Release Confidence & Type Safety

- TypeScript places a greater importance on productivity than 100% type safety.
  Compare this to [flow](https://flow.org), which has made a different choice
  > In type systems, soundness is the ability for a type checker to catch every single error that might happen at runtime. This comes at the cost of sometimes catching errors that will not actually happen at runtime.
  >
  > On the flip-side, completeness is the ability for a type checker to only ever catch errors that would happen at runtime. This comes at the cost of sometimes missing errors that will happen at runtime.
  >
  > In an ideal world, every type checker would be both sound and complete so that it catches every error that will happen at runtime.
  >
  > Flow tries to be as sound and complete as possible. But because JavaScript was not designed around a type system, Flow sometimes has to make a trade-off. When this happens Flow tends to favor soundness over completeness, ensuring that code doesn’t have any bugs. ([source](https://flow.org/en/docs/lang/types-and-expressions/#toc-soundness-and-completeness))

### Take extra care where runtime and type-checking meet

- We'll see first hand how bugs in these areas significantly weaken TypeScript's value as a tool
- By the end of this course, you'll understand how to give these areas extra attention

## What do you assume I already know?
<!-- TODO - Fill this in -->

This course is intended for developers who are already familiar with TypeScript
as a programming language, and are interested in learning more about how
to use it at scale, in libraries, and as a core part of large software projects.

## Project tour and getting started

In this workshop we'll be working in the context of a simplified Slack app

![project screenshot](./img/project_screenshot.png)

As we begin the course, it's written entirely in JavaScript, and is comprised of a few mostly stateless React components.

The web client for this app lives in [`src/`](../src/), and is roughly organized as

```bash
src/        # web client
  data/     # data layer
  ui/       # react components
  utils/    # low-level utilities
  index.js  # entry point
```

There's a API and database in this project as well, but we won't be changing them during the workshop.

The database comes from your [`db.json`](../db.json) file, and the API code is located in the [`server/`](../server/) folder.

**One thing you _absolutely will_ want to look at is the API documentation, which can be found in your [`API_EXAMPLES.http`](API_EXAMPLES.http) file**.
