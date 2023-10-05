---
title: Union and Intersection Types
date: "2023-10-23T09:00:00.000Z"
description: |
  We will discuss and explore TypeScript's union and intersection types,
  which are effectively "AND" and "OR" boolean logic operators for types.
course: fundamentals-v4
order: 6
---

## Union and Intersection Types, Conceptually

Union and intersection types can conceptually be thought of as logical boolean operators
(`AND`, `OR`) as they pertain to types. Here are a couple of example sets we'll use for this discussion

```py
Evens = { 2, 4, 6, 8 }
Odds = { 1, 3, 5, 7, 9 }

Squares = { 1, 4, 9 }

OneThroughNine = { 1, 2, 3, 4,
                   5, 6, 7, 8, 9 }
OneThroughFive = { 1, 2, 3, 4, 5 }
```

### Union types `|`

A union type can be thought of as **`OR`, for types**, and TypeScript uses the pipe (`|`)
symbol to represent the **Union type operator**

Using the example above, if we wanted to find `OneThroughFive | Odds` we'd combine all the members
of the `OneThroughFive` set and all of the members of the `Odds` set.

```py
OneThroughFive | Odds => { 1, 2, 3, 4, 5, 7, 9 }
```

If you think about the assumptions we could make about a member of this set at random, we couldn't
be sure whether it's between 1 and 5, and we couldn't be sure whether it's odd.

### Intersection types `&`

An intersection type can be thought of as **`AND`, for types**, and TypeScript uses the ampersand (`&`)
symbol to represent the **Intersection type operator**

Using the example again, if we wanted to find `OneThroughFive & Odds` we'd find all members that the
`OneThroughFive` and `Odds` sets have in common

```py
OneThroughFive & Odds => { 1, 3, 5 }
```

## Union Types in TypeScript

Let's think back to the concept of literal types from an earlier example

```ts twoslash
const humidity = 79
//     ^?
```

If we wanted to create a union type that represented the set `{ 1, 2, 3, 4, 5 }` we could do it using
the `|` operator. We can also use the `type` keyword to give this type a name (we'll talk more about
this in the next chapter)

```ts twoslash
// @errors: 2322
type OneThroughFive = 1 | 2 | 3 | 4 | 5
//   ^?
let upToFive: OneThroughFive = 3
//   ^?
upToFive = 8
```

and we could create another type called `Evens` to represent the set `{ 2, 4, 6, 8 }`

```ts twoslash
// @errors: 2322
type Evens = 2 | 4 | 6 | 8
//    ^?
let evensOnly: Evens = 2;
//    ^?
evensOnly = 5;
```

Explicitly creating the union type is now simple

```ts twoslash
type OneThroughFive = 1 | 2 | 3 | 4 | 5
type Evens = 2 | 4 | 6 | 8
/// ---cut---
let evensThroughFive: Evens | OneThroughFive;
//    ^?
```

Union types often appear where control flow can produce a different value for different code paths.

For example, the `flipCoin()` function will return `"heads"` if a number selected
from `(0, 1)` is >= 0.5, or `"tails"` if <=0.5.

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
it to be at least a 50-to-1 ratio for you in practice. A real-world case where you'll find
(and appreciate) an intersection type is [`Object.assign(a, b)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
