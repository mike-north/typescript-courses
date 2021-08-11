---
title: Top and bottom types
date: "2021-06-08T09:00:00.000Z"
description: |
  Top types can be anything, bottom types can't be anything. We will also look
  at three "extreme types" in TypeScript: any, unknown and never.
course: fundamentals-v3
order: 11
---

## Types describe sets of allowed values

Let's imagine that types describe a set of allowed values that a value might be.

For example:

```ts
const x: boolean
```

x could be either item from the following set `{true, false}`. Let's look at another example:

```ts
const y: number
```

y could be **any number**. If we wanted to get technical and express this in terms of [set builder notation](https://en.wikipedia.org/wiki/Set-builder_notation), this would be `{y | y is a number}`[^1]

Let's look at a few more, just for completeness:

```ts twoslash
let a: 5 | 6 | 7 // anything in { 5, 6, 7 }
let b: null // anything in { null }
let c: {
  favoriteFruit?: "pineapple" // { "pineapple", undefined }
  // ^?
}
```

Hopefully this makes sense. Now we are ready to continue...

## Top types

A [top type](https://en.wikipedia.org/wiki/Top_type) (symbol: `⊤`) is a type that describes **any possible value allowed by the system**.
To use our set theory mental model, we could describe this as `{x| x could be anything }`

TypeScript provides two of these types: [`any`](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#any) and [`unknown`](https://www.typescriptlang.org/docs/handbook/2/functions.html#unknown).

### `any`

You can think of values with an `any` type as "playing by the usual JavaScript rules".
Here's an illustrative example:

```ts twoslash
let flexible: any = 4
flexible = "Download some more ram"
flexible = window.document
flexible = setTimeout
```

`any` typed values provide none of the safety we typically expect from TypeScript.

```ts twoslash
let flexible: any = 14
flexible.it.is.possible.to.access.any.deep.property
//                  ^?
```

It's important to understand that `any` is not necessarily a problem -- sometimes
it's exactly the right type to use for a particular situation.

For example, `console.log`:

```ts twoslash
console.log(window, Promise, setTimeout, "foo")
//       ^?
```

We can see here that `any` is not always a "bug" or a "problem" -- it just indicates _maximal flexibility_ and _the absence of type checking validation_.

### `unknown`

Like `any`, unknown can _accept_ any value:

```ts twoslash
let flexible: unknown = 4
flexible = "Download some more ram"
flexible = window.document
flexible = setTimeout
```

However, `unknown` is different from `any` in a very important way:

> Values with an `unknown` type cannot be _used_ without first
> applying a type guard

```ts twoslash
// @errors: 2571
let myUnknown: unknown = 14
myUnknown.it.is.possible.to.access.any.deep.property
//          ^?

// This code runs for { myUnknown| anything }
if (typeof myUnknown === "string") {
  // This code runs for { myUnknown| all strings }
  console.log(myUnknown, "is a string")
  //            ^?
} else if (typeof myUnknown === "number") {
  // This code runs for { myUnknown| all numbers }
  console.log(myUnknown, "is a number")
  //            ^?
} else {
  // this would run for "the leftovers"
  //       { myUnknown| anything except string or numbers }
}
```

### Practical use of top types

You will run into places where top types come in handy _very often_. In particular,
if you ever convert a project from JavaScript to TypeScript, it's very convenient
to be able to incrementally add increasingly strong types. A lot of things will
be `any` until you get a chance to give them some attention.

`unknown` is great for values received at runtime (e.g., your data layer). By
obligating consumers of these values to perform some light validation before using them,
errors are caught earlier, and can often be surfaced with more context.

## Bottom type: `never`

A [bottom type](https://en.wikipedia.org/wiki/Bottom_type) (symbol: `⊥`) is a type that describes **no possible value allowed by the system**.
To use our set theory mental model, we could describe this as "any value from the following set: `{ }` (intentionally empty)"

TypeScript provides one bottom type: [`never`](https://www.typescriptlang.org/docs/handbook/2/functions.html#never).

At first glance, this may appear to be an _extremely abstract_ and _pointless_ concept, but there's
one use case that should convince you otherwise. Let's take a look at this scenario below.

### Exhaustive conditionals

Let's consider the following scenario:

```ts twoslash
function obtainRandomVehicle(): any {
  return {} as any
}
/// ---cut---
class Car {
  drive() {
    console.log("vroom")
  }
}
class Truck {
  tow() {
    console.log("dragging something")
  }
}
type Vehicle = Truck | Car

let myVehicle: Vehicle = obtainRandomVehicle()

// The exhaustive conditional
if (myVehicle instanceof Truck) {
  myVehicle.tow() // Truck
} else if (myVehicle instanceof Car) {
  myVehicle.drive() // Car
} else {
  // NEITHER!
  const neverValue: never = myVehicle
}
```

Now, leaving the conditional exactly as-is, let's add `Boat` as a vehicle type:

```ts twoslash
// @errors: 2322
function obtainRandomVehicle(): any {
  return {} as any
}
/// ---cut---
class Car {
  drive() {
    console.log("vroom")
  }
}
class Truck {
  tow() {
    console.log("dragging something")
  }
}
class Boat {
  isFloating() {
    return true
  }
}
type Vehicle = Truck | Car | Boat

let myVehicle: Vehicle = obtainRandomVehicle()

// The exhaustive conditional
if (myVehicle instanceof Truck) {
  myVehicle.tow() // Truck
} else if (myVehicle instanceof Car) {
  myVehicle.drive() // Car
} else {
  // NEITHER!
  const neverValue: never = myVehicle
}
```

Effectively, what has happened here is that we have been alerted to the fact that
a new possibility for `Vehicle` has been introduced. As a result, we don't
end up with the type for `myVehicle` as a `never` in that final `else` clause.

I recommend handling this a little more gracefully via an **error subclass**:

```ts twoslash
// @errors: 2345
function obtainRandomVehicle(): any {
  return {} as any
}
class Car {
  drive() {
    console.log("vroom")
  }
}
class Truck {
  tow() {
    console.log("dragging something")
  }
}
class Boat {
  isFloating() {
    return true
  }
}
type Vehicle = Truck | Car | Boat

let myVehicle: Vehicle = obtainRandomVehicle()
/// ---cut---
class UnreachableError extends Error {
  constructor(_nvr: never, message: string) {
    super(message)
  }
}

// The exhaustive conditional
if (myVehicle instanceof Truck) {
  myVehicle.tow() // Truck
} else if (myVehicle instanceof Car) {
  myVehicle.drive() // Car
} else {
  // NEITHER!
  throw new UnreachableError(
    myVehicle,
    `Unexpected vehicle type: ${myVehicle}`
  )
}
```

Now, one of three things will happen in that final `else` block

- We will have handled every case before reaching it, and thus we will never enter the final `else` block
- We will catch upstream code changes that need to be handled in this conditional at compile time (e.g., adding the `Boat` case)
- If somehow an unexpected value "slip through" and is not caught until we actually run the code, we will get a meaningful error message

Note that this approach works nicely with a `switch` statement, when the `UnreachableError` is thrown from the `default` case clause.

[^1]: Technically in JS or TS this would be `{ y| -Number.MAX_VALUE <= y <= Number.MAX_VALUE }`, but if you know enough to ask, you probably don't need this footnote...!
