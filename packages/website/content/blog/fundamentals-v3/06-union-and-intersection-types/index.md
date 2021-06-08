---
title: Union and Intersection Types
date: "2021-06-08T09:00:00.000Z"
description: |
  We will discuss and explore TypeScript's union and intersection types,
  which are effectively "AND" and "OR" boolean logic operators for types.
course: fundamentals-v3
order: 6
---

## Union and Intersection Types, Conceptually

Union and intersection types can conceptually be thought of as logical boolean operators
(`AND`, `OR`) as they pertain to types. Let's look at this group of two overlapping
sets of items as an example:

![union](./venn.png)

A union type has [a very specific technical definition](<https://en.wikipedia.org/wiki/Union_(set_theory)>)
that comes from set theory, but it's completely fine to think of it as **OR, for types**.

In the diagram above, if we had a type `Fruit OR Sour` it would include
every one of the items on the entire chart.

Intersection types also have [a name
and definition that comes from set theory](<https://en.wikipedia.org/wiki/Intersection_(set_theory)>),
but they can be thought of as **AND, for types**.

In the same diagram above, if we wanted _fruits that are also sour_ (`Fruit AND Sour`) we'd end up
only getting `{ Lemon, Lime, Grapefruit }`.

## Union Types in TypeScript

Union types in TypeScript can be described using the `|` (pipe) operator.

For example, if we had a type that could be one of two strings, `"success"` or
`"error"`, we could define it as

```ts
"success" | "error"
```

For example, the `flipCoin()` function will return `"heads"` if a number selected from `(0, 1)` is >= 0.5, or `"tails"` if <=0.5.

```ts twoslash
function flipCoin(): "heads" | "tails" {
  if (Math.random() > 0.5) return "heads"
  return "tails"
}

const outcome = flipCoin()
//     ^?
```

Let's make this a bit more interesting by using tuples, that is structured as follows:

- `[0]` either `"success"` or `"failure"`
- `[1]` something different, depending on the value found in `[0]`
  - `"success"` case: a piece of contact information: `{ name: string; email: string; }`
  - `"error"` case: an `Error` instance

We'll still decide which of these things actually happens based on our 50/50 coin flip from above

```ts twoslash
function flipCoin(): "heads" | "tails" {
  if (Math.random() > 0.5) return "heads"
  return "tails"
}

function maybeGetUserInfo():
  | ["error", Error]
  | ["success", { name: string; email: string }] {
  if (flipCoin() === "heads") {
    return [
      "success",
      { name: "Mike North", email: "mike@example.com" },
    ]
  } else {
    return [
      "error",
      new Error("The coin landed on TAILS :("),
    ]
  }
}

const outcome = maybeGetUserInfo()
//     ^?
```

this type is significantly more interesting.

### Working with union types

Let's continue with our example from above and attempt to do something with the
"outcome" value.

First, let's destructure the tuple and see what TypeScript has to say about its members

```ts twoslash
function maybeGetUserInfo():
  | ["error", Error]
  | ["success", { name: string; email: string }] {
  if (Math.random() > 0.5) {
    return [
      "success",
      { name: "Mike North", email: "mike@example.com" },
    ]
  } else {
    return [
      "error",
      new Error("The coin landed on TAILS :("),
    ]
  }
}
/// ---cut---
const outcome = maybeGetUserInfo()

const [first, second] = outcome
first
// ^?
second
// ^?
```

[[info | :bulb: A good time to poke around]]
| Click the `Try` button and explore `first` and `second` in the TS playground.
| Explore what's available in the autocomplete for each.

```ts twoslash
function maybeGetUserInfo():
  | ["error", Error]
  | ["success", { name: string; email: string }] {
  if (Math.random() > 0.5) {
    return [
      "success",
      { name: "Mike North", email: "mike@example.com" },
    ]
  } else {
    return [
      "error",
      new Error("The coin landed on TAILS :("),
    ]
  }
}
/// ---cut---
const outcome = maybeGetUserInfo()
const [first, second] = outcome
first.split
//     ^|
second.name
//      ^|
```

We can see that the autocomplete information for the first value suggests that it's
a string. This is because, regardles of whether this happens to be the specific `"success"`
or `"error"` string, it's definitely going to be a string.

The second value is a bit more complicated -- only the `name` property is available to us.
This is because, both our "user info object, and instances of the `Error` class have a `name`
property whose value is a string.

> What we are seeing here is, when a value has a type that includes a union, we are only able
> to use the "common behavior" that's guaranteed to be there.

### Narrowing with type guards

Ultimately, we need to "separate" the two potential possibilities for our value, or
we won't be able to get very far. We can do this with [type guards](https://www.typescriptlang.org/docs/handbook/2/narrowing.html).

> Type guards are expressions, which when used with control flow statement, allow us to
> have a more specific type for a particular value.

I like to think of these as "glue" between the compile time type-checking and runtime
execution of your code. We will work with one that you should already be familiar with
to start: `instanceof`.

```ts twoslash
function maybeGetUserInfo():
  | ["error", Error]
  | ["success", { name: string; email: string }] {
  if (Math.random() > 0.5) {
    return [
      "success",
      { name: "Mike North", email: "mike@example.com" },
    ]
  } else {
    return [
      "error",
      new Error("The coin landed on TAILS :("),
    ]
  }
}
/// ---cut---
const outcome = maybeGetUserInfo()
const [first, second] = outcome
//            ^?
if (second instanceof Error) {
  // In this branch of your code, second is an Error
  second
  // ^?
} else {
  // In this branch of your code, second is the user info
  second
  // ^?
}
```

TypeScript has a special understanding of _what it means_ when our `instanceof`
check returns `true` or `false`, and creates a branch of code that handles each
possibility.

It gets even better...

### Discriminated Unions

```ts twoslash
function maybeGetUserInfo():
  | ["error", Error]
  | ["success", { name: string; email: string }] {
  if (Math.random() > 0.5) {
    return [
      "success",
      { name: "Mike North", email: "mike@example.com" },
    ]
  } else {
    return [
      "error",
      new Error("The coin landed on TAILS :("),
    ]
  }
}
/// ---cut---
const outcome = maybeGetUserInfo()
if (outcome[0] === "error") {
  // In this branch of your code, second is an Error
  outcome
  // ^?
} else {
  // In this branch of your code, second is the user info
  outcome
  // ^?
}
```

TypeScript understands that the first and second positions of our tuple are linked.
What we are seeing here is sometimes referred to as a [discriminated or "tagged" union type](https://en.wikipedia.org/wiki/Tagged_union).

## Intersection Types in TypeScript

Intersection types in TypeScript can be described using the `&` (ampersand) operator.

For example, what if we had a `Promise`, that had extra `startTime` and `endTime`
properties added to it?

```ts twoslash
const ONE_WEEK = 1000 * 60 * 60 * 24 * 7 // 1w in ms
/// ---cut---
function makeWeek(): Date & { end: Date } {
  //⬅ return type

  const start = new Date()
  const end = new Date(start.valueOf() + ONE_WEEK)

  return { ...start, end } // kind of Object.assign
}

const thisWeek = makeWeek()
thisWeek.toISOString()
//   ^?
thisWeek.end.toISOString()
//        ^?
```

This is quite different than what we saw with union types -- this is quite literally
a `Date` and `{ end: Date}` mashed together, and we have access to everything immediately.

It is _far_ less common to use intersection types compared to union types. I expect
it to be at least a 50-to-1 ratio for you in practice.

[[question | :grey_question: Ask yourself: why might you run into union types more often?]]
| - Consider control flow and function return types
