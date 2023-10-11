# Welcome to Professional TypeScript

### What is TypeScript? How does Mike think about it?

TypeScript aims to be a typed semantic superset of JavaScript. It is not a
syntactic superset, which means that NOT ALL valid JavaScript is valid TypeScript.

In fact even a piece of simple JS code like

```js
let x = 4;
x = 'hello';
```

Will make the TypeScript compiler unhappy, and that's the point!

In a modern tool chain, the TypeScript compiler isn't even usually the
thing emitting runnable JavaScript any more (often that's Babel's job),
so it can be thought of as a "very fancy linter", with some extra
in-editor UX treats.

### Who is this course for?

This course is intended for developers who are already familiar with TypeScript
as a programming language, and are interested in learning more about how
to use it at scale, in libraries, and as a core part of large software projects.

### What kind of stuff will we learn?

We'll cover a lot of ground in this course, but much of it will come back to a
few central themes:

#### Productivity through stability and automation

- The whole point of TS is to allow you do more, and do it better. We'll learn how to make sure that it delivers on this promise
- The bigger your team is, and the more critical your app is, the more costly disruptions can be. We'll learn how to avoid them

#### Developer ergonomics, and a modern authoring environment

- Part of the TS value proposition is the idea of a _fantastic development environment_.
  We'll learn how to make sure this is set up nicely so that it works well
  for even _very large_ apps.
- We'll learn about how to use valuable (but oft neglected) features like API
  deprecations, tracking a public API surface, and marking parts of your
  code as "alpha" or "beta" maturity

#### Release Confidence & Type Safety

- TypeScript places a greater importance on productivity than 100% type safety.
  Compare this to [flow](https://flow.org), which has made a different choice
  > In type systems, soundness is the ability for a type checker to catch every single error that might happen at runtime. This comes at the cost of sometimes catching errors that will not actually happen at runtime.
  >
  > On the flip-side, completeness is the ability for a type checker to only ever catch errors that would happen at runtime. This comes at the cost of sometimes missing errors that will happen at runtime.
  >
  > In an ideal world, every type checker would be both sound and complete so that it catches every error that will happen at runtime.
  >
  > Flow tries to be as sound and complete as possible. But because JavaScript was not designed around a type system, Flow sometimes has to make a trade-off. When this happens Flow tends to favor soundness over completeness, ensuring that code doesn’t have any bugs. ([source](https://flow.org/en/docs/lang/types-and-expressions/#toc-soundness-and-completeness))

#### Take extra care where runtime and type-checking meet

- We'll see first hand how bugs in these areas significantly weaken TypeScript's value as a tool
- By the end of this course, you'll understand how to give these areas extra attention

---

<p align='right'>
 <a href="./01-project-tour.md">Next: Project Tour ▶</a>
</p>
